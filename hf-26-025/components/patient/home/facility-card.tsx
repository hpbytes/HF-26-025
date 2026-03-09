import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { Facility } from '@/hooks/use-drugs';

interface Props {
  facility: Facility;
}

const TYPE_ICON: Record<string, string> = {
  hospital: '🏥',
  pharmacy: '💊',
  clinic: '🏪',
};

export function FacilityCard({ facility }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.icon}>{TYPE_ICON[facility.type] || '🏥'}</ThemedText>
        <ThemedText style={styles.name}>{facility.name}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.stock}>{facility.stock.toLocaleString()} units in stock</ThemedText>
      </View>
      <View style={styles.meta}>
        <ThemedText style={styles.metaText}>{facility.distanceKm} km away</ThemedText>
        <ThemedText style={styles.metaText}>Open: {facility.hours}</ThemedText>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  icon: { fontSize: 18 },
  name: { fontSize: 15, fontWeight: '700', color: '#11181C' },
  row: { marginBottom: 4 },
  stock: { fontSize: 14, color: '#16a34a', fontWeight: '600' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  metaText: { fontSize: 13, color: '#687076' },
});
