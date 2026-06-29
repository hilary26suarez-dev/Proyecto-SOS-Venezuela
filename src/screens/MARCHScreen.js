import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
} from 'react-native';
import { MARCH_STEPS, TRIAGE_COLORS } from '../data/marchProtocol';

export default function MARCHScreen() {
  const [selectedStep, setSelectedStep] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [triageMode, setTriageMode] = useState(false);

  const openStep = (step) => {
    setSelectedStep(step);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header warning */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            ⚕️ PROTOCOLO MARCH — ADAPTACIÓN CIVIL
          </Text>
          <Text style={styles.warningSubtext}>
            Derivado del Tactical Combat Casualty Care (TCCC) y Stop the Bleed.
            Actúa en orden. La hemorragia masiva mata primero.
          </Text>
        </View>

        {/* Critical fact */}
        <View style={styles.criticalFact}>
          <Text style={styles.criticalFactTitle}>DATO CRÍTICO</Text>
          <Text style={styles.criticalFactText}>
            Un torniquete correctamente aplicado puede estar puesto hasta{' '}
            <Text style={{ color: '#FF4444', fontWeight: '900' }}>2 horas</Text>{' '}
            sin causar daño permanente. La vacilación mata.{'\n'}
            Pon el torniquete PRIMERO. Piensa después.
          </Text>
        </View>

        {/* MARCH Steps */}
        <Text style={styles.sectionTitle}>ALGORITMO MARCH — EN ORDEN</Text>
        {MARCH_STEPS.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            style={[styles.stepCard, { borderLeftColor: step.color }]}
            onPress={() => openStep(step)}
          >
            <View style={styles.stepCardLeft}>
              <View style={[styles.stepLetter, { backgroundColor: step.color }]}>
                <Text style={styles.stepLetterText}>{step.letter}</Text>
              </View>
              <Text style={styles.stepOrder}>#{index + 1}</Text>
            </View>
            <View style={styles.stepCardContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              {step.warning && (
                <Text style={styles.stepWarning}>{step.warning}</Text>
              )}
            </View>
            <Text style={styles.stepArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Triage Section */}
        <TouchableOpacity
          style={styles.triageToggle}
          onPress={() => setTriageMode(!triageMode)}
        >
          <Text style={styles.triageToggleText}>
            🏷️ CLASIFICACIÓN TRIAGE {triageMode ? '▲' : '▼'}
          </Text>
          <Text style={styles.triageToggleSub}>Cuando hay múltiples heridos</Text>
        </TouchableOpacity>

        {triageMode && (
          <View style={styles.triageContainer}>
            {Object.entries(TRIAGE_COLORS).map(([key, t]) => (
              <View key={key} style={[styles.triageCard, { borderLeftColor: t.color }]}>
                <View style={[styles.triageColorDot, { backgroundColor: t.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.triageLabel}>{t.label}</Text>
                  <Text style={styles.triageDesc}>{t.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Decision Tree */}
        <View style={styles.decisionCard}>
          <Text style={styles.decisionTitle}>ÁRBOL DE DECISIÓN RÁPIDA</Text>
          <View style={styles.decisionStep}>
            <Text style={styles.decisionQ}>¿Hay sangrado masivo activo?</Text>
            <Text style={styles.decisionYes}>→ SÍ: Torniquete / presión AHORA</Text>
            <Text style={styles.decisionNo}>→ NO: Pasa a vía aérea</Text>
          </View>
          <View style={styles.decisionStep}>
            <Text style={styles.decisionQ}>¿Respira? ¿Hay herida en pecho?</Text>
            <Text style={styles.decisionYes}>→ SÍ (herida pecho): Sello 3 lados</Text>
            <Text style={styles.decisionNo}>→ NO respira: Maniobra mentón</Text>
          </View>
          <View style={styles.decisionStep}>
            <Text style={styles.decisionQ}>¿Piel pálida/fría, confuso?</Text>
            <Text style={styles.decisionYes}>→ SÍ: Revisar torniquetes + acostar + manta</Text>
            <Text style={styles.decisionNo}>→ NO: Monitorear cada 5 min</Text>
          </View>
        </View>

        {/* Supplies Checklist */}
        <View style={styles.suppliesCard}>
          <Text style={styles.suppliesTitle}>🎒 KIT MÉDICO MÍNIMO VIABLE</Text>
          {[
            ['🔴', 'Torniquete CAT o tira de tela ancha (4 cm)', 'crítico'],
            ['🔴', 'Gasas de 10x10 cm (hemostáticas si es posible)', 'crítico'],
            ['🟡', 'Cinta médica o duct tape', 'importante'],
            ['🟡', 'Guantes de nitrilo', 'importante'],
            ['🟡', 'Tijeras de trauma o tijera fuerte', 'importante'],
            ['🟢', 'Plástico limpio (bolsa ziplock para sello torácico)', 'útil'],
            ['🟢', 'Marcador permanente (marcar hora torniquete)', 'útil'],
            ['🟢', 'Mantas térmicas mylar', 'útil'],
          ].map(([icon, item, level]) => (
            <View key={item} style={styles.supplyItem}>
              <Text style={styles.supplyIcon}>{icon}</Text>
              <Text style={styles.supplyText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Step Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedStep && (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: selectedStep.color }]}>
                  <View style={[styles.modalLetter, { backgroundColor: selectedStep.color }]}>
                    <Text style={styles.modalLetterText}>{selectedStep.letter}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selectedStep.title}</Text>
                    <Text style={styles.modalSubtitle}>{selectedStep.subtitle}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDesc}>{selectedStep.description}</Text>

                {selectedStep.warning && (
                  <View style={[styles.modalWarning, { borderColor: selectedStep.color }]}>
                    <Text style={[styles.modalWarningText, { color: selectedStep.color }]}>
                      ⚠️ {selectedStep.warning}
                    </Text>
                  </View>
                )}

                <Text style={styles.stepsTitle}>PASOS DE INTERVENCIÓN</Text>
                <ScrollView style={{ maxHeight: 300 }}>
                  {selectedStep.steps.map((s, i) => (
                    <View key={i} style={styles.modalStep}>
                      <View style={[styles.modalStepNum, { backgroundColor: selectedStep.color }]}>
                        <Text style={styles.modalStepNumText}>{i + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalStepTitle}>{s.title}</Text>
                        <Text style={styles.modalStepDetail}>{s.detail}</Text>
                        {s.note && (
                          <View style={styles.noteBox}>
                            <Text style={styles.noteText}>📌 {s.note}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}

                  {selectedStep.supplies && (
                    <>
                      <Text style={[styles.stepsTitle, { marginTop: 16 }]}>MATERIALES</Text>
                      {selectedStep.supplies.map((s, i) => (
                        <Text key={i} style={styles.supplyLine}>• {s}</Text>
                      ))}
                    </>
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: selectedStep.color }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>ENTENDIDO</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  warningBanner: {
    backgroundColor: '#1A0000',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CC0000',
  },
  warningText: {
    color: '#FF4444',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },
  warningSubtext: { color: '#CCAAAA', fontSize: 12, lineHeight: 18 },
  criticalFact: {
    backgroundColor: '#1A1400',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB800',
  },
  criticalFactTitle: {
    color: '#FFB800',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 6,
  },
  criticalFactText: { color: '#DDCCAA', fontSize: 13, lineHeight: 20 },
  sectionTitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  stepCardLeft: { alignItems: 'center', marginRight: 14 },
  stepLetter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLetterText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  stepOrder: { color: '#555', fontSize: 10, marginTop: 4 },
  stepCardContent: { flex: 1 },
  stepTitle: { color: '#F0F0F0', fontSize: 15, fontWeight: '900', marginBottom: 3 },
  stepSubtitle: { color: '#888', fontSize: 12 },
  stepWarning: { color: '#FF8C00', fontSize: 11, marginTop: 5, fontWeight: '700' },
  stepArrow: { color: '#555', fontSize: 24, marginLeft: 8 },
  triageToggle: {
    margin: 16,
    backgroundColor: '#1A1A1A',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  triageToggleText: { color: '#F0F0F0', fontSize: 14, fontWeight: '800' },
  triageToggleSub: { color: '#888', fontSize: 11, marginTop: 3 },
  triageContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  triageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  triageColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  triageLabel: { color: '#F0F0F0', fontSize: 13, fontWeight: '800', marginBottom: 2 },
  triageDesc: { color: '#888', fontSize: 12 },
  decisionCard: {
    margin: 16,
    backgroundColor: '#111800',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334433',
  },
  decisionTitle: {
    color: '#668866',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  decisionStep: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#223322',
  },
  decisionQ: { color: '#CCDDCC', fontSize: 13, fontWeight: '700', marginBottom: 5 },
  decisionYes: { color: '#FF6666', fontSize: 12, marginBottom: 3 },
  decisionNo: { color: '#AAAAAA', fontSize: 12 },
  suppliesCard: {
    margin: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  suppliesTitle: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  supplyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  supplyIcon: { fontSize: 16, marginRight: 12 },
  supplyText: { color: '#F0F0F0', fontSize: 13, flex: 1 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 14,
    borderBottomWidth: 2,
  },
  modalLetter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalLetterText: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  modalTitle: { color: '#F0F0F0', fontSize: 17, fontWeight: '900' },
  modalSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  modalClose: { color: '#888', fontSize: 22, paddingLeft: 10 },
  modalDesc: { color: '#AAAAAA', fontSize: 13, lineHeight: 20, marginBottom: 14 },
  modalWarning: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  modalWarningText: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  stepsTitle: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  modalStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  modalStepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
    flexShrink: 0,
  },
  modalStepNumText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  modalStepTitle: { color: '#F0F0F0', fontSize: 14, fontWeight: '800', marginBottom: 4 },
  modalStepDetail: { color: '#AAAAAA', fontSize: 13, lineHeight: 19 },
  noteBox: {
    backgroundColor: '#222',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB800',
  },
  noteText: { color: '#CCBBAA', fontSize: 12, lineHeight: 18 },
  supplyLine: { color: '#AAAAAA', fontSize: 13, marginBottom: 5 },
  modalBtn: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  modalBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
});
