import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { TransferRecord } from '@/hooks/use-distributors';

interface Props {
  transfer: TransferRecord;
}

const STATUS_ICON: Record<string, string> = {
  received: '✅',
  pending: '🕐',
  rejected: '❌',
};

export function TransferRow({ transfer }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <ThemedText style={styles.batchId} numberOfLines={1}>
          {transfer.batchId}
        </ThemedText>
        <ThemedText style={styles.meta}>
          {transfer.date} · {transfer.quantity.toLocaleString()} units
        </ThemedText>
      </View>
      <ThemedText style={styles.status}>
        {STATUS_ICON[transfer.status]} {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  left: { flex: 1, marginRight: 8 },
  batchId: { fontSize: 12, fontFamily: 'monospace', color: '#0a7ea4' },
  meta: { fontSize: 13, color: '#888', marginTop: 2 },
  status: { fontSize: 13, fontWeight: '600' },
});
