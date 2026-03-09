import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { AuditEntry, AuditAction } from '@/hooks/use-chain-history';

interface Props {
  entry: AuditEntry;
  onPress: () => void;
}

const ACTION_CONFIG: Record<AuditAction, { color: string; icon: string; label: string }> = {
  BATCH_CREATED: { color: '#16a34a', icon: '📦', label: 'Batch Created' },
  TRANSFER_INITIATED: { color: '#0a7ea4', icon: '↗️', label: 'Transfer Initiated' },
  TRANSFER_ACCEPTED: { color: '#16a34a', icon: '✓', label: 'Transfer Accepted' },
  TRANSFER_REJECTED: { color: '#dc2626', icon: '✗', label: 'Transfer Rejected' },
  BATCH_FLAGGED: { color: '#ca8a04', icon: '⚠️', label: 'Batch Flagged' },
  BATCH_DEACTIVATED: { color: '#687076', icon: '⊘', label: 'Batch Deactivated' },
  EXPIRY_CHECK: { color: '#7c3aed', icon: '⏱', label: 'Expiry Check' },
};

export function AuditLogCard({ entry, onPress }: Props) {
  const cfg = ACTION_CONFIG[entry.action];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.actionRow}>
          <ThemedText style={styles.actionIcon}>{cfg.icon}</ThemedText>
          <ThemedText style={[styles.actionLabel, { color: cfg.color }]}>{cfg.label}</ThemedText>
        </View>
        <ThemedText style={styles.timestamp}>{entry.timestamp}</ThemedText>
      </View>
      <ThemedText style={styles.drug}>{entry.drug}</ThemedText>
      <ThemedText style={styles.details} numberOfLines={2}>{entry.details}</ThemedText>
      <View style={styles.footer}>
        <ThemedText style={styles.actor}>{entry.actorRole}</ThemedText>
        <ThemedText style={styles.block}>Block #{entry.blockNumber}</ThemedText>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 14 },
  actionLabel: { fontSize: 13, fontWeight: '700' },
  timestamp: { fontSize: 12, color: '#687076' },
  drug: { fontSize: 16, fontWeight: '700', color: '#11181C', marginBottom: 4 },
  details: { fontSize: 13, color: '#687076', lineHeight: 18, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  actor: { fontSize: 12, color: '#0a7ea4', fontWeight: '600' },
  block: { fontSize: 12, color: '#687076' },
});
