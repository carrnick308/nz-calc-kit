import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../theme';

// Standard horizontal progress bar: a track with a width-driven fill.
//
//   <ProgressBar pct={72} />                              // green fill, 8px pill
//   <ProgressBar pct={x} height={14} fillColor={COLORS.red} />
//   <ProgressBar pct={x} trackColor={COLORS.border} radius={4} />
//
// pct is clamped to 0–100 internally, so callers never need Math.min/Math.max.
// radius defaults to a full pill (height / 2). overflow:'hidden' keeps the fill
// tucked inside the rounded corners (a recurring bug when done by hand).
export default function ProgressBar({
  pct = 0,
  height = 8,
  radius,
  trackColor = COLORS.bgSecondary,
  fillColor = COLORS.green,
  style,
  fillStyle,
}) {
  const r = radius != null ? radius : height / 2;
  const w = Math.max(0, Math.min(100, Number.isFinite(pct) ? pct : 0));
  return (
    <View style={[{ height, backgroundColor: trackColor, borderRadius: r, overflow: 'hidden' }, style]}>
      <View style={[{ width: `${w}%`, height: '100%', backgroundColor: fillColor, borderRadius: r }, fillStyle]} />
    </View>
  );
}
