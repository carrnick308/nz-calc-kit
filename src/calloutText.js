import { StyleSheet } from 'react-native';
import { COLORS } from './theme';

// calloutText — canonical text styles for inside IntroBox / NoteBox callouts.
// Tone-neutral: one dark colour reads cleanly on every callout tint.
// (No explicit lineHeight on body — avoids the iOS multi-line wrap bug.)
export const calloutText = StyleSheet.create({
  title: { fontSize: 14, fontWeight: '700', color: COLORS.navyDark, marginBottom: 6 },
  body:  { fontSize: 13, color: COLORS.navyDark },
  bold:  { fontWeight: '700' },
  link:  { fontSize: 13, fontWeight: '600', color: COLORS.blue },
});
