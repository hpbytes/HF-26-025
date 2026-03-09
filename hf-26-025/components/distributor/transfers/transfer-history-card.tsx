import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { TransferItem } from '@/hooks/use-transfers';

interface Props {
  transfer: TransferItem;
  onPress: () => void;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: '#ca8a04', bg: '#fefce8', label: 'Pending' },
  accepted: { color: '#16a34a', bg: '#f0fdf4', label: 'Accepted' },
  rejected: { color: '#dc2626', bg: '#fef2f2', label: 'Rejected' },
  cancelled: { color: '#687076', bg: '#f3f4f6', label: 'Cancelled' },
};

export function TransferHistoryCard({ transfer, onPress }: Props) {
  const cfg = STATUS_CONFIG[transfer.status];
  const isIncoming = transfer.direction === 'incoming';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.directionBadge}>
          <ThemedText style={[styles.directionText, { color: isIncoming ? '#16a34a' : '#0a7ea4' }]}>
            {isIncoming ? '↓ IN' : '↑ OUT'}
          </ThemedText>
        </View>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <ThemedText style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.drug}>{transfer.drug}</ThemedText>
      <View style={styles.row}>
        <ThemedText style={styles.label}>{isIncoming ? 'From' : 'To'}</ThemedText>
        <ThemedText style={styles.value}>{isIncoming ? transfer.from : transfer.to}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Quantity</ThemedText>
        <ThemedText style={styles.value}>{transfer.quantity.toLocaleString()}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Date</ThemedText>
        <ThemedText style={styles.value}>{transfer.completedDate || transfer.initiatedDate}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  directionBadge: { paddingHorizontal: 8, paddingVertical: 2 },
  directionText: { fontSize: 13, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  drug: { fontSize: 17, fontWeight: '700', color: '#11181C', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  label: { fontSize: 14, color: '#687076' },
  value: { fontSize: 14, fontWeight: '600', color: '#11181C' },
});
