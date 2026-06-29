import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PROTOCOLS, HOSPITALS_2026, EMERGENCY_CONTACTS, PATIENT_DATA_URL } from '../clinical_logic/protocols';

const CATEGORIES = Object.values(PROTOCOLS.categories);

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [liveTotal, setLiveTotal] = useState(null);

  useEffect(() => {
    fetch(PATIENT_DATA_URL)
      .then(r => r.json())
      .then(d => setLiveTotal(d.total))
      .catch(() => {});
  }, []);

  const call = number => Linking.openURL(`tel:${number}`);

  const gotoTriage = categoryId => {
    navigation.navigate('Triaje', { categoryId });
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <View style={s.flagStripe}>
          <View style={[s.stripeSegment, { backgroundColor: '#FFCE00' }]} />
          <View style={[s.stripeSegment, { backgroundColor: '#002060' }]} />
          <View style={[s.stripeSegment, { backgroundColor: '#CF142B' }]} />
        </View>

        <View style={s.header}>
          <Text style={s.headerEmoji}>🇻🇪</Text>
          <View style={s.headerText}>
            <Text style={s.headerTitle}>SOS VENEZUELA</Text>
            <Text style={s.headerSub}>La Guaira 2026 · Primeros Auxilios</Text>
          </View>
          <View style={s.offlineBadge}>
            <Text style={s.offlineBadgeText}>OFFLINE</Text>
          </View>
        </View>

        {/* ── ALERTA ACTIVA ─────────────────────────────────────────────────── */}
        <View style={s.alertBox}>
          <Text style={s.alertTitle}>🚨 EMERGENCIA ACTIVA — SISMO LA GUAIRA</Text>
          <Text style={s.alertSub}>
            {liveTotal ? `${liveTotal.toLocaleString()} pacientes` : '3.186+ pacientes'} en 14 hospitales
            · Actualización en tiempo real
          </Text>
        </View>

        {/* ── ACCIONES PRINCIPALES ──────────────────────────────────────────── */}
        <View style={s.primaryActions}>
          <TouchableOpacity
            style={s.triajeBtnBig}
            onPress={() => navigation.navigate('Triaje')}
            activeOpacity={0.8}
          >
            <Text style={s.triajeIcon}>🚨</Text>
            <View>
              <Text style={s.triajeBtnTitle}>INICIAR TRIAJE</Text>
              <Text style={s.triajeBtnSub}>Guía de primeros auxilios paso a paso</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.buscarBtn}
            onPress={() => navigation.navigate('Buscar')}
            activeOpacity={0.8}
          >
            <Text style={s.buscarIcon}>🔍</Text>
            <View>
              <Text style={s.buscarBtnTitle}>BUSCAR FAMILIAR</Text>
              <Text style={s.buscarBtnSub}>Consulta en qué hospital está</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── PROTOCOLOS RÁPIDOS ────────────────────────────────────────────── */}
        <Text style={s.sectionTitle}>PROTOCOLOS RÁPIDOS</Text>
        <View style={s.protocolGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={s.protoCard}
              onPress={() => gotoTriage(cat.id)}
              activeOpacity={0.75}
            >
              <Text style={s.protoEmoji}>{cat.emoji}</Text>
              <Text style={s.protoName}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── HERRAMIENTAS ──────────────────────────────────────────────────── */}
        <Text style={s.sectionTitle}>HERRAMIENTAS</Text>
        <View style={s.toolsRow}>
          <ToolBtn icon="🩺" label="MARCH" onPress={() => navigation.navigate('MARCH')} />
          <ToolBtn icon="🎒" label="Kit 72h" onPress={() => navigation.navigate('Kit')} />
          <ToolBtn icon="💧" label="Agua" onPress={() => navigation.navigate('Agua')} />
          <ToolBtn icon="🔌" label="Apagón" onPress={() => navigation.navigate('Blackout')} />
        </View>

        {/* ── HOSPITALES ACTIVOS ────────────────────────────────────────────── */}
        <Text style={s.sectionTitle}>HOSPITALES ACTIVOS</Text>
        {HOSPITALS_2026.filter(h => h.patients > 0).map(h => (
          <View key={h.name} style={s.hospitalRow}>
            <View style={s.hospitalInfo}>
              <Text style={s.hospitalName}>{h.name}</Text>
              {h.note && <Text style={s.hospitalNote}>⚠️ {h.note}</Text>}
            </View>
            <View style={[s.hospitalCount, { backgroundColor: h.patients > 200 ? '#4A1010' : '#1A2A1A' }]}>
              <Text style={s.hospitalCountText}>{h.patients.toLocaleString()}</Text>
            </View>
          </View>
        ))}

        {/* ── EMERGENCIAS ───────────────────────────────────────────────────── */}
        <Text style={s.sectionTitle}>LÍNEAS DE EMERGENCIA</Text>
        <TouchableOpacity
          style={s.call911}
          onPress={() => call(EMERGENCY_CONTACTS.primary.number)}
          activeOpacity={0.8}
        >
          <Text style={s.call911Text}>📞 LLAMAR AL 911</Text>
        </TouchableOpacity>

        <View style={s.contactsGrid}>
          {EMERGENCY_CONTACTS.contacts.map(c => (
            <TouchableOpacity
              key={c.number}
              style={s.contactCard}
              onPress={() => call(c.number)}
              activeOpacity={0.75}
            >
              <Text style={s.contactIcon}>{c.icon}</Text>
              <Text style={s.contactName}>{c.name}</Text>
              <Text style={s.contactNumber}>{c.number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            ⚕️ Protocolos basados en Cruz Roja Internacional, PHTLS y ATLS.
            No reemplaza atención médica profesional.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ToolBtn({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={s.toolBtn} onPress={onPress} activeOpacity={0.75}>
      <Text style={s.toolIcon}>{icon}</Text>
      <Text style={s.toolLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  flagStripe: { flexDirection: 'row', height: 4 },
  stripeSegment: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerEmoji: { fontSize: 28, marginRight: 10 },
  headerText: { flex: 1 },
  headerTitle: {
    color: '#F0F0F0', fontSize: 18, fontWeight: '900', letterSpacing: 1,
  },
  headerSub: { color: '#888', fontSize: 12, marginTop: 1 },
  offlineBadge: {
    backgroundColor: '#1A2A1A', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  offlineBadgeText: { color: '#5CCC5C', fontSize: 10, fontWeight: '700' },

  alertBox: {
    backgroundColor: '#2A1010',
    borderLeftWidth: 4,
    borderLeftColor: '#CC0000',
    margin: 12,
    borderRadius: 10,
    padding: 14,
  },
  alertTitle: { color: '#FF4444', fontSize: 13, fontWeight: '900', marginBottom: 4 },
  alertSub: { color: '#CC8888', fontSize: 12, lineHeight: 18 },

  primaryActions: { paddingHorizontal: 12, gap: 10, marginBottom: 4 },
  triajeBtnBig: {
    backgroundColor: '#CC0000',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  triajeIcon: { fontSize: 32 },
  triajeBtnTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  triajeBtnSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },

  buscarBtn: {
    backgroundColor: '#0D2A4A',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#1A4A7A',
  },
  buscarIcon: { fontSize: 28 },
  buscarBtnTitle: { color: '#88CCFF', fontSize: 16, fontWeight: '900' },
  buscarBtnSub: { color: 'rgba(136,204,255,0.7)', fontSize: 12, marginTop: 2 },

  sectionTitle: {
    color: '#555',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginHorizontal: 14,
    marginTop: 20,
    marginBottom: 10,
  },

  protocolGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  protoCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 14,
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  protoEmoji: { fontSize: 28, marginBottom: 6 },
  protoName: { color: '#DDD', fontSize: 12, fontWeight: '700', textAlign: 'center' },

  toolsRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8 },
  toolBtn: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  toolIcon: { fontSize: 22 },
  toolLabel: { color: '#888', fontSize: 9, fontWeight: '700', marginTop: 4 },

  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  hospitalInfo: { flex: 1 },
  hospitalName: { color: '#DDD', fontSize: 13, fontWeight: '600' },
  hospitalNote: { color: '#FF8C00', fontSize: 11, marginTop: 2 },
  hospitalCount: {
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, minWidth: 48, alignItems: 'center',
  },
  hospitalCountText: { color: '#DDD', fontWeight: '700', fontSize: 14 },

  call911: {
    backgroundColor: '#CC0000',
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  call911Text: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 1 },

  contactsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  contactCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 12,
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  contactIcon: { fontSize: 22, marginBottom: 4 },
  contactName: { color: '#AAA', fontSize: 11, fontWeight: '700', textAlign: 'center' },
  contactNumber: { color: '#666', fontSize: 11, marginTop: 2 },

  disclaimer: {
    margin: 14, backgroundColor: '#111', borderRadius: 8, padding: 12, marginTop: 16,
  },
  disclaimerText: { color: '#444', fontSize: 11, lineHeight: 17, textAlign: 'center' },
});
