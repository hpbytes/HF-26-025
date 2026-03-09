import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { DistributorSummary } from '@/hooks/use-distributors';

interface Props {
  distributor: DistributorSummary;
  onPress: () => void;
}

const STATUS_BADGE: Record<string, { icon: string; label: string; color: string }> = {
  healthy: { icon: '✅', label: 'Stock healthy', color: '#16a34a' },
  low: { icon: '⚠️', label: 'Low stock alerts', color: '#ca8a04' },
  critical: { icon: '🔴', label: 'Critical stock', color: '#dc2626' },
};

const TRANSFER_DOT: Record<string, string> = {
  recent: '🟢',
  moderate: '🟡',
  stale: '🔴',
};

export function DistributorCard({ distributor, onPress }: Props) {
  const badge = STATUS_BADGE[distributor.stockStatus];
  const transferAge =
    distributor.lastTransferDays <= 5
      ? 'recent'
      : distributor.lastTransferDays <= 10
      ? 'moderate'
      : 'stale';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <ThemedText style={styles.name}>{distributor.name}</ThemedText>
        <ThemedText style={styles.arrow}>→</ThemedText>
      </View>
      <ThemedText style={styles.meta}>
        📦 {distributor.activeBatches} batches active
      </ThemedText>
      <ThemedText style={[styles.meta, { color: badge.color }]}>
        {badge.icon} {distributor.alertCount > 0 ? `${distributor.alertCount} ${badge.label}` : badge.label}
      </ThemedText>
      <ThemedText style={styles.meta}>
        {TRANSFER_DOT[transferAge]} Last transfer: {distributor.lastTransferDays}d ago
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8fcfe',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d0e8f0',
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: { fontSize: 17, fontWeight: '700', color: '#0a7ea4' },
  arrow: { fontSize: 18, color: '#0a7ea4' },
  meta: { fontSize: 14, color: '#555' },
});
