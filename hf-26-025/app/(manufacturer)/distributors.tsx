import { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DistributorCard } from '@/components/manufacturer/distributors/DistributorCard';
import { StockTable } from '@/components/manufacturer/distributors/StockTable';
import { DemandSupplyChart } from '@/components/manufacturer/distributors/DemandSupplyChart';
import { TransferRow } from '@/components/manufacturer/distributors/TransferRow';
import { useDistributors } from '@/hooks/use-distributors';

type Filter = 'all' | 'low' | 'critical' | 'inactive';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Low Stock' },
  { key: 'critical', label: 'Critical' },
  { key: 'inactive', label: 'No Recent Activity' },
];

export default function DistributorsScreen() {
  const { distributors, filter, setFilter, getDetail } = useDistributors();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (selectedId) {
    const detail = getDetail(selectedId);
    if (!detail) {
      setSelectedId(null);
      return null;
    }
    return (
      <ThemedView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.detailContainer}>
          <TouchableOpacity onPress={() => setSelectedId(null)}>
            <ThemedText style={styles.backLink}>← Back to Distributors</ThemedText>
          </TouchableOpacity>

          <ThemedText type="title" style={styles.detailName}>{detail.name}</ThemedText>
          <ThemedText style={styles.detailMeta}>District: {detail.region}</ThemedText>
          <ThemedText style={styles.detailMeta}>Wallet: {detail.wallet}</ThemedText>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>── Current Stock ──</ThemedText>
            <StockTable items={detail.stock} />
          </View>

          <View style={styles.section}>
            <DemandSupplyChart data={detail.demandVsSupply} />
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>── Recent Transfers ──</ThemedText>
            {detail.recentTransfers.map((t, i) => (
              <TransferRow key={i} transfer={t} />
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterActive]}
              onPress={() => setFilter(f.key)}>
              <ThemedText
                style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.cardList}>
          {distributors.map((d) => (
            <DistributorCard
              key={d.id}
              distributor={d}
              onPress={() => setSelectedId(d.id)}
            />
          ))}
          {distributors.length === 0 && (
            <ThemedText style={styles.empty}>No distributors match this filter.</ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  listContainer: { padding: 16, paddingBottom: 40 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    backgroundColor: '#fff',
  },
  filterActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  filterText: { fontSize: 13, color: '#555' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  cardList: { gap: 12 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
  // Detail view
  detailContainer: { padding: 16, paddingBottom: 40 },
  backLink: { color: '#0a7ea4', fontSize: 15, fontWeight: '600', marginBottom: 12 },
  detailName: { fontSize: 22, color: '#0a7ea4', marginBottom: 4 },
  detailMeta: { fontSize: 14, color: '#888' },
  section: { marginTop: 20, gap: 8 },
  sectionTitle: { textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 4 },
});
