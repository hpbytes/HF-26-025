import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ScanQRScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Scan QR</ThemedText>
      <ThemedText>Verify drug authenticity via blockchain</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
});
