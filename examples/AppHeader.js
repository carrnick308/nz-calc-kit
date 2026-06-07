// Drop-in replacement for each app's src/components/AppHeader.js
// Injects this app's APP_NAME into the shared kit header.
import React from 'react';
import { AppHeader as KitAppHeader } from 'nz-calc-kit';
import { APP_NAME } from '../theme';

export default function AppHeader(props) {
  return <KitAppHeader appName={APP_NAME} {...props} />;
}
