import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { ScanResult } from '@/hooks/use-scan';

interface Props {
  data: ScanResult;
  onFindStock: () => void;
  onScanAnother: () => void;
}

export function ExpiredCard({ data, onFindStock, onScanAnother }: Props) {
  const daysExpired = data.daysLeft ? Math.abs(data.daysLeft) : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <ThemedText style={styles.warnIcon}>⚠️</ThemedText>
      </View>
      <ThemedText style={styles.title}>EXPIRED</ThemedText>
      <ThemedText style={styles.subtitle}>This medicine has passed its expiry date</ThemedText>

      <View style={styles.card}>
        <ThemedText style={styles.sectionTitle}>Medicine Info</ThemedText>
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>Drug</ThemedText>
          <ThemedText style={styles.rowValue}>{data.drug}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>Batch ID</ThemedText>
          <ThemedText style={styles.rowValue}>{data.batchId}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>Expiry Date</ThemedText>
          <ThemedText style={[styles.rowValue, { color: '#dc2626' }]}>{data.expiryDate}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.rowLabel}>Days Expired</ThemedText>
          <ThemedText style={[styles.rowValue, { color: '#dc2626' }]}>{daysExpired} days ago</ThemedText>
        </View>
      </View>

      <View style={styles.warningBox}>
        <ThemedText style={styles.warningIcon}>🚫</ThemedText>
        <ThemedText style={styles.warningText}>Do not use this medicine. Expired drugs may be ineffective or harmful.</ThemedText>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={onFindStock} activeOpacity={0.7}>
        <ThemedText style={styles.primaryBtnText}>Find Available Stock</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={onScanAnother} activeOpacity={0.7}>
        <ThemedText style={styles.secondaryBtnText}>Scan Another</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  iconWrap: { marginTop: 10, marginBottom: 8 },
  warnIcon: { fontSize: 48 },
  title: { fontSize: 26, fontWeight: '800', color: '#f59e0b', marginBottom: 2 },
  subtitle: { fontSize: 14, color: '#687076', marginBottom: 20, textAlign: 'center' },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#687076', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rowLabel: { fontSize: 14, color: '#687076' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#11181C' },
  warningBox: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fef2f2', borderRadius: 10, borderWidth: 1, borderColor: '#fecaca', padding: 14, marginBottom: 20 },
  warningIcon: { fontSize: 20 },
  warningText: { flex: 1, fontSize: 13, color: '#991b1b', lineHeight: 18 },
  primaryBtn: { width: '100%', backgroundColor: '#f59e0b', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { width: '100%', borderWidth: 2, borderColor: '#0a7ea4', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  secondaryBtnText: { color: '#0a7ea4', fontSize: 16, fontWeight: '700' },
});
