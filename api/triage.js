// Vercel Serverless Function — SOS Venezuela Triage API
// El equipo de WhatsApp llama a este endpoint desde su bot
//
// Uso:
//   POST /api/triage
//   Body: { "message": "me está sangrando mucho", "session_id": "user123" }
//   Response: { "text": "...", "urgency": "CRÍTICA", "call_emergency": true, "protocol_id": "hemo_severa" }
//
//   GET /api/triage?protocol=hemo_severa
//   Response: { "text": "...", "protocol": {...} }

import { PROTOCOLS, EMERGENCY_CONTACTS } from '../src/clinical_logic/protocols.js';

// ── Motor de triaje inline (sin deps externos) ────────────────────────────────
const CATEGORIES = Object.values(PROTOCOLS.categories);

function matchCategory(input) {
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => input.includes(kw))) return cat;
  }
  return null;
}

function findProtocolById(id) {
  for (const cat of CATEGORIES) {
    if (cat.protocols[id]) return cat.protocols[id];
  }
  return null;
}

function formatProtocol(protocol) {
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
    if (t.transport)      lines.push(`🚑 *Traslado:* ${t.transport}`);
    if (t.stay)           lines.push(`🏠 *Quedarse:* ${t.stay}`);
    if (t.hospitals_note) lines.push(`🏥 ${t.hospitals_note}`);
    lines.push('');
  }

  if (protocol.steps?.length > 0) {
    lines.push('*Pasos adicionales:*');
    protocol.steps.forEach(step => lines.push(step));
  }

  if (protocol.contraindications?.length > 0) {
    lines.push('');
    lines.push('*🚫 NO hacer:*');
    protocol.contraindications.forEach(c => lines.push(`• ${c}`));
  }

  if (protocol.post_extraction_warning) {
    lines.push('');
    lines.push(`📋 *Después:* ${protocol.post_extraction_warning}`);
  }

  if (protocol.danger_signs?.length > 0) {
    lines.push('');
    lines.push('*⚠️ Ir al hospital AHORA si hay:*');
    protocol.danger_signs.forEach(s => lines.push(`• ${s}`));
  }

  lines.push('');
  lines.push('_⚕️ Guía primeros auxilios — no reemplaza atención médica._');
  lines.push('_Escribe /menu para más opciones._');

  return lines.join('\n');
}

const NUM_EMOJIS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','1️⃣1️⃣'];
function formatMainMenu() {
  const lines = [
    '🇻🇪 *SOS VENEZUELA — Primeros Auxilios*',
    '_Sismo La Guaira 2026_',
    '',
    '¿Cuál es la emergencia? Escribe el número:',
    '',
  ];
  CATEGORIES.forEach((cat, i) => {
    lines.push(`${NUM_EMOJIS[i] || `${i+1}.`}  ${cat.emoji} ${cat.title}`);
  });
  lines.push('', '📞 Emergencia inmediata: *911*', '', '_⚕️ Guía no reemplaza atención médica._');
  return lines.join('\n');
}

function formatCategoryIntro(cat) {
  const lines = [`${cat.emoji} *${cat.title.toUpperCase()}*`, ''];
  if (cat.triage_questions?.[0]) {
    const q = cat.triage_questions[0];
    lines.push(q.question, '');
    q.options.forEach((opt, i) => lines.push(`${i + 1}. ${opt.label}`));
    lines.push('', '_Responde con el número o describe._');
  }
  lines.push('', '📞 Peligro inmediato: *llama al 911*');
  return lines.join('\n');
}

const NUMERIC_MAP = Object.fromEntries(CATEGORIES.map((cat, i) => [String(i + 1), cat.id]));

function processMessage(userInput) {
  const input = (userInput || '').toLowerCase().trim();

  if (!input || input === '/menu' || input === 'menu' || input === 'inicio') {
    return { text: formatMainMenu(), urgency: null, call_emergency: false, protocol_id: null };
  }

  // Menú numérico
  if (NUMERIC_MAP[input]) {
    const cat = PROTOCOLS.categories[NUMERIC_MAP[input]];
    return { text: formatCategoryIntro(cat), urgency: null, call_emergency: false, protocol_id: null };
  }

  // Coincidencia de categoría por keywords
  const category = matchCategory(input);
  if (category) {
    return { text: formatCategoryIntro(category), urgency: null, call_emergency: false, protocol_id: null };
  }

  // Menú por defecto
  return { text: formatMainMenu(), urgency: null, call_emergency: false, protocol_id: null };
}

// ── Handler Vercel ────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET /api/triage?protocol=hemo_severa
  if (req.method === 'GET') {
    const protocolId = req.query?.protocol;
    if (protocolId) {
      const protocol = findProtocolById(protocolId);
      if (!protocol) return res.status(404).json({ error: 'Protocolo no encontrado' });
      return res.status(200).json({
        text: formatProtocol(protocol),
        protocol,
      });
    }
    return res.status(200).json({
      categories: CATEGORIES.map(c => ({ id: c.id, title: c.title, emoji: c.emoji })),
      menu: formatMainMenu(),
    });
  }

  // POST /api/triage
  if (req.method === 'POST') {
    const { message, session_id } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Campo "message" requerido' });
    }
    const result = processMessage(message);
    return res.status(200).json({ ...result, session_id });
  }

  return res.status(405).json({ error: 'Método no permitido' });
};
