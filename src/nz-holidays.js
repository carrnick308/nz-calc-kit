// nz-calc-kit — New Zealand public holidays.
//
// Verified 10 July 2026 against:
//   https://www.employment.govt.nz/leave-and-holidays/public-holidays/public-holidays-and-anniversary-dates
//   Te Kāhui o Matariki Public Holiday Act 2022, Schedule 1
//
// ── The one rule that matters ────────────────────────────────────────────────
// Employment NZ, for Christmas Day, Boxing Day, New Year's Day, 2 January,
// Waitangi Day AND ANZAC Day alike:
//
//   "These public holidays are observed on the actual day when they fall on a
//    weekday. When they fall on a Saturday/Sunday:
//      - If the employee would normally have worked on the Saturday/Sunday, the
//        public holiday is observed on the Saturday/Sunday.
//      - If the employee would not normally have worked on the Saturday/Sunday,
//        the public holiday is observed on the following Monday (or in some
//        cases Tuesday)."
//
// So "Mondayisation" is NOT a property of the date — it is a property of the
// EMPLOYEE'S WORKING PATTERN. The same calendar year yields a different set of
// observed dates for a Mon–Fri worker than for someone who works Saturdays.
//
// Consequence: a Mon–Fri worker always receives all 11 national holidays, every
// year, because any weekend-falling holiday transfers onto a weekday. The count
// only varies for people with fixed non-working weekdays.
//
// Only Matariki needs a lookup table. Everything else is computable.

// ── Matariki: legislated, always a Friday. Te Kāhui o Matariki Act 2022, Sch 1.
// Cross-checked against employment.govt.nz (2026: Fri 10 Jul; 2027: Fri 25 Jun).
const MATARIKI = {
  2022: '06-24', 2023: '07-14', 2024: '06-28', 2025: '06-20', 2026: '07-10',
  2027: '06-25', 2028: '07-14', 2029: '07-06', 2030: '06-21', 2031: '07-11',
  2032: '07-02', 2033: '06-24', 2034: '07-07', 2035: '06-29', 2036: '07-18',
  2037: '07-10', 2038: '06-25', 2039: '07-15', 2040: '07-06', 2041: '07-19',
  2042: '07-11', 2043: '07-03', 2044: '06-24', 2045: '07-07', 2046: '06-29',
  2047: '07-19', 2048: '07-03', 2049: '06-25', 2050: '07-15', 2051: '06-30',
  2052: '06-21',
};
export const MATARIKI_LAST_YEAR = 2052;

// ── date helpers. All dates are UTC-midnight Date objects, so no DST drift. ──
const d = (y, m, day) => new Date(Date.UTC(y, m - 1, day));
const addDays = (dt, n) => new Date(dt.getTime() + n * 86400000);
const dow = (dt) => dt.getUTCDay();              // 0 Sun … 6 Sat
const key = (dt) => dt.toISOString().slice(0, 10);

// Anonymous Gregorian computus. Returns Easter Sunday.
// Checked: 2026 → 5 Apr, 2027 → 28 Mar (matches Good Friday 3 Apr / 26 Mar).
function easterSunday(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return d(y, month, day);
}

// nth <weekday> of a month, e.g. nthDow(2026, 6, 1, 1) = 1st Monday in June.
function nthDow(y, month, weekday, n) {
  let dt = d(y, month, 1);
  while (dow(dt) !== weekday) dt = addDays(dt, 1);
  return addDays(dt, (n - 1) * 7);
}

// ── The six date-fixed holidays, in the order they must be resolved. Order
//    matters: 2 January cannot land on the Monday that 1 January already took.
const FIXED = [
  { id: 'newYear',    name: "New Year's Day",           month: 1,  day: 1  },
  { id: 'dayAfterNY', name: "Day after New Year's Day", month: 1,  day: 2  },
  { id: 'waitangi',   name: 'Waitangi Day',             month: 2,  day: 6  },
  { id: 'anzac',      name: 'ANZAC Day',                month: 4,  day: 25 },
  { id: 'christmas',  name: 'Christmas Day',            month: 12, day: 25 },
  { id: 'boxing',     name: 'Boxing Day',               month: 12, day: 26 },
];

const isWeekend = (dt) => dow(dt) === 0 || dow(dt) === 6;

/**
 * The 11 national public holidays for `year`, as OBSERVED by someone who works
 * `workDays` (a Set/array of day numbers, 0 Sun … 6 Sat).
 *
 * Returns [{ id, name, actual, observed, transferred }] sorted by observed date.
 * `transferred` is true when the pattern pushed the holiday off its actual date.
 */
export function nationalHolidays(year, workDays = [1, 2, 3, 4, 5]) {
  const works = new Set(workDays);
  const taken = new Set();
  const out = [];

  for (const h of FIXED) {
    const actual = d(year, h.month, h.day);
    let observed = actual;
    let transferred = false;

    // Transfer only if it lands on a weekend AND they don't work that day.
    if (isWeekend(actual) && !works.has(dow(actual))) {
      // The following Monday; then the next free day if that Monday is spoken for.
      observed = addDays(actual, dow(actual) === 6 ? 2 : 1);
      while (taken.has(key(observed))) observed = addDays(observed, 1);
      transferred = true;
    }
    taken.add(key(observed));
    out.push({ ...h, actual, observed, transferred });
  }

  // Always weekdays — never transferred, no "otherwise working day" test.
  const easter = easterSunday(year);
  out.push({ id: 'goodFriday', name: 'Good Friday',  actual: addDays(easter, -2), observed: addDays(easter, -2), transferred: false });
  out.push({ id: 'easterMon',  name: 'Easter Monday', actual: addDays(easter, 1),  observed: addDays(easter, 1),  transferred: false });
  out.push({ id: 'kingsBday',  name: "King's Birthday", actual: nthDow(year, 6, 1, 1), observed: nthDow(year, 6, 1, 1), transferred: false });
  out.push({ id: 'labour',     name: 'Labour Day',   actual: nthDow(year, 10, 1, 4), observed: nthDow(year, 10, 1, 4), transferred: false });

  const mat = MATARIKI[year];
  if (mat) {
    const [mm, dd] = mat.split('-').map(Number);
    out.push({ id: 'matariki', name: 'Matariki', actual: d(year, mm, dd), observed: d(year, mm, dd), transferred: false });
  }

  return out.sort((a, b) => a.observed - b.observed);
}

