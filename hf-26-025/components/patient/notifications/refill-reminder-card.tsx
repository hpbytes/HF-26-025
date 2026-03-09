import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { NotificationItem } from '@/hooks/use-notifications';

interface Props {
  item: NotificationItem;
  onViewPrescription: () => void;
}

export function RefillReminderCard({ item, onViewPrescription }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ThemedText style={styles.icon}>💊</ThemedText>
        <View style={styles.content}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText style={styles.desc}>{item.description}</ThemedText>
          <View style={styles.footer}>
            <ThemedText style={styles.time}>{item.timestamp}</ThemedText>
            <TouchableOpacity onPress={onViewPrescription} activeOpacity={0.7}>
              <ThemedText style={styles.action}>View Prescription →</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#f0f9ff', borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#0a7ea4', padding: 14, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  icon: { fontSize: 20, marginTop: 2 },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#11181C', marginBottom: 4 },
  desc: { fontSize: 13, color: '#687076', lineHeight: 18, marginBottom: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontSize: 12, color: '#9BA1A6' },
  action: { fontSize: 13, fontWeight: '600', color: '#0a7ea4' },
});
