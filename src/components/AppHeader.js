import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// appName is passed in by each app (via its thin local AppHeader shim) so the
// kit stays app-agnostic. calculatorName + onBack are passed per screen.
export default function AppHeader({ appName, calculatorName, onBack }) {
  return (
    <View style={styles.header}>
      <Text style={styles.appName}>{appName}</Text>
      {calculatorName ? (
        <View style={styles.titleRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.calcName}>{calculatorName}</Text>
        </View>
      ) : (
        <Text style={styles.calcName}>{appName}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.navyDark,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 4,
  },
  appName: {
    fontSize: 11,
    color: COLORS.navySubtext,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingRight: 4 },
  backArrow: { fontSize: 22, color: COLORS.white, lineHeight: 26 },
  calcName: { fontSize: 20, color: COLORS.white, fontWeight: '600', lineHeight: 26, flex: 1 },
});
