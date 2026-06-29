// TriageModule — Motor de Triaje SOS Venezuela
// Optimizado para aplicación móvil y despliegue Vercel
// Basado en: Cruz Roja Internacional · PHTLS · ATLS
import { PROTOCOLS, EMERGENCY_CONTACTS } from '../clinical_logic/protocols';

class TriageModule {
  constructor() {
    this.protocols = PROTOCOLS;
    this.strictSafetyMode = PROTOCOLS.strict_safety_mode;
    this._categoryList = Object.values(PROTOCOLS.categories);
    this.dehydrationKeywords = ["sed", "deshidratado", "boca seca", "piel", "orina"];
  }

  // ── API PRINCIPAL ──────────────────────────────────────────────────────────

  /**
   * Procesa mensaje de texto libre (entrada de texto).
   * @param {string} userInput  Texto del usuario
   * @returns {{ text: string, urgency: string|null, call_emergency: boolean, protocol_id: string|null }}
   */
  process_message(userInput) {
    if (!userInput || typeof userInput !== 'string') {
      return this._buildResponse(this._formatMainMenu(), null, false, null);
    }

    const input = userInput.toLowerCase().trim();

    // Menú numérico
    const numericMap = { '1': 'hemorragia', '2': 'asfixia', '3': 'trauma', '4': 'aplastamiento', '5': 'atrapado' };
    if (numericMap[input]) {
      return this._buildResponse(this._formatCategoryIntro(numericMap[input]), null, false, null);
    }

    // Selección de sub-opción (a/b/c o 1/2/3 con categoría activa)
    const category = this._matchCategory(input);
    if (category) {
      return this._buildResponse(this._formatCategoryIntro(category.id), null, false, null);
    }

    // Coincidencia directa con protocolo específico
    const protocol = this._matchProtocol(input);
    if (protocol) {
      return this._buildResponse(
        this._formatProtocol(protocol),
        protocol.urgency,
        protocol.call_emergency_now,
        protocol.id
      );
    }

    // Default: menú principal
    return this._buildResponse(this._formatMainMenu(), null, false, null);
  }

  /**
   * Retorna el protocolo completo formateado para salida de texto por su ID.
   * @param {string} protocolId  ej: 'hemo_severa', 'aplast_prolongado'
   * @returns {{ text: string, protocol: object|null }}
   */
  get_safety_protocol(protocolId) {
    const protocol = this._findProtocolById(protocolId);
    if (!protocol) {
      return { text: '⚠️ Protocolo no encontrado. Escribe /menu para ver opciones.', protocol: null };
    }
    return {
      text: this._formatProtocol(protocol),
      protocol,
    };
  }

  /**
   * Retorna lista de categorías disponibles.
   * @returns {Array<{ id, title, emoji }>}
   */
  get_categories() {
    return this._categoryList.map(c => ({ id: c.id, title: c.title, emoji: c.emoji }));
  }

  /**
   * Retorna un protocolo por ID como objeto (para uso interno en UI).
   * @param {string} protocolId
   * @returns {object|null}
   */
  get_protocol_object(protocolId) {
    return this._findProtocolById(protocolId);
  }

  // ── FORMATEO DE TEXTO ──

  _formatMainMenu() {
    return [
      '🇻🇪 *SOS VENEZUELA — Primeros Auxilios*',
      '_Sismo La Guaira 2026_',
      '',
      '¿Cuál es la emergencia? Escribe el número:',
      '',
      '1️⃣  🩸 Hemorragia / Sangrado',
      '2️⃣  🫁 Asfixia / Atragantamiento',
      '3️⃣  🦴 Trauma / Golpe / Fractura',
      '4️⃣  🏚️ Aplastamiento por escombros',
      '5️⃣  🆘 Persona atrapada',
      '',
      '📞 Emergencia inmediata: llama al *911*',
      '',
      '_⚕️ Esta guía no reemplaza atención médica profesional._',
    ].join('\n');
  }

