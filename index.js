// nz-calc-kit — single import surface.
//   import { COLORS, formatCurrency, formatCompact, AppHeader, HomeHeader, ScreenFooter,
//            SectionHeader, InputField, MetricCard, usePersistedState, RelatedCalculators } from 'nz-calc-kit';

export { COLORS, WEBSITE_URL, DISCLAIMER } from './src/theme';
export { calloutText } from './src/calloutText';
export { formatCurrency, formatCurrency2, formatCompact, formatPct, formatAxis } from './src/format';

export { default as AppHeader } from './src/components/AppHeader';
export { default as HomeHeader } from './src/components/HomeHeader';
export { default as ScreenFooter } from './src/components/ScreenFooter';
export { default as SectionHeader } from './src/components/SectionHeader';
export { default as InputField } from './src/components/InputField';
export {
  BaseField, MoneyInput, RateInput, IntInput, SignedRateInput, NumberInput, TextField, DenseField,
} from './src/components/fields';
export { default as MetricCard } from './src/components/MetricCard';
export { default as ResultCard } from './src/components/ResultCard';
export { default as NetWorthChart } from './src/components/NetWorthChart';
export { default as RemoveButton } from './src/components/RemoveButton';
export { default as AddButton } from './src/components/AddButton';
export { default as IntroBox } from './src/components/IntroBox';
export { default as NoteBox } from './src/components/IntroBox';
export { default as TableHeader, tableColStyle, tableRowStyle, tableCellStyle } from './src/components/TableHeader';
export { default as ProgressBar } from './src/components/ProgressBar';

export { usePersistedState } from './src/hooks/usePersistedState';

export { esctRate, calcKiwiSaver, fireSurvivesDrawdown } from './src/fire';

export { NZ, MAINTENANCE_CALENDAR, LAST_REVIEWED } from './src/nz-constants';

export {
  nationalHolidays, nationalHolidaysWorked, publicHolidaysWorked, holidayBreakdown,
  anniversaryDate, holidayCoverage, ANNIVERSARIES, ANNIVERSARY_YEARS,
  LATEST_ANNIVERSARY_YEAR, MATARIKI_LAST_YEAR,
} from './src/nz-holidays';

export { default as RelatedCalculators } from './src/components/RelatedCalculators';
