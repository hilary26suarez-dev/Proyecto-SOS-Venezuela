import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';

const METHODS = [
  {
    id: 'sodis',
    label: 'SODIS',
    sublabel: 'Desinfección Solar',
    icon: '☀️',
    color: '#FF8C00',
    priority: 'MÉTODO PRINCIPAL',
    summary: 'Radiación UV-A destruye bacterias, virus y protozoos. Avalado por OMS y UNICEF.',
    steps: [
      { n: '1', t: 'Botella PET transparente', d: 'SOLO botellas de plástico PET (código ♳) transparentes. Máximo 2 litros. Las botellas de vidrio, opacas o de color bloquean los rayos UV-A y ANULAN el método.' },
      { n: '2', t: 'Test de turbidez', d: 'Coloca la botella llena sobre un titular de periódico. Si puedes leer las letras a través del agua → el agua pasa el test.\n\nSi NO puedes leer → Pre-filtra el agua a través de telas (camisa de tela, arena fina) hasta que sea legible.' },
      { n: '3', t: 'Llenado y posición', d: 'Llena la botella completamente (sin espacio de aire). Coloca horizontalmente sobre una superficie reflectante (techo de zinc, papel aluminio) para máxima exposición UV.' },
      { n: '4', t: 'Tiempo de exposición', d: '☀️ Cielo despejado o < 50% nuboso: 6 horas continuas\n⛅ Cielo > 50% cubierto: 48 horas (2 días)\n\nCosta Rica (8°-11° N) tiene índice UV elevado — las 6 horas aplican la mayor parte del año.' },
      { n: '5', t: 'Consumo', d: 'Beber directamente de la botella o transvasar a recipiente limpio. NO dejes pasar más de 24h después del SODIS sin volver a exponer o consumir.' },
    ],
    warning: 'SODIS NO funciona para agua con contaminantes químicos (combustibles, pesticidas). Solo para patógenos biológicos.',
    supplies: ['Botellas PET transparentes 2L', 'Superficie reflectante (zinc, aluminio)', 'Fuente de luz solar directa'],
  },
  {
    id: 'boiling',
    label: 'EBULLICIÓN',
    sublabel: 'Desinfección Térmica',
    icon: '🔥',
    color: '#CC3300',
    priority: 'MÁS EFECTIVO',
    summary: 'La CDC establece que la ebullición es el método más confiable. Mata el 100% de patógenos.',
    steps: [
      { n: '1', t: 'Pre-filtrado', d: 'Si el agua está turbia: pasar por tela limpia o dejar reposar 30 min para sedimentar partículas.' },
      { n: '2', t: 'Calentar hasta hervor vigoroso', d: 'Calentar hasta que aparezcan burbujas grandes y continuas (ebullición rodante). Las burbujas pequeñas al fondo NO indican ebullición.' },
      { n: '3', t: 'Mantener ebullición', d: 'Nivel del mar (< 2,000 m): 1 MINUTO mínimo\n\nAltitudes elevadas (> 2,000 m): 3 MINUTOS mínimos\n\nSan José y Valle Central están a ~1,000-1,500 m: aplicar 1 minuto.' },
      { n: '4', t: 'Enfriar y almacenar', d: 'Dejar enfriar en el mismo recipiente tapado. Transvasar a recipiente limpio con tapa. Consumir dentro de 24 horas o volver a tratar.' },
    ],
    warning: 'Requiere combustible (gas, madera, alcohol). Reserva el gas LP solo para agua y comida esencial durante la emergencia.',
    supplies: ['Olla o recipiente metálico', 'Fuente de calor (gas, leña, alcohol)', 'Recipiente limpio con tapa'],
  },
  {
    id: 'sediment',
    label: 'SEDIMENTACIÓN',
    sublabel: 'Pre-tratamiento mecánico',
    icon: '⏳',
    color: '#4488BB',
    priority: 'PASO PREVIO',
    summary: 'No desinfecta, pero prepara el agua para SODIS o ebullición. Siempre primer paso si el agua está turbia.',
    steps: [
      { n: '1', t: 'Reposo inicial', d: 'Llenar un recipiente limpio y dejar reposar sin mover durante 30-60 minutos. La ley de Stokes hace que las partículas más pesadas caigan al fondo.' },
      { n: '2', t: 'Decantación', d: 'Inclinar suavemente el recipiente y verter el agua clara del sobrenadante (la parte de arriba) a otro recipiente, sin disturbar el sedimento del fondo.' },
      { n: '3', t: 'Filtrado con tela', d: 'Pasar el agua decantada a través de varias capas de tela de algodón limpia (camisa, trapo) para retener partículas más pequeñas.' },
      { n: '4', t: 'Repetir si es necesario', d: 'Si el agua aún no es lo suficientemente clara para el test del periódico de SODIS: repetir sedimentación 2-3 veces.' },
    ],
    warning: 'La sedimentación NO mata patógenos. SIEMPRE combinar con SODIS o ebullición después.',
    supplies: ['2 recipientes limpios', 'Telas de algodón limpias'],
  },
];

