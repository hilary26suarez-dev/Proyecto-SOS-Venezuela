import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Linking, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PATIENT_DATA_URL, HOSPITALS_2026 } from '../clinical_logic/protocols';

const CACHE_KEY = 'sos_ve_patient_cache';
const CACHE_TS_KEY = 'sos_ve_patient_cache_ts';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export default function PatientSearchScreen() {
  const [query, setQuery] = useState('');
  const [allPatients, setAllPatients] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cacheDate, setCacheDate] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // Intentar caché primero
      const [cached, ts] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEY),
        AsyncStorage.getItem(CACHE_TS_KEY),
      ]);

      if (cached && ts && Date.now() - Number(ts) < CACHE_TTL_MS) {
        const parsed = JSON.parse(cached);
        setAllPatients(parsed.patients || []);
        setStats(parsed.stats || null);
        setCacheDate(new Date(Number(ts)));
        setLoading(false);
        return;
      }

      // Fetch fresco
      const res = await fetch(PATIENT_DATA_URL, { timeout: 10000 });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const patients = buildPatientList(data);
      const statsObj = {
        total: data.total || patients.length,
        con_cedula: data.con_cedula || 0,
        hospitales: Object.keys(data.by_hospital || {}).length,
      };

      setAllPatients(patients);
      setStats(statsObj);
      setCacheDate(new Date());

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ patients, stats: statsObj }));
      await AsyncStorage.setItem(CACHE_TS_KEY, String(Date.now()));
    } catch (e) {
      setError('Sin conexión. Mostrando lista de hospitales.');
      // Construir lista desde constante local
      setAllPatients([]);
      setStats(null);
    }
    setLoading(false);
  }

  function buildPatientList(data) {
    // El endpoint devuelve pacientes en data.patients o los construimos de by_hospital
    // Formato esperado: array de { nombre, apellidos, cedula, hospital, area }
    if (Array.isArray(data.patients)) return data.patients;
    if (Array.isArray(data.records)) return data.records;
    return [];
  }

  function doSearch() {
    const q = normalize(query);
    setSearched(true);
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    const filtered = allPatients.filter(p => {
      const name = normalize(`${p.nombres || ''} ${p.apellidos || ''}`);
      const ci = normalize(p.cedula || p.ci || '');
      return name.includes(q) || ci.includes(q);
    });
    setResults(filtered.slice(0, 50)); // máximo 50 resultados
  }

  const renderPatient = ({ item }) => (
    <View style={s.patientCard}>
      <View style={s.patientHeader}>
        <Text style={s.patientName}>
          {[item.nombres, item.apellidos].filter(Boolean).join(' ') || 'Sin nombre'}
        </Text>
        {item.cedula || item.ci ? (
          <Text style={s.patientCI}>CI: {item.cedula || item.ci}</Text>
        ) : null}
      </View>
      <View style={s.hospitalTag}>
        <Text style={s.hospitalTagText}>🏥 {item.hospital || 'Hospital no especificado'}</Text>
      </View>
      {item.area ? <Text style={s.patientArea}>Área: {item.area}</Text> : null}
    </View>
  );

  return (
    <View style={s.container}>
      {/* Barra de búsqueda */}
      <View style={s.searchBar}>
        <TextInput
          style={s.input}
          placeholder="Nombre, apellido o cédula..."
          placeholderTextColor="#555"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={doSearch}
          returnKeyType="search"
          autoCapitalize="words"
        />
        <TouchableOpacity style={s.searchBtn} onPress={doSearch} activeOpacity={0.8}>
          <Text style={s.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {stats && (
        <View style={s.statsRow}>
          <StatChip label="Pacientes" value={stats.total?.toLocaleString()} />
          <StatChip label="Hospitales" value={stats.hospitales} />
          <StatChip label="Con cédula" value={stats.con_cedula?.toLocaleString()} />
        </View>
      )}

      {cacheDate && (
        <TouchableOpacity onPress={loadData} style={s.updateRow}>
          <Text style={s.updateText}>
            🔄 Actualizado {cacheDate.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
            {loading ? '  Actualizando...' : '  — Toca para refrescar'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Loading */}
      {loading && !allPatients.length && (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#CC0000" />
          <Text style={s.loadingText}>Consultando base de datos...</Text>
        </View>
      )}

      {/* Error — muestra hospitales locales */}
      {error && (
        <View style={s.errorBox}>
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {/* Resultados de búsqueda */}
      {searched && !loading && (
        <>
          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item, i) => `${item.cedula || item.ci || i}`}
              renderItem={renderPatient}
              style={s.list}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListHeaderComponent={
                <Text style={s.resultsLabel}>{results.length} resultado(s)</Text>
              }
            />
          ) : (
            <View style={s.noResults}>
              <Text style={s.noResultsTitle}>No encontrado</Text>
              <Text style={s.noResultsSub}>
                Verifica en estos hospitales activos:
              </Text>
              <HospitalList />
            </View>
          )}
        </>
      )}

      {/* Estado inicial — sin búsqueda */}
      {!searched && !loading && allPatients.length > 0 && (
        <View style={s.initialState}>
          <Text style={s.initialIcon}>🔍</Text>
          <Text style={s.initialText}>
            Ingresa nombre completo, apellido o número de cédula para buscar a tu familiar.
          </Text>
          <Text style={s.initialSub}>
            Base de datos: {allPatients.length.toLocaleString()} registros de 14 hospitales
          </Text>
        </View>
      )}

      {/* Sin datos y sin error: muestra hospitales */}
      {!loading && !allPatients.length && !error && <HospitalList />}
    </View>
  );
}

function StatChip({ label, value }) {
  return (
    <View style={s.statChip}>
      <Text style={s.statVal}>{value ?? '—'}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function HospitalList() {
  return (
    <View style={s.hospitalSection}>
      <Text style={s.hospitalSectionTitle}>Hospitales activos — La Guaira 2026</Text>
      {HOSPITALS_2026.filter(h => h.patients > 0).map(h => (
        <View key={h.name} style={s.hospitalRow}>
          <View style={s.hospitalInfo}>
            <Text style={s.hospitalName}>{h.name}</Text>
            <Text style={s.hospitalZone}>{h.zone}{h.note ? ` · ${h.note}` : ''}</Text>
          </View>
          <View style={[s.hospitalBadge, { backgroundColor: h.patients > 200 ? '#4A1010' : '#1A2A1A' }]}>
            <Text style={s.hospitalBadgeText}>{h.patients}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  searchBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F0F0F0',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  searchBtn: {
    backgroundColor: '#CC0000',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  statChip: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  statVal: { color: '#CC0000', fontSize: 16, fontWeight: '900' },
  statLabel: { color: '#666', fontSize: 10, marginTop: 2 },

  updateRow: { paddingHorizontal: 14, paddingBottom: 6 },
  updateText: { color: '#555', fontSize: 11 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  loadingText: { color: '#666', marginTop: 12, fontSize: 14 },

  errorBox: { margin: 12, backgroundColor: '#2A1010', borderRadius: 10, padding: 14 },
  errorText: { color: '#FF8080', fontSize: 13 },

  list: { flex: 1 },
  resultsLabel: { color: '#666', fontSize: 12, padding: 12, paddingBottom: 4 },

  patientCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  patientName: { color: '#F0F0F0', fontSize: 15, fontWeight: '700', flex: 1 },
  patientCI: { color: '#888', fontSize: 12, fontFamily: 'monospace' },
  hospitalTag: {
    backgroundColor: '#0D1F0D',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  hospitalTagText: { color: '#5CCC5C', fontSize: 12, fontWeight: '600' },
  patientArea: { color: '#666', fontSize: 12, marginTop: 2 },

  noResults: { padding: 20 },
  noResultsTitle: { color: '#F0F0F0', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  noResultsSub: { color: '#888', fontSize: 13, marginBottom: 14 },

  initialState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  initialIcon: { fontSize: 48, marginBottom: 16 },
  initialText: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  initialSub: { color: '#555', fontSize: 12, textAlign: 'center' },

  hospitalSection: { padding: 12 },
  hospitalSectionTitle: {
    color: '#888',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#222',
  },
  hospitalInfo: { flex: 1 },
  hospitalName: { color: '#DDD', fontSize: 13, fontWeight: '600' },
  hospitalZone: { color: '#666', fontSize: 11, marginTop: 2 },
  hospitalBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  hospitalBadgeText: { color: '#DDD', fontWeight: '700', fontSize: 13 },
});
