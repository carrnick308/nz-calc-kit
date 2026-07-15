// nz-calc-kit — canonical number formatting. Single source of truth for the whole suite.
//
// TWO-TIER RULE (see SUITE-CONSISTENCY-AUDIT.md §A):
//   • formatCurrency  → full en-NZ, no abbreviation. Use for ALL headline / result-card values.
//   • formatCompact   → full en-NZ below a threshold, then M / B / T. Use ONLY inside dense table
//                        cells (paired with numberOfLines={1}) where a 9-digit value would wrap and
//                        break the layout on extreme inputs.
// Never abbreviate a headline. Never leave a wide table cell un-guarded.

// ── Headline / result-card formatter: full en-NZ, rounded, sign-aware ───────────
export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  const n = Math.round(value);
  return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-NZ');
}

// ── 2dp variant for prices / rates where cents matter ───────────────────────────
export function formatCurrency2(value) {
  const n = value || 0;
  return (n < 0 ? '-$' : '$') +
    Math.abs(n).toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Table-cell formatter: full below `fullBelow`, then M / B / T ────────────────
// Notation is fixed for the whole suite: uppercase M/B/T, up to 2 dp with trailing
// zeros stripped, en-NZ separators in the full range, ASCII '-' for negatives.
// No "K" tier — sub-$1M values fit one line in full, so K is unnecessary and removes
// the K/k ambiguity that had crept across screens.
//
//   fullBelow = 1_000_000 (default — most tables):
//     formatCompact(950000)    → "$950,000"     formatCompact(1234567) → "$1.23M"
//     formatCompact(42000000)  → "$42M"          formatCompact(-1500000) → "-$1.5M"
//   fullBelow = 1e7 (month-by-month schedule tables — keep per-row precision longer):
//     formatCompact(9500000, 1e7)  → "$9,500,000"   formatCompact(12000000, 1e7) → "$12M"
export function formatCompact(value, fullBelow = 1_000_000) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const neg = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  if (abs < fullBelow) return neg + '$' + Math.round(abs).toLocaleString('en-NZ');
  const strip = (x) => x.toFixed(2).replace(/\.?0+$/, '');
  // Clamp beyond trillions. Without this, 1e18 renders as "$1000000T" and the string
  // grows without bound, spilling out of result cards. No real figure in these
  // calculators exceeds a trillion, so a clamped display is honest and safe.
  if (abs >= 1e15) return neg ? '<-$999T' : '>$999T';
  if (abs >= 1e12) return neg + '$' + strip(abs / 1e12) + 'T';
  if (abs >= 1e9)  return neg + '$' + strip(abs / 1e9)  + 'B';
  if (abs >= 1e6)  return neg + '$' + strip(abs / 1e6)  + 'M';
  return neg + '$' + Math.round(abs).toLocaleString('en-NZ'); // fullBelow < $1M edge
}

// ── Chart-axis tick formatter: ALWAYS short, k / M / B / T, 1 dp ────────────────
// For the narrow axis gutter, where even mid-size values must stay one short token.
// Rolls all the way to B/T so billions/trillions never bleed onto two lines.
//   formatAxis(500000)     → "$500k"     formatAxis(1500000)   → "$1.5M"
//   formatAxis(1.5e9)      → "$1.5B"     formatAxis(2.3e12)    → "$2.3T"
export function formatAxis(value) {
  const neg = value < 0 ? '-' : '';
  const a = Math.abs(value || 0);
  const strip = (x) => x.toFixed(1).replace(/\.0$/, '');
  if (a >= 1e12) return neg + '$' + strip(a / 1e12) + 'T';
  if (a >= 1e9)  return neg + '$' + strip(a / 1e9)  + 'B';
  if (a >= 1e6)  return neg + '$' + strip(a / 1e6)  + 'M';
  if (a >= 1e3)  return neg + '$' + Math.round(a / 1e3) + 'k';
  return neg + '$' + Math.round(a);
}
