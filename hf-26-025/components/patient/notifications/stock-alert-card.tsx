import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { NotificationItem } from '@/hooks/use-notifications';

interface Props {
  item: NotificationItem;
  onFindStock: () => void;
}

export function StockAlertCard({ item, onFindStock }: Props) {
  const isCritical = item.type === 'stock_alert';

  return (
    <View style={[styles.card, isCritical && styles.critical]}>
      <View style={styles.row}>
        <ThemedText style={styles.icon}>{isCritical ? '🔴' : '🟡'}</ThemedText>
        <View style={styles.content}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText style={styles.desc}>{item.description}</ThemedText>
          <View style={styles.footer}>
            <ThemedText style={styles.time}>{item.timestamp}</ThemedText>
            <TouchableOpacity onPress={onFindStock} activeOpacity={0.7}>
              <ThemedText style={styles.action}>Find Stock →</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fefce8', borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#f59e0b', padding: 14, marginBottom: 8 },
  critical: { backgroundColor: '#fef2f2', borderLeftColor: '#dc2626' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  icon: { fontSize: 20, marginTop: 2 },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#11181C', marginBottom: 4 },
  desc: { fontSize: 13, color: '#687076', lineHeight: 18, marginBottom: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontSize: 12, color: '#9BA1A6' },
  action: { fontSize: 13, fontWeight: '600', color: '#0a7ea4' },
});
