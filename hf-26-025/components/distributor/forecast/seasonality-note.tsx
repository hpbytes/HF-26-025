import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
  note: string;
}

export function SeasonalityNote({ note }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.icon}>📊</ThemedText>
      <ThemedText style={styles.text}>{note}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
    alignItems: 'flex-start',
  },
  icon: { fontSize: 16 },
  text: { fontSize: 13, color: '#92400e', flex: 1, lineHeight: 18 },
});
