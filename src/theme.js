// nz-calc-kit — canonical shared palette and constants.
// COLORS is the single source of truth for every app's colours.
// APP_NAME is intentionally NOT here — it is app-specific and injected per app.

export const COLORS = {
  // Navy header
  navyDark:    '#042C53',
  navyMid:     '#0C447C',
  navyLight:   '#B5D4F4',
  navySubtext: '#85B7EB',

  // Green
  green:       '#1D9E75',
  greenLight:  '#EAF3DE',
  greenDark:   '#3B6D11',
  greenBorder: '#97C459',

  // Blue
  blue:        '#378ADD',
  blueLight:   '#E6F1FB',
  blueDark:    '#185FA5',

  // Red / Orange accents
  red:         '#E24B4A',
  redLight:    '#FDECEA',
  orange:      '#E8852A',
  orangeLight: '#FEF3E8',

  // Neutrals
  white:       '#ffffff',
  bgSecondary: '#f5f5f5',
  border:      '#e0e0e0',
  textPrimary: '#111111',
  textMuted:   '#888888',
};

// Shared across all apps (override per app only if ever needed).
export const WEBSITE_URL = 'https://www.yourmoneyblueprint.co.nz/';
export const DISCLAIMER =
  'This calculator is for general information only and does not constitute personalised financial advice.';
