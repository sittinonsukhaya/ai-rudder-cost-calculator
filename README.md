# AI Rudder Cost Calculator

Interactive ROI calculator for collaborative sales sessions comparing call center costs vs AI Rudder's conversational AI solution.

## Overview

This calculator is designed for **live client meetings** where sales representatives sit with clients to compare their current call center costs against AI Rudder's solution. It acts as a financial discovery tool that exposes hidden operational costs and demonstrates ROI in real-time.

### Key Features

- **Flexible Dynamic Ledger** - Add unlimited cost items with 6 frequency types (one-time, monthly, yearly, per-minute, per-session, per-agent)
- **Two-Column Comparison** - Side-by-side view of client current state vs AI Rudder solution
- **Global Parameters** - Volume, handle times, agent count, salary inputs
- **Operation Efficiency Offset** - Deflection rate slider (0-80%) and admin hours saved calculator
- **Real-time Visualization** - 24-month ROI timeline chart updates instantly
- **Dashboard Metrics** - Initial investment, monthly savings, payroll saved, year 1 net savings, break-even month
- **Scenario Management** - Save/load/delete multiple client scenarios
- **Zero Configuration** - Just open index.html in a browser, no build step required

## Quick Start

### Local Development

1. **Clone or download this repository**

2. **Install dependencies** (only needed for running tests):
   ```bash
   npm install
   ```

3. **Open the calculator**:
   - Option 1: Double-click `index.html` to open in your default browser
   - Option 2: Start a local server:
     ```bash
     npm run serve
     # Then open http://localhost:8000 in your browser
     ```

4. **Run tests** (optional):
   ```bash
   npm test              # Run once
   npm run test:watch    # Watch mode
   ```

## Usage Guide

### Basic Workflow

1. **Set Global Parameters**
   - Total Monthly Volume (calls/chats)
   - Average Human Handle Time (minutes)
   - Average AI Handle Time (minutes)
   - Total Current Agents (headcount)
   - Average Monthly Salary per Agent

2. **Configure Operation Efficiency Offset**
   - Adjust AI Deflection Rate slider (0-80%)
   - Enter Admin Hours Saved/Month
   - Enter Hourly Rate for admin time value

3. **Add Client Current State Costs**
   - Click "+ Add Cost Item" in left column
   - Enter cost name, amount, select frequency, choose category
   - Examples:
     - "Agent Salaries" - 1,000,000 THB - Monthly - Labor
     - "PBX System" - 120,000 THB - Yearly - Technology
     - "SIP Minutes" - 2 THB - Per Minute - Telecom
     - "CRM Licenses" - 2,000 THB - Per Agent - Technology

4. **Add AI Rudder Solution Costs**
   - Click "+ Add Cost Item" in right column
   - Enter AI-related costs:
     - "Setup Fee" - 50,000 THB - One-time - Technology
     - "AI Platform Fee" - 30,000 THB - Monthly - Technology
     - "AI Rudder Licenses" - 1,500 THB - Per Agent - Technology

5. **Review Dashboard & Chart**
   - Watch the 24-month cumulative cost chart
   - Check dashboard metrics:
     - Initial Investment (CapEx)
     - Monthly Savings (OpEx reduction)
     - Payroll Saved (headcount reduction)
     - Year 1 Net Savings
     - Break-Even Month

6. **Save Scenario**
   - Click "Save Scenario" button
   - Enter client name (e.g., "ACME Corp - Call Center")
   - Scenario saved to browser localStorage

7. **Load/Delete Scenarios**
   - Use dropdown to select saved scenarios
   - Click "Delete Scenario" to remove

### Frequency Types Explained

| Frequency | Description | Calculation |
|-----------|-------------|-------------|
| **One-time** | CapEx, setup fees | Added to Month 0 only |
| **Monthly** | Recurring OpEx | Added to monthly cost as-is |
| **Yearly** | Annual contracts | Divided by 12 for monthly |
| **Per Minute** | Usage-based telecom | `amount × volume × handleTime` |
| **Per Session** | Per-call/chat fees | `amount × volume` |
| **Per Agent** | License fees per user | `amount × (totalAgents × (1 - deflectionRate))` |

### Understanding Deflection Rate

The deflection rate represents the percentage of volume/agents replaced by AI:

- **0%** = No AI deflection, all current agents retained
- **20%** (default) = AI handles 20% of traffic, 80% of agents retained
- **50%** = AI handles 50% of traffic, 50% of agents retained
- **80%** (max) = AI handles 80% of traffic, 20% of agents retained

**Impact:**
- Reduces "Per Agent" costs on both client and AI sides
- Shows agents replaced and traffic routed to AI
- Calculates payroll saved from headcount reduction

### Admin Hours Saved

Represents efficiency gains from automation (e.g., reduced manual reporting, less supervision needed):

