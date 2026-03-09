import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { IncomingShipment } from '@/hooks/use-inventory';

interface Props {
  shipment: IncomingShipment;
  onAccept: () => void;
  onReject: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#ca8a04',
  in_transit: '#0a7ea4',
};

export function IncomingShipmentCard({ shipment, onAccept, onReject }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.drug}>{shipment.drug}</ThemedText>
        <View style={[styles.badge, { backgroundColor: shipment.status === 'pending' ? '#fefce8' : '#e8f4f8' }]}>
          <ThemedText style={[styles.badgeText, { color: STATUS_COLOR[shipment.status] }]}>
            {shipment.status === 'in_transit' ? 'In Transit' : 'Pending'}
          </ThemedText>
        </View>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Batch</ThemedText>
        <ThemedText style={styles.value} numberOfLines={1}>{shipment.batchId}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Quantity</ThemedText>
        <ThemedText style={styles.value}>{shipment.quantity.toLocaleString()}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>From</ThemedText>
        <ThemedText style={styles.value}>{shipment.from}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Initiated</ThemedText>
        <ThemedText style={styles.value}>{shipment.initiatedDate}</ThemedText>
      </View>
      {shipment.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.7}>
            <ThemedText style={styles.acceptText}>Accept</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={onReject} activeOpacity={0.7}>
            <ThemedText style={styles.rejectText}>Reject</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0a7ea4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  drug: { fontSize: 17, fontWeight: '700', color: '#11181C' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { fontSize: 14, color: '#687076' },
  value: { fontSize: 14, fontWeight: '600', color: '#11181C', flexShrink: 1 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  acceptBtn: { flex: 1, backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  acceptText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  rejectBtn: { flex: 1, backgroundColor: '#fef2f2', borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  rejectText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
});
