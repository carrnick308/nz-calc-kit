import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { COLORS, DISCLAIMER, WEBSITE_URL } from '../theme';

export default function ScreenFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(WEBSITE_URL)}>
        <Text style={styles.link}>{WEBSITE_URL}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { marginTop: 24, marginBottom: 32, paddingHorizontal: 24 },
  disclaimer: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16, textAlign: 'center', marginBottom: 6 },
  link: { fontSize: 12, color: COLORS.blue, textAlign: 'center', textDecorationLine: 'underline' },
});