/** How many of the 11 national holidays land on a day this person works. */
export function nationalHolidaysWorked(year, workDays = [1, 2, 3, 4, 5]) {
  const works = new Set(workDays);
  return nationalHolidays(year, workDays).filter(h => works.has(dow(h.observed))).length;
}

// ── Regional anniversary days ────────────────────────────────────────────────
// Transcribed verbatim from the employment.govt.nz "Observed date" column on
// 10 July 2026. NOT computed: the rules resist it. Taranaki moves to the 2nd
// Monday in March to dodge Easter; Hawke's Bay to the Friday before Labour Day;
// Marlborough to the 1st Monday after Labour Day; Canterbury to the 2nd Friday
// after the first Tuesday in November (Christchurch Show Day); South Canterbury
// to the 4th Monday in September; Southland to Easter Tuesday. Otago has no
// single determinable day — employer and employee agree it.
//
// Employment NZ's own warning: "The dates below may contain unintentional
// errors. For the most reliable date, please check with your local council."
//
// ⚠️ MAINTENANCE: only the published years exist. Add the next year each January.
export const ANNIVERSARY_YEARS = [2026, 2027];
export const LATEST_ANNIVERSARY_YEAR = ANNIVERSARY_YEARS[ANNIVERSARY_YEARS.length - 1];
export const ANNIVERSARIES = {
  'Auckland':           { 2026: '01-26', 2027: '02-01' },
  'Wellington':         { 2026: '01-19', 2027: '01-25' },
  'Nelson':             { 2026: '02-02', 2027: '02-01' },
  'Taranaki':           { 2026: '03-09', 2027: '03-08' },
  'Otago':              { 2026: '03-23', 2027: '03-22' },
  'Southland':          { 2026: '04-07', 2027: '03-30' },
  'Canterbury (South)': { 2026: '09-28', 2027: '09-27' },
  "Hawke's Bay":        { 2026: '10-23', 2027: '10-22' },
  'Marlborough':        { 2026: '11-02', 2027: '11-01' },
  'Canterbury':         { 2026: '11-13', 2027: '11-12' },
  'Westland':           { 2026: '11-30', 2027: '11-29' },
  'Chatham Islands':    { 2026: '11-30', 2027: '11-29' },
};

/** The observed anniversary date for a province, or null if that year isn't published. */
export function anniversaryDate(province, year) {
  const md = ANNIVERSARIES[province] && ANNIVERSARIES[province][year];
  if (!md) return null;
  const [mm, dd] = md.split('-').map(Number);
  return d(year, mm, dd);
}

/** Total public holidays landing on a working day: nationals + anniversary. Max 12. */
export function publicHolidaysWorked(year, workDays = [1, 2, 3, 4, 5], province = null) {
  return holidayBreakdown(year, workDays, province).filter(h => h.worked).length;
}

/**
 * The full year for this person: all 11 nationals plus the regional anniversary,
 * each tagged with whether it lands on a day they work.
 *
 *   [{ id, name, actual, observed, transferred, worked, isAnniversary }]
 *
 * `worked: false` means the holiday is simply lost — a Tuesday/Thursday worker
 * misses ten of the twelve, because so many NZ holidays are Mondays.
 */
export function holidayBreakdown(year, workDays = [1, 2, 3, 4, 5], province = null) {
  const works = new Set(workDays);
  const list = nationalHolidays(year, workDays).map(h => ({
    ...h, worked: works.has(dow(h.observed)), isAnniversary: false, known: true,
  }));
  const ann = province ? anniversaryDate(province, year) : null;
  if (ann) {
    list.push({
      id: 'anniversary', name: `${province} Anniversary`,
      actual: ann, observed: ann, transferred: false,
      worked: works.has(dow(ann)), isAnniversary: true, known: true,
    });
  }
  return list.sort((a, b) => a.observed - b.observed);
}

/** Day-of-week of a holiday's observed date (0 Sun … 6 Sat). */
export const observedDow = (h) => dow(h.observed);

/**
 * What this module actually knows about `year`, so a caller never mistakes a short
 * count for a real one.
 *
 * Both gaps fail the same silent way if you don't check: ask for 2028 and the
 * regional anniversary is simply missing (11 back, not 12); ask past 2052 and
 * Matariki goes too (10 back). Nothing throws. The number just comes back low.
 *
 *   { year, matariki, anniversary, complete, found, expected, missing[] }
 */
export function holidayCoverage(year, province = null) {
  const matariki = Object.prototype.hasOwnProperty.call(MATARIKI, year);
  const anniversary = province
    ? !!(ANNIVERSARIES[province] && ANNIVERSARIES[province][year])
    : true;
  const expected = 11 + (province ? 1 : 0);
  const missing = [];
  if (!matariki) missing.push('Matariki');
  if (!anniversary) missing.push(`${province} Anniversary`);
  return {
    year, matariki, anniversary,
    complete: matariki && anniversary,
    found: expected - missing.length,
    expected, missing,
  };
}
