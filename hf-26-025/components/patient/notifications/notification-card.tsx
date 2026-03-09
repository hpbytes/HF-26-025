import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { NotificationItem, NotificationType } from '@/hooks/use-notifications';

interface Props {
  item: NotificationItem;
  onPress: () => void;
  onAction?: () => void;
}

const ICON_MAP: Record<NotificationType, string> = {
  stock_alert: '🔴',
  low_stock: '🟡',
  stock_restored: '🟢',
  refill_reminder: '💊',
  verify_log: '🔍',
};

export function NotificationCard({ item, onPress, onAction }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.unread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <ThemedText style={styles.icon}>{ICON_MAP[item.type]}</ThemedText>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            {!item.read && <View style={styles.dot} />}
          </View>
          <ThemedText style={styles.desc}>{item.description}</ThemedText>
          <View style={styles.footer}>
            <ThemedText style={styles.time}>{item.timestamp}</ThemedText>
            {item.actionLabel && onAction && (
              <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
                <ThemedText style={styles.action}>{item.actionLabel} →</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  unread: { backgroundColor: '#f0f9ff', borderLeftWidth: 3, borderLeftColor: '#0a7ea4' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  icon: { fontSize: 20, marginTop: 2 },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '700', color: '#11181C' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0a7ea4' },
  desc: { fontSize: 13, color: '#687076', lineHeight: 18, marginBottom: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontSize: 12, color: '#9BA1A6' },
  action: { fontSize: 13, fontWeight: '600', color: '#0a7ea4' },
});
