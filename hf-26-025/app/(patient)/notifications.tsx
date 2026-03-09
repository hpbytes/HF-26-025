import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NotificationCard } from '@/components/patient/notifications/notification-card';
import { useNotifications } from '@/hooks/use-notifications';

const FILTERS = ['all', 'unread', 'stock', 'refills'] as const;
const FILTER_LABELS: Record<string, string> = {
  all: 'All',
  unread: 'Unread',
  stock: 'Stock',
  refills: 'Refills',
};

export default function NotificationsScreen() {
  const { notifications, filter, setFilter, unreadCount, markRead, markAllRead } = useNotifications();

  const groups = notifications.reduce<Record<string, typeof notifications>>((acc, n) => {
    if (!acc[n.group]) acc[n.group] = [];
    acc[n.group].push(n);
    return acc;
  }, {});

  const groupOrder = ['Today', 'Yesterday', 'Earlier'].filter((g) => groups[g]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <ThemedText type="title">Notifications</ThemedText>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
              <ThemedText style={styles.markAll}>Mark all read</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <ThemedText style={styles.unreadText}>{unreadCount} unread</ThemedText>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <ThemedText style={[styles.chipText, filter === f && styles.chipTextActive]}>
                {FILTER_LABELS[f]}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {groupOrder.map((group) => (
          <View key={group}>
            <ThemedText style={styles.groupLabel}>{group}</ThemedText>
            {groups[group].map((n) => (
              <NotificationCard
                key={n.id}
                item={n}
                onPress={() => markRead(n.id)}
                onAction={n.actionLabel ? () => { /* navigate */ } : undefined}
              />
            ))}
          </View>
        ))}

        {notifications.length === 0 && (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyIcon}>🔔</ThemedText>
            <ThemedText style={styles.emptyText}>No notifications</ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  markAll: { fontSize: 14, fontWeight: '600', color: '#0a7ea4' },
  unreadBadge: { backgroundColor: '#dbeafe', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 12 },
  unreadText: { fontSize: 13, fontWeight: '600', color: '#1d4ed8' },
  chipRow: { flexDirection: 'row', marginBottom: 16 },
  chip: { backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  chipActive: { backgroundColor: '#0a7ea4' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#687076' },
  chipTextActive: { color: '#fff' },
  groupLabel: { fontSize: 13, fontWeight: '700', color: '#9BA1A6', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#687076' },
});
