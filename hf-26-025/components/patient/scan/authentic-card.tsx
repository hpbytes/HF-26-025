import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { ScanResult, CustodyEntry } from '@/hooks/use-scan';

interface Props {
  data: ScanResult;
  onScanAnother: () => void;
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText style={[styles.rowValue, valueColor ? { color: valueColor } : undefined]}>{value}</ThemedText>
    </View>
  );
}

function CustodyStepView({ entry }: { entry: CustodyEntry }) {
  return (
    <View style={styles.custodyStep}>
      <View style={styles.stepDot}>
        <ThemedText style={styles.stepNum}>①②③④⑤⑥⑦⑧⑨⑩</ThemedText>
      </View>
      <View style={styles.stepContent}>
        <ThemedText style={styles.stepActor}>{entry.actor}</ThemedText>
        <ThemedText style={styles.stepAction}>{entry.action} · {entry.timestamp}</ThemedText>
      </View>
    </View>
  );
}

export function AuthenticCard({ data, onScanAnother }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <ThemedText style={styles.checkIcon}>✅</ThemedText>
      </View>
      <ThemedText style={styles.title}>AUTHENTIC</ThemedText>
      <ThemedText style={styles.subtitle}>Verified on blockchain</ThemedText>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Medicine Details</ThemedText>
        <InfoRow label="Drug" value={data.drug || ''} />
        <InfoRow label="Form" value={data.form || ''} />
        <InfoRow label="Batch ID" value={data.batchId} />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Manufacturer</ThemedText>
        <InfoRow label="Name" value={data.manufacturer || ''} />
        <InfoRow label="Verified" value={data.manufacturerVerified ? '✅' : '❌'} />
        <InfoRow label="Registered" value={data.registeredDate || ''} />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Safety Check</ThemedText>
        <InfoRow label="Expiry Date" value={`${data.expiryDate}  ✅`} />
        <InfoRow label="Days left" value={`${data.daysLeft} days`} />
        <InfoRow label="Status" value="Safe to use" valueColor="#16a34a" />
      </View>

      {data.custody && data.custody.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Chain of Custody</ThemedText>
          {data.custody.map((c) => (
            <View key={c.step} style={styles.custodyStep}>
              <ThemedText style={styles.stepCircle}>{c.step}</ThemedText>
              <View style={styles.stepContent}>
                <ThemedText style={styles.stepActor}>{c.actor}</ThemedText>
                <ThemedText style={styles.stepAction}>{c.action} · {c.timestamp}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}

      {data.txHash && (
        <View style={styles.txBox}>
          <ThemedText style={styles.txLabel}>Tx Hash: {data.txHash.slice(0, 10)}...{data.txHash.slice(-4)}</ThemedText>
          <ThemedText style={styles.txLabel}>Block: #{data.blockNumber}</ThemedText>
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={onScanAnother} activeOpacity={0.7}>
        <ThemedText style={styles.btnText}>Scan Another</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  iconWrap: { marginTop: 10, marginBottom: 8 },
  checkIcon: { fontSize: 48 },
  title: { fontSize: 26, fontWeight: '800', color: '#16a34a', marginBottom: 2 },
  subtitle: { fontSize: 14, color: '#687076', marginBottom: 20 },
  section: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#687076', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rowLabel: { fontSize: 14, color: '#687076' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#11181C', flexShrink: 1, textAlign: 'right' },
  custodyStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  stepDot: { display: 'none' },
  stepNum: { display: 'none' },
  stepCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#0a7ea4', color: '#fff', textAlign: 'center', lineHeight: 24, fontSize: 12, fontWeight: '700', overflow: 'hidden' },
  stepContent: { flex: 1 },
  stepActor: { fontSize: 14, fontWeight: '700', color: '#11181C' },
  stepAction: { fontSize: 13, color: '#687076' },
  txBox: { width: '100%', backgroundColor: '#f8fafc', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  txLabel: { fontSize: 12, color: '#0a7ea4', fontFamily: 'monospace', marginBottom: 2 },
  btn: { backgroundColor: '#0a7ea4', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 20 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
