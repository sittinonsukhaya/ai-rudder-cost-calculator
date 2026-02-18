# AI Rudder Cost Calculator - Development Standards (v2.0)

## Purpose

This document locks down terminology, code standards, and design patterns to prevent drift across versions. **All labels, variable names, and UI text must follow these standards.**

## UI Terminology Standards

### Section Headers
- **"Client Operations"** (not "Global Parameters" or "Operations Data")
- **"Rates Comparison"** (not "Per-Unit Costs" or "Pricing")
- **"Additional Costs"** (not "Dynamic Ledger" or "Cost Items")
- **"Efficiency Offset"** (not "Deflection Settings" or "Savings Calculator")
- **"Client Current State"** (not "Legacy" or "Status Quo")
- **"AI Rudder Solution"** (not "Your Solution" or "New System")

### Input Labels

**Client Operations:**
- **"Total Current Agents"** — *Number of human agents handling customer interactions*
- **"Avg Monthly Salary per Agent"** — *Including benefits and overhead per agent*

**Channel Fields:**
- **"Volume"** — *Monthly interaction count for this channel*
- **"Avg Handle Time (Minutes)"** — *Average duration per human-handled interaction* (voice only)

**Rates Comparison:**
- **"Client Rate"** / **"AI Rudder Rate"** — column headers
- **"AI Handle Time (Minutes)"** — *Average duration when AI handles a voice interaction*

**Additional Costs:**
- **"Cost Name"** (not "Description" or "Item")
- **"Amount"** (not "Cost" or "Value")
- **"Frequency"** (not "Type" or "Period")

**Efficiency Offset:**
- **"AI Deflection Rate"** — *Percentage of interactions fully handled by AI without human intervention*
- **"Admin Hours Saved/Month"** — *Hours of supervisory/admin work eliminated by AI automation*
- **"Hourly Rate"** — *Cost per hour for admin/supervisory time*

### Channel Types and Billing Units
| Type | Billing Unit | Has Handle Time? |
|------|-------------|-----------------|
| Voice | per minute | Yes |
| SMS | per message | No |
| Chat | per session | No |

### Frequency Options (Additional Costs)
- **"One-time"** — CapEx (Month 0 only)
- **"Monthly"** — OpEx as-is
- **"Yearly"** — OpEx = amount / 12
- **"Per Agent"** — OpEx = amount × retainedAgents

*Removed in v2.0:* "Per Minute" and "Per Session" — now handled by the structured Rates section.

### Dashboard Metrics
- **"Initial Investment"** (not "CapEx" or "Setup Costs")
- **"Monthly Savings"** (not "OpEx Reduction" or "Monthly Benefit")
- **"Payroll Saved"** (not "Headcount Savings" or "Labor Reduction")
- **"Year 1 Net Savings"** (not "Annual Savings" or "First Year ROI")
- **"Break-Even Month"** (not "Payback Period" or "ROI Timeline")

### Efficiency Offset Display Labels
- **"Agents Replaced: X of Y"**
- **"Traffic Routed to AI: X%"**
- **"Payroll Saved: ฿X/mo"**
- **"Admin Value Reclaimed: ฿X/mo"**

### Label Descriptions
Every input label must include a subtitle in smaller, muted text explaining what the field means. These descriptions are defined in the Input Labels section above (italic text after the em-dash).

## Architecture Standards

### Module Pattern
- All JS files use **native ES Modules** (`export function`, `import { } from`)
- No `window.*` globals. No IIFEs. No global namespaces.
- Single entry point: `<script type="module" src="js/app.js">`
- Requires HTTP server to run (ES modules need CORS headers)

### Module Dependency Graph
```
app.js ──→ state.js         (getState, setState, subscribe)
       ──→ calculator.js    (all pure functions)
       ──→ storage.js       (save/load/delete/list)
       ──→ ui.js ──→ calculator.js (formatCurrency/formatNumber only)
       ──→ chart.js ──→ calculator.js (formatCurrency only)
```

### Event Handling
- **Event delegation** on container elements using `data-*` attributes
- Attribute conventions: `data-channel-id`, `data-item-id`, `data-field`, `data-action`, `data-side`, `data-rate-side`
- No inline `onclick`/`onchange` handlers in HTML templates
- `escapeHTML()` for all user-entered text rendered into templates

