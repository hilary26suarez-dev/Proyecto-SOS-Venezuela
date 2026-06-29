import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CONTACTS = [
  {
    category: 'EMERGENCIAS INMEDIATAS',
    color: '#CC0000',
    entries: [
      { name: '9-1-1', desc: 'Emergencias nacionales — Policía, Bomberos, Médico', type: 'Marcación directa' },
      { name: '128', desc: 'Cruz Roja Costarricense — Ambulancias', type: 'Cruz Roja' },
      { name: '118', desc: 'Cuerpo de Bomberos de Costa Rica', type: 'Bomberos' },
    ],
  },
  {
    category: 'GESTIÓN DE DESASTRES',
    color: '#FF8C00',
    entries: [
      { name: '2210-2828', desc: 'CNE — Comisión Nacional de Emergencias', type: 'CNE' },
      { name: '2212-5400', desc: 'Sede central CNE', type: 'CNE' },
      { name: '2244-2736', desc: 'OVSICORI-UNA — Vulcanología y Sismología', type: 'OVSICORI' },
      { name: '2511-4444', desc: 'RSN-UCR — Red Sismológica Nacional', type: 'RSN' },
    ],
  },
  {
    category: 'SERVICIOS DE INFRAESTRUCTURA',
    color: '#4488BB',
    entries: [
      { name: '1-800-1038', desc: 'CNFL — Compañía Nacional Fuerza y Luz (averías)', type: 'Electricidad' },
      { name: '2696-1000', desc: 'ICE — Instituto Costarricense Electricidad', type: 'ICE' },
      { name: '800-2001-000', desc: 'AyA — Acueductos y Alcantarillados', type: 'Agua' },
      { name: '1-800-7475825', desc: 'RECOPE — Gas y combustible (emergencias)', type: 'Gas/RECOPE' },
    ],
  },
  {
    category: 'HOSPITALES CAJA — VALLE CENTRAL',
    color: '#006633',
    entries: [
      { name: '2547-8000', desc: 'Hospital México (UCR) — San José norte', type: 'CCSS' },
      { name: '2257-8122', desc: 'Hospital San Juan de Dios — San José centro', type: 'CCSS' },
      { name: '2291-5000', desc: 'Hospital Calderón Guardia — Tibás', type: 'CCSS' },
      { name: '2551-9900', desc: 'Hospital Max Peralta — Cartago', type: 'CCSS' },
      { name: '2436-1000', desc: 'Hospital San Rafael — Alajuela', type: 'CCSS' },
    ],
  },
  {
    category: 'DATOS DE ALERTA SÍSMICA',
    color: '#888888',
    entries: [
      { name: 'OVSICORI', desc: 'ovsicori.una.ac.cr — Información en tiempo real', type: 'Web/App' },
      { name: 'RSN UCR', desc: 'rsn.ucr.ac.cr — Red Sismológica Nacional', type: 'Web' },
      { name: 'SINAMOT', desc: 'Sistema Nacional de Monitoreo de Tsunamis', type: 'Web' },
    ],
  },
];

const OVSICORI_INFO = `El OVSICORI (Observatorio Vulcanológico y Sismológico de Costa Rica) administra una red de sensores sismológicos distribuidos en todo el territorio nacional.

Cuando un sismo ocurre, los sensores detectan primero las ondas P (rápidas, menos destructivas) y calculan automáticamente la magnitud, enviando alertas a las poblaciones antes de la llegada de las ondas S (lentas, destructivas).

Este margen puede ser de segundos a minutos según tu distancia al hipocentro. La app activará su protocolo inmediatamente al recibir la notificación del sistema operativo.`;

export default function ContactsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* OVSICORI science box */}
        <View style={styles.ovsicoriCard}>
          <Text style={styles.ovsicoriTitle}>🌋 SISTEMA DE ALERTA OVSICORI</Text>
          <Text style={styles.ovsicoriText}>{OVSICORI_INFO}</Text>
          <View style={styles.waveBox}>
            <View style={styles.waveItem}>
              <Text style={styles.waveLetter}>P</Text>
              <Text style={styles.waveLabel}>Onda Primaria</Text>
              <Text style={styles.waveDesc}>Rápida{'\n'}Detectada primero{'\n'}Menos destructiva</Text>
            </View>
            <View style={styles.waveArrow}>
              <Text style={styles.waveArrowText}>→</Text>
              <Text style={styles.waveArrowLabel}>alerta sale</Text>
            </View>
            <View style={styles.waveItem}>
              <Text style={[styles.waveLetter, { color: '#CC0000' }]}>S</Text>
              <Text style={styles.waveLabel}>Onda Secundaria</Text>
              <Text style={styles.waveDesc}>Lenta{'\n'}Llega después{'\n'}DESTRUCTIVA</Text>
            </View>
          </View>
          <Text style={styles.marginNote}>
            En San José: el margen típico ante un sismo costero es de 30-90 segundos.
            Úsalos siguiendo el protocolo del mapa de calor.
          </Text>
        </View>

        {/* Contact Groups */}
        {CONTACTS.map(group => (
          <View key={group.category} style={styles.group}>
            <Text style={[styles.groupTitle, { color: group.color }]}>{group.category}</Text>
            {group.entries.map(entry => (
              <View key={entry.name} style={styles.contactCard}>
                <View style={styles.contactMain}>
                  <Text style={styles.contactNumber}>{entry.name}</Text>
                  <View style={[styles.typeBadge, { backgroundColor: group.color + '33' }]}>
                    <Text style={[styles.typeBadgeText, { color: group.color }]}>{entry.type}</Text>
                  </View>
                </View>
                <Text style={styles.contactDesc}>{entry.desc}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Analog note */}
        <View style={styles.analogNote}>
          <Text style={styles.analogTitle}>📻 SI NO HAY SEÑAL CELULAR</Text>
          <Text style={styles.analogText}>
            Todos los números de arriba son inútiles sin red.{'\n\n'}
            Activa el radio AM/FM analógico (pilas AA).{'\n'}
            Canal CNE/gobierno: Radio Nacional AM 780 / FM 101.5{'\n\n'}
            La información oficial del Estado se transmite primero por estas frecuencias durante desastres nacionales.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  ovsicoriCard: {
    margin: 16,
    backgroundColor: '#111420',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A44',
  },
  ovsicoriTitle: {
    color: '#6688CC',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 12,
  },
  ovsicoriText: { color: '#7788AA', fontSize: 12, lineHeight: 19, marginBottom: 16 },
  waveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0D1020',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  waveItem: { alignItems: 'center' },
  waveLetter: {
    fontSize: 36,
    fontWeight: '900',
    color: '#4488BB',
    marginBottom: 4,
  },
  waveLabel: { color: '#888', fontSize: 10, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  waveDesc: { color: '#555', fontSize: 10, textAlign: 'center', lineHeight: 15 },
  waveArrow: { alignItems: 'center' },
  waveArrowText: { color: '#FFB800', fontSize: 24, fontWeight: '900' },
  waveArrowLabel: { color: '#665500', fontSize: 9, marginTop: 4 },
  marginNote: { color: '#5566AA', fontSize: 11, lineHeight: 17, fontStyle: 'italic' },
  group: { marginBottom: 8 },
  groupTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  contactCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  contactMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  contactNumber: { color: '#F0F0F0', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  contactDesc: { color: '#888', fontSize: 12, lineHeight: 17 },
  analogNote: {
    margin: 16,
    backgroundColor: '#181200',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  analogTitle: {
    color: '#FF8C00',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
  },
  analogText: { color: '#CCBBAA', fontSize: 13, lineHeight: 20 },
});
