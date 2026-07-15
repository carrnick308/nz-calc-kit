import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme';
// Shared home-screen header. title is usually the app name; subtitle is the tagline.
// v1.4.0: respects the device safe-area top inset so the title clears the notch/clock.
export default function HomeHeader({ title, subtitle }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  header:   { backgroundColor: COLORS.navyDark, paddingHorizontal: 24, paddingBottom: 28 },
  title:    { fontSize: 24, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.navySubtext },
});