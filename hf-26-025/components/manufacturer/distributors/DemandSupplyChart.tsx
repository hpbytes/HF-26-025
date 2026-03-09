import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { DemandSupplyItem } from '@/hooks/use-distributors';

interface Props {
  data: DemandSupplyItem[];
}

export function DemandSupplyChart({ data }: Props) {
  const maxVal = Math.max(...data.flatMap((d) => [d.demand, d.supply]), 1);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Demand vs Supply (30 days)</ThemedText>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
          <ThemedText style={styles.legendText}>Demand</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#0a7ea4' }]} />
          <ThemedText style={styles.legendText}>Supply</ThemedText>
        </View>
      </View>
      {data.map((item, i) => {
        const demandWidth = (item.demand / maxVal) * 100;
        const supplyWidth = (item.supply / maxVal) * 100;
        const gap = item.supply < item.demand;
        return (
          <View key={i} style={styles.barGroup}>
            <ThemedText style={styles.drugLabel}>{item.drug}</ThemedText>
            <View style={styles.barRow}>
              <View style={[styles.bar, { width: `${demandWidth}%`, backgroundColor: '#f97316' }]} />
              <ThemedText style={styles.barValue}>{item.demand.toLocaleString()}</ThemedText>
            </View>
            <View style={styles.barRow}>
              <View
                style={[
                  styles.bar,
                  { width: `${supplyWidth}%`, backgroundColor: gap ? '#ef4444' : '#0a7ea4' },
                ]}
              />
              <ThemedText style={styles.barValue}>{item.supply.toLocaleString()}</ThemedText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 4 },
  legend: { flexDirection: 'row', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#888' },
  barGroup: { gap: 3, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f3f3f3' },
  drugLabel: { fontSize: 13, fontWeight: '600', color: '#555' },
  barRow: { flexDirection: 'row', alignItems: 'center', height: 18, gap: 6 },
  bar: { height: 14, borderRadius: 4, minWidth: 4 },
  barValue: { fontSize: 11, color: '#888' },
});