export default function WaterScreen() {
  const [activeMethod, setActiveMethod] = useState('sodis');
  const [checkedSteps, setCheckedSteps] = useState({});

  const method = METHODS.find(m => m.id === activeMethod);

  const toggleStep = (stepN) => {
    setCheckedSteps(prev => ({ ...prev, [`${activeMethod}_${stepN}`]: !prev[`${activeMethod}_${stepN}`] }));
  };

  const isChecked = (stepN) => checkedSteps[`${activeMethod}_${stepN}`];

  const completedSteps = method.steps.filter(s => isChecked(s.n)).length;

  return (
    <View style={styles.container}>
      {/* Method tabs */}
      <View style={styles.tabs}>
        {METHODS.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.tab, activeMethod === m.id && { borderBottomColor: m.color, borderBottomWidth: 3 }]}
            onPress={() => setActiveMethod(m.id)}
          >
            <Text style={styles.tabIcon}>{m.icon}</Text>
            <Text style={[styles.tabLabel, activeMethod === m.id && { color: '#F0F0F0' }]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Method Header */}
        <View style={[styles.methodHeader, { borderLeftColor: method.color }]}>
          <View style={styles.methodHeaderRow}>
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <View style={{ flex: 1 }}>
              <View style={[styles.priorityBadge, { backgroundColor: method.color }]}>
                <Text style={styles.priorityText}>{method.priority}</Text>
              </View>
              <Text style={styles.methodTitle}>{method.label}</Text>
              <Text style={styles.methodSubtitle}>{method.sublabel}</Text>
            </View>
          </View>
          <Text style={styles.methodSummary}>{method.summary}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>Pasos completados: {completedSteps} / {method.steps.length}</Text>
          <TouchableOpacity onPress={() => {
            const reset = {};
            method.steps.forEach(s => { reset[`${activeMethod}_${s.n}`] = false; });
            setCheckedSteps(prev => ({ ...prev, ...reset }));
          }}>
            <Text style={styles.resetBtn}>Reiniciar</Text>
          </TouchableOpacity>
        </View>

        {/* Steps */}
        {method.steps.map((step) => (
          <TouchableOpacity
            key={step.n}
            style={[styles.stepCard, isChecked(step.n) && styles.stepCardDone]}
            onPress={() => toggleStep(step.n)}
          >
            <View style={[styles.stepCheckbox, isChecked(step.n) && { backgroundColor: method.color, borderColor: method.color }]}>
              {isChecked(step.n) && <Text style={styles.stepCheckmark}>✓</Text>}
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, isChecked(step.n) && styles.stepTitleDone]}>
                {step.n}. {step.t}
              </Text>
              <Text style={[styles.stepDetail, isChecked(step.n) && styles.stepDetailDone]}>
                {step.d}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Warning */}
        <View style={[styles.warningCard, { borderColor: method.color }]}>
          <Text style={[styles.warningTitle, { color: method.color }]}>⚠️ IMPORTANTE</Text>
          <Text style={styles.warningText}>{method.warning}</Text>
        </View>

        {/* Supplies */}
        <View style={styles.suppliesCard}>
          <Text style={styles.suppliesTitle}>MATERIALES NECESARIOS</Text>
          {method.supplies.map((s, i) => (
            <View key={i} style={styles.supplyRow}>
              <Text style={styles.supplyBullet}>›</Text>
              <Text style={styles.supplyText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Costa Rica specific */}
        <View style={styles.crCard}>
          <Text style={styles.crTitle}>🇨🇷 DATOS PARA COSTA RICA</Text>
          <Text style={styles.crText}>
            Latitud 8°-11° Norte. Índice UV promedio: 12-14 (extremo) en estación seca.{'\n\n'}
            <Text style={{ fontWeight: '800', color: '#FFDDAA' }}>Temporada seca</Text> (dic-abr): SODIS 6h ideal{'\n'}
            <Text style={{ fontWeight: '800', color: '#AACCFF' }}>Temporada lluviosa</Text> (may-nov): Priorizar ebullición o ampliar SODIS a 48h{'\n\n'}
            Altitudes referencia:{'\n'}
            • San José: ~1,100 m → ebullición 1 min{'\n'}
            • Cartago: ~1,400 m → ebullición 1 min{'\n'}
            • Volcán Irazú: ~3,432 m → ebullición 3 min
          </Text>
        </View>

        {/* Daily needs calculator */}
        <View style={styles.calcCard}>
          <Text style={styles.calcTitle}>💧 NECESIDADES HÍDRICAS DIARIAS</Text>
          {[
            ['Adulto (actividad normal)', '2 litros/día'],
            ['Adulto (calor / esfuerzo)', '3-4 litros/día'],
            ['Niño 6-12 años', '1.5 litros/día'],
            ['Adulto mayor', '2 litros/día mínimo'],
            ['Cocina + higiene básica', '+1 litro/persona/día'],
          ].map(([label, val]) => (
            <View key={label} style={styles.calcRow}>
              <Text style={styles.calcLabel}>{label}</Text>
              <Text style={styles.calcValue}>{val}</Text>
            </View>
          ))}
          <View style={[styles.calcRow, styles.calcTotal]}>
            <Text style={[styles.calcLabel, { color: '#F0F0F0', fontWeight: '800' }]}>
              KIT 72H — 4 personas
            </Text>
            <Text style={[styles.calcValue, { color: '#FF8C00', fontWeight: '900' }]}>~32 litros</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabIcon: { fontSize: 20, marginBottom: 4 },
  tabLabel: { color: '#666', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  methodHeader: {
    margin: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 4,
  },
  methodHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  methodIcon: { fontSize: 36, marginRight: 12 },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  priorityText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  methodTitle: { color: '#F0F0F0', fontSize: 20, fontWeight: '900' },
  methodSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  methodSummary: { color: '#AAAAAA', fontSize: 13, lineHeight: 19 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  progressText: { color: '#666', fontSize: 12 },
  resetBtn: { color: '#4488BB', fontSize: 12 },
  stepCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  stepCardDone: { opacity: 0.6, backgroundColor: '#141414' },
  stepCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
    flexShrink: 0,
  },
  stepCheckmark: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  stepContent: { flex: 1 },
  stepTitle: { color: '#F0F0F0', fontSize: 14, fontWeight: '800', marginBottom: 6 },
  stepTitleDone: { textDecorationLine: 'line-through', color: '#555' },
  stepDetail: { color: '#AAAAAA', fontSize: 13, lineHeight: 19 },
  stepDetailDone: { color: '#444' },
  warningCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
  },
  warningTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  warningText: { color: '#AAAAAA', fontSize: 13, lineHeight: 19 },
  suppliesCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  suppliesTitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  supplyRow: { flexDirection: 'row', marginBottom: 8 },
  supplyBullet: { color: '#4488BB', fontSize: 16, marginRight: 10 },
  supplyText: { color: '#CCCCCC', fontSize: 13, flex: 1 },
  crCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#111820',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1A3355',
  },
  crTitle: {
    color: '#4488BB',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  crText: { color: '#7799BB', fontSize: 13, lineHeight: 20 },
  calcCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  calcTitle: {
    color: '#4488BB',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  calcTotal: { borderTopWidth: 1, borderTopColor: '#333', borderBottomWidth: 0, marginTop: 4 },
  calcLabel: { color: '#888', fontSize: 12, flex: 1 },
  calcValue: { color: '#FF8C00', fontSize: 13, fontWeight: '700' },
});
