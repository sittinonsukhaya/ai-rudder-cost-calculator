# AI Rudder Cost Calculator

Interactive ROI calculator for collaborative sales sessions comparing call center costs vs AI Rudder's conversational AI solution.

## Overview

This calculator is designed for **live client meetings** where sales representatives sit with clients to compare their current call center costs against AI Rudder's solution. It acts as a financial discovery tool that exposes hidden operational costs and demonstrates ROI in real-time.

### Key Features

- **Channel-Based Cost Model** — Voice (per minute), SMS (per message), Chat (per session) with per-channel rates
- **Left/Right Layout** — Input panel on the left, sticky dashboard + chart on the right
- **Rates Comparison** — Side-by-side client vs AI rates auto-populated from channels
- **Additional Costs Ledger** — Unlimited cost items with 4 frequency types (one-time, monthly, yearly, per-agent)
- **Efficiency Offset** — AI deflection rate slider (0-80%) and admin hours saved
- **Real-time Visualization** — 24-month ROI timeline chart updates instantly
- **Dashboard Metrics** — Initial investment, monthly savings, payroll saved, year 1 net savings, break-even month
- **Scenario Management** — Save/load/delete via modal dialogs with toast feedback
- **ES Module Architecture** — Clean module boundaries, reactive state, event delegation

## Quick Start

1. **Install dependencies** (only needed for running tests):
   ```bash
   npm install
   ```

2. **Start a local server** (required for ES modules):
   ```bash
   npm run serve
   # Open http://localhost:8000
   ```

3. **Run tests** (optional):
   ```bash
   npm test              # Run once (78 tests)
   npm run test:watch    # Watch mode
   ```

## Usage Guide

### Workflow

1. **Client Operations** — Set agent count, salary, and add channels (Voice, SMS, Chat) with volumes
2. **Rates Comparison** — Enter per-unit rates for both client and AI Rudder sides
3. **Additional Costs** — Add other operating costs (CRM licenses, platform fees, etc.)
4. **Efficiency Offset** — Adjust deflection rate slider, enter admin hours saved
5. **Review** — Dashboard and chart update in real-time on the right panel
6. **Save** — Save scenario via modal dialog for later use

### Channel Types

| Type | Billing Unit | Example |
|------|-------------|---------|
| **Voice** | per minute | SIP/telephony costs, handle time matters |
| **SMS** | per message | SMS gateway costs |
| **Chat** | per session | Chat platform costs per conversation |

### Frequency Types (Additional Costs)

| Frequency | Calculation |
|-----------|------------|
| **One-time** | CapEx — added to Month 0 only |
| **Monthly** | OpEx — added as-is |
| **Yearly** | OpEx — divided by 12 |
| **Per Agent** | OpEx — multiplied by retained agents after deflection |

### Deflection Rate

Represents the percentage of interactions fully handled by AI:

- **0%** = No AI deflection, all agents retained
- **20%** (default) = AI handles 20%, 80% of agents retained
- **80%** (max) = AI handles 80%, 20% of agents retained

Affects "Per Agent" costs and shows agents replaced, payroll saved.

## Project Structure

```
ai-rudder-calculator/
├── index.html                 # Two-panel layout, single module entry
├── css/
│   └── styles.css             # All styles (no Tailwind)
├── js/
│   ├── calculator.js          # Pure calculation functions
│   ├── state.js               # Reactive state with pub/sub
│   ├── storage.js             # localStorage wrapper
│   ├── ui.js                  # DOM rendering, modals, toasts
│   ├── chart.js               # Chart.js lifecycle wrapper
│   └── app.js                 # Orchestrator
├── tests/
│   ├── calculator.test.js     # 48 tests
│   ├── state.test.js          # 16 tests
│   └── storage.test.js        # 14 tests
├── vitest.config.js
├── CLAUDE.md                  # Development standards
├── CHANGELOG.md               # Version history
├── README.md                  # This file
└── package.json
```

## Technology Stack

- **HTML5 + Vanilla JavaScript** — ES Modules, zero build step
- **Chart.js** (CDN) — 24-month ROI line chart
- **Custom CSS** — No framework dependencies
- **Vitest** — Unit test runner (dev dependency only)
- **localStorage** — Browser storage for scenarios

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Note:** Requires HTTP server (ES modules don't work with `file://` protocol).

## Development

### Running Tests

```bash
npm install          # Install Vitest
npm test             # 78 tests across 3 files
npm run test:watch   # Watch mode
```

### Code Standards

See `CLAUDE.md` for complete standards:
- ES Modules (no globals)
- Event delegation with `data-*` attributes
- `escapeHTML()` for user text in templates
- Modal dialogs instead of `prompt()`/`alert()`
- Reactive state pattern

## Troubleshooting

### Calculator not loading
- Must use HTTP server (`npm run serve`), not `file://`
- Check browser console for module loading errors

### Scenarios not saving
- Verify localStorage is enabled in browser settings
- Clear old data if storage is full

### Tests failing
- Ensure Node.js 18+ is installed
- Run `npm install` to install Vitest

## License

UNLICENSED - Internal AI Rudder tool

---

**Version:** 2.0.0
**Last Updated:** February 2026
