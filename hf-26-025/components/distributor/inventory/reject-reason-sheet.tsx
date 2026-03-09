import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
  visible: boolean;
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}

export function RejectReasonSheet({ visible, onSubmit, onCancel }: Props) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason.trim());
      setReason('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <ThemedText style={styles.title}>Rejection Reason</ThemedText>
          <ThemedText style={styles.subtitle}>Please provide a reason for rejecting this shipment</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter reason..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, !reason.trim() && styles.submitDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={!reason.trim()}
            >
              <ThemedText style={styles.submitText}>Submit</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#11181C', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#687076', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    backgroundColor: '#f9fafb',
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, borderRadius: 10, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#d0d5dd' },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#687076' },
  submitBtn: { flex: 1, backgroundColor: '#dc2626', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
