import { PROTOCOLS } from './protocols.js';

const CATS = PROTOCOLS.categories;
const CAT_KEYS = Object.keys(CATS);

// Flat list of all protocols
const ALL_PROTOCOLS = Object.values(CATS).flatMap(c => Object.values(c.protocols));

function formatMenu() {
  const lines = [
    '🆘 *SOS VENEZUELA — Protocolos de Emergencia*',
    '_Sismo La Guaira 2026_',
    '',
    'Responde con el *número* de categoría:',
    '',
  ];
  CAT_KEYS.forEach((key, i) => {
    const cat = CATS[key];
    const count = Object.keys(cat.protocols).length;
    lines.push(`*${i + 1}.* ${cat.emoji} ${cat.title} (${count})`);
  });
  lines.push('');
  lines.push('_Ej: escribe "1" para Hemorragia_');
  return lines.join('\n');
}

function formatCategoryMenu(catKey) {
  const cat = CATS[catKey];
  const prots = Object.values(cat.protocols);
  const lines = [
    `${cat.emoji} *${cat.title.toUpperCase()}*`,
    '',
    'Elige el protocolo:',
    '',
  ];
  prots.forEach((p, i) => {
    const icon = p.urgency === 'CRÍTICA' ? '🔴' : p.urgency === 'URGENTE' ? '🟠' : '🟡';
    lines.push(`*${i + 1}.* ${icon} ${p.title}`);
  });
  lines.push('');
  lines.push('_Escribe "menu" para volver_');
  return lines.join('\n');
}

function formatProtocol(p) {
  const icon = p.urgency === 'CRÍTICA' ? '🔴' : p.urgency === 'URGENTE' ? '🟠' : '🟡';
  const lines = [
    `${icon} *${p.title.toUpperCase()}*`,
    `_Urgencia: ${p.urgency}_`,
    '',
  ];
  if (p.clinical_warning) {
    lines.push(`⚠️ *ADVERTENCIA:* ${p.clinical_warning}`);
    lines.push('');
  }
  if (p.immediate_actions?.length > 0) {
    lines.push('🚨 *ACTÚA AHORA:*');
    p.immediate_actions.forEach(a => lines.push(a));
    lines.push('');
  }
  if (p.no_equipment_note) {
    lines.push(`_${p.no_equipment_note}_`);
    lines.push('');
  }
  if (p.signs_to_recognize?.length > 0) {
    lines.push('*Reconocer:*');
    p.signs_to_recognize.forEach(s => lines.push(`• ${s}`));
    lines.push('');
  }
  if (p.steps?.length > 0) {
    lines.push('*Pasos:*');
    p.steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push('');
  }
  if (p.danger_signs?.length > 0) {
    lines.push('🚩 *Señales de peligro:*');
    p.danger_signs.forEach(s => lines.push(`• ${s}`));
    lines.push('');
  }
  if (p.help_seeking) {
    lines.push(`📞 *Buscar ayuda:* ${p.help_seeking}`);
    lines.push('');
  }
  if (p.transport_decision) {
    const td = p.transport_decision;
    if (td.transport) { lines.push(`🚗 *Transportar:* ${td.transport}`); }
    if (td.stay) { lines.push(`🏠 *Quedarse:* ${td.stay}`); }
    if (td.hospitals_note) { lines.push(`🏥 ${td.hospitals_note}`); }
    lines.push('');
  }
  if (p.contraindications?.length > 0) {
    lines.push('🚫 *NO hacer:*');
    p.contraindications.forEach(c => lines.push(`• ${c}`));
    lines.push('');
  }
  lines.push('_Escribe "menu" para volver al inicio_');
  return lines.join('\n');
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawMsg = req.query.msg || req.body?.msg || req.body?.Body || '';
  const msg = rawMsg.toLowerCase().trim();

  // Status / health check
  if (!msg || msg === 'ping' || msg === 'status') {
    return res.json({
      sos: 'Venezuela',
      status: 'ok',
      protocolos: ALL_PROTOCOLS.length,
      categorias: CAT_KEYS.length,
      version: PROTOCOLS.version,
    });
  }

  // Main menu
  if (['menu', 'inicio', 'hola', 'ayuda', 'help', 'start', '0'].includes(msg)) {
    return res.json({ response: formatMenu() });
  }

  // Category selection by number (1–12)
  const catIdx = parseInt(msg) - 1;
  if (!isNaN(catIdx) && catIdx >= 0 && catIdx < CAT_KEYS.length) {
    return res.json({
      response: formatCategoryMenu(CAT_KEYS[catIdx]),
      category: CAT_KEYS[catIdx],
    });
  }

  // Protocol sub-selection "2.3" → category 2, protocol 3
  const subMatch = msg.match(/^(\d+)\.(\d+)$/);
  if (subMatch) {
    const ci = parseInt(subMatch[1]) - 1;
    const pi = parseInt(subMatch[2]) - 1;
    const catKey = CAT_KEYS[ci];
    if (catKey) {
      const prots = Object.values(CATS[catKey].protocols);
      if (prots[pi]) {
        return res.json({ response: formatProtocol(prots[pi]), protocol_id: prots[pi].id });
      }
    }
  }

  // Search by protocol ID directly
  const byId = ALL_PROTOCOLS.find(p => p.id === msg);
  if (byId) return res.json({ response: formatProtocol(byId), protocol_id: byId.id });

  // Keyword search across protocol titles and category keywords
  const byTitle = ALL_PROTOCOLS.find(p => p.title.toLowerCase().includes(msg));
  if (byTitle) return res.json({ response: formatProtocol(byTitle), protocol_id: byTitle.id });

  // Keyword search in category keywords
  for (const key of CAT_KEYS) {
    if (CATS[key].keywords?.some(k => k.includes(msg) || msg.includes(k))) {
      return res.json({ response: formatCategoryMenu(key), category: key });
    }
  }

  return res.json({
    response: `No encontré ese protocolo. Escribe *menu* para ver las 12 categorías disponibles.`,
  });
}
