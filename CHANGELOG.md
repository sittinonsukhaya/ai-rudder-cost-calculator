# Changelog

All notable changes to the AI Rudder Cost Calculator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-02-18

### Added
- **Bilingual Language Toggle** — Switch between English and Thai (EN/TH) via header toggle
- **i18n Module** (`js/i18n.js`) — Translation system with locale-aware string lookup
- All UI labels, section headers, tooltips, and descriptions fully translated to Thai
- Language preference saved to localStorage and restored on reload

### Changed
- `ui.js`, `app.js`, `chart.js`, `calculator.js` — Updated to use i18n string lookups
- `index.html` — Added language toggle button in header
- `css/styles.css` — Styling for language toggle component
- Test count: 83 tests across 3 test files

## [2.0.0] - 2026-02-17

### Added
- **Channel-Based Cost Model** — Voice (per minute), SMS (per message), Chat (per session)
  - Dynamic channel cards: add/remove channels with type dropdown
  - Each channel has volume and optional handle time (voice only)
  - Rates Comparison section auto-populated from channels
  - `calculateChannelCosts()` function for structured rate calculations
- **Left/Right Two-Panel Layout**
  - Input panel (55% width) scrollable on the left
  - Output panel (45% width) with `position: sticky` on the right
  - Dashboard metrics + ROI chart always visible while editing inputs
  - Responsive: stacks vertically below 1024px
- **ES Module Architecture**
  - All JS files converted to native ES Modules
  - `state.js` — Reactive state with pub/sub (`getState/setState/subscribe/resetState`)
  - `chart.js` — Chart.js lifecycle wrapper
  - `app.js` — Orchestrator wiring all modules
  - Single `<script type="module">` entry point
- **Modal Dialogs** — Replace `prompt()`/`alert()`/`confirm()` with proper modal UI
- **Toast Notifications** — Auto-dismissing feedback messages for save/load/delete
- **Input Validation** — Red border + error message on invalid fields
- **Label Descriptions** — Every input has a muted subtitle explaining what it means
- **Inline SVGs** — Replaced Feather Icons CDN dependency (~75KB removed)
- **New Test Suites**
  - `state.test.js` — 16 tests for reactive state
  - `storage.test.js` — 14 tests for localStorage operations
  - Total: 78 tests across 3 test files
- **Vitest Configuration** — `vitest.config.js` added

### Changed
- **Section Reorganization** — Input sections reordered for natural sales flow:
  1. Client Operations (agents, salary, channels)
  2. Rates Comparison (auto-populated from channels)
  3. Additional Costs (simplified ledger)
  4. Efficiency Offset (deflection, admin hours)
- **`calculateMonthlyCosts()`** — Now accepts channels, rates, and aiHandleTime parameters
- **`calculateLedgerTotals()`** — Simplified to 4 frequency types (removed per-minute, per-session)
- **Calculator tests** — Rewritten for new channel model (48 tests, up from 44)
- **Styling** — All styles in `css/styles.css` (no more inline `<style>` block)

### Removed
- Tailwind CSS CDN dependency
- Feather Icons CDN dependency
- `test-ui.html` verification page
- `PROGRESS.md` (replaced by CHANGELOG)
- Global namespace pattern (`window.AIRudder`, `window.AIRudderStorage`, `window.AIRudderUI`)
- "Per Minute" and "Per Session" frequency options from Additional Costs ledger
- "Category" field from cost items (was never used)
- "Total Monthly Volume" global field (replaced by per-channel volumes)
- "Avg Human Handle Time" global field (replaced by per-channel handle time)
- "Avg AI Handle Time" global field (moved to Rates section, shared for voice)

## [1.0.1] - 2026-02-17

### Fixed
- **CRITICAL BUG:** Converted ES6 modules to global namespaces to fix CORS issues with file:// protocol

### Added
- `test-ui.html` - Namespace verification test page
- `PROGRESS.md` - Project checkpoint documentation

### Verified
- All 44 unit tests passing after conversion
- Application works with both file:// and http:// protocols

## [1.0.0] - 2026-02-17

### Added
- Core calculator logic with 6 frequency types
- User interface with global parameters, deflection slider, cost comparison
- Scenario save/load/delete via localStorage
- 24-month ROI timeline chart (Chart.js)
- 44 unit tests (Vitest)
- Development standards (CLAUDE.md)
- Documentation (README.md)

---

**Legend:**
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Removed` - Removed features
- `Fixed` - Bug fixes