### State Management
- Reactive state in `state.js` with `getState()` / `setState(partial)` / `subscribe(listener)`
- `getState()` returns a deep copy (mutations don't affect internal state)
- `setState()` merges partial updates and notifies all subscribers
- `subscribe()` returns an unsubscribe function
- `resetState()` restores all defaults

### UI Patterns
- **Modal dialogs** replace `prompt()`/`alert()`/`confirm()`
- **Toast messages** for action feedback (auto-dismiss after 2.5s)
- **Validation errors** via `.field-error` class + `.error-message` element
- **Inline SVGs** replace Feather Icons CDN (only 5 icons: plus, save, folder-open, trash-2, x)

## Code Standards

### Variable Naming
- **camelCase** for all variables and functions
- **Descriptive names** - no abbreviations unless universally known
  - ✅ Good: `totalAgents`, `humanHandleTime`, `deflectionRate`, `channelCosts`
  - ❌ Bad: `vol`, `aht`, `defRate`
- **Exceptions allowed:** `html`, `id`, `ui`, `url`, `api`

### Function Naming
- **Verb + Noun** pattern
  - ✅ Good: `calculateChannelCosts`, `generateROITimeline`, `formatCurrency`, `renderChannels`
  - ❌ Bad: `getOpEx`, `monthlyCalc`, `format`

### Currency Formatting
```javascript
// Always use Intl.NumberFormat for Thai Baht
export function formatCurrency(value) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
}
```

### Input Validation
- **All numeric inputs must default to 0 if empty/invalid**
- **No NaN propagation** - handle undefined/null gracefully
- **Allow negative numbers** - used for credits/discounts
- **Prevent division by zero**

## AI Rudder Brand Standards

### Color Palette
```css
--brand-blue: #2563eb;        /* Buttons, AI costs, primary actions */
--teal-accent: #44C9C1;       /* Savings, positive metrics, success */
--dark-navy: #024F94;         /* Headings, high contrast text */
--slate-900: #111827;         /* Body text, dark text */
--client-legacy: #ef4444;     /* Red for client/legacy costs */
--savings-green: #22c55e;     /* Green for savings/benefits */
--light-sky: #f7fbff;         /* Page background */
--light-slate: #f8fafc;       /* Alternate sections */
--border-gray: #e5e7eb;       /* Light gray borders */
--muted-text: #64748b;        /* Labels, secondary text */
```

### UI Components

**Buttons:** pill shape (`border-radius: 9999px`), primary blue, hover `opacity: 0.9`

**Cards:** `border-radius: 12px`, white background, subtle shadow

**Input Fields:** `border-radius: 8px`, blue focus ring `0 0 0 4px rgba(37, 99, 235, .15)`

**Icons:** Inline SVGs, 16px for buttons, stroke-width 2

### Layout
- Left/right two-panel grid (55% / 45%)
- Right panel: `position: sticky; top: 24px` — always visible
- Responsive: stacks vertically below 1024px

## Calculation Standards

### Channel Cost Calculation
```javascript
// Voice: clientRate × volume × humanHandleTime (client)
//        aiRate × volume × aiHandleTime (AI)
// SMS:   clientRate × volume (both sides)
// Chat:  clientRate × volume (both sides)
```

### Ledger Frequency Mapping
```javascript
// One-time → CapEx only (Month 0)
// Monthly → OpEx as-is
// Yearly → OpEx = amount / 12
// Per Agent → OpEx = amount × retainedAgents
```

### Deflection Rate
- **Range:** 0% to 80% (default: 20%)
- **Applied to:** Per Agent costs only
- **Formula:** `retainedAgents = totalAgents × (1 - deflectionRate)`
- **Rounding:** `Math.ceil()` (conservative)

### Admin Hours Saved
- **Formula:** `adminValue = hoursPerMonth × hourlyRate`
- **Applied as:** Monthly credit/offset to AI costs

### Break-Even Calculation
```javascript
// First month where cumulative AI cost < cumulative Client cost
// Returns null if break-even never occurs within 24 months
```

## File Organization

```
ai-rudder-calculator/
├── index.html                 # Two-panel layout, modal/toast markup, single module entry
├── css/
│   └── styles.css             # All styles (layout, components, modal, toast, validation)
├── js/
│   ├── calculator.js          # Pure calculation functions (ES module exports)
│   ├── state.js               # Reactive state with pub/sub
│   ├── storage.js             # localStorage wrapper (ES module exports)
│   ├── ui.js                  # DOM rendering, event delegation, modals, validation
│   ├── chart.js               # Chart.js lifecycle wrapper
│   └── app.js                 # Orchestrator — wires state, UI, storage, chart
├── tests/
│   ├── calculator.test.js     # Calculator tests (channel model + ledger)
│   ├── state.test.js          # Reactive state tests
│   └── storage.test.js        # Storage round-trip tests
├── vitest.config.js           # Test configuration
├── CLAUDE.md                  # This file
├── CHANGELOG.md
├── README.md
└── package.json
```

## Testing Standards

### Test Coverage Required
- ✅ Channel cost calculations (voice, SMS, chat, multi-channel)
- ✅ Ledger frequency conversions (one-time, monthly, yearly, per-agent)
- ✅ Edge cases (zero volume, empty arrays, null values, missing rates)
- ✅ Deflection rate impact on per-agent costs
- ✅ Admin hours value calculation
- ✅ ROI timeline generation (24 months)
- ✅ Break-even detection (including null case)
- ✅ Dashboard metrics accuracy
- ✅ State reactivity (subscribe, unsubscribe, merge, reset)
- ✅ Storage round-trips (save, load, delete, list)

### Test Naming
```javascript
test('calculates voice channel costs with handle times')
test('per-agent cost scales with retained agents after deflection')
test('listener is called on setState')
test('saves a scenario successfully')
```

## Git Standards

### Commit Messages
```
feat: Add channel-based cost model
fix: Handle missing rates for channel
docs: Update CLAUDE.md for v2.0
test: Add multi-channel integration test
```

### Versioning
- **v1.0.0** - Initial release
- **v1.0.1** - ES6 module fix
- **v2.0.0** - Channel-based model, left/right layout, ES modules

---

**This document is the source of truth. When in doubt, refer here.**
