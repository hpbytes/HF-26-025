import { useState } from 'react';
import { Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { BatchForm } from '@/components/manufacturer/add-batch/BatchForm';
import { QRDisplay } from '@/components/manufacturer/add-batch/QRDisplay';
import { TxReceipt } from '@/components/manufacturer/add-batch/TxReceipt';
import { useBatch, BatchResult, BatchFormData } from '@/hooks/use-batch';

type View = 'form' | 'qr' | 'receipt';

export default function AddBatchScreen() {
  const [view, setView] = useState<View>('form');
  const [result, setResult] = useState<BatchResult | null>(null);
  const { registerBatch, loading } = useBatch();

  const handleSubmit = async (data: BatchFormData) => {
    try {
      const res = await registerBatch(data);
      setResult(res);
      setView('qr');
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message);
    }
  };

  const handleRegisterAnother = () => {
    setResult(null);
    setView('form');
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {view === 'form' && <BatchForm onSubmit={handleSubmit} loading={loading} />}
      {view === 'qr' && result && (
        <QRDisplay
          batch={result}
          onRegisterAnother={handleRegisterAnother}
          onViewReceipt={() => setView('receipt')}
        />
      )}
      {view === 'receipt' && result && (
        <TxReceipt batch={result} onBack={() => setView('qr')} />
      )}
    </ThemedView>
  );
}
