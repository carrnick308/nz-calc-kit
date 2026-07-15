# NZ calculators — what goes out of date, and when to check it

Statutory single numbers live in **`nz-calc-kit/src/nz-constants.js`**.
This doc is the checklist: what to review, when, and exactly which screens are affected.

_Last reviewed: 2026-07-13. Screen lists verified by reading the code, not keyword search._
_Includes the Green Loan (Home Ownership) and Contractor vs Employee Rate (Income) calculators._

## How to read the two columns

- **COMPUTES** — the screen holds the number and calculates with it. **A rate change means
  the results are wrong until you edit these.** Always update every screen in this column.
- **Mentions** — the number only appears in intro text, a note, or an assumption. Results are
  unaffected; you're only updating the *wording* so it doesn't read as stale. Lower priority.

That distinction matters: e.g. "What tax code am I on" *talks about* tax brackets but never
computes with them, and Debt Recycling asks the user for their own marginal rate.

---

## A. SCHEDULED REVIEW CALENDAR

### Every 1 April

| What | COMPUTES (must update) | Notes |
|---|---|---|
| **PAYE tax brackets** | **10** — TaxOnIncome, TaxWithStudentLoan, SecondaryTax, AfterTaxReverse, TaxDollars (Income); IncomeProtection, ReturnToWork, WorkOrStudy (Toolkit); BuyRentalOrInvest, ShouldIBuyARental (Rental) | ★ Most-duplicated compute. Only changes by Budget. |
| **ACC earner levy** (rate + cap) | **7** — LifeEnergy (FIRE); TaxOnIncome, TaxWithStudentLoan, SecondaryTax, AfterTaxReverse (Income); ReturnToWork, WorkOrStudy (Toolkit) | Reset annually. **Now 1.75% / $156,641** (2026-27). Already legislated → **1.83% on 1 Apr 2027**. |
| **ACC contractor levies** (Work levy by CU + Working Safer $0.08/$100) | **1** — ContractorRate (Income) | Employers pay these for employees; contractors pay them directly. Work levy is **per Classification Unit** — the calc uses indicative bands, not a verified CU table. |
| **KiwiSaver govt contribution** ($260.72) | **7** — BaristaFIRE, YearsToFI (FIRE); ReturnToWork, WorkOrStudy (Toolkit); KiwiSaver, RetirementSavings (Retirement); **kit `fire.js`** | |
| **KiwiSaver default / employer rate** | as above + **ContractorRate** (Income) | **3.5%** from 1 Apr 2026 → **4% from 1 Apr 2028** (phased). ContractorRate applies ESCT to it. |
| **Student loan** threshold + rate | **5** — AfterTaxReverse, TaxWithStudentLoan, ContractorRate (Income); StudentLoan, WorkOrStudy (Toolkit) | ContractorRate uses the NZ-based rule (12% over threshold) only. |
| **ESCT** brackets | **3** — WorkOrStudy, ContractorRate (Income); **kit `fire.js`** (used by BaristaFIRE, YearsToFI, KiwiSaver) | Separate table from PAYE. Mostly centralised already — ContractorRate imports `esctRate` from the kit. |
| **PIR** thresholds | **3** — PIRCalculator, FundFight (Investing); TermDeposit (Toolkit) | Track the PAYE bands. |

### Every 1 July

| What | COMPUTES | Notes |
|---|---|---|
| **RCS asset thresholds** | **2** — RestHomeCare, RetirementVillage | CPI-adjusted 1 July. |
| **RCS income-from-assets exemption** | **1** — RestHomeCare | Same 1 July regulation as the thresholds. **$1,306 / $2,612 / $3,918** (single / couple both in care / couple one in care) for 2026-27. ⚠️ W&I's page lagged on this item in 2026 — verify against the **Annual Adjustment Regulations** or MSD's Map, not the public page. Gifting limits (**$8,500/yr, $42,500** 5-yr total) move in the same reg — *mention-only* in RestHomeCare's assumptions. |
| **NZ Super** rates | **2** — RestHomeCare, RetirementVillage | Also sometimes 1 Oct. *Many other retirement screens only mention it.* |
| **Rest-home max contribution rates** (per TLA) | RestHomeCare | Ministry of Health. |
| **Paid Parental Leave** max/min weekly | **1** — PaidParentalLeave | IRD adjusts to average weekly earnings. |

### After each Budget (late May)

| What | COMPUTES | Notes |
|---|---|---|
| **Government Budget allocation** | TaxDollars | New spending split every year. |
| **FamilyBoost** rate / thresholds | **1** — FamilyBoost | |
| **KiwiSaver govt contribution**, **FIF de minimis** | see above / below | Budget can move these. |

### Only when legislation changes (no fixed date)

| What | COMPUTES | Notes |
|---|---|---|
| **Statutory leave entitlements** (`NZ.employment`) | **1** — ContractorRate (Income) | Full-time: 20 days annual leave, 12 public holidays, 10 days sick. **They don't all scale the same way** — annual leave and public holidays pro-rate with days worked; **sick leave stays 10 days at any pattern**. |

