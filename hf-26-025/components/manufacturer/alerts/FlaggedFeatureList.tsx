import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
  features: string[];
}

export function FlaggedFeatureList({ features }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Flagged Features</ThemedText>
      {features.map((f, i) => (
        <View key={i} style={styles.item}>
          <ThemedText style={styles.bullet}>•</ThemedText>
          <ThemedText style={styles.text}>{f}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  title: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 2 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { fontSize: 16, color: '#dc2626', lineHeight: 20 },
  text: { flex: 1, fontSize: 14, color: '#333', lineHeight: 20 },
});
