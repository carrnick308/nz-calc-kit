import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

export default function MetricCard({ label, value, positive = true }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: positive ? COLORS.green : COLORS.red }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, padding: 10, margin: 3 },
  label: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },
  value: { fontSize: 15, fontWeight: '500' },
});
