import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

export default function InputField({
  label, hint, value, onChangeText,
  decimal = false, prefix, suffix, placeholder,
}) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.inputRow}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value === undefined || value === null ? '' : String(value)}
          onChangeText={onChangeText}
          keyboardType={decimal ? 'decimal-pad' : 'numeric'}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          returnKeyType="done"
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },
  hint: { fontSize: 10, color: COLORS.textMuted, opacity: 0.7, marginBottom: 4, fontStyle: 'italic' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.navyLight, borderRadius: 8,
    backgroundColor: COLORS.white, paddingHorizontal: 10, height: 44,
  },
  prefix: { fontSize: 16, fontWeight: '600', color: COLORS.textMuted, marginRight: 4 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.navyDark, paddingVertical: 0 },
  suffix: { fontSize: 14, color: COLORS.textMuted, marginLeft: 4 },
});
