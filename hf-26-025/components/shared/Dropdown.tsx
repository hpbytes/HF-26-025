import { useState } from 'react';
import {
  Modal,
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface DropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function Dropdown({ label, value, options, onSelect, placeholder }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        <ThemedText style={selected ? styles.value : styles.placeholder}>
          {selected?.label || placeholder || `Select ${label}`}
        </ThemedText>
        <ThemedText style={styles.arrow}>▼</ThemedText>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>
              {label}
            </ThemedText>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item.value === value && styles.optionSelected]}
                  onPress={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}>
                  <ThemedText
                    style={item.value === value ? styles.optionTextSelected : styles.optionText}>
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#555' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f9fafb',
  },
  value: { fontSize: 15, color: '#11181C' },
  placeholder: { fontSize: 15, color: '#999' },
  arrow: { fontSize: 12, color: '#888' },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 30,
  },
  sheetTitle: { textAlign: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  option: { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f3f3f3' },
  optionSelected: { backgroundColor: '#e8f4f8' },
  optionText: { fontSize: 16 },
  optionTextSelected: { fontSize: 16, color: '#0a7ea4', fontWeight: '600' },
});
