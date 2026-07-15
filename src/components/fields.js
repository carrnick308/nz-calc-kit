// nz-calc-kit/src/components/fields.js
// Shared input-field family. One base row + typed wrappers, so every calculator field across the
// suite renders identically and carries the right keyboard by construction (see KEYBOARD-STANDARD).
//
// Adopted from NZRetirementCalc's typed family (AgeInput / DollarInput / PctInput / SignedPctInput),
// corrected to the keyboard standard and de-duplicated. Styles match the live converged InputField
// (label 13/600/textPrimary, border navyLight 1.5, height 44).
//
// Wrappers:
//   <MoneyInput>       $ prefix, decimal-pad        (money)
//   <RateInput>        % suffix, decimal-pad        (rates / percentages)
//   <IntInput>         number-pad, optional min/max (age / year / count)
//   <SignedRateInput>  % suffix, +/- toggle         (rates that can be negative)
//   <TextField>        default keyboard             (names / free text)
//
// Every wrapper accepts onChange OR onChangeText (the suite is split on the name); BaseField
// normalises them. value is coerced safely so undefined/null never renders the literal "undefined".

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// ── Base row ────────────────────────────────────────────────────────────────────
export function BaseField({
  label, hint, value, onChange, onChangeText, onBlur,
  prefix, suffix, placeholder, keyboardType = 'decimal-pad',
  warning, error, note, editable = true, leftAccessory, optional,
}) {
  const handle = onChange || onChangeText || (() => {});
  const v = value === undefined || value === null ? '' : String(value);
  return (
    <View style={styles.container}>
      {label ? (
        optional ? (
          <View style={styles.labelRow}>
            <Text style={[styles.label, styles.labelFlex]} numberOfLines={2}>{label}</Text>
            <Text style={styles.optionalTag}>optional</Text>
          </View>
        ) : (
          <Text style={styles.label} numberOfLines={2}>{label}</Text>
        )
      ) : null}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        {leftAccessory || null}
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={v}
          onChangeText={handle}
          onBlur={onBlur}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          editable={editable}
          returnKeyType="done"
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
      {warning ? <Text style={styles.warning}>{warning}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

// ── Typed wrappers ──────────────────────────────────────────────────────────────
// prefix/suffix/keyboardType are defaults; a caller can still override via props.
export function MoneyInput(props) {
  return <BaseField prefix="$" keyboardType="decimal-pad" {...props} />;
}

export function RateInput(props) {
  return <BaseField suffix="%" keyboardType="decimal-pad" {...props} />;
}

// Plain decimal field — decimal-pad, no $/% affordance. For unitless quantities that
// can be fractional (e.g. "years to double", trip distance, a multiplier). Use IntInput
// instead when the value is a true whole-number count (age, calendar year, people).
export function NumberInput(props) {
  return <BaseField keyboardType="decimal-pad" {...props} />;
}

export function TextField(props) {
  return <BaseField keyboardType="default" {...props} />;
}

// Integer field — number-pad, digits only, optional min/max clamp.
// Generalises Retirement's AgeInput: caps on the way up (so the field can't exceed max),
// floors to min on blur (so a half-typed low value isn't fought mid-entry).
export function IntInput({ min, max, value, onChange, onChangeText, onBlur, ...rest }) {
  const handle = onChange || onChangeText || (() => {});
  const onCh = (v) => {
    if (v === '') { handle(''); return; }
    if (!/^\d+$/.test(v)) return;
    if (max != null && parseInt(v, 10) > max) { handle(String(max)); return; }
    handle(v);
  };
  const onBl = (e) => {
    if (min != null && value !== '' && value !== undefined && value !== null) {
      const n = parseInt(value, 10);
      if (!isNaN(n) && n < min) handle(String(min));
    }
    if (onBlur) onBlur(e);
  };
  return <BaseField value={value} onChangeText={onCh} onBlur={onBl} keyboardType="number-pad" {...rest} />;
}

// Signed rate — % suffix, numbers-and-punctuation, with a +/- toggle button.
// The toggle owns the sign; the text input holds the magnitude. Negative values use ASCII '-'
// (the suite minus convention). Adopted from Retirement's SignedPctInput.
export function SignedRateInput({ value, onChange, onChangeText, suffix = '%', ...rest }) {
  const handle = onChange || onChangeText || (() => {});
  const s = value === undefined || value === null ? '' : String(value);
  const isNeg = s.startsWith('-');
  const abs = isNeg ? s.slice(1) : s;
  const toggle = () => { if (!s) return; handle(isNeg ? abs : '-' + abs); };
  const onCh = (v) => {
    const clean = v.replace(/[^0-9.]/g, '');
    handle(isNeg ? (clean ? '-' + clean : '') : clean);
  };
  const signBtn = (
    <TouchableOpacity onPress={toggle} style={styles.signBtn} activeOpacity={0.7}>
      <Text style={[styles.signText, isNeg && styles.signTextNeg]}>{isNeg ? '-' : '+'}</Text>
    </TouchableOpacity>
  );
  return (
    <BaseField
      value={abs}
      onChangeText={onCh}
      keyboardType="numbers-and-punctuation"
      suffix={suffix}
      leftAccessory={signBtn}
      {...rest}
    />
  );
}

// Dense / table-cell field — a label-less, margin-less bordered input for compact data-entry rows
// (fee tables, transaction rows, asset rows). Pass `style` for the column's flex/width; `align` for
// textAlign; optional inline prefix/suffix. Default keyboard is decimal-pad; pass keyboardType="default"
// for text columns (names). Unlike the labelled fields it has no container margin and no label slot.
export function DenseField({
  value, onChange, onChangeText, prefix, suffix, align, style,
  keyboardType = 'decimal-pad', placeholder, placeholderTextColor,
  editable = true, onBlur, ...rest
}) {
  const handle = onChange || onChangeText || (() => {});
  const v = value === undefined || value === null ? '' : String(value);
  return (
    <View style={[styles.denseRow, style]}>
      {prefix ? <Text style={styles.densePrefix}>{prefix}</Text> : null}
      <TextInput
        style={[styles.denseInput, align ? { textAlign: align } : null]}
        value={v}
        onChangeText={handle}
        onBlur={onBlur}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || COLORS.textMuted}
        editable={editable}
        returnKeyType="done"
        {...rest}
      />
      {suffix ? <Text style={styles.denseSuffix}>{suffix}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  denseRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.navyLight, borderRadius: 8,
    backgroundColor: COLORS.white, paddingHorizontal: 8, paddingVertical: 8,
  },
  denseInput: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.navyDark, paddingVertical: 0 },
  densePrefix: { fontSize: 14, fontWeight: '700', color: COLORS.navyMid, marginRight: 3 },
  denseSuffix: { fontSize: 13, color: COLORS.textMuted, marginLeft: 3 },
  // 13/600/textPrimary label; minHeight reserves 2 lines so half-width paired fields stay aligned.
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 3, minHeight: 34 },
  labelRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  labelFlex: { flex: 1 },
  optionalTag: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic', marginLeft: 8, marginTop: 2 },
  hint: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4, fontStyle: 'italic' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.navyLight, borderRadius: 8,
    backgroundColor: COLORS.white, paddingHorizontal: 10, height: 44,
  },
  inputRowError: { borderColor: COLORS.red },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.navyDark, paddingVertical: 0 },
  prefix: { fontSize: 16, fontWeight: '700', color: COLORS.navyMid, marginRight: 4 },
  suffix: { fontSize: 14, color: COLORS.textMuted, marginLeft: 4 },
  warning: { fontSize: 11, color: COLORS.orange, fontWeight: '600', marginTop: 5 },
  error: { fontSize: 11, color: COLORS.red, marginTop: 4 },
  note: { fontSize: 11, color: COLORS.textMuted, marginTop: 5 },
  signBtn: {
    width: 28, height: 30, borderRadius: 6, backgroundColor: COLORS.bgSecondary,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  signText: { fontSize: 18, fontWeight: '700', color: COLORS.green },
  signTextNeg: { color: COLORS.red },
});
