import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AlertItem } from '@/hooks/use-alerts';

interface Props {
  alert: AlertItem;
  onPress: () => void;
}

const SEVERITY_BADGE: Record<string, { icon: string; label: string; bg: string; color: string }> = {
  high: { icon: '🔴', label: 'HIGH', bg: '#fef2f2', color: '#dc2626' },
  medium: { icon: '🟡', label: 'MEDIUM', bg: '#fefce8', color: '#ca8a04' },
  low: { icon: '🟢', label: 'LOW', bg: '#f0fdf4', color: '#16a34a' },
};

export function AlertCard({ alert, onPress }: Props) {
  const badge = SEVERITY_BADGE[alert.severity];
  const isResolved = alert.status === 'resolved';

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: badge.color }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <ThemedText style={[styles.badgeText, { color: badge.color }]}>
            {badge.icon} {badge.label}
          </ThemedText>
        </View>
        {isResolved && (
          <View style={styles.resolvedBadge}>
            <ThemedText style={styles.resolvedText}>✅ RESOLVED</ThemedText>
          </View>
        )}
      </View>

      <ThemedText style={styles.type}>{alert.type}</ThemedText>
      <ThemedText style={styles.meta}>Batch: {alert.batchId}</ThemedText>
      <ThemedText style={styles.meta}>
        {alert.drug} · {alert.region}
      </ThemedText>

      {!isResolved && (
        <ThemedText style={styles.confidence}>Confidence: {alert.confidence.toFixed(2)}</ThemedText>
      )}

      <View style={styles.footer}>
        <ThemedText style={styles.time}>
          {isResolved ? `Resolved: ${alert.timestamp}` : alert.timestamp}
        </ThemedText>
        <ThemedText style={styles.viewLink}>View →</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
    gap: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  resolvedBadge: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#dcfce7', borderRadius: 6 },
  resolvedText: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
  type: { fontSize: 16, fontWeight: '700', color: '#11181C' },
  meta: { fontSize: 13, color: '#888', fontFamily: 'monospace' },
  confidence: { fontSize: 13, color: '#555', fontWeight: '600', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  time: { fontSize: 12, color: '#aaa' },
  viewLink: { fontSize: 14, color: '#0a7ea4', fontWeight: '600' },
});
