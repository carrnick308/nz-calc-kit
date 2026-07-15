// ============================================================================
// nz-constants.js — SINGLE SOURCE OF TRUTH for volatile NZ figures
// ----------------------------------------------------------------------------
// Every rate, threshold, benefit amount and levy that changes over time lives
// here, once. Screens import these instead of hard-coding, so an annual update
// is a one-line change in this file — pushed to every app via nz-calc-kit — not
// a hunt through dozens of screens where copies can drift out of sync.
//
// Each value carries:  its number, the date it took effect, the official source,
// and when to review it next.  When you update a value, update its `effective`
// and `source` too, and bump `LAST_REVIEWED` at the bottom.
//
// Verified current for 2026/27 as at July 2026. See MAINTENANCE_CALENDAR below.
// ============================================================================

export const NZ = {

  // ── PAYE income tax brackets ──────────────────────────────────────────────
  // effective: 1 Apr 2025 (Budget 2024 thresholds, full-year). Unchanged for 2026-27.
  // source: https://www.ird.govt.nz/income-tax/income-tax-for-individuals/tax-codes-and-tax-rates-for-individuals
  // review: 1 April yearly, and after any Budget (late May).
  taxBrackets: [
    { upTo: 15600,    rate: 0.105 },
    { upTo: 53500,    rate: 0.175 },
    { upTo: 78100,    rate: 0.30  },
    { upTo: 180000,   rate: 0.33  },
    { upTo: Infinity, rate: 0.39  },
  ],

  // ── ACC earner levy ───────────────────────────────────────────────────────
  // effective: 1 Apr 2026 (2026-27 levy year). Rate rose from 1.67%; cap from $152,790.
  // Already legislated to rise again to 1.83% on 1 Apr 2027.
  // source: https://www.acc.co.nz/for-business/understanding-levies-if-you-work-or-own-a-business/
  // review: 1 April yearly (levy rate + cap are reset annually).
  acc: {
    earnerLevyRate: 0.0175,   // 1.75% of gross, GST-inclusive (2026-27)
    maxEarnings:    156641,   // levy cap; max annual levy = $2,741.22
    // History: 2024-25 = 1.60% / $142,283 · 2025-26 = 1.67% / $152,790 · 2027-28 = 1.83%
    // The regulations express this excl GST ($1.52 per $100); IRD publishes the
    // GST-inclusive rate (1.75%), which is what PAYE actually deducts.
    earnerLevyRateExclGst: 0.0152,

    // ── Self-employed / contractors pay THREE levies ────────────────────────
    // Earner's (above, same as employees) + Work levy (by Classification Unit)
    // + Working Safer levy. An EMPLOYER pays the latter two for its employees,
    // so they are the levies a contractor newly picks up.
    workingSaferRate: 0.0008,   // $0.08 per $100 of liable earnings (flat, for WorkSafe NZ)

    // Work levy varies by ACC Classification Unit (CU) — hundreds of them.
    // ⚠️ NOT a verified per-CU table. Office-based work sits around $0.10–$0.30
    // per $100; construction and forestry are $1.50+ per $100. ContractorRate
    // uses indicative risk bands and lets the user enter their exact CU rate.
    // To verify a CU rate: ACC levy guidebook, or MyACC for Business.
    workLevyIsPerCU: true,

    // Standard cover is CoverPlus. CoverPlus Extra (CPX) lets a self-employed
    // person agree a fixed level of weekly compensation for a different levy.
    // source: https://www.acc.co.nz/for-business/understanding-your-cover-options/types-of-cover-for-self-employed
  },

  // ── Student loan ──────────────────────────────────────────────────────────
  // effective: 2026 tax year (1 Apr 2025 – 31 Mar 2026 threshold; carries to 2026-27).
  // source: https://www.ird.govt.nz/student-loans
  // review: 1 April yearly (threshold), and after any Budget (rate/overseas rate).
  studentLoan: {
    annualThreshold: 24128,   // repay 12% of income over this (NZ-based)
    repaymentRate:   0.12,
    overseasInterestRate: 0.056,  // 5.6% p.a. from 1 Apr 2026, overseas-based borrowers
    // Overseas-based fixed annual minimum repayments by loan balance:
    overseasMinRepayments: [
      { upTo: 15000,    annual: 1000 },
      { upTo: 30000,    annual: 2000 },
      { upTo: 45000,    annual: 3000 },
      { upTo: 60000,    annual: 4000 },
      { upTo: Infinity, annual: 5000 },
    ],
  },

  // ── Statutory employment entitlements ─────────────────────────────────────
  // Paid days an employee receives but does not work. Used to work out how many
  // days a contractor can actually invoice (ContractorRate).
  // Annual leave: Holidays Act 2003, 4 weeks after 12 months.
  // Sick leave: 10 days from 24 Jul 2021 (was 5).
  // Public holidays: 11 national + 1 regional anniversary = 12.
  // source: https://www.employment.govt.nz/leave-and-holidays/
  // review: only when legislation changes (ad hoc, not annual).
  employment: {
    // ⚠️ These DAY counts assume a 5-day week. They do NOT all scale the same way:
    //   annual leave    — 4 WEEKS, so scales with days worked per week
    //   public holidays — only paid if they fall on an "otherwise working day", so scales
    //   sick leave      — 10 days a year REGARDLESS of working pattern. NOT pro-rated.
    annualLeaveWeeks:   4,
    annualLeaveDays:   20,   // 4 weeks x 5 days (full-time)
    publicHolidays:    12,   // 11 national + regional anniversary (full-time)
    sickLeaveDays:     10,   // fixed at every working pattern
    workDaysPerYear:  260,   // 52 weeks x 5 days (full-time)
    get paidDaysOff() { return this.annualLeaveDays + this.publicHolidays + this.sickLeaveDays; },

    // Helpers for part-time patterns (ContractorRate uses these rules).
    leaveDaysFor:  (daysPerWeek) => 4 * daysPerWeek,
    publicDaysFor: (daysPerWeek) => Math.round(12 * daysPerWeek / 5),
    workDaysFor:   (daysPerWeek) => Math.round(52 * daysPerWeek),

    // ⚠️ PENDING: the Employment Leave Bill would repeal the Holidays Act 2003 and move to
    //    HOURS-BASED ACCRUAL — annual leave at 0.0769 hrs and sick leave at 0.0385 hrs per
    //    hour worked, which PRO-RATES sick leave (reversing the fixed-10 rule above). A new
    //    "otherwise working day" test applies to public holidays. 24-month transition once
    //    passed. When it lands, sickLeaveDays must scale with hours.
    //    source: https://www.legislation.govt.nz/bill/government/2026/259/en/latest/
  },

  // ── KiwiSaver ─────────────────────────────────────────────────────────────
  // source: https://www.ird.govt.nz/kiwisaver
  kiwiSaver: {
    // Government contribution: 25c per $1, capped. HALVED on 1 Jul 2025 (was $521.43).
    // Not paid on income over $180,000. effective: 1 Jul 2025. review: after each Budget.
    govtContributionRate: 0.25,
    govtContributionMax:  260.72,
    govtContributionIncomeCutoff: 180000,   // no govt contribution above this income
    // Default contribution rate: stepped up from 3% to 3.5% on 1 Apr 2026, and
    // rises again to 4% on 1 Apr 2028 (phased, per Budget 2025). Employees may
    // apply to IRD for a temporary reduction back to 3%.
    // effective: 1 Apr 2026.  review: 1 April yearly (next step 1 Apr 2028).
    defaultEmployeeRate:  0.035,
    minEmployerRate:      0.035,   // compulsory employer contribution (CEC)
    // ESCT (Employer Superannuation Contribution Tax) — taxes the EMPLOYER's contribution.
    // These are a SEPARATE table from the PAYE brackets. effective: 1 Apr 2025.
    // source: https://www.ird.govt.nz/employing-staff/deductions-from-other-payments/employer-superannuation-contribution-tax
    // review: 1 April yearly. Currently implemented in nz-calc-kit/src/fire.js (esctRate).
    esctBrackets: [
      { upTo: 18720,    rate: 0.105 },
      { upTo: 64200,    rate: 0.175 },
      { upTo: 93720,    rate: 0.30  },
      { upTo: 216000,   rate: 0.33  },
      { upTo: Infinity, rate: 0.39  },
    ],
  },

  // ── NZ Superannuation ─────────────────────────────────────────────────────
  // effective: 1 Apr 2026.  source: https://www.workandincome.govt.nz/products/benefit-rates/benefit-rates-april-2026.html
  // review: 1 April yearly (and sometimes 1 October).  Rates are after-tax at code M.
  nzSuper: {
    singleLivingAloneWeekly: 555.15,   // single, living alone
    singleLivingAloneAnnual: 28868,    // = weekly * 52 (rounded)
    // Add couple / sharing rates here when a screen needs them.
    personalAllowanceInCareWeekly: 58.34,  // kept when in residential care
    clothingAllowanceInCareAnnual: 365.92,
  },

  // ── FamilyBoost (ECE rebate) ──────────────────────────────────────────────
  // effective: quarters from 1 Jul 2025 (40% / $1,560).  Confirmed current 2026/27.
  // source: https://www.ird.govt.nz/familyboost
  // review: after each Budget (late May).
  familyBoost: {
    eceRate:        0.40,     // 40% of ECE fees
    maxPerQuarter:  1560,
    lowerThresholdQuarterly: 35000,  // below: straight 40% up to max
    upperThresholdQuarterly: 57286,  // above: not eligible
    taperRate:      0.07,     // abatement per $ of quarterly income over lower threshold
  },

  // ── Residential Care Subsidy (RCS) — thresholds, income exemption, gifting ──
  // effective: 1 Jul 2026.  All items below are adjusted together each 1 July by the
  // RCDSS (Annual Adjustment of Applicable Asset Thresholds and Income-from-assets
  // Exemption) Regulations.
  // source: https://www.workandincome.govt.nz/products/a-z-benefits/residential-care-subsidy.html
  // ⚠️ The W&I page can lag on the income exemption — its 30 Jun 2026 refresh updated the
  //    asset/gifting figures but left the old exemption paragraph. If it disagrees with the
  //    year's Annual Adjustment Regulations or MSD's Map manual, the regulation wins.
  // review: 1 July yearly (CPI-adjusted).
  rcs: {
    assetThresholdSingleOrBothInCare: 300811,   // single, or couple both in care
    assetThresholdCoupleOneInCare:    164731,   // couple, one in care, excl. home & vehicle
    // Income-from-assets exemption (annual $) — COMPUTES in RestHomeCare's income test.
    incomeExemptSingle:      1306,    // single
    incomeExemptCoupleBoth:  2612,    // couple, both in care
    incomeExemptCoupleOne:   3918,    // couple, one in care
    // Allowable gifting (mention-only, RestHomeCare assumptions text).
    giftingInPeriodPerYear:  8500,    // per couple, each of the 5 yrs before applying
    giftingInPeriodTotal:    42500,   // 5-yr total ($85,000 if both partners apply together)
    giftingPrePeriodPerYear: 27000,   // per couple, before the 5-yr window (not CPI-indexed)
  },

  // ── Road User Charges (RUC) ───────────────────────────────────────────────
  // NZTA-set, $ per 1,000 km, GST incl. Change when NZTA revises (no fixed date).
  // source: https://www.nzta.govt.nz/vehicles/vehicle-registration-and-licensing/road-user-charges-ruc/
  // review: watch for NZTA announcements (ad hoc).
  ruc: {
    lightPer1000km:      76,   // light diesel & full EV (2-axle, up to 3,500 kg)
    phevPetrolPer1000km: 38,   // plug-in petrol hybrid
    // Heavier diesel rates vary by weight band — kept as a table in RUCCalculatorScreen.
  },

  // ── Debt-to-income (DTI) caps ─────────────────────────────────────────────
  // Reserve Bank (RBNZ) rule, effective 1 July 2024. Changes when RBNZ adjusts.
  // source: https://www.rbnz.govt.nz/regulation-and-supervision/banks/macro-prudential-policy
  // review: watch for RBNZ announcements (ad hoc).
  dti: {
    ownerOccupierMultiple: 6,   // most home-loan borrowing capped at 6× gross income
    investorMultiple:      7,   // 7× for investors
  },

  // ── FIF (Foreign Investment Fund) ─────────────────────────────────────────
  // de minimis threshold = total NZD COST of direct overseas shares/ETFs (not market value).
  // source: https://www.ird.govt.nz/international-tax/individuals/foreign-investment-funds-fifs
  // ⚠️ PENDING CHANGE: Budget 2026 raises this from $50,000 to $100,000, effective
  //    (retroactively) 1 Apr 2026 for the 2026-27 tax year — SUBJECT TO LEGISLATION
  //    PASSING. Once it's law, change deMinimis to 100000 and update the 5 FIF screens
  //    (FIFThresholdChecker, FDRvsCV, FDRvsCVTrades, FundFight, DividendPortfolio).
  // review: high priority — watch for the Bill passing, then 1 April yearly.
  fif: {
    deMinimis:  50000,   // ⚠️ becomes 100000 once Budget 2026 legislation passes
    fdrRate:    0.05,    // Fair Dividend Rate: deemed 5% of opening value
  },

  // ── PIR (Prescribed Investor Rate) for PIE income ─────────────────────────
  // Based on taxable income (+ PIE income) in either of the last two tax years.
  // Test thresholds track the PAYE bands. source: https://www.ird.govt.nz/roles/portfolio-investment-entities/using-prescribed-investor-rates
  // review: 1 April yearly (thresholds move with the PAYE bands).
  pir: {
    // Two-tier test. 10.5% needs taxable income <= incomeThresholdLow AND income+PIE <= combinedLow.
    // 17.5% needs taxable income <= combinedLow AND income+PIE <= combinedHigh. Otherwise 28%.
    // Both combined figures are needed to place the top tier; the mid figure ($78,100) tracks the
    // PAYE 30% band edge and was previously missing here.
    rates: [0.105, 0.175, 0.28],
    incomeThresholdLow:   15600,   // taxable income <= this ...
    combinedLow:          53500,   // ... AND income + PIE <= this  -> 10.5%; and the 17.5% income test
    combinedHigh:         78100,   // 17.5% needs income + PIE <= this; above it (with the income test) -> 28%
  },

  // ── Paid Parental Leave (PPL) ─────────────────────────────────────────────
  // effective: 1 Jul 2026 – 30 Jun 2027.  source: https://www.ird.govt.nz/paid-parental-leave
  // review: 1 July yearly (IRD adjusts to average weekly earnings).
  paidParentalLeave: {
    maxWeekly:        811.05,   // employee & self-employed cap
    minWeeklySelfEmp: 239.50,   // self-employed floor
  },

  // ── Suite-wide default assumptions (harmonised convention) ────────────────
  // Not statutory — these are the app's default "e.g." values, kept consistent
  // across every calculator. review: whenever the harmonised convention changes.
  defaults: {
    inflation:        2.5,   // general / spend inflation / wage growth / fee increase (%)
    propertyGrowth:   3.0,   // house / property growth (%)
    returnNominal:    7.0,   // investment return, nominal (%)
    returnReal:       5.0,   // investment return, real (%)
    mortgageRate:     6.0,   // (%)
    swr:              4.0,   // safe withdrawal rate (%)
    premiumIncrease:  3.0,   // insurance premium increase (%)
  },
};

