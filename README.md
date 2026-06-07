# nz-calc-kit

Shared UI kit + helpers for the NZ calculator apps. One canonical source for the
pieces every app repeats, so they stop drifting:

- `COLORS`, `WEBSITE_URL`, `DISCLAIMER`
- `formatCurrency`, `formatCurrency2` (full en-NZ)
- `AppHeader`, `ScreenFooter`, `SectionHeader`, `InputField`, `MetricCard`

> Coming in later passes: `usePersistedState` (saved inputs), `RelatedCalculators` (cross-promo).

---

## How it's distributed (and why)

Each app depends on a **pinned version** of this repo. You edit the kit once, bump
the version, then `npm install` + rebuild each app **when you're ready** and verify on
device. You get one-place edits and no drift, but you choose when each app adopts a
change — so a bad edit can never silently break all 10 apps at once. A git
dependency installs into `node_modules` normally, so Metro resolves it with **no
special config** (unlike a local symlinked path, which would need `watchFolders`).

### One-time setup per app

1. Put this folder in its own git repo (e.g. `github.com/<you>/nz-calc-kit`) and tag a release:
   ```
   git init && git add . && git commit -m "kit v1.0.0" && git tag v1.0.0
   git remote add origin <repo-url> && git push --tags
   ```
2. In each app's `package.json`, add a pinned dependency:
   ```json
   "dependencies": {
     "nz-calc-kit": "github:<you>/nz-calc-kit#v1.0.0"
   }
   ```
   (During local dev before pushing, you can instead use `"file:../nz-calc-kit"` — that
   path *does* need `watchFolders` in `metro.config.js`; the git form does not.)
3. `npm install`, then rebuild the app.

### Adopting a kit change later

```
# in nz-calc-kit
edit files → bump version in package.json → git commit && git tag v1.1.0 && git push --tags
# in each app, when ready:
npm install nz-calc-kit@github:<you>/nz-calc-kit#v1.1.0   # then rebuild + verify on device
```

---

## Wiring it into an app with zero screen changes (the shim pattern)

Your screens already do `import AppHeader from '../components/AppHeader'`,
`import { COLORS } from '../theme'`, etc. Keep those imports exactly as they are —
just turn each local file into a thin re-export of the kit. The only app-specific
value is the app name, injected by the local `AppHeader` shim.

See the ready-to-copy files in `examples/`:

- `examples/theme.js`      → replaces each app's `src/theme.js`
- `examples/format.js`     → replaces each app's `src/utils/format.js`
- `examples/AppHeader.js`  → replaces each app's `src/components/AppHeader.js` (injects APP_NAME)
- `examples/ScreenFooter.js`, `examples/SectionHeader.js`, `examples/InputField.js`, `examples/MetricCard.js`
  → replace the matching local components

After copying the shims, set the app name in one place (`examples/theme.js`'s `APP_NAME`)
and you're done — no screen edits.

> Note: this kit covers the universally-shared primitives only. `NetWorthChart` is
> still app-local for now (the chart implementations differ between apps); folding a
> single canonical chart in is a candidate for a later version.

---

## v1.1 additions

**24px gutter standard.** `AppHeader`, `ScreenFooter` and the new `HomeHeader` all use a
24px horizontal gutter. Match it in each screen's body wrapper (`section: { marginHorizontal: 24 }`).

**`HomeHeader`** — shared home-screen header so the standard lives in one place:
```jsx
import { HomeHeader } from 'nz-calc-kit';
<HomeHeader title={APP_NAME} subtitle="Make confident NZ property investment decisions" />
```

**`usePersistedState`** — saved inputs (survives logout/restart). Drop-in for `useState`:
```jsx
import { usePersistedState } from 'nz-calc-kit';
const [inputs, setInputs] = usePersistedState('rental:buyOrInvest', DEFAULTS);
```
Use a unique key per screen, namespaced by app (`'rental:…'`, `'toolkit:…'`).

> **Prerequisite:** `usePersistedState` needs AsyncStorage. Install it once per app:
> ```
> npx expo install @react-native-async-storage/async-storage
> ```

---

## v1.2 additions

**`RelatedCalculators`** — generic cross-promo block. The relationships map lives
**per app** (each app knows its own calculators); the component just renders items:
```jsx
import { RelatedCalculators } from 'nz-calc-kit';
<RelatedCalculators items={relatedItems(thisCalcId)} onNavigate={onNavigate} />
```
where `items` is `[{ id, title, note? }]` and `onNavigate(id)` switches screens.
Place it after the body section and before `<ScreenFooter />`. Requires threading an
`onNavigate` prop from `App.js` into each screen.
