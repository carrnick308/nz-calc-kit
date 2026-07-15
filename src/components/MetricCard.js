import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

export default function MetricCard({ label, value, positive = true }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: positive ? COLORS.green : COLORS.red }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    margin: 3,
  },
  // A MetricCard shows ONE result: a label above a value. Both are centred.
  //
  // The "pair" exception is a different layout entirely — a row with the label on the
  // left and the value on the right (`flexDirection: 'row', justifyContent:
  // 'space-between'`), as in FDR vs CV. There you centre the card's title and leave
  // the rows justified. That is not this component.
  label: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4, textAlign: 'center' },
  // marginTop:'auto' pins the value to the bottom of the card, so values line up
  // across a row even when one label wraps to more lines than another.
  value: { fontSize: 15, fontWeight: '500', marginTop: 'auto', textAlign: 'center' },
});
