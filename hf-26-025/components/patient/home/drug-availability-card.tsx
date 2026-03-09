import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { StockBadge } from '@/hooks/use-drugs';

interface Props {
  name: string;
  form: string;
  badge: StockBadge;
  pharmacyCount: number;
  price: number;
  onPress: () => void;
}

const BADGE_CONFIG: Record<StockBadge, { icon: string; label: string; color: string }> = {
  in_stock: { icon: '🟢', label: 'In Stock', color: '#16a34a' },
  low: { icon: '🟡', label: 'Low Stock', color: '#ca8a04' },
  critical: { icon: '🔴', label: 'Critical Stock', color: '#dc2626' },
  unavailable: { icon: '⚫', label: 'Unavailable', color: '#687076' },
};

export function DrugAvailabilityCard({ name, form, badge, pharmacyCount, price, onPress }: Props) {
  const cfg = BADGE_CONFIG[badge];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText style={styles.arrow}>→</ThemedText>
      </View>
      <ThemedText style={styles.form}>{form}</ThemedText>
      <ThemedText style={[styles.badge, { color: cfg.color }]}>
        {cfg.icon} {cfg.label}
      </ThemedText>
      {badge !== 'unavailable' && pharmacyCount > 0 ? (
        <ThemedText style={styles.pharmacies}>
          {pharmacyCount} pharmac{pharmacyCount === 1 ? 'y' : 'ies'} nearby
        </ThemedText>
      ) : badge === 'critical' ? (
        <ThemedText style={styles.warning}>⚠️ Limited availability</ThemedText>
      ) : badge === 'unavailable' ? (
        <ThemedText style={styles.warning}>No stock available</ThemedText>
      ) : null}
      <ThemedText style={styles.price}>₹{price} per unit</ThemedText>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700', color: '#11181C' },
  arrow: { fontSize: 18, color: '#687076' },
  form: { fontSize: 14, color: '#687076', marginTop: 2 },
  badge: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  pharmacies: { fontSize: 13, color: '#687076', marginTop: 2 },
  warning: { fontSize: 13, color: '#dc2626', marginTop: 2 },
  price: { fontSize: 13, color: '#687076', marginTop: 4 },
});
