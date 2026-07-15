// nz-calc-kit/src/fire.js
// Shared FIRE + KiwiSaver maths used across the FIRE calculators (Barista, Years to FI, Coast).
// Keeping these in one place means the screens can't drift apart on the NZ rules or the FIRE test.

// ESCT (Employer Superannuation Contribution Tax) rate by income band.
// IRD thresholds in effect from 1 April 2025.
export function esctRate(income) {
  if (income <= 18720)  return 0.105;
  if (income <= 64200)  return 0.175;
  if (income <= 93720)  return 0.30;
  if (income <= 216000) return 0.33;
  return 0.39;
}

// Household annual KiwiSaver, split into the employee's OWN contribution and the employer +
// government portions. The per-person thresholds (ESCT brackets, the $180k government-
// contribution income cut-off, the $260.72 annual cap) are applied by splitting combined income
// evenly across `earners`, computing one person, then scaling back up — far closer than applying
// the thresholds once to the doubled income (the even split is an approximation for couples with
// unequal incomes). Government rules as at 1 July 2025: 25c per $1, max $260.72/person, none over
// $180k income.
export function calcKiwiSaver(preTaxIncome, employeeRate, employerRate, earners = 1) {
  if (!preTaxIncome || preTaxIncome <= 0) return { employee: 0, employerGovt: 0 };
  const n  = Math.max(1, earners);
  const pp = preTaxIncome / n;
  const employee = pp * employeeRate;
  const esct     = employee * esctRate(pp);
  const employer = (pp * employerRate) - esct;
  const govt     = pp > 180000 ? 0 : Math.min(260.72, employee * 0.25);
  return {
    employee:     Math.max(0, employee) * n,
    employerGovt: Math.max(0, employer + govt) * n,
  };
}

// Honest FIRE drawdown test, in real (today's-dollar) terms. Starting from the balances at
// `fromAge`, draw `realSpend` every year out to `horizon`. Before `ksAge` only the accessible
// (outside-KiwiSaver) pot can be spent; from `ksAge` the locked KiwiSaver pot unlocks and joins
// it. Returns true only if the money never runs out. This single test captures the pre-65 bridge,
// post-65 sustainability, AND the reality that 25× only lasts forever when the real return covers
// the withdrawal rate. Spending is taken at the start of each year; balances then grow at the
// real return.
export function fireSurvivesDrawdown({
  fromAge, accessibleReal, lockedReal, realSpend, realReturn, ksAge = 65, horizon = 100,
}) {
  let acc = accessibleReal, locked = lockedReal;
  for (let age = fromAge + 1; age <= horizon; age++) {
    if (age >= ksAge) { acc += locked; locked = 0; }
    acc -= realSpend;
    if (acc < 0) return false;
    acc *= (1 + realReturn);
    locked *= (1 + realReturn);
  }
  return true;
}
