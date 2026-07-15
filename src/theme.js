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
  blueBorder:  '#93c5fd',   // intro/info callout border

  // Red
  red:         '#E24B4A',
  redLight:    '#FDECEA',
  redDark:     '#A32D2D',
  redBorder:   '#F3B0AE',

  // Orange (assumptions / sensitivity)
  orange:      '#E8852A',
  orangeLight: '#FEF3E8',
  orangeDark:  '#B45309',
  orangeBorder:'#F5C842',

  // Amber / gold (rankings, "best value" highlights — distinct from orange)
  amber:       '#F5A642',
  amberLight:  '#FFF6E5',
  amberDark:   '#7A5A00',
  amberBorder: '#FAC775',

  // Medals (podium rankings)
  gold:        '#E0A400',
  silver:      '#A7A7A7',
  bronze:      '#B87333',

  // Categorical (chart series / type tags — never status)
  purple:      '#7C3AED',
  purpleLight: '#EDE9FE',
  teal:        '#2196A8',
  tealLight:   '#E1F5F5',

  // Neutrals
  white:       '#ffffff',
  bgSecondary: '#f5f5f5',
  border:      '#e0e0e0',
  textPrimary: '#111111',
  textDark:    '#333333',
  textMuted:   '#888888',
  textFaint:   '#AAAAAA',
};

// Canonical chart-series order (replaces per-file CHART_COLORS arrays).
export const CHART_SERIES = [
  COLORS.blue, COLORS.green, COLORS.orange, COLORS.purple, COLORS.teal, COLORS.red,
];

// ── HEADER COLOUR CONVENTION (suite-wide; see colour sweep) ──────────────────
// Navy is RESERVED for structure; accents carry meaning. A scenario, sensitivity
// or extra-info header must NEVER use navy — it uses an accent below.
//   navyDark  → the primary Results header (the headline answer)
//   navyMid   → input sections ("Your Details", "Your Debts", "Shared Settings")
//   blue      → scenario grids / what-if explorers
//   green     → year-by-year / breakdown tables and positive sub-results
//   orange    → assumptions, sensitivity, and "what if X changes" sections
//   red       → warnings / negative outcomes only
// SectionHeader divider text stays UPPERCASE (kit default); table COLUMN headers
// are Title Case for readability in dense rows.

// Shared across all apps (override per app only if ever needed).
export const WEBSITE_URL = 'https://www.yourmoneyblueprint.co.nz/';
export const DISCLAIMER =
  'This calculator is for general information only and does not constitute personalised financial advice.';
