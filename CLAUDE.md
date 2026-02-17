# AI Rudder Cost Calculator - Development Standards

## Purpose

This document locks down terminology, code standards, and design patterns to prevent drift across versions. **All labels, variable names, and UI text must follow these standards.**

## UI Terminology Standards

### Section Headers
- **"Global Parameters"** (not "Operations Data" or "Volume Inputs")
- **"Operation Efficiency Offset"** (not "Deflection Settings" or "Savings Calculator")
- **"Client Current State"** (not "Legacy" or "Status Quo")
- **"AI Rudder Solution"** (not "Your Solution" or "New System")

### Input Labels

**Global Parameters:**
- **"Total Monthly Volume"** (not "Call Volume" or "Traffic Volume")
- **"Avg Human Handle Time (Minutes)"** (not "AHT" or "Avg Time")
- **"Avg AI Handle Time (Minutes)"** (not "Bot Time" or "AI AHT")
- **"Total Current Agents"** (not "Headcount" or "FTEs")
- **"Avg Monthly Salary per Agent"** (not "Payroll" or "Wage")

**Operation Efficiency Offset:**
- **"AI Deflection Rate"** (not "Automation Rate" or "Replacement %")
- **"Admin Hours Saved/Month"** (not "Time Savings" or "Admin Time Offset")
- **"Hourly Rate"** (not "$/Hour" or "Wage Rate")

**Dynamic Ledger:**
- **"Cost Name"** (not "Description" or "Item")
- **"Amount"** (not "Cost" or "Value")
- **"Frequency"** (not "Type" or "Period")
- **"Category"** (not "Tag" or "Group")

### Frequency Options
- **"One-time"** (not "1-Time" or "CapEx")
- **"Monthly"** (not "/Mo" or "Per Month")
- **"Yearly"** (not "/Yr" or "Annual")
- **"Per Minute"** (not "/Min" or "Usage-based")
- **"Per Session"** (not "/Call" or "Per Interaction")
- **"Per Agent"** (not "/Agent" or "Per User")

### Category Options
- **"Labor"** (not "Headcount" or "Personnel")
- **"Technology"** (not "Tech" or "Software")
- **"Telecom"** (not "Telephony" or "Communications")
- **"Overhead"** (not "Other" or "Misc")

### Dashboard Metrics
- **"Initial Investment"** (not "CapEx" or "Setup Costs")
- **"Monthly Savings"** (not "OpEx Reduction" or "Monthly Benefit")
- **"Payroll Saved"** (not "Headcount Savings" or "Labor Reduction")
- **"Year 1 Net Savings"** (not "Annual Savings" or "First Year ROI")
- **"Break-Even Month"** (not "Payback Period" or "ROI Timeline")

### Efficiency Offset Display Labels
- **"Agents Replaced: X of Y"** (not "Headcount Reduction" or "FTE Savings")
- **"Traffic Routed to AI: X%"** (not "Automation Coverage" or "Bot Usage")
- **"Payroll Saved: X THB/mo"** (not "Labor Cost Reduction" or "Wage Savings")
- **"Admin Value Reclaimed: X THB/mo"** (not "Efficiency Gains" or "Time Savings")

## Code Standards

### Variable Naming
- **camelCase** for all variables and functions
- **Descriptive names** - no abbreviations unless universally known
  - ✅ Good: `totalMonthlyVolume`, `averageHumanHandleTime`, `deflectionRate`
  - ❌ Bad: `vol`, `aht`, `defRate`
- **Exceptions allowed:** `html`, `id`, `ui`, `url`, `api`

### Function Naming
- **Verb + Noun** pattern
  - ✅ Good: `calculateMonthlyOpEx`, `generateROITimeline`, `formatCurrency`
  - ❌ Bad: `getOpEx`, `monthlyCalc`, `format`

### Currency Formatting
```javascript
// Always use Intl.NumberFormat for Thai Baht
const formatCurrency = (value) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
```

### Input Validation
- **All numeric inputs must default to 0 if empty/invalid**
- **No NaN propagation** - handle undefined/null gracefully
- **Allow negative numbers** - used for credits/discounts
- **Prevent division by zero**

### Comment Standards
- **Inline comments** only where logic is not self-evident
- **Function docstrings** for complex calculations
- **No obvious comments** (e.g., `// increment i` is bad)

## AI Rudder Brand Standards

### Color Palette
```css
/* Primary Colors */
--brand-blue: #2563eb;        /* Buttons, AI costs, primary actions */
--teal-accent: #44C9C1;       /* Savings, positive metrics, success */
--dark-navy: #024F94;         /* Headings, high contrast text */
--slate-900: #111827;         /* Body text, dark text */

/* Semantic Colors */
--client-legacy: #ef4444;     /* Red for client/legacy costs */
--ai-solution: #2563eb;       /* Blue for AI costs (matches brand-blue) */
--savings-green: #22c55e;     /* Green for savings/benefits */

/* Backgrounds */
--white: #ffffff;             /* Cards, panels */
--light-sky: #f7fbff;         /* Page background */
--light-slate: #f8fafc;       /* Alternate sections */

/* Borders & Text */
--border-gray: #e5e7eb;       /* Light gray borders */
--muted-text: #64748b;        /* Labels, secondary text */
```

