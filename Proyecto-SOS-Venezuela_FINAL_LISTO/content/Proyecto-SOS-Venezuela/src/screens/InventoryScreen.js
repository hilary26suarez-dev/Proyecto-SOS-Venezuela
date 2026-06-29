import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { getInventory, updateInventoryCheck } from '../database/db';

const CATEGORY_ICONS = {
  agua: '💧',
  comida: '🥫',
  medico: '🏥',
  herramientas: '🔧',
  documentos: '📄',
  abrigo: '🧥',
  desinfeccion: '🧴',
};

const CATEGORY_LABELS = {
  agua: 'AGUA',
  comida: 'ALIMENTOS',
  medico: 'MÉDICO',
  herramientas: 'HERRAMIENTAS',
  documentos: 'DOCUMENTOS',
  abrigo: 'ABRIGO',
  desinfeccion: 'DESINFECCIÓN',
};

export default function InventoryScreen() {
  const { db } = useApp();
  const [inventory, setInventory] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showCheckedOnly, setShowCheckedOnly] = useState(false);

  useEffect(() => {
    if (db) loadInventory();
  }, [db]);

  const loadInventory = async () => {
    const data = await getInventory(db);
    setInventory(data);
  };

  const toggleItem = async (id, checked) => {
    await updateInventoryCheck(db, id, !checked);
    setInventory(prev => prev.map(i => i.id === id ? { ...i, checked: checked ? 0 : 1 } : i));
  };

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    const diff = (d - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  };

  const filtered = inventory.filter(i => {
    const matchSearch = !searchText || i.item.toLowerCase().includes(searchText.toLowerCase());
    const matchChecked = !showCheckedOnly || i.checked;
    return matchSearch && matchChecked;
  });

  const categories = [...new Set(filtered.map(i => i.category))];

  const checkedCount = inventory.filter(i => i.checked).length;
  const progress = inventory.length > 0 ? (checkedCount / inventory.length) * 100 : 0;

  const getExpiryWarnings = () => {
    return inventory.filter(i => i.expiry_date && (isExpired(i.expiry_date) || isExpiringSoon(i.expiry_date)));
  };

  const warnings = getExpiryWarnings();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Progress Header */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>ESTADO DEL KIT</Text>
            <Text style={styles.progressCount}>{checkedCount} / {inventory.length}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {progress === 100 ? '✅ Kit completo' : `${Math.round(progress)}% preparado`}
          </Text>
        </View>

        {/* Expiry Warnings */}
        {warnings.length > 0 && (
          <View style={styles.warningsCard}>
            <Text style={styles.warningsTitle}>⚠️ ALERTAS DE VENCIMIENTO ({warnings.length})</Text>
            {warnings.map(w => (
              <View key={w.id} style={styles.warningItem}>
                <Text style={[styles.warningItemText, isExpired(w.expiry_date) && styles.expired]}>
                  {isExpired(w.expiry_date) ? '🔴' : '🟡'} {w.item}
                  {w.expiry_date && ` — vence: ${w.expiry_date}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artículo..."
            placeholderTextColor="#555"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            style={[styles.filterBtn, showCheckedOnly && styles.filterBtnActive]}
            onPress={() => setShowCheckedOnly(!showCheckedOnly)}
          >
            <Text style={[styles.filterBtnText, showCheckedOnly && { color: '#FFF' }]}>
              {showCheckedOnly ? '✅ Verificados' : '📋 Todos'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Groups */}
        {categories.map(cat => {
          const items = filtered.filter(i => i.category === cat);
          const isExpanded = expandedCategories[cat] !== false; // default expanded
          const catChecked = items.filter(i => i.checked).length;

          return (
            <View key={cat} style={styles.categoryGroup}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(cat)}
              >
                <Text style={styles.categoryIcon}>{CATEGORY_ICONS[cat] || '📦'}</Text>
                <Text style={styles.categoryLabel}>{CATEGORY_LABELS[cat] || cat.toUpperCase()}</Text>
                <Text style={styles.categoryCount}>{catChecked}/{items.length}</Text>
                <Text style={styles.categoryArrow}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && items.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemRow, item.checked && styles.itemRowChecked]}
                  onPress={() => toggleItem(item.id, item.checked)}
                >
                  <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                    {item.checked ? <Text style={styles.checkmark}>✓</Text> : null}
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                      {item.item}
                      {item.quantity > 1 ? ` (${item.quantity} ${item.unit || ''})` : ''}
                    </Text>
                    {item.notes && (
                      <Text style={styles.itemNotes}>{item.notes}</Text>
                    )}
                    {item.location && (
                      <Text style={styles.itemLocation}>📍 {item.location}</Text>
                    )}
                    {item.expiry_date && (
                      <Text style={[
                        styles.itemExpiry,
                        isExpired(item.expiry_date) && styles.expiryRed,
                        isExpiringSoon(item.expiry_date) && !isExpired(item.expiry_date) && styles.expiryYellow,
                      ]}>
                        {isExpired(item.expiry_date) ? '🔴 VENCIDO' : '🟡 Vence'}: {item.expiry_date}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {/* EDC Reminder */}
        <View style={styles.edcCard}>
          <Text style={styles.edcTitle}>📦 TOPOLOGÍA DEL CARGAMENTO</Text>
          <View style={styles.edcItem}>
            <Text style={styles.edcItemTitle}>MOCHILA PRINCIPAL — Go-Bag 72h</Text>
            <Text style={styles.edcItemDesc}>
              Sustento voluminoso • Agua • Alimentos liofilizados{'\n'}
              Abrigo térmico • Documentos • Radio AM/FM{'\n'}
              Ubicación: {'{DEFINIR - Ruta de evacuación primaria}'}
            </Text>
          </View>
          <View style={[styles.edcItem, { borderTopWidth: 1, borderTopColor: '#2A2A2A', marginTop: 10, paddingTop: 10 }]}>
            <Text style={styles.edcItemTitle}>EDC — Every Day Carry (por persona)</Text>
            <Text style={styles.edcItemDesc}>
              Silbato sin perlas • Linterna • Navaja{'\n'}
              Documentos plastificados • Medicamentos urgentes{'\n'}
              Siempre encima • No en la mochila
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  progressCard: {
    margin: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  progressCount: { color: '#F0F0F0', fontSize: 18, fontWeight: '900' },
  progressBar: {
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#006633',
    borderRadius: 4,
  },
  progressLabel: { color: '#888', fontSize: 12 },
  warningsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1A0E00',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  warningsTitle: {
    color: '#FF8C00',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  warningItem: { marginBottom: 6 },
  warningItemText: { color: '#CCBBAA', fontSize: 12 },
  expired: { color: '#FF4444' },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 10,
    color: '#F0F0F0',
    fontSize: 13,
  },
  filterBtn: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: '#006633', borderColor: '#006633' },
  filterBtnText: { color: '#888', fontSize: 12, fontWeight: '600' },
  categoryGroup: { marginBottom: 4 },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#141414',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  categoryIcon: { fontSize: 18, marginRight: 10 },
  categoryLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    flex: 1,
  },
  categoryCount: { color: '#666', fontSize: 12, marginRight: 8 },
  categoryArrow: { color: '#666', fontSize: 12 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#181818',
  },
  itemRowChecked: { opacity: 0.5 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: '#006633', borderColor: '#006633' },
  checkmark: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  itemContent: { flex: 1 },
  itemName: { color: '#F0F0F0', fontSize: 13, fontWeight: '600', marginBottom: 3 },
  itemNameChecked: { textDecorationLine: 'line-through', color: '#555' },
  itemNotes: { color: '#666', fontSize: 11, marginBottom: 2, fontStyle: 'italic' },
  itemLocation: { color: '#555', fontSize: 11, marginBottom: 2 },
  itemExpiry: { fontSize: 11, marginTop: 2 },
  expiryRed: { color: '#FF4444' },
  expiryYellow: { color: '#FFB800' },
  edcCard: {
    margin: 16,
    backgroundColor: '#111820',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1A3355',
  },
  edcTitle: {
    color: '#4488BB',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  edcItem: {},
  edcItemTitle: {
    color: '#88AACC',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  edcItemDesc: { color: '#667788', fontSize: 12, lineHeight: 19 },
});
