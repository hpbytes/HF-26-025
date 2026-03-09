import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth, UserRole } from '@/contexts/auth-context';

const ROLES: { key: UserRole; label: string; icon: string; desc: string }[] = [
  { key: 'manufacturer', label: 'Manufacturer', icon: '🏭', desc: 'Register batches & manage supply' },
  { key: 'distributor', label: 'Distributor', icon: '🚚', desc: 'Track inventory & transfers' },
  { key: 'patient', label: 'Patient', icon: '🧑‍⚕️', desc: 'Verify drugs & prescriptions' },
];

export default function LoginScreen() {
  const { selectRole } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.brand}>
          MedChain TN
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Healthcare Supply Chain Management
        </ThemedText>
      </View>

      <ThemedText style={styles.prompt}>Continue as</ThemedText>

      <View style={styles.roles}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={styles.roleCard}
            onPress={() => selectRole(r.key)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.roleIcon}>{r.icon}</ThemedText>
            <View style={styles.roleInfo}>
              <ThemedText style={styles.roleLabel}>{r.label}</ThemedText>
              <ThemedText style={styles.roleDesc}>{r.desc}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brand: {
    fontSize: 32,
    color: '#0a7ea4',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.6,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  roles: {
    gap: 14,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#f0f8fb',
    borderWidth: 1,
    borderColor: '#d0e8f0',
  },
  roleIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  roleDesc: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
});
