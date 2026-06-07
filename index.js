// nz-calc-kit — single import surface.
//   import { COLORS, formatCurrency, AppHeader, HomeHeader, ScreenFooter, SectionHeader,
//            InputField, MetricCard, usePersistedState, RelatedCalculators } from 'nz-calc-kit';

export { COLORS, WEBSITE_URL, DISCLAIMER } from './src/theme';
export { formatCurrency, formatCurrency2 } from './src/format';

export { default as AppHeader } from './src/components/AppHeader';
export { default as HomeHeader } from './src/components/HomeHeader';
export { default as ScreenFooter } from './src/components/ScreenFooter';
export { default as SectionHeader } from './src/components/SectionHeader';
export { default as InputField } from './src/components/InputField';
export { default as MetricCard } from './src/components/MetricCard';

export { usePersistedState } from './src/hooks/usePersistedState';

// Coming in a later pass:
export { default as RelatedCalculators } from './src/components/RelatedCalculators';
