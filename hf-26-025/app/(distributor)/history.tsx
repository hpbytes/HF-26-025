import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ChainHistoryScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Chain History</ThemedText>
      <ThemedText>Full blockchain transaction log</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
});
