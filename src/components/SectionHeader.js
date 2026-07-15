import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// SectionHeader — a coloured section bar. Honours `colour` (or `color`) as the
// background; defaults to navyDark. White bold label. This is the canonical
// section divider across the suite (replaces the per-screen local copies).
export default function SectionHeader({ title, colour, color }) {
  const bg = colour || color || COLORS.navyDark;
  return (
    <View style={[styles.bar, { backgroundColor: bg }]}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, marginTop: 16, marginBottom: 10 },
  text: { fontSize: 13, fontWeight: '700', color: COLORS.white, letterSpacing: 0.5 },
});
