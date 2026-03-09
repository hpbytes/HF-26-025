import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export function ScanViewfinder() {
  return (
    <View style={styles.camera}>
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
      <View style={styles.placeholder}>
        <ThemedText style={styles.placeholderText}>📷 Camera Preview</ThemedText>
        <ThemedText style={styles.placeholderSub}>Camera access required</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    height: 280,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  scanArea: {
    width: 180,
    height: 180,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#0a7ea4',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  placeholder: { alignItems: 'center' },
  placeholderText: { fontSize: 24, color: '#fff', marginBottom: 4 },
  placeholderSub: { fontSize: 13, color: '#94a3b8' },
});
