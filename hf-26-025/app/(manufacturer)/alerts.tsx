import { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AlertCard } from '@/components/manufacturer/alerts/AlertCard';
import { ConfidenceBar } from '@/components/manufacturer/alerts/ConfidenceBar';
import { FlaggedFeatureList } from '@/components/manufacturer/alerts/FlaggedFeatureList';
import { ResolveForm } from '@/components/manufacturer/alerts/ResolveForm';
import { useAlerts, AlertItem, ResolutionAction } from '@/hooks/use-alerts';

type ViewState =
  | { screen: 'feed' }
  | { screen: 'detail'; alertId: string }
  | { screen: 'resolve'; alertId: string };

const TABS: { key: 'all' | 'open' | 'resolved'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'resolved', label: 'Resolved' },
];

export default function AlertsScreen() {
  const { alerts, filter, setFilter, getAlert, resolveAlert } = useAlerts();
  const [view, setView] = useState<ViewState>({ screen: 'feed' });
  const [resolving, setResolving] = useState(false);

  // ── Resolve Screen ──
  if (view.screen === 'resolve') {
    const alert = getAlert(view.alertId);
    if (!alert) { setView({ screen: 'feed' }); return null; }

    const handleResolve = async (action: ResolutionAction, notes: string) => {
      setResolving(true);
      try {
        await resolveAlert(alert.id, action, notes);
        Alert.alert('Resolved', 'Alert has been resolved successfully.');
        setView({ screen: 'feed' });
      } catch {
        Alert.alert('Error', 'Failed to resolve alert.');
      } finally {
        setResolving(false);
      }
    };

    return (
      <ThemedView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.detailContainer}>
          <TouchableOpacity onPress={() => setView({ screen: 'detail', alertId: alert.id })}>
            <ThemedText style={styles.backLink}>← Back to Detail</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.heading}>Resolve Alert</ThemedText>
          <ResolveForm alert={alert} onResolve={handleResolve} loading={resolving} />
        </ScrollView>
      </ThemedView>
    );
  }

  // ── Detail Screen ──
  if (view.screen === 'detail') {
    const alert = getAlert(view.alertId);
    if (!alert) { setView({ screen: 'feed' }); return null; }

    const severityColors: Record<string, string> = {
      high: '#dc2626', medium: '#ca8a04', low: '#16a34a',
    };

    return (
      <ThemedView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.detailContainer}>
          <TouchableOpacity onPress={() => setView({ screen: 'feed' })}>
            <ThemedText style={styles.backLink}>← Back to Alerts</ThemedText>
          </TouchableOpacity>

          <View style={styles.severityHeader}>
            <ThemedText style={[styles.severityBadge, { color: severityColors[alert.severity] }]}>
              {alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🟢'}{' '}
              {alert.severity.toUpperCase()} SEVERITY
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.alertType}>{alert.type}</ThemedText>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>── Batch Info ──</ThemedText>
            <InfoRow label="Batch ID" value={alert.batchId} />
            <InfoRow label="Drug" value={alert.drug} />
            <InfoRow label="Region" value={alert.region} />
            <InfoRow label="Distributor" value={alert.distributor} />
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>── Detection Details ──</ThemedText>
            <ConfidenceBar score={alert.confidence} />
            <View style={{ height: 12 }} />
            <FlaggedFeatureList features={alert.flaggedFeatures} />
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>── Timeline ──</ThemedText>
            {alert.timeline.map((t, i) => (
              <View key={i} style={styles.timelineRow}>
                <ThemedText style={styles.timelineTime}>{t.time}</ThemedText>
                <ThemedText style={[styles.timelineEvent, t.flagged && styles.timelineFlagged]}>
                  {t.event}{t.flagged ? ' ← flag' : ''}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>── AI Recommendation ──</ThemedText>
            <View style={styles.recoBox}>
              <ThemedText style={styles.recoAction}>
                Action: {alert.confidence > 0.85 ? 'Escalate' : 'Monitor'}
              </ThemedText>
              <ThemedText style={styles.recoText}>"{alert.recommendation}"</ThemedText>
            </View>
          </View>

          {alert.status !== 'resolved' && (
            <View style={styles.actionBtns}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setView({ screen: 'resolve', alertId: alert.id })}>
                <ThemedText style={styles.actionBtnText}>Mark as Investigating</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.escalateBtn]}
                onPress={() => setView({ screen: 'resolve', alertId: alert.id })}>
                <ThemedText style={styles.escalateText}>Escalate</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    );
  }

  // ── Feed Screen ──
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.feedContainer}>
        <View style={styles.tabRow}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, filter === t.key && styles.tabActive]}
              onPress={() => setFilter(t.key)}>
              <ThemedText style={[styles.tabText, filter === t.key && styles.tabTextActive]}>
                {t.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.cardList}>
          {alerts.map((a) => (
            <AlertCard
              key={a.id}
              alert={a}
              onPress={() => setView({ screen: 'detail', alertId: a.id })}
            />
          ))}
          {alerts.length === 0 && (
            <ThemedText style={styles.empty}>No alerts match this filter.</ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue} numberOfLines={1}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  feedContainer: { padding: 16, paddingBottom: 40 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    backgroundColor: '#fff',
  },
  tabActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  tabText: { fontSize: 14, color: '#555' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  cardList: { gap: 12 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
  // Detail
  detailContainer: { padding: 16, paddingBottom: 40 },
  backLink: { color: '#0a7ea4', fontSize: 15, fontWeight: '600', marginBottom: 12 },
  heading: { fontSize: 22, color: '#0a7ea4', marginBottom: 16 },
  severityHeader: { marginBottom: 4 },
  severityBadge: { fontSize: 14, fontWeight: '700' },
  alertType: { fontSize: 20, marginBottom: 12 },
  section: { marginTop: 16, gap: 8 },
  sectionTitle: { textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 4 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  timelineRow: { flexDirection: 'row', gap: 12, paddingVertical: 4 },
  timelineTime: { fontSize: 13, fontWeight: '600', color: '#555', width: 50 },
  timelineEvent: { flex: 1, fontSize: 13, color: '#333' },
  timelineFlagged: { color: '#dc2626', fontWeight: '700' },
  recoBox: {
    backgroundColor: '#fffbeb',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 6,
  },
  recoAction: { fontSize: 14, fontWeight: '700', color: '#92400e' },
  recoText: { fontSize: 14, color: '#78350f', fontStyle: 'italic' },
  actionBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { color: '#0a7ea4', fontSize: 14, fontWeight: '600' },
  escalateBtn: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  escalateText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
