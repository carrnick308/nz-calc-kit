import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

// Standard data-table header row for the whole suite.
//
//   <TableHeader columns={[
//     { label: 'Debt', flex: 1.5, align: 'left' },
//     { label: 'Paid off after' },   // align defaults to 'right'
//     { label: 'By' },
//   ]} />
//
// Look: navy bar, white Title-Case labels, weight 700, 12px.
// Spacing: columns share width evenly (flex defaults to 1). Bump a label/date
// column with `flex` only when it genuinely needs more room — this is what keeps
// the old "wide first gap, crammed rest" problem from coming back.
// Each column: { label, flex?, width?, align? }
//   width  fixed px width (use for tight columns like "Year" or a bar spacer)
//   flex   proportional width, defaults to 1 (ignored if width is set)
//   align  defaults to 'center' for every column (the suite standard).
//          Set align:'left' only for genuine multi-word text columns.
//          Set align:'right' on money / large-number columns so figures line up
//          on their right edge and magnitudes compare at a glance.
//
// Centred default keeps each header word and its data on the same axis even when
// headers differ a lot in length (a short "By" over a wider date). Right-align is
// reserved for money because there the header (Balance, Interest…) is about as wide
// as the number, so it lines up cleanly without the short-header poke-out.
//
// Use `tableColStyle(col, index)` on the matching BODY cells so the data lines up
// under the header — header and body must share the same column definitions.
export function tableColStyle(col = {}, index = 0) {
  const align = { textAlign: col.align ?? 'center' };
  return col.width != null
    ? { width: col.width, ...align }
    : { flex: col.flex ?? 1, ...align };
}

// Standard body-row chrome + zebra for data tables.
//   {rows.map((r, i) => (
//     <View style={tableRowStyle(i)}> ... </View>
//   ))}
// Layer screen-specific emphasis on top — the helper only owns base chrome+zebra:
//   <View style={[tableRowStyle(i), r.isMain && styles.highlightRow]}>
// For a fixed totals row (not part of the .map, no zebra) call tableRowStyle()
// with no index: <View style={[tableRowStyle(), styles.totalRow]}>
export function tableRowStyle(i = 0) {
  return [styles.bodyRow, i % 2 === 1 && styles.bodyRowAlt];
}

// Standard body-cell text (12px, primary colour). Alignment is intentionally
// NOT set here — it stays with the column (inline flex/align or tableColStyle),
// so left-label columns stay left and centred/right columns keep their axis.
// Layer bold / negative / chosen styles on top as usual.
export function tableCellStyle() {
  return styles.bodyCell;
}

// `dense` shrinks the header type and side padding for tables with 6+ columns,
// where 12px labels get squeezed and long words like "KiwiSaver" break mid-word.
// Body cells stay at 12px — the numbers are shorter than the headers.
export default function TableHeader({ columns = [], style, dense = false }) {
  return (
    <View style={[styles.row, dense && styles.rowDense, style]}>
      {columns.map((c, i) => (
        <Text key={i} numberOfLines={2} style={[styles.text, dense && styles.textDense, tableColStyle(c, i)]}>
          {c.label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row:  { flexDirection: 'row', backgroundColor: COLORS.navyDark, paddingVertical: 9, paddingHorizontal: 12 },
  rowDense:  { paddingHorizontal: 8 },
  text: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  textDense: { fontSize: 11 },
  bodyRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  bodyRowAlt: { backgroundColor: COLORS.bgSecondary },
  bodyCell:   { fontSize: 12, color: COLORS.textPrimary },
});
