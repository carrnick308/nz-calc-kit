import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

export default function SectionHeader({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 10, gap: 8 },
  text: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  line: { flex: 1, height: 0.5, backgroundColor: COLORS.border },
});
