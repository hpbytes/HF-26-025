import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { ScanResult } from '@/hooks/use-scan';

interface Props {
  data: ScanResult;
  onReport: () => void;
  onScanAgain: () => void;
}

export function InvalidCard({ data, onReport, onScanAgain }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <ThemedText style={styles.errorIcon}>❌</ThemedText>
      </View>
      <ThemedText style={styles.title}>WARNING</ThemedText>
      <ThemedText style={styles.subtitle}>Batch not found on blockchain</ThemedText>

      <View style={styles.card}>
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>Batch ID</ThemedText>
          <ThemedText style={styles.rowValue}>{data.batchId}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>Reason</ThemedText>
          <ThemedText style={[styles.rowValue, { color: '#dc2626' }]}>{data.reason || 'Not registered'}</ThemedText>
        </View>
      </View>

      <View style={styles.warningBox}>
        <ThemedText style={styles.warningIcon}>🚫</ThemedText>
        <View style={styles.warningContent}>
          <ThemedText style={styles.warningTitle}>Do not use this medicine</ThemedText>
          <ThemedText style={styles.warningText}>
            This batch could not be verified. It may be counterfeit, recalled, or not yet registered.
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity style={styles.reportBtn} onPress={onReport} activeOpacity={0.7}>
        <ThemedText style={styles.reportBtnText}>Report Suspicious Medicine</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={onScanAgain} activeOpacity={0.7}>
        <ThemedText style={styles.secondaryBtnText}>Scan Again</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  iconWrap: { marginTop: 10, marginBottom: 8 },
  errorIcon: { fontSize: 48 },
  title: { fontSize: 26, fontWeight: '800', color: '#dc2626', marginBottom: 2 },
  subtitle: { fontSize: 14, color: '#687076', marginBottom: 20 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rowLabel: { fontSize: 14, color: '#687076' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#11181C', flexShrink: 1, textAlign: 'right' },
  warningBox: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#fef2f2', borderRadius: 10, borderWidth: 1, borderColor: '#fecaca', padding: 14, marginBottom: 20 },
  warningIcon: { fontSize: 20, marginTop: 2 },
  warningContent: { flex: 1 },
  warningTitle: { fontSize: 14, fontWeight: '700', color: '#991b1b', marginBottom: 4 },
  warningText: { fontSize: 13, color: '#991b1b', lineHeight: 18 },
  reportBtn: { width: '100%', backgroundColor: '#dc2626', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  reportBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { width: '100%', borderWidth: 2, borderColor: '#0a7ea4', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  secondaryBtnText: { color: '#0a7ea4', fontSize: 16, fontWeight: '700' },
});
