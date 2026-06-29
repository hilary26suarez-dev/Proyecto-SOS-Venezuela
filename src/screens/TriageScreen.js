import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Linking,
} from 'react-native';
import { PROTOCOLS } from '../clinical_logic/protocols';

const CATEGORIES = Object.values(PROTOCOLS.categories);

export default function TriageScreen({ route }) {
  const scrollRef = useRef(null);

  // Fase: 'menu' | 'question' | 'protocol'
  const initPhase = route?.params?.protocolId ? 'protocol'
    : route?.params?.categoryId ? 'question'
    : 'menu';
  const [phase, setPhase] = useState(initPhase);
  const [category, setCategory] = useState(
    route?.params?.categoryId ? PROTOCOLS.categories[route.params.categoryId] : null
  );
  const [protocol, setProtocol] = useState(
    route?.params?.protocolId
      ? findProtocol(route.params.protocolId)
      : null
  );

  function findProtocol(id) {
    for (const cat of CATEGORIES) {
      if (cat.protocols[id]) return cat.protocols[id];
    }
    return null;
  }

  function selectCategory(cat) {
    setCategory(cat);
    setProtocol(null);
    setPhase('question');
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
  }

  function selectOption(optionProtocolId) {
    const found = findProtocol(optionProtocolId);
    if (found) {
      setProtocol(found);
      setPhase('protocol');
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
    }
  }

  function reset() {
    setPhase('menu');
    setCategory(null);
    setProtocol(null);
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
  }

  const call911 = () => Linking.openURL('tel:911');

  const urgencyColor = {
    'CRÍTICA':     '#CC0000',
    'URGENTE':     '#FF6600',
    'NO CRÍTICA':  '#228B22',
    'VARÍA':       '#FF6600',
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Barra de ayuda — intenta 911, puede estar saturado */}
      <TouchableOpacity style={s.emergencyBar} onPress={call911} activeOpacity={0.8}>
        <Text style={s.emergencyBarText}>📞 Intentar 911  ·  puede estar saturado</Text>
      </TouchableOpacity>

      <ScrollView ref={scrollRef} style={s.scroll} contentContainerStyle={s.content}>

        {/* ── MENÚ PRINCIPAL ───────────────────────────────────────────────── */}
        {phase === 'menu' && (
          <>
            <Text style={s.menuTitle}>¿Cuál es la emergencia?</Text>
            <Text style={s.menuSub}>Selecciona la categoría más cercana</Text>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={s.catCard}
                onPress={() => selectCategory(cat)}
                activeOpacity={0.75}
              >
                <Text style={s.catEmoji}>{cat.emoji}</Text>
                <View style={s.catTextWrap}>
                  <Text style={s.catTitle}>{cat.title}</Text>
                  <Text style={s.catSub} numberOfLines={1}>
                    {cat.triage_questions?.[0]?.question || ''}
                  </Text>
                </View>
                <Text style={s.catArrow}>›</Text>
              </TouchableOpacity>
            ))}

            <View style={s.disclaimerBox}>
              <Text style={s.disclaimerText}>
                ⚕️ Guía de primeros auxilios basada en protocolos Cruz Roja Internacional, PHTLS y ATLS.
                No reemplaza atención médica profesional.
              </Text>
            </View>
          </>
        )}

        {/* ── PREGUNTA DE TRIAJE ───────────────────────────────────────────── */}
        {phase === 'question' && category && (
          <>
            <TouchableOpacity style={s.backBtn} onPress={reset}>
              <Text style={s.backBtnText}>← Volver</Text>
            </TouchableOpacity>

            <View style={s.catHeader}>
              <Text style={s.catHeaderEmoji}>{category.emoji}</Text>
              <Text style={s.catHeaderTitle}>{category.title}</Text>
            </View>

            {category.triage_questions?.map(q => (
              <View key={q.id}>
                <Text style={s.questionText}>{q.question}</Text>
                {q.options.map((opt, i) => (
                  <TouchableOpacity
                    key={opt.protocol_id}
                    style={s.optionCard}
                    onPress={() => selectOption(opt.protocol_id)}
                    activeOpacity={0.75}
                  >
                    <Text style={s.optionNum}>{i + 1}</Text>
                    <Text style={s.optionLabel}>{opt.label}</Text>
                    <Text style={s.optionArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        )}

        {/* ── PROTOCOLO COMPLETO ───────────────────────────────────────────── */}
        {phase === 'protocol' && protocol && (
          <>
            <TouchableOpacity
              style={s.backBtn}
              onPress={() => { setPhase('question'); setProtocol(null); }}
            >
              <Text style={s.backBtnText}>← Volver</Text>
            </TouchableOpacity>

            {/* Nivel de urgencia */}
            <View style={[s.urgencyBadge, { backgroundColor: urgencyColor[protocol.urgency] || '#555' }]}>
              <Text style={s.urgencyText}>⚠️ {protocol.urgency}</Text>
            </View>

            <Text style={s.protoTitle}>{protocol.title}</Text>

            {/* Advertencia clínica */}
            {protocol.clinical_warning && (
              <View style={s.warningBox}>
                <Text style={s.warningLabel}>⚠️ ANTES DE EMPEZAR</Text>
                <Text style={s.warningText}>{protocol.clinical_warning}</Text>
              </View>
            )}

            {/* Signos a reconocer */}
            {protocol.signs_to_recognize?.length > 0 && (
              <View style={s.sectionBox}>
                <Text style={s.sectionLabel}>RECONOCER</Text>
                {protocol.signs_to_recognize.map((sg, i) => (
                  <Text key={i} style={s.signItem}>• {sg}</Text>
                ))}
              </View>
            )}

            {/* ── ACTÚA AHORA — primera prioridad ── */}
            {protocol.immediate_actions?.length > 0 && (
              <View style={[s.sectionBox, s.immediateBg]}>
                <Text style={[s.sectionLabel, { color: '#FF4444' }]}>🔴 ACTÚA AHORA</Text>
                {protocol.no_equipment_note && (
                  <View style={s.noEquipNote}>
                    <Text style={s.noEquipText}>{protocol.no_equipment_note}</Text>
                  </View>
                )}
                {protocol.immediate_actions.map((step, i) => (
                  <View key={i} style={s.stepRow}>
                    <Text style={s.immediateStep}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── BUSCA AYUDA — mientras actúas ── */}
            {protocol.help_seeking && (
              <View style={[s.sectionBox, s.helpBg]}>
                <Text style={[s.sectionLabel, { color: '#88CCFF' }]}>📡 BUSCA AYUDA MIENTRAS ACTÚAS</Text>
                <Text style={s.helpText}>{protocol.help_seeking}</Text>
                <TouchableOpacity style={s.call911InlineBtn} onPress={call911} activeOpacity={0.8}>
                  <Text style={s.call911InlineText}>📞 Intentar 911</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── DECISIÓN DE TRASLADO ── */}
            {protocol.transport_decision && (
              <View style={[s.sectionBox, s.transportBg]}>
                <Text style={[s.sectionLabel, { color: '#FFCC44' }]}>🚗 DECISIÓN DE TRASLADO</Text>
                <Text style={s.transportLabel}>SÍ TRASLADA si:</Text>
                <Text style={s.transportText}>{protocol.transport_decision.transport}</Text>
                <Text style={[s.transportLabel, { marginTop: 10 }]}>QUÉDATE si:</Text>
                <Text style={s.transportText}>{protocol.transport_decision.stay}</Text>
                {protocol.transport_decision.hospitals_note && (
                  <View style={s.hospitalsTip}>
                    <Text style={s.hospitalsTipText}>🏥 {protocol.transport_decision.hospitals_note}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Pasos adicionales (si los hay) */}
            {protocol.steps?.length > 0 && (
              <View style={s.sectionBox}>
                <Text style={s.sectionLabel}>ADEMÁS</Text>
                {protocol.steps.map((step, i) => (
                  <View key={i} style={s.stepRow}>
                    <Text style={s.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Contraindications */}
            {protocol.contraindications?.length > 0 && (
              <View style={[s.sectionBox, s.contraBg]}>
                <Text style={[s.sectionLabel, { color: '#CC0000' }]}>🚫 NO HACER</Text>
                {protocol.contraindications.map((c, i) => (
                  <Text key={i} style={s.contraItem}>• {c}</Text>
                ))}
              </View>
            )}

            {/* Post-extracción */}
            {protocol.post_extraction_warning && (
              <View style={[s.sectionBox, { borderLeftColor: '#FF6600' }]}>
                <Text style={s.sectionLabel}>DESPUÉS DE LA EXTRACCIÓN</Text>
                <Text style={s.stepText}>{protocol.post_extraction_warning}</Text>
              </View>
            )}

            {/* Señales de peligro */}
            {protocol.danger_signs?.length > 0 && (
              <View style={[s.sectionBox, s.contraBg]}>
                <Text style={[s.sectionLabel, { color: '#CC0000' }]}>⚠️ VE AL HOSPITAL SI…</Text>
                {protocol.danger_signs.map((d, i) => (
                  <Text key={i} style={s.contraItem}>• {d}</Text>
                ))}
              </View>
            )}

            {/* Detalle de complicación (vigilancia) */}
            {protocol.complication_detail && (
              <View style={[s.sectionBox, s.complicBg]}>
                <Text style={[s.sectionLabel, { color: '#CC8800' }]}>
                  ⚗️ QUÉ ESTÁ PASANDO — {protocol.complication_detail.name}
                </Text>
                <Text style={s.complicText}>{protocol.complication_detail.what_happens}</Text>
                {protocol.complication_detail.window && (
                  <Text style={[s.complicText, { marginTop: 6, color: '#FFAA44' }]}>
                    ⏱️ {protocol.complication_detail.window}
                  </Text>
                )}
                {protocol.complication_detail.classic_sign && (
                  <Text style={[s.complicText, { marginTop: 6, color: '#FF8888' }]}>
                    🔑 {protocol.complication_detail.classic_sign}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity style={s.restartBtn} onPress={reset} activeOpacity={0.8}>
              <Text style={s.restartBtnText}>Nueva consulta</Text>
            </TouchableOpacity>

            <View style={s.disclaimerBox}>
              <Text style={s.disclaimerText}>
                ⚕️ Protocolos: Cruz Roja Internacional · PHTLS · ATLS · PAHO.
                No reemplaza atención médica profesional.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0A' },
  emergencyBar: {
    backgroundColor: '#4A1A00',
    paddingVertical: 9,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CC4400',
  },
  emergencyBarText: {
    color: '#FFAA66',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  // MENÚ
  menuTitle: { color: '#F0F0F0', fontSize: 22, fontWeight: '900', marginBottom: 4, marginTop: 8 },
  menuSub: { color: '#888', fontSize: 13, marginBottom: 20 },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  catEmoji: { fontSize: 28, width: 40 },
  catTextWrap: { flex: 1, paddingHorizontal: 10 },
  catTitle: { color: '#F0F0F0', fontSize: 16, fontWeight: '700' },
  catSub: { color: '#888', fontSize: 12, marginTop: 2 },
  catArrow: { color: '#555', fontSize: 22, fontWeight: '300' },

  // PREGUNTA
  backBtn: { marginBottom: 16 },
  backBtnText: { color: '#CC0000', fontSize: 14, fontWeight: '600' },
  catHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  catHeaderEmoji: { fontSize: 32, marginRight: 10 },
  catHeaderTitle: { color: '#F0F0F0', fontSize: 20, fontWeight: '900', flex: 1 },
  questionText: { color: '#CCC', fontSize: 16, marginBottom: 14 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  optionNum: {
    color: '#CC0000',
    fontSize: 18,
    fontWeight: '900',
    width: 28,
  },
  optionLabel: { color: '#F0F0F0', fontSize: 14, flex: 1, fontWeight: '600' },
  optionArrow: { color: '#555', fontSize: 20 },

  // PROTOCOLO
  urgencyBadge: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  urgencyText: { color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },
  protoTitle: {
    color: '#F0F0F0',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  warningBox: {
    backgroundColor: '#2A1010',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#CC0000',
  },
  warningLabel: { color: '#CC0000', fontSize: 12, fontWeight: '900', marginBottom: 4 },
  warningText: { color: '#FFB3B3', fontSize: 13, lineHeight: 20 },
  sectionBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#333',
  },
  sectionLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  signItem: { color: '#DDD', fontSize: 13, marginBottom: 6, lineHeight: 20 },
  stepRow: { marginBottom: 8 },
  stepText: { color: '#DDD', fontSize: 14, lineHeight: 22 },
  contraBg: { backgroundColor: '#1A0A0A', borderLeftColor: '#CC0000' },
  contraItem: { color: '#FFB3B3', fontSize: 13, marginBottom: 6, lineHeight: 20 },

  // ACTÚA AHORA
  immediateBg: { backgroundColor: '#200808', borderLeftColor: '#CC0000' },
  immediateStep: { color: '#FFE0E0', fontSize: 14, lineHeight: 22, marginBottom: 8, fontWeight: '600' },
  noEquipNote: {
    backgroundColor: '#300A0A',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#5A1A1A',
  },
  noEquipText: { color: '#FFAAAA', fontSize: 12, lineHeight: 18, fontStyle: 'italic' },

  // BUSCA AYUDA
  helpBg: { backgroundColor: '#080D20', borderLeftColor: '#4488CC' },
  helpText: { color: '#AACCEE', fontSize: 13, lineHeight: 20, marginBottom: 10 },
  call911InlineBtn: {
    backgroundColor: '#1A3A5A',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4488CC',
  },
  call911InlineText: { color: '#88CCFF', fontSize: 13, fontWeight: '700' },

  // TRASLADO
  transportBg: { backgroundColor: '#1A1400', borderLeftColor: '#FFCC44' },
  transportLabel: { color: '#FFCC44', fontSize: 11, fontWeight: '900', marginBottom: 4 },
  transportText: { color: '#DDD', fontSize: 13, lineHeight: 20, marginBottom: 4 },
  hospitalsTip: {
    backgroundColor: '#111A00',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#334400',
  },
  hospitalsTipText: { color: '#99BB55', fontSize: 12, lineHeight: 18 },

  restartBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  restartBtnText: { color: '#888', fontSize: 14, fontWeight: '600' },

  // COMPLICACIÓN
  complicBg: { backgroundColor: '#1A1200', borderLeftColor: '#CC8800' },
  complicText: { color: '#CCA855', fontSize: 12, lineHeight: 19 },

  disclaimerBox: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  disclaimerText: { color: '#555', fontSize: 11, lineHeight: 17, textAlign: 'center' },
});
