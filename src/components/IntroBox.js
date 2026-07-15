import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// IntroBox / NoteBox — the standard callout for the suite (one component, two
// names: use IntroBox for top-of-screen explainers, NoteBox for inline notes).
// Normalises SHAPE only (radius 10, 1px border, padding 12, marginBottom 12);
// the screen keeps its own <Text> children, so existing content is untouched.
//
//   tone:  undefined / 'info' (blue, default) | 'warning' (orange)
//          | 'success' (green) | 'danger' (red) | 'subtle' (grey)
//   style: optional overrides, merged last (e.g. marginHorizontal for screens
//          whose ScrollView has no horizontal padding)
export default function IntroBox({ tone, style, children }) {
  const s = [styles.base, styles[tone] || styles.info];
  if (style) s.push(style);
  return <View style={s}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 12 },
  info: { backgroundColor: COLORS.blueLight, borderColor: COLORS.blueBorder },
  warning: { backgroundColor: COLORS.orangeLight, borderColor: COLORS.orange },
  success: { backgroundColor: COLORS.greenLight, borderColor: COLORS.greenBorder },
  danger: { backgroundColor: COLORS.redLight, borderColor: COLORS.red },
  subtle: { backgroundColor: COLORS.bgSecondary, borderColor: COLORS.border },
});
