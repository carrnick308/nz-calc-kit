import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// Standard "add another item" button for multi-input lists (debts, funds, banks, rows...).
// One glyph (+), one colour (blue), one shape. Pass the label without the plus:
//   <AddButton onPress={fn} label="Add another debt" />   -> "+ Add another debt"
// Pass `style` to override layout (e.g. marginTop) — visual styling stays here.
export default function AddButton({ onPress, label, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={typeof label === 'string' ? label : 'Add'}>
      <Text style={styles.text}>+ {label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:  { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.blueBorder, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center' },
  text: { fontSize: 13, fontWeight: '600', color: COLORS.blue },
});
