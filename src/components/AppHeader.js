import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme';
// Kit-standard header. `appName` is injected by each app's local AppHeader shim;
// each screen passes the calculator name as `title` (preferred) or `calculatorName`,
// plus `onBack`. Render as a SIBLING directly above the ScrollView, inside a navy
// SafeAreaView.
//
// v1.4.0: header now respects the device safe-area top inset (notch / camera /
// status bar) so the title never rides up under the clock on modern phones.
export default function AppHeader({ appName, title, calculatorName, onBack }) {
  const insets = useSafeAreaInsets();
  const heading = title || calculatorName;
  return (
    <View style={[styles.header, { paddingTop: 10 }]}>
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
    paddingBottom: 12,
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
    fontSize: 30,
    color: COLORS.white,
    fontWeight: '600',
    lineHeight: 30,
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '600',
    lineHeight: 26,
  },
});