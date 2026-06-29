import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';

export default function BlackoutScreen() {
  const [airplaneReminder, setAirplaneReminder] = useState(false);
  const [darkModeReminder, setDarkModeReminder] = useState(false);
  const [animationsOff, setAnimationsOff] = useState(false);
  const [brightnessLow, setBrightnessLow] = useState(false);

  const checkedCount = [airplaneReminder, darkModeReminder, animationsOff, brightnessLow].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔦 PROTOCOLO APAGÓN</Text>
          <Text style={styles.headerSub}>
            Gestión de luz, batería y visión nocturna durante colapso de red eléctrica.
          </Text>
        </View>

        {/* Checklist rápida */}
        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>LISTA DE ACCIONES INMEDIATAS</Text>
            <Text style={styles.checklistCount}>{checkedCount}/4</Text>
          </View>

          {[
            { label: 'Modo Avión activado', sub: 'Desactiva módem celular → ahorra hasta 40% de batería', state: airplaneReminder, setter: setAirplaneReminder, icon: '✈️' },
            { label: 'Pantalla en negro / true dark', sub: 'OLED/AMOLED: #000000 apaga cada píxel físicamente', state: darkModeReminder, setter: setDarkModeReminder, icon: '🌑' },
            { label: 'Brillo al mínimo útil', sub: 'No al 0% — suficiente para leer pero mínimo posible', state: brightnessLow, setter: setBrightnessLow, icon: '🔆' },
            { label: 'Wi-Fi, Bluetooth, GPS desactivados', sub: 'Cada radio activo consume miliamperios constantemente', state: animationsOff, setter: setAnimationsOff, icon: '📡' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.checkItem}
              onPress={() => item.setter(!item.state)}
            >
              <View style={[styles.checkBox, item.state && styles.checkBoxDone]}>
                {item.state && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.checkIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.checkLabel, item.state && styles.checkLabelDone]}>{item.label}</Text>
                <Text style={styles.checkSub}>{item.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Battery conservation math */}
        <View style={styles.batteryCard}>
          <Text style={styles.sectionTitle}>⚡ ARITMÉTICA DE BATERÍA</Text>
          <Text style={styles.batteryIntro}>
            Un teléfono de 4,000 mAh tiene este consumo aproximado:
          </Text>
          {[
            ['Modo normal (pantalla on, WiFi, datos)', '~400-600 mAh/h', '#CC0000'],
            ['Solo modo avión, pantalla off', '~15-30 mAh/h', '#FF8C00'],
            ['Modo emergencia completo (esta app)', '~20-40 mAh/h', '#FFB800'],
            ['Con panel solar 20W (luz directa)', '+500-800 mAh/h', '#006633'],
          ].map(([scenario, rate, color]) => (
            <View key={scenario} style={styles.batteryRow}>
              <Text style={styles.batteryScenario}>{scenario}</Text>
              <Text style={[styles.batteryRate, { color }]}>{rate}</Text>
            </View>
          ))}
          <View style={styles.batteryConclusion}>
            <Text style={styles.batteryConclusionText}>
              💡 En modo emergencia + avión: batería de 4,000 mAh dura{' '}
              <Text style={{ color: '#006633', fontWeight: '900' }}>~100-200 horas</Text>
              {' '}de standby (4-8 días).{'\n'}
              Con Power Bank de 20,000 mAh adicional:{' '}
              <Text style={{ color: '#006633', fontWeight: '900' }}>hasta 25 días teóricos</Text>.
            </Text>
          </View>
        </View>

        {/* Flashlight technique */}
        <View style={styles.torchCard}>
          <Text style={styles.sectionTitle}>👁️ TÉCNICA MILITAR DE LINTERNA</Text>
          <View style={styles.scienceBox}>
            <Text style={styles.scienceTitle}>FISIOLOGÍA DE LA VISIÓN NOCTURNA</Text>
            <Text style={styles.scienceText}>
              La{' '}
              <Text style={{ color: '#FFAAAA', fontWeight: '700' }}>rodopsina</Text>
              {' '}(pigmento en bastones de la retina) da visión escotópica (noche).
              Se{' '}
              <Text style={{ color: '#FF4444', fontWeight: '700' }}>blanquea en milisegundos</Text>
              {' '}con luz intensa.{'\n\n'}
              Recuperación completa:{' '}
              <Text style={{ color: '#FF4444', fontWeight: '700' }}>20-30 minutos</Text>
              {' '}en oscuridad total.
            </Text>
          </View>

          <Text style={styles.techniqueTitle}>TÉCNICA DE DESTELLOS PULSADOS</Text>
          {[
            { n: '1', t: 'Pulso corto', d: 'Activa la linterna 1-2 segundos MÁXIMO. Solo el tiempo necesario para mapear el espacio visual.' },
            { n: '2', t: 'Persistencia visual', d: 'El cerebro retiene la imagen ~0.5 segundos. Eso es suficiente para identificar obstáculos y planificar el movimiento.' },
            { n: '3', t: 'Mover en la oscuridad', d: 'Desplázate con la imagen mental grabada. NO tengas la linterna encendida mientras caminas.' },
            { n: '4', t: 'Siguiente pulso', d: 'Repite solo cuando necesites re-orientarte. Un adulto entrenado puede cruzar una habitación con 3-5 pulsos.' },
          ].map(step => (
            <View key={step.n} style={styles.techStep}>
              <View style={styles.techStepNum}>
                <Text style={styles.techStepNumText}>{step.n}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.techStepTitle}>{step.t}</Text>
                <Text style={styles.techStepDetail}>{step.d}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Light sources priority */}
        <View style={styles.priorityCard}>
          <Text style={styles.sectionTitle}>🕯️ JERARQUÍA DE FUENTES DE LUZ</Text>
          {[
            { rank: '1°', source: 'Linterna LED con pilas AA', why: 'Confiable, reemplazable, no drena tu teléfono. SIEMPRE primera opción.', color: '#006633' },
            { rank: '2°', source: 'Panel solar + USB', why: 'Carga dispositivos durante el día. Fuente infinita si hay sol.', color: '#4488BB' },
            { rank: '3°', source: 'Vela + recipiente metálico', why: 'Amplificador de luz pasivo. Una vela + olla de acero ilumina sorprendentemente bien.', color: '#FF8C00' },
            { rank: '4°', source: 'Teléfono (linterna)', why: 'ÚLTIMO RECURSO. Drena batería y destruye la visión nocturna. Solo en emergencias reales.', color: '#CC0000' },
            { rank: '❌', source: 'Fuego abierto en interiores', why: 'NUNCA. Riesgo de CO2, incendio. Solo fuego controlado en exterior.', color: '#880000' },
          ].map(item => (
            <View key={item.source} style={styles.priorityRow}>
              <View style={[styles.priorityRank, { backgroundColor: item.color + '33' }]}>
                <Text style={[styles.priorityRankText, { color: item.color }]}>{item.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.prioritySource}>{item.source}</Text>
                <Text style={styles.priorityWhy}>{item.why}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Radio analógico */}
        <View style={styles.radioCard}>
          <Text style={styles.sectionTitle}>📻 RADIO ANALÓGICO — ÚNICO VECTOR DE INFORMACIÓN</Text>
          <Text style={styles.radioText}>
            Durante el colapso de telecomunicaciones digitales (Internet, 4G, WiFi),
            las emisoras de radio AM/FM mantienen transmisión porque dependen de
            ondas terrestres de largo alcance, no de servidores ni routers.
          </Text>
          <View style={styles.radioFreq}>
            <Text style={styles.radioFreqTitle}>FRECUENCIAS CLAVE — COSTA RICA</Text>
            {[
              ['Radio Nacional / SINART', 'AM 780 / FM 101.5', 'Gobierno'],
              ['Radio Columbia', 'AM 1140 / FM 98.7', 'Noticias'],
              ['Radio Reloj', 'AM 790 / FM 100.3', '24h noticias'],
              ['CNE (Comisión Nacional)', 'Via Radio Nacional', 'Emergencias'],
            ].map(([name, freq, type]) => (
              <View key={name} style={styles.radioRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.radioName}>{name}</Text>
                  <Text style={styles.radioType}>{type}</Text>
                </View>
                <Text style={styles.radioFreqText}>{freq}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: { color: '#F0F0F0', fontSize: 20, fontWeight: '900', marginBottom: 6 },
  headerSub: { color: '#888', fontSize: 13, lineHeight: 18 },
  checklistCard: {
    margin: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  checklistTitle: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  checklistCount: { color: '#F0F0F0', fontSize: 16, fontWeight: '900' },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  checkBoxDone: { backgroundColor: '#006633', borderColor: '#006633' },
  checkMark: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  checkIcon: { fontSize: 18, marginRight: 10 },
  checkLabel: { color: '#F0F0F0', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  checkLabelDone: { textDecorationLine: 'line-through', color: '#555' },
  checkSub: { color: '#666', fontSize: 11 },
  batteryCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#111800',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334400',
  },
  sectionTitle: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  batteryIntro: { color: '#777', fontSize: 12, marginBottom: 10 },
  batteryRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2200',
  },
  batteryScenario: { color: '#AAAAAA', fontSize: 12, marginBottom: 4 },
  batteryRate: { fontSize: 13, fontWeight: '800' },
  batteryConclusion: {
    backgroundColor: '#0D1A00',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  batteryConclusionText: { color: '#AABBAA', fontSize: 13, lineHeight: 20 },
  torchCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1A1400',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#443300',
  },
  scienceBox: {
    backgroundColor: '#110E00',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB800',
  },
  scienceTitle: {
    color: '#FFB800',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  scienceText: { color: '#CCBBAA', fontSize: 12, lineHeight: 19 },
  techniqueTitle: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  techStep: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  techStepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#443300',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  techStepNumText: { color: '#FFB800', fontSize: 13, fontWeight: '900' },
  techStepTitle: { color: '#F0F0F0', fontSize: 13, fontWeight: '800', marginBottom: 4 },
  techStepDetail: { color: '#AAAAAA', fontSize: 12, lineHeight: 18 },
  priorityCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  priorityRank: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  priorityRankText: { fontSize: 12, fontWeight: '900' },
  prioritySource: { color: '#F0F0F0', fontSize: 13, fontWeight: '700', marginBottom: 3 },
  priorityWhy: { color: '#888', fontSize: 12, lineHeight: 17 },
  radioCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#111820',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1A3355',
  },
  radioText: { color: '#7799BB', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  radioFreq: {
    backgroundColor: '#0D1420',
    borderRadius: 8,
    padding: 12,
  },
  radioFreqTitle: {
    color: '#4488BB',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2A3A',
  },
  radioName: { color: '#AABBCC', fontSize: 13, fontWeight: '600' },
  radioType: { color: '#4477AA', fontSize: 11, marginTop: 2 },
  radioFreqText: { color: '#FF8C00', fontSize: 13, fontWeight: '800' },
});