// ============================================================================
// MAINTENANCE_CALENDAR — what changes when, and where it lives.
// Use this as the annual checklist. Each entry: when to check, what to verify,
// which NZ.* keys it touches.
// ============================================================================
export const MAINTENANCE_CALENDAR = [
  {
    when: '1 April (yearly)',
    check: [
      'PAYE brackets (NZ.taxBrackets) — usually stable, changes only by Budget.',
      'ACC earner levy rate + cap (NZ.acc) — reset annually.',
      'Student loan repayment threshold (NZ.studentLoan.annualThreshold).',
      'NZ Super rates (NZ.nzSuper) — adjusted 1 April (sometimes also 1 Oct).',
      'KiwiSaver default/employer rates (NZ.kiwiSaver.defaultEmployeeRate, minEmployerRate).',
    ],
  },
  {
    when: '1 July (yearly)',
    check: [
      'RCS asset thresholds, income-from-assets exemption & gifting limits (NZ.rcs) — all',
      '  CPI-adjusted every 1 July by the annual adjustment regulations. ⚠️ Verify the',
      '  exemption against the regulation or MSD Map, not the W&I page (it lagged in 2026).',
      'Rest-home maximum contribution rates (per-TLA; in RestHomeCareScreen, not yet centralised).',
      'Paid Parental Leave max/min weekly (NZ.paidParentalLeave) — IRD adjusts to average weekly earnings.',
    ],
  },
  {
    when: 'After each Budget (late May)',
    check: [
      'KiwiSaver government contribution (NZ.kiwiSaver.govtContributionMax).',
      'FamilyBoost rate/thresholds (NZ.familyBoost).',
      'Working for Families amounts (if/when a screen uses them).',
      'Any one-off or temporary measures announced.',
    ],
  },
  {
    when: 'January (yearly)',
    check: [
      'Regional anniversary dates for the new year (nz-holidays.js: ANNIVERSARIES, ANNIVERSARY_YEARS).',
      '  Source: employment.govt.nz "Public holidays and anniversary dates". Transcribe the',
      '  Observed date column for all 12 provinces, then add the year to ANNIVERSARY_YEARS.',
      '  Nothing else needs touching: the 10 other nationals are computed, and Matariki is',
      '  legislated to 2052 (Te Kahui o Matariki Public Holiday Act 2022, Schedule 1).',
      '  Without this, holidayCoverage() reports the year incomplete and the year picker',
      '  will not offer it.',
    ],
  },
  {
    when: 'Ad hoc (no fixed date)',
    check: [
      'Product pricing that lives in a single screen (Sharesies, Kernel, YouOwn, Lifetime Home, credit-card offers, power/term-deposit example rates). These are contained per screen — update the data object in that screen.',
    ],
  },
];

// When you review/update anything above, bump this date.
export const LAST_REVIEWED = '2026-07-13';
