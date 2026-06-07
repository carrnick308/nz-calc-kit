import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// Generic cross-promo block. The relationships map lives per-app (each app has
// its own calculators); this just renders whatever items it's handed.
//   items: [{ id, title, note? }]   onNavigate: (id) => void
export default function RelatedCalculators({ items, onNavigate, heading = 'Related calculators' }) {
  if (!items || items.length === 0 || !onNavigate) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{heading}</Text>
      {items.map((it) => (
        <TouchableOpacity key={it.id} style={styles.row} onPress={() => onNavigate(it.id)} activeOpacity={0.7}>
          <View style={styles.textCol}>
            <Text style={styles.title}>{it.title}</Text>
            {it.note ? <Text style={styles.note}>{it.note}</Text> : null}
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 24, marginTop: 12, marginBottom: 4 },
  heading: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8,
  },
  textCol: { flex: 1, paddingRight: 10 },
  title: { fontSize: 14, fontWeight: '600', color: COLORS.navyDark },
  note: { fontSize: 12, color: COLORS.textMuted, marginTop: 2, lineHeight: 16 },
  arrow: { fontSize: 18, color: COLORS.blue },
});
