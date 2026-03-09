import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { ForecastItem } from '@/hooks/use-forecast';

interface Props {
  item: ForecastItem;
}

export function ForecastTrendChart({ item }: Props) {
  const maxVal = Math.max(item.forecast30, item.forecast60, item.forecast90, item.currentStock);
  const barHeight = (val: number) => maxVal > 0 ? Math.max((val / maxVal) * 120, 4) : 4;

  const TREND_CONFIG: Record<string, { color: string; label: string }> = {
    rising: { color: '#dc2626', label: '↑ Rising' },
    stable: { color: '#16a34a', label: '→ Stable' },
    declining: { color: '#0a7ea4', label: '↓ Declining' },
  };

  const trend = TREND_CONFIG[item.trend];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Demand Trend</ThemedText>
        <ThemedText style={[styles.trendBadge, { color: trend.color }]}>{trend.label}</ThemedText>
      </View>
      <View style={styles.chartRow}>
        <View style={styles.barCol}>
          <View style={[styles.bar, { height: barHeight(item.currentStock), backgroundColor: '#0a7ea4' }]} />
          <ThemedText style={styles.barLabel}>Now</ThemedText>
          <ThemedText style={styles.barValue}>{item.currentStock.toLocaleString()}</ThemedText>
        </View>
        <View style={styles.barCol}>
          <View style={[styles.bar, { height: barHeight(item.forecast30), backgroundColor: '#94a3b8' }]} />
          <ThemedText style={styles.barLabel}>30d</ThemedText>
          <ThemedText style={styles.barValue}>{item.forecast30.toLocaleString()}</ThemedText>
        </View>
        <View style={styles.barCol}>
          <View style={[styles.bar, { height: barHeight(item.forecast60), backgroundColor: '#94a3b8' }]} />
          <ThemedText style={styles.barLabel}>60d</ThemedText>
          <ThemedText style={styles.barValue}>{item.forecast60.toLocaleString()}</ThemedText>
        </View>
        <View style={styles.barCol}>
          <View style={[styles.bar, { height: barHeight(item.forecast90), backgroundColor: '#64748b' }]} />
          <ThemedText style={styles.barLabel}>90d</ThemedText>
          <ThemedText style={styles.barValue}>{item.forecast90.toLocaleString()}</ThemedText>
        </View>
      </View>
    </View>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#11181C' },
  trendBadge: { fontSize: 13, fontWeight: '600' },
  chartRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 160, paddingTop: 20 },
  barCol: { alignItems: 'center', gap: 4 },
  bar: { width: 36, borderRadius: 6 },
  barLabel: { fontSize: 12, color: '#687076', fontWeight: '600' },
  barValue: { fontSize: 11, color: '#11181C' },
});
