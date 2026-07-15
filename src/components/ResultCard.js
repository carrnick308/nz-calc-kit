import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// ResultCard — the standard result container for the suite.
// Normalises SHAPE only (radius 12, padding 16, 1px border, marginBottom 12);
// colour and inner content come from the screen, so colour-coded results
// (navy hero, green winner, gold/silver/bronze ranks, accent stripes) keep
// their own colours — they just share one consistent shape.
//
//   variant:    'panel' (default, white) | 'hero' (navy, centred) | 'subtle' (grey sub-result)
//   accent:     colour string -> coloured stripe (any colour, incl. gold/silver/bronze)
//   accentEdge: 'left' (default, stacked cards) | 'top' (side-by-side / row cards)
//   tone:       'positive' | 'negative' -> 1.5px green/red border (winner / comparison cards)
//   style:      optional overrides, merged last (e.g. flex:1 + marginBottom:0 for row cards)
export default function ResultCard({
  variant = 'panel',
  accent,
  accentEdge = 'left',
  tone,
  centered = false,
  style,
  children,
}) {
  const s = [styles.base, styles[variant] || styles.panel];
  if (centered) s.push(styles.centered);
  if (accent) {
    s.push(
      accentEdge === 'top'
        ? { borderTopWidth: 4, borderTopColor: accent }
        : { borderLeftWidth: 4, borderLeftColor: accent }
    );
  }
  if (tone === 'positive') s.push(styles.tonePositive);
  if (tone === 'negative') s.push(styles.toneNegative);
  if (style) s.push(style);
  return <View style={s}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { borderRadius: 12, padding: 16, marginBottom: 12 },
  panel: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  hero: { backgroundColor: COLORS.navyDark, padding: 20, alignItems: 'center' },
  centered: { alignItems: 'center' },
  subtle: { backgroundColor: COLORS.bgSecondary, borderWidth: 1, borderColor: COLORS.border },
  tonePositive: { borderWidth: 1.5, borderColor: COLORS.green },
  toneNegative: { borderWidth: 1.5, borderColor: COLORS.red },
});
