import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { PrescriptionItem } from '@/hooks/use-prescriptions';
import type { StockBadge } from '@/hooks/use-drugs';

interface Props {
  item: PrescriptionItem;
  onPress: () => void;
}

const BADGE_MAP: Record<StockBadge, { label: string; color: string; bg: string }> = {
  in_stock: { label: '🟢 In Stock', color: '#16a34a', bg: '#f0fdf4' },
  low: { label: '🟡 Low Stock', color: '#ca8a04', bg: '#fefce8' },
  critical: { label: '🔴 Critical', color: '#dc2626', bg: '#fef2f2' },
  unavailable: { label: '⚫ Unavailable', color: '#64748b', bg: '#f1f5f9' },
};

export function PrescriptionCard({ item, onPress }: Props) {
  const badge = BADGE_MAP[item.stockBadge];
  const refillsLeft = item.refillsTotal - item.refillsUsed;
  const refillPct = (item.refillsUsed / item.refillsTotal) * 100;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.drug}>{item.drug} {item.form}</ThemedText>
          <ThemedText style={styles.dosage}>{item.dosage}</ThemedText>
        </View>
        <View style={[styles.statusTag, { backgroundColor: item.status === 'active' ? '#dbeafe' : '#f1f5f9' }]}>
          <ThemedText style={[styles.statusText, { color: item.status === 'active' ? '#1d4ed8' : '#64748b' }]}>
            {item.status === 'active' ? 'Active' : 'Completed'}
          </ThemedText>
        </View>
      </View>

      <View style={styles.info}>
        <ThemedText style={styles.infoText}>👨‍⚕️ {item.doctor}</ThemedText>
        <ThemedText style={styles.infoText}>📅 {item.prescribedDate}</ThemedText>
      </View>

      <View style={styles.refillRow}>
        <ThemedText style={styles.refillLabel}>Refills: {refillsLeft}/{item.refillsTotal} remaining</ThemedText>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${refillPct}%` }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <ThemedText style={[styles.badgeText, { color: badge.color }]}>{badge.label}</ThemedText>
        </View>
        {item.nextRefillDate && (
          <ThemedText style={styles.nextRefill}>Next refill: {item.nextRefillDate}</ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  drug: { fontSize: 16, fontWeight: '700', color: '#11181C' },
  dosage: { fontSize: 13, color: '#687076', marginTop: 2 },
  statusTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 12, fontWeight: '600' },
  info: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  infoText: { fontSize: 13, color: '#687076' },
  refillRow: { marginBottom: 10 },
  refillLabel: { fontSize: 13, color: '#687076', marginBottom: 4 },
  progressBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#0a7ea4', borderRadius: 3 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  nextRefill: { fontSize: 12, color: '#687076' },
});
