import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Dropdown } from '@/components/shared/Dropdown';
import { DRUGS, REGIONS, MOCK_DISTRIBUTORS } from '@/constants/medchain';
import { generateBatchId, BatchFormData } from '@/hooks/use-batch';

interface Props {
  onSubmit: (data: BatchFormData) => void;
  loading?: boolean;
}

const drugOptions = DRUGS.map((d) => ({ label: d.name, value: d.code }));
const regionOptions = REGIONS.map((r) => ({ label: r, value: r }));
const distributorOptions = MOCK_DISTRIBUTORS.map((d) => ({ label: `${d.name} (${d.region})`, value: d.id }));

export function BatchForm({ onSubmit, loading }: Props) {
  const [drugCode, setDrugCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [expDate, setExpDate] = useState('');
  const [region, setRegion] = useState('');
  const [distributorId, setDistributorId] = useState('');

  const batchId = drugCode ? generateBatchId(drugCode) : '—';
  const drugName = DRUGS.find((d) => d.code === drugCode)?.name || '';

  const validate = (): string | null => {
    if (!drugCode) return 'Select a drug';
    if (!quantity || parseInt(quantity, 10) <= 0) return 'Quantity must be > 0';
    if (!mfgDate.match(/^\d{4}-\d{2}-\d{2}$/)) return 'Manufacture date must be YYYY-MM-DD';
    if (!expDate.match(/^\d{4}-\d{2}-\d{2}$/)) return 'Expiry date must be YYYY-MM-DD';
    if (new Date(expDate) <= new Date(mfgDate)) return 'Expiry must be after manufacture date';
    if (!region) return 'Select a region';
    if (!distributorId) return 'Select a distributor';
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      Alert.alert('Validation Error', err);
      return;
    }
    onSubmit({
      drug: drugName,
      drugCode,
      quantity,
      manufactureDate: mfgDate,
      expiryDate: expDate,
      region,
      distributorId,
    });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.heading}>Add New Batch</ThemedText>

      <Dropdown label="Drug Name" value={drugCode} options={drugOptions} onSelect={setDrugCode} />

      <View style={styles.field}>
        <ThemedText style={styles.label}>Batch ID</ThemedText>
        <View style={styles.readOnly}>
          <ThemedText style={styles.readOnlyText} numberOfLines={1}>{batchId}</ThemedText>
        </View>
      </View>

      <View style={styles.field}>
        <ThemedText style={styles.label}>Quantity (units)</ThemedText>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="e.g. 5000"
          placeholderTextColor="#999"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={styles.label}>Manufacture Date</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={mfgDate}
          onChangeText={setMfgDate}
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={styles.label}>Expiry Date</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={expDate}
          onChangeText={setExpDate}
        />
      </View>

      <Dropdown label="Assign Region" value={region} options={regionOptions} onSelect={setRegion} />
      <Dropdown label="Assign Distributor" value={distributorId} options={distributorOptions} onSelect={setDistributorId} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.disabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}>
          <ThemedText style={styles.submitText}>{loading ? 'Registering...' : 'Submit'}</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 20, paddingBottom: 40, gap: 16 },
  heading: { fontSize: 24, marginBottom: 8, color: '#0a7ea4' },
  field: {},
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#555' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: '#f9fafb',
    color: '#11181C',
  },
  readOnly: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  readOnlyText: { fontSize: 13, color: '#666', fontFamily: 'monospace' },
  actions: { marginTop: 8 },
  submitBtn: {
    height: 52,
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
