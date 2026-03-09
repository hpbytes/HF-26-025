import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
  name: string;
  distanceKm: number;
}

export function NearbyFacilityRow({ name, distanceKm }: Props) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.icon}>📍</ThemedText>
      <ThemedText style={styles.name}>{name}</ThemedText>
      <ThemedText style={styles.distance}>{distanceKm} km</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  icon: { fontSize: 16 },
  name: { flex: 1, fontSize: 14, fontWeight: '500', color: '#11181C' },
  distance: { fontSize: 13, color: '#687076' },
});