  _formatCategoryIntro(categoryId) {
    const cat = this.protocols.categories[categoryId];
    if (!cat) return this._formatMainMenu();

    const lines = [
      `${cat.emoji} *${cat.title.toUpperCase()}*`,
      '',
    ];

    if (cat.triage_questions && cat.triage_questions.length > 0) {
      const q = cat.triage_questions[0];
      lines.push(q.question);
      lines.push('');
      q.options.forEach((opt, i) => {
        lines.push(`${i + 1}. ${opt.label}`);
      });
      lines.push('');
      lines.push('_Responde con el número o describe la situación._');
    }

    lines.push('');
    lines.push('📞 Si hay riesgo de vida inmediato: *llama al 911*');

    return lines.join('\n');
  }

  _formatProtocol(protocol) {
    const lines = [];

    if (protocol.call_emergency_now) {
      lines.push('🚨 *LLAMA AL 911 AHORA*');
      lines.push('');
    }

    lines.push(`*${protocol.title}*`);
    if (protocol.urgency) lines.push(`_Nivel: ${protocol.urgency}_`);
    lines.push('');

    if (protocol.clinical_warning) {
      lines.push(`⚠️ *IMPORTANTE:* _${protocol.clinical_warning}_`);
      lines.push('');
    }

    if (protocol.signs_to_recognize) {
      lines.push('*Reconocer:*');
      protocol.signs_to_recognize.forEach(s => lines.push(`• ${s}`));
      lines.push('');
    }

    if (protocol.immediate_actions?.length > 0) {
      lines.push('🚨 *ACTÚA AHORA:*');
      protocol.immediate_actions.forEach(a => lines.push(a));
      lines.push('');
    }

    if (protocol.no_equipment_note) {
      lines.push(`_${protocol.no_equipment_note}_`);
      lines.push('');
    }

    if (protocol.help_seeking) {
      lines.push(`📞 *Buscar ayuda:* ${protocol.help_seeking}`);
      lines.push('');
    }

    if (protocol.transport_decision) {
      const t = protocol.transport_decision;
      if (t.transport) lines.push(`🚑 *Traslado:* ${t.transport}`);
      if (t.stay)      lines.push(`🏠 *Quedarse:* ${t.stay}`);
      if (t.hospitals_note) lines.push(`🏥 ${t.hospitals_note}`);
      lines.push('');
    }

    if (protocol.steps?.length > 0) {
      lines.push('*Pasos adicionales:*');
      protocol.steps.forEach(step => lines.push(step));
    }

    if (protocol.contraindications && protocol.contraindications.length > 0) {
      lines.push('');
      lines.push('*🚫 NO hacer:*');
      protocol.contraindications.forEach(c => lines.push(`• ${c}`));
    }

    if (protocol.post_extraction_warning) {
      lines.push('');
      lines.push(`📋 *Después de la extracción:* ${protocol.post_extraction_warning}`);
    }

    if (protocol.danger_signs) {
      lines.push('');
      lines.push('*⚠️ Señales de peligro — ir al hospital INMEDIATO:*');
      protocol.danger_signs.forEach(s => lines.push(`• ${s}`));
    }

    lines.push('');
    lines.push('_⚕️ Guía de primeros auxilios — no reemplaza atención médica._');
    lines.push('_Escribe /menu para ver otras opciones._');

    return lines.join('\n');
  }

  // ── BÚSQUEDA INTERNA ───────────────────────────────────────────────────────

  _matchCategory(input) {
    for (const cat of this._categoryList) {
      if (cat.keywords.some(kw => input.includes(kw))) return cat;
    }
    return null;
  }

  _matchProtocol(input) {
    for (const cat of this._categoryList) {
      for (const proto of Object.values(cat.protocols)) {
        const titleWords = proto.title.toLowerCase().split(/\s+/);
        if (titleWords.some(w => w.length > 4 && input.includes(w))) return proto;
        if (proto.id && input.includes(proto.id.replace(/_/g, ' '))) return proto;
      }
    }
    return null;
  }

  _findProtocolById(id) {
    for (const cat of this._categoryList) {
      if (cat.protocols[id]) return cat.protocols[id];
    }
    return null;
  }

  _buildResponse(text, urgency, call_emergency, protocol_id) {
    return { text, urgency, call_emergency: !!call_emergency, protocol_id };
  }
}

// Singleton — usar directamente
const instance = new TriageModule();
export default instance;
export { TriageModule };
export { TriageModule };
