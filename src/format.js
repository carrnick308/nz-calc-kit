// nz-calc-kit — canonical number formatting (full NZ numbers, no K/M abbreviation).
// Keep this identical across all apps so output never drifts.

export function formatCurrency(value) {
  const n = Math.round(value || 0);
  return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-NZ');
}

// 2dp variant for prices/rates where cents matter.
export function formatCurrency2(value) {
  const n = value || 0;
  return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