### Typography
```css
/* Font Stack */
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Headings */
h1, h2, h3: font-weight: 600 (semibold), color: #111827
h1: text-3xl (30px)
h2: text-2xl (24px)
h3: text-xl (20px)

/* Body */
body: font-weight: 400 (normal), color: #64748b

/* Labels */
labels: font-weight: 500 (medium), color: #64748b

/* Metric Values */
.metric-value: font-weight: 600-700 (semibold/bold), large sizes
```

### UI Components

**Buttons:**
```css
border-radius: 9999px;        /* Fully rounded pills */
background: #2563eb;          /* Primary blue */
color: white;
padding: 12px 24px;
hover: opacity: 0.9;
```

**Cards/Panels:**
```css
border-radius: 12px;          /* Rounded corners */
box-shadow: 0 10px 30px -10px rgba(2, 8, 23, 0.10);
background: white;
border: 1px solid #e5e7eb;
padding: 24px;
```

**Input Fields:**
```css
border: 1px solid #e5e7eb;
border-radius: 8px;
padding: 10px 14px;
focus: 0 0 0 4px rgba(37, 99, 235, .15);  /* Blue ring */
```

**Icons:**
- Use Feather Icons (outlined, minimal, consistent stroke width)
- Icon size: 20px for buttons, 24px for headers
- Stroke width: 2px

## Calculation Standards

### Frequency Mapping
```javascript
// One-time → CapEx only (Month 0)
// Monthly → OpEx as-is
// Yearly → OpEx = amount / 12
// Per Minute → OpEx = amount × volume × handleTime
// Per Session → OpEx = amount × volume
// Per Agent → OpEx = amount × (totalAgents × (1 - deflectionRate))
```

### Deflection Rate
- **Range:** 0% to 80% (default: 20%)
- **Applied to:** Per Agent costs only
- **Formula:** `retainedAgents = totalAgents × (1 - deflectionRate)`
- **Rounding:** Use `Math.ceil()` for retained agents (conservative)

### Admin Hours Saved
- **Formula:** `adminValue = hoursPerMonth × hourlyRate`
- **Applied as:** Monthly credit/offset to AI costs
- **Display:** Separate metric showing "Admin Value Reclaimed"

### Payroll Saved
- **Formula:** `payrollSaved = agentsReplaced × monthlySalary`
- **Enhanced formula (if legacy licenses tracked):**
  `payrollSaved = agentsReplaced × (monthlySalary + legacyLicenseCost)`
- **Display:** Separate dashboard metric

### Break-Even Calculation
```javascript
// Find first month where cumulative AI cost < cumulative Client cost
// Handle case where break-even never occurs in 24 months (return null)
```

## File Organization

### Directory Structure
```
ai-rudder-calculator/
├── CLAUDE.md              # This file
├── CHANGELOG.md           # Version history
├── README.md              # Setup and usage
├── package.json           # npm config
├── .gitignore
├── index.html             # Main HTML
├── css/
│   └── styles.css         # Custom styles (overrides)
├── js/
│   ├── calculator.js      # Pure calculation functions
│   ├── ui.js              # DOM handling & events
│   └── storage.js         # localStorage wrapper
└── tests/
    └── calculator.test.js # Calculation unit tests
```

### Import Order (for future modules)
1. External libraries (Chart.js, etc.)
2. Local modules (calculator, storage, ui)
3. Styles (if using imports)

## Testing Standards

### Test Coverage Required
- ✅ All frequency conversions (one-time, monthly, yearly, per-minute, per-session, per-agent)
- ✅ Per-unit calculations with realistic volumes
- ✅ Edge cases (zero volume, empty arrays, null values)
- ✅ Deflection rate impact on per-agent costs
- ✅ Admin hours value calculation
- ✅ ROI timeline generation (24 months)
- ✅ Break-even detection (including null case)
- ✅ Dashboard metrics accuracy

### Test Naming
```javascript
// Pattern: describe what is tested, not how
test('one-time cost appears only in capex')
test('per-agent cost scales with retained agents after deflection')
test('break-even is null when AI never becomes cheaper')
```

## Git Standards

### Commit Messages
```
feat: Add per-agent frequency calculation
fix: Handle zero volume in per-minute costs
docs: Update CLAUDE.md with currency formatting
test: Add edge case tests for empty ledger
```

### Versioning
- **v1.0.0** - Initial release (this plan)
- **v1.x.x** - Patch/minor updates (bug fixes, small features)
- **v2.0.0** - Major updates (multi-workflow cards, PDF export)

### Tagging
```bash
git tag -a v1.0.0 -m "Initial release: Core calculator with save/load"
git push origin v1.0.0
```

## Future Considerations (v2.0+)

**Not in v1.0, but documented for future reference:**
- Multi-workflow cards (separate channels like Gemini V8)
- Auto-calculated agent reduction from workflow minutes
- Split-billing with bot/human SIP rates
- PDF export functionality
- Configurable timeline length (12/24/36 months)
- Category-based donut chart
- Side-by-side scenario comparison

## Changelog Maintenance

Every code change must be logged in CHANGELOG.md:
```markdown
## [1.0.1] - 2026-02-17
### Fixed
- Per-minute calculations no longer crash on empty volume

## [1.0.0] - 2026-02-17
### Added
- Initial release with core calculator
- Save/load scenario functionality
- 24-month ROI timeline chart
```

---

**This document is the source of truth. When in doubt, refer here.**
