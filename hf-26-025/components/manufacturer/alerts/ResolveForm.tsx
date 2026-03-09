import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AlertItem, ResolutionAction } from '@/hooks/use-alerts';

interface Props {
  alert: AlertItem;
  onResolve: (action: ResolutionAction, notes: string) => void;
  loading?: boolean;
}

const OPTIONS: { key: ResolutionAction; label: string; desc: string }[] = [
  { key: 'investigated', label: 'Mark as Investigated', desc: 'No further action needed' },
  { key: 'escalate', label: 'Escalate to Authority', desc: 'Flag for regulatory review' },
  { key: 'false_positive', label: 'False Positive', desc: 'Dismiss — expected movement' },
];

export function ResolveForm({ alert, onResolve, loading }: Props) {
  const [selected, setSelected] = useState<ResolutionAction | null>(null);
  const [notes, setNotes] = useState('');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.batchInfo}>Batch: {alert.batchId}</ThemedText>
      <ThemedText style={styles.drugInfo}>
        {alert.drug} · {alert.region}
      </ThemedText>
      <ThemedText style={styles.alertType}>Alert: {alert.type}</ThemedText>

      <ThemedText style={styles.sectionTitle}>── Resolution Action ──</ThemedText>

      {OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.key}
          style={[styles.option, selected === opt.key && styles.optionSelected]}
          onPress={() => setSelected(opt.key)}
          activeOpacity={0.7}>
          <View style={styles.radio}>
            {selected === opt.key && <View style={styles.radioDot} />}
          </View>
          <View style={styles.optionInfo}>
            <ThemedText style={styles.optionLabel}>{opt.label}</ThemedText>
            <ThemedText style={styles.optionDesc}>{opt.desc}</ThemedText>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.notesSection}>
        <ThemedText style={styles.notesLabel}>Notes (optional):</ThemedText>
        <TextInput
          style={styles.notesInput}
          placeholder="Add investigation notes"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <TouchableOpacity
        style={[styles.confirmBtn, (!selected || loading) && styles.disabled]}
        onPress={() => selected && onResolve(selected, notes)}
        disabled={!selected || loading}
        activeOpacity={0.8}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.confirmText}>Confirm Resolution</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  batchInfo: { fontSize: 13, fontFamily: 'monospace', color: '#0a7ea4' },
  drugInfo: { fontSize: 15, color: '#555' },
  alertType: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
  sectionTitle: { textAlign: 'center', color: '#888', fontSize: 13, marginVertical: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  optionSelected: { borderColor: '#0a7ea4', backgroundColor: '#f0f8fb' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0a7ea4' },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: '600' },
  optionDesc: { fontSize: 13, color: '#888' },
  notesSection: { gap: 6, marginTop: 4 },
  notesLabel: { fontSize: 13, fontWeight: '600', color: '#555' },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    backgroundColor: '#f9fafb',
    color: '#11181C',
  },
  confirmBtn: {
    height: 52,
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  disabled: { opacity: 0.5 },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
