import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// Standard remove/delete control for multi-input lists (banks, funds, debts, rows...).
// One glyph (×), one colour (muted grey), generous hitSlop for easy tapping.
//   <RemoveButton onPress={fn} />                 -> icon-only  ×
//   <RemoveButton onPress={fn} label="Remove" />  -> labelled   × Remove
// Pass `style` to position it (e.g. alignSelf / margin) — visual styling stays here.
// `onDark` renders the glyph white for use on navy/coloured surfaces (e.g. card headers);
// default is muted grey for light rows.
export default function RemoveButton({
  onPress,
  label,
  onDark = false,
  hitSlop = { top: 8, bottom: 8, left: 8, right: 8 },
  style,
}) {
  const tone = { color: onDark ? COLORS.white : COLORS.textMuted };
  return (
    <TouchableOpacity onPress={onPress} hitSlop={hitSlop} style={style} accessibilityRole="button" accessibilityLabel={label || 'Remove'}>
      <Text style={[label ? styles.labelled : styles.icon, tone]}>
        {label ? `\u00D7 ${label}` : '\u00D7'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // icon-only: slightly larger so the bare glyph is an easy tap target
  icon:     { fontSize: 18, lineHeight: 18, fontWeight: '600' },
  // labelled: matches small button text; the × reads as a prefix
  labelled: { fontSize: 13, fontWeight: '600' },
});