- Enter hours saved per month (e.g., 160 hours)
- Enter hourly rate (e.g., 150 THB/hour)
- System calculates monthly value: `160 × 150 = 24,000 THB/month`
- This value offsets AI monthly costs (shown as benefit)

## Project Structure

```
ai-rudder-calculator/
├── CLAUDE.md              # Development standards & terminology
├── CHANGELOG.md           # Version history
├── README.md              # This file
├── package.json           # npm configuration
├── .gitignore
├── index.html             # Main HTML file
├── css/
│   └── styles.css         # Custom styles (AI Rudder brand)
├── js/
│   ├── calculator.js      # Pure calculation functions
│   ├── ui.js              # DOM handling & events
│   └── storage.js         # localStorage save/load
└── tests/
    └── calculator.test.js # Calculation unit tests
```

## Technology Stack

- **HTML5 + Vanilla JavaScript** - No frameworks, zero build step
- **Tailwind CSS** (CDN) - Utility-first styling
- **Chart.js** (CDN) - 24-month ROI line chart
- **Feather Icons** (CDN) - Outlined icon set
- **Vitest** - Fast unit test runner (dev dependency only)
- **localStorage** - Browser storage for scenarios (no backend)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires:
- ES6+ JavaScript support
- localStorage API
- CSS Grid & Flexbox

## Development

### Running Tests

```bash
# Install dependencies first
npm install

# Run tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# UI mode (visual test runner)
npm run test:ui
```

### Making Changes

1. **Read CLAUDE.md** - Locked terminology and code standards
2. **Edit files** - calculator.js for logic, ui.js for interface
3. **Add tests** - Update calculator.test.js for new calculations
4. **Test locally** - Open index.html in browser
5. **Update CHANGELOG.md** - Document all changes
6. **Commit & tag** - Follow semantic versioning

### Code Standards

- **Variable names:** camelCase, descriptive (`totalMonthlyVolume` not `vol`)
- **Function names:** verb + noun (`calculateMonthlyOpEx` not `getOpEx`)
- **Currency:** Always use `Intl.NumberFormat('th-TH', {currency: 'THB'})`
- **Input validation:** Default to 0 if empty/invalid, no NaN propagation

See CLAUDE.md for complete standards.

## Troubleshooting

### Calculator not loading
- Check browser console for errors (F12)
- Ensure index.html is opened via file:// or http:// protocol
- Verify CDN resources are loading (internet connection required)

### Scenarios not saving
- Check browser localStorage is enabled
- Try different browser (Safari has stricter localStorage limits)
- Clear browser cache and try again

### Tests failing
- Ensure Node.js 18+ is installed
- Run `npm install` to install Vitest
- Check test output for specific failures

### Chart not rendering
- Verify Chart.js CDN is accessible
- Check browser console for Chart.js errors
- Ensure canvas element exists in DOM

## Examples

### Example 1: Basic Call Center

**Global Parameters:**
- Volume: 10,000 calls/month
- Human Time: 6 minutes
- AI Time: 3.5 minutes
- Total Agents: 100
- Monthly Salary: 25,000 THB

**Client Current State:**
- Agent Salaries: 2,500,000 THB/month
- CRM Licenses: 2,000 THB/agent (200,000 THB/month for 100 agents)
- SIP Minutes: 2 THB/minute (120,000 THB/month for 10k × 6min)
- PBX Maintenance: 120,000 THB/year (10,000 THB/month)

**AI Rudder Solution:**
- Setup Fee: 50,000 THB (one-time)
- AI Platform: 30,000 THB/month
- AI Rudder Licenses: 1,500 THB/agent (120,000 THB/month for 80 retained agents @ 20% deflection)
- AI SIP Minutes: 4 THB/minute (140,000 THB/month for 10k × 3.5min)

**Deflection: 20%**
- Agents Replaced: 20 of 100
- Payroll Saved: 500,000 THB/month (20 × 25,000)

**Result:**
- Monthly Savings: ~2.3M THB
- Break-Even: Month 1
- Year 1 Net Savings: ~27M THB

## Roadmap

### v1.0 (Current)
- ✅ Core calculator with 6 frequency types
- ✅ Deflection rate slider and admin hours saved
- ✅ 24-month ROI timeline chart
- ✅ Save/load scenarios
- ✅ Unit tests for calculations

### v2.0 (Future)
- [ ] Multi-workflow cards (separate channels)
- [ ] Auto-calculated agent reduction from workflow minutes
- [ ] PDF export functionality
- [ ] Category-based donut chart
- [ ] Side-by-side scenario comparison
- [ ] Configurable timeline (12/24/36 months)

## Support

For questions or issues:
- Read CLAUDE.md for development standards
- Check tests/calculator.test.js for calculation examples
- Review CHANGELOG.md for recent changes

## License

UNLICENSED - Internal AI Rudder tool

---

**Version:** 1.0.0
**Last Updated:** February 2026
