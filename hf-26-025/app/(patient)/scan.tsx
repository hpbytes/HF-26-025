import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScanViewfinder } from '@/components/patient/scan/scan-viewfinder';
import { ManualBatchInput } from '@/components/patient/scan/manual-batch-input';
import { AuthenticCard } from '@/components/patient/scan/authentic-card';
import { ExpiredCard } from '@/components/patient/scan/expired-card';
import { InvalidCard } from '@/components/patient/scan/invalid-card';
import { useScan } from '@/hooks/use-scan';

export default function ScanQRScreen() {
  const { state, scanResult, verifyBatch, resetScan } = useScan();

  if (state === 'loading') {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>Verifying on blockchain...</ThemedText>
      </ThemedView>
    );
  }

  if (state === 'result' && scanResult) {
    if (scanResult.result === 'authentic') {
      return (
        <ThemedView style={styles.container}>
          <AuthenticCard data={scanResult} onScanAnother={resetScan} />
        </ThemedView>
      );
    }
    if (scanResult.result === 'expired') {
      return (
        <ThemedView style={styles.container}>
          <ExpiredCard
            data={scanResult}
            onFindStock={() => { /* navigate to home */ }}
            onScanAnother={resetScan}
          />
        </ThemedView>
      );
    }
    return (
      <ThemedView style={styles.container}>
        <InvalidCard
          data={scanResult}
          onReport={() => { /* report action */ }}
          onScanAgain={resetScan}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>Scan QR Code</ThemedText>
        <ThemedText style={styles.subtitle}>Verify drug authenticity via blockchain</ThemedText>

        <ScanViewfinder />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>or enter manually</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        <ManualBatchInput onSubmit={verifyBatch} loading={false} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#687076', marginBottom: 20 },
  loadingText: { fontSize: 15, color: '#687076', marginTop: 12 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 13, color: '#9BA1A6', marginHorizontal: 12 },
});
