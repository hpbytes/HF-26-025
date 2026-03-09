import { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrescriptionCard } from '@/components/patient/prescriptions/prescription-card';
import { RefillProgressBar } from '@/components/patient/prescriptions/refill-progress-bar';
import { NearbyFacilityRow } from '@/components/patient/prescriptions/nearby-facility-row';
import { usePrescriptions } from '@/hooks/use-prescriptions';
import type { StockBadge } from '@/hooks/use-drugs';

type PrescriptionView = 'list' | 'detail';

const FILTERS = ['all', 'active', 'past'] as const;

const BADGE_MAP: Record<StockBadge, { label: string; color: string }> = {
  in_stock: { label: '🟢 In Stock', color: '#16a34a' },
  low: { label: '🟡 Low Stock', color: '#ca8a04' },
  critical: { label: '🔴 Critical', color: '#dc2626' },
  unavailable: { label: '⚫ Unavailable', color: '#64748b' },
};

export default function PrescriptionsScreen() {
  const { prescriptions, filter, setFilter, getDetail } = usePrescriptions();
  const [view, setView] = useState<PrescriptionView>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (view === 'detail' && selectedId) {
    const detail = getDetail(selectedId);
    if (!detail) return null;
    const badge = BADGE_MAP[detail.stockBadge];

    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={() => setView('list')}>
            <ThemedText style={styles.backLink}>← Back to Prescriptions</ThemedText>
          </TouchableOpacity>

          <ThemedText type="title" style={styles.title}>{detail.drug} {detail.form}</ThemedText>
          <ThemedText style={styles.dosageDetail}>{detail.dosage} · {detail.duration}</ThemedText>

          <View style={styles.card}>
            <View style={styles.row}>
              <ThemedText style={styles.label}>Doctor</ThemedText>
              <ThemedText style={styles.value}>{detail.doctor}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText style={styles.label}>Hospital</ThemedText>
              <ThemedText style={styles.value}>{detail.hospital}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText style={styles.label}>Prescribed</ThemedText>
              <ThemedText style={styles.value}>{detail.prescribedDate}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText style={styles.label}>Status</ThemedText>
              <ThemedText style={[styles.value, { color: detail.status === 'active' ? '#1d4ed8' : '#64748b' }]}>
                {detail.status === 'active' ? 'Active' : 'Completed'}
              </ThemedText>
            </View>
          </View>

          {detail.refillsTotal > 0 && (
            <View style={styles.card}>
              <RefillProgressBar used={detail.refillsUsed} total={detail.refillsTotal} />
              {detail.nextRefillDate && (
                <ThemedText style={styles.nextRefill}>Next refill: {detail.nextRefillDate}</ThemedText>
              )}
            </View>
          )}

          <View style={styles.card}>
            <ThemedText style={styles.sectionHeader}>Availability</ThemedText>
            <View style={styles.row}>
              <ThemedText style={styles.label}>Stock Status</ThemedText>
              <ThemedText style={[styles.value, { color: badge.color }]}>{badge.label}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText style={styles.label}>Stock Qty</ThemedText>
              <ThemedText style={styles.value}>{detail.stockQty.toLocaleString()}</ThemedText>
            </View>
          </View>

          {detail.nearbyFacilities.length > 0 && (
            <View style={styles.card}>
              <ThemedText style={styles.sectionHeader}>
                Nearby Facilities ({detail.nearbyFacilities.length})
              </ThemedText>
              {detail.nearbyFacilities.map((f) => (
                <NearbyFacilityRow key={f.name} name={f.name} distanceKm={f.distanceKm} />
              ))}
            </View>
          )}
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>Prescriptions</ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <ThemedText style={[styles.chipText, filter === f && styles.chipTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ThemedText style={styles.resultCount}>{prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}</ThemedText>

        {prescriptions.map((rx) => (
          <PrescriptionCard
            key={rx.id}
            item={rx}
            onPress={() => {
              setSelectedId(rx.id);
              setView('detail');
            }}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { marginBottom: 12 },
  backLink: { color: '#0a7ea4', fontSize: 15, fontWeight: '600', marginBottom: 12 },
  dosageDetail: { fontSize: 15, color: '#687076', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: 14, color: '#687076' },
  value: { fontSize: 14, fontWeight: '600', color: '#11181C' },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: '#687076', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  nextRefill: { fontSize: 13, color: '#0a7ea4', marginTop: 4 },
  chipRow: { flexDirection: 'row', marginBottom: 12 },
  chip: { backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  chipActive: { backgroundColor: '#0a7ea4' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#687076' },
  chipTextActive: { color: '#fff' },
  resultCount: { fontSize: 13, color: '#687076', marginBottom: 10 },
});
