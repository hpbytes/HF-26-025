import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
  score: number;
}

export function ConfidenceBar({ score }: Props) {
  const pct = Math.round(score * 100);
  const color = score > 0.85 ? '#dc2626' : score > 0.6 ? '#ca8a04' : '#16a34a';

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Confidence Score: {score.toFixed(2)}</ThemedText>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <ThemedText style={[styles.pct, { color }]}>{pct}%</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#555' },
  barBg: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 8 },
  pct: { fontSize: 13, fontWeight: '700', textAlign: 'right' },
});
