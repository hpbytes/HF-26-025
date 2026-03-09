import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TransfersScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Transfers</ThemedText>
      <ThemedText>Initiate, accept &amp; track batch transfers</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
});
