import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// Kit-standard header. `appName` is injected by each app's local AppHeader shim;
// each screen passes the calculator name as `title` (preferred) or `calculatorName`,
// plus `onBack`. Render as a SIBLING directly above the ScrollView, inside a navy
// SafeAreaView.
//
// v1.3.0: folded in the larger back-button hitSlop and the 2-line title cap, and
// adopted the 16/18 vertical padding. `title` is accepted as an alias of
// `calculatorName` so apps using either prop name work unchanged.
export default function AppHeader({ appName, title, calculatorName, onBack }) {
  const heading = title || calculatorName;
  return (
    <View style={styles.header}>
      <Text style={styles.appName} numberOfLines={1}>{appName}</Text>
      {heading ? (
        <View style={styles.titleRow}>
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.title} numberOfLines={2}>{heading}</Text>
        </View>
      ) : (
        <Text style={styles.title} numberOfLines={2}>{appName}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.navyDark,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 18,
  },
  appName: {
    fontSize: 11,
    color: COLORS.navySubtext,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    paddingRight: 12,
  },
  backArrow: {
    fontSize: 24,
    color: COLORS.white,
    lineHeight: 28,
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '600',
    lineHeight: 26,
  },
});