### ★ Watch item — Employment Leave Bill

The **Employment Leave Bill** would repeal and replace the Holidays Act 2003, moving to
**hours-based accrual**: annual leave at 0.0769 hrs and sick leave at 0.0385 hrs per hour
worked. That **pro-rates sick leave**, reversing the fixed-10-days rule the ContractorRate
calculator relies on. Public holidays get a new "otherwise working day" test. There's a
**24-month transition period** once it passes.

**When it becomes law:** update `NZ.employment` (sick leave must scale with hours) and the
day-derivation rules in ContractorRate. Not imminent, but it invalidates a core assumption.

### When Stats NZ / RBNZ publish

| What | Screens | Cadence |
|---|---|---|
| **CPI / inflation history** | Inflation, PersonalInflation | Yearly (~Mar–Apr) — append the new figure. |
| **Household net worth** percentile bands | NetWorth | **Every 3 years — NEXT DUE 2027** (Stats NZ HES). |

---

## ★ FIF — its own watch item

**COMPUTES (5)** — FIFThresholdChecker, FDRvsCV, FDRvsCVTrades, FundFight, DividendPortfolio.
*(Rebalancing mentions FIF but holds no threshold.)* Current de minimis = **$50,000**.

**⚠️ PENDING:** Budget 2026 raises it **$50,000 → $100,000**, effective (retroactively)
**1 Apr 2026** for the 2026-27 tax year — **subject to legislation passing.** When it's law:
set `NZ.fif.deMinimis = 100000` and update those 5 screens. High priority; track the Bill.

---

## ⚠️ Known data gap — ACC Work levy by Classification Unit

The **Contractor vs Employee Rate** calculator needs a Work levy rate per occupation.
ACC sets an exact rate for each of several hundred **Classification Units (CU)**, published
in its annual Levy Guidebook. That full table was **not** sourced, so the calculator ships
with **indicative risk bands** (office ~$0.20, construction ~$2.00, forestry ~$4.00 per $100)
plus an "enter my own rate" option and a clear on-screen warning.

**To improve:** pull the CU rates from ACC's Levy Guidebook (published ~March each year) and
replace the bands with real per-occupation rates. Until then the bands must stay labelled indicative.

---

## B. AD HOC — provider & product data (no fixed date)

Only these screens hold real fee/pricing/terms **data**:

| Provider / product | Screen(s) holding DATA |
|---|---|
| **Sharesies** plans | SharesiesPlan, PlatformComparison |
| **Kernel** plans | KernelPlan, PlatformComparison |
| **YouOwn** (fee 5.95%, $1,100 one-off) | YouOwn |
| **Lifetime Home** (2.5% income, 0.23% fee, 3.5% equity/yr) | LifetimeHome |
| **Reverse mortgage** (Heartland 7.75%, age-based LVR) | ReverseMortgage |
| **Credit cards** (fees, offers, add/remove cards) | CreditCardRewards |
| **Green loan / solar bank offers** (Westpac, ANZ, ASB, BNZ, Kiwibank) | SolarPanel, **GreenLoan** — keep the two in step, they share the same preset data |
| **USD/NZD rate** used for platform fees | PlatformComparison |
| **Typical upgrade costs & indicative savings** (heat pump, insulation, glazing, battery, EV charger) | GreenLoan — starting points only, from EECA / Gen Less guidance |

> **Name-only mentions — no update needed on a fee change.** Kernel, InvestNow, Simplicity,
> Smartshares and Hatch appear in prose in FDRvsCVTrades, FundFight, DividendPortfolio and
> Rebalancing purely as examples ("PIE funds like Kernel handle FIF for you"). These only
> need editing if a provider ceases to exist or stops being a PIE provider.

**Government-set, but no fixed date** (in `nz-constants.js`):
- **RUC** (`NZ.ruc`) — COMPUTES in 2: RUCCalculator, CarOwnership. Watch NZTA.
- **DTI** (`NZ.dti`) — COMPUTES in 2: DebtToIncome, DebtToIncomeInvestor. Watch RBNZ.
  *(MaxMortgageRate and HowMuchHouseCanIAfford only mention DTI in prose.)*

---

## Duplication ranking — by COMPUTES (update-risk order)

1. **PAYE tax brackets — 10 screens** ★
2. **ACC earner levy — 7** · **KiwiSaver govt contribution — 7**
3. **FIF de minimis — 5** · **Student loan — 5**
4. **PIR — 3** · **ESCT — 3**
5. NZ Super, RCS, DTI, RUC — 2 each
6. PPL, FamilyBoost, ACC contractor levies, statutory leave — 1 each

---

## How updates work (plain version)

Every COMPUTES number is currently typed into each screen listed, so a change means editing
**every** screen in that row. Once the screens are wired to `nz-constants.js` (a post-launch
job), those become one-line updates. Company fee tables and datasets (CPI history, net-worth
bands, Budget split, provider plans) stay per-screen by nature. Adding the constants file
changes nothing on screen until we connect it up.
