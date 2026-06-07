import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// Shared home-screen header. title is usually the app name; subtitle is the tagline.
export default function HomeHeader({ title, subtitle }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header:   { backgroundColor: COLORS.navyDark, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 28 },
  title:    { fontSize: 24, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.navySubtext },
});
