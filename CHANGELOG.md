# Changelog

All notable changes to the AI Rudder Cost Calculator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-17

### Added
- **Core Calculator Logic** (`js/calculator.js`)
  - Calculate retained agents after deflection with conservative rounding
  - Calculate admin hours value (hours × hourly rate)
  - Dynamic ledger totals with 6 frequency types:
    - One-time (CapEx, Month 0 only)
    - Monthly (recurring OpEx)
    - Yearly (divided by 12 for monthly)
    - Per Minute (amount × volume × handle time)
    - Per Session (amount × volume)
    - Per Agent (amount × retained agents after deflection)
  - Monthly costs calculation for both client and AI sides
  - Payroll saved calculation (agents replaced × salary)
  - 24-month ROI timeline generation with cumulative costs
  - Dashboard metrics calculation (5 key metrics)
  - Currency and number formatting for Thai Baht

- **User Interface** (`index.html`, `js/ui.js`)
  - Clean, spacious layout with AI Rudder brand colors
  - Global Parameters section (volume, handle times, agent count, salary)
  - Operation Efficiency Offset section:
    - AI Deflection Rate slider (0-80%)
    - Real-time display of agents replaced and traffic percentage
    - Admin Hours Saved calculator
    - Visual feedback for payroll saved and admin value reclaimed
  - Two-column cost comparison:
    - Client Current State (left)
    - AI Rudder Solution (right)
  - Add/remove unlimited cost items with 6 frequency options
  - Dashboard with 5 metric cards:
    - Initial Investment
    - Monthly Savings
    - Payroll Saved
    - Year 1 Net Savings
    - Break-Even Month
  - 24-month ROI timeline chart (Chart.js)
  - Real-time calculation updates on all input changes

- **Scenario Management** (`js/storage.js`)
  - Save scenarios to browser localStorage
  - Load scenarios from dropdown
  - Delete scenarios
  - List all saved scenarios
  - Export scenarios to JSON (API available)

- **Testing Infrastructure** (`tests/calculator.test.js`)
  - 44 comprehensive unit tests covering:
    - All frequency type calculations
    - Edge cases (zero values, null handling)
    - Deflection rate impact
    - Admin hours value
    - ROI timeline generation
    - Break-even detection
    - Dashboard metrics
    - Real-world scenarios
  - Test runner: Vitest
  - All tests passing ✅

- **Development Standards** (`CLAUDE.md`)
  - Locked UI terminology to prevent label drift
  - Code standards (camelCase, verb+noun functions)
  - AI Rudder brand color palette
  - Typography guidelines
  - Currency formatting standards
  - Input validation rules
  - Testing requirements

- **Documentation**
  - Comprehensive README.md with:
    - Quick start guide
    - Usage instructions
    - Frequency types explained
    - Deflection rate explanation
    - Project structure
    - Technology stack
    - Browser compatibility
    - Troubleshooting guide
    - Real-world examples
  - Inline code comments in all modules
  - Function docstrings for complex logic

- **Project Infrastructure**
  - Git repository initialized
  - package.json with npm scripts
  - .gitignore for common files
  - Directory structure (js/, css/, tests/)
  - CDN dependencies (Tailwind CSS, Chart.js, Feather Icons)

### Design Decisions

**Why vanilla JavaScript instead of React/Vue?**
- Zero build step - just open index.html in browser
- Faster testing during client meetings
- No dependency bloat
- Easier for future developers to understand

**Why localStorage instead of a database?**
- No backend required
- Works offline
- Perfect for single-user sales tool
- Easy to export/import scenarios

**Why 6 frequency types?**
- Matches how clients describe their costs in raw P&L data
- "Per Agent" handles license fees that scale with headcount
- "Per Minute" and "Per Session" handle usage-based telecom costs
- "Yearly" auto-converts annual contracts to monthly OpEx

**Why deflection rate slider (0-80%)?**
- Conservative maximum prevents unrealistic projections
- Visual feedback helps clients understand impact
- Affects "Per Agent" costs realistically
- Shows tangible headcount reduction numbers

**Why admin hours saved separate from deflection?**
- Captures "soft savings" beyond headcount reduction
- Examples: Less supervision needed, automated reporting, reduced training
- Makes efficiency gains quantifiable during sales conversations

### Known Limitations

- Single currency (Thai Baht) - internationalization planned for v2.0
- No PDF export yet - use browser Print to PDF as workaround
- No multi-workflow cards (clients with multiple channels) - v2.0 feature
- No undo/redo functionality - reload scenario if needed
- localStorage limit ~5-10MB depending on browser

### Technical Notes

- **Browser compatibility:** Chrome 90+, Firefox 88+, Safari 14+
- **Dependencies:** Tailwind CSS 3.x, Chart.js 4.x, Feather Icons
- **Test coverage:** 44 tests, 100% of calculator logic
- **Lines of code:** ~1,500 (excluding tests and docs)

---

## [Unreleased]

### Planned for v2.0
- Multi-workflow cards for clients with multiple channels
- Auto-calculated agent reduction from workflow minutes
- PDF export functionality
- Category-based donut chart for cost breakdown
- Side-by-side scenario comparison
- Configurable timeline length (12/24/36 months)
- Multi-currency support
- Undo/redo functionality

---

**Legend:**
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Vulnerability fixes
