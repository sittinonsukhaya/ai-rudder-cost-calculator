/**
 * AI Rudder Cost Calculator - Pure Calculation Functions
 *
 * This module contains all calculation logic with no DOM dependencies.
 * All functions are pure and testable.
 */

// Create global AIRudder namespace
window.AIRudder = window.AIRudder || {};

/**
 * Calculate retained agents after deflection
 * @param {number} totalAgents - Total current agents
 * @param {number} deflectionRate - Deflection rate (0-1)
 * @returns {number} - Retained agents (rounded up conservatively)
 */
AIRudder.calculateRetainedAgents = function(totalAgents, deflectionRate) {
  const total = totalAgents || 0;
  const rate = deflectionRate || 0;
  const retained = total * (1 - rate);
  return Math.ceil(retained); // Conservative rounding
}

/**
 * Calculate admin hours value
 * @param {number} hoursPerMonth - Admin hours saved per month
 * @param {number} hourlyRate - Hourly rate for admin time
 * @returns {number} - Monthly value of admin hours saved
 */
AIRudder.calculateAdminValue = function(hoursPerMonth, hourlyRate) {
  const hours = hoursPerMonth || 0;
  const rate = hourlyRate || 0;
  return hours * rate;
}

/**
 * Calculate ledger totals from dynamic cost items
 * @param {Array} items - Array of cost items {name, amount, frequency, category}
 * @param {Object} globalParams - {volume, humanTime, aiTime, totalAgents, deflectionRate}
 * @returns {Object} - {capex: number, monthlyOpex: number}
 */
AIRudder.calculateLedgerTotals = function(items, globalParams = {}) {
  if (!items || items.length === 0) {
    return { capex: 0, monthlyOpex: 0 };
  }

  const {
    volume = 0,
    humanTime = 0,
    aiTime = 0,
    totalAgents = 0,
    deflectionRate = 0
  } = globalParams;

  const retainedAgents = AIRudder.calculateRetainedAgents(totalAgents, deflectionRate);

  let capex = 0;
  let monthlyOpex = 0;

  items.forEach(item => {
    const amount = parseFloat(item.amount) || 0;
    const frequency = (item.frequency || '').toLowerCase();

    switch (frequency) {
      case 'one-time':
        capex += amount;
        break;

      case 'monthly':
        monthlyOpex += amount;
        break;

      case 'yearly':
        monthlyOpex += amount / 12;
        break;

      case 'per minute':
        // Use humanTime for client side, aiTime for AI side
        // This is handled by caller passing correct time
        const handleTime = item.isAISide ? aiTime : humanTime;
        monthlyOpex += amount * volume * handleTime;
        break;

      case 'per session':
        monthlyOpex += amount * volume;
        break;

      case 'per agent':
        monthlyOpex += amount * retainedAgents;
        break;

      default:
        // Unknown frequency, treat as monthly
        monthlyOpex += amount;
    }
  });

  return { capex, monthlyOpex };
}

/**
 * Calculate monthly costs for both sides
 * @param {Array} clientItems - Client current state items
 * @param {Array} aiItems - AI Rudder solution items
 * @param {Object} globalParams - Global parameters
 * @returns {Object} - {clientMonthly, aiMonthly, clientCapex, aiCapex, agentsReplaced, retainedAgents, adminValue}
 */
AIRudder.calculateMonthlyCosts = function(clientItems, aiItems, globalParams) {
  const params = globalParams || {};

  // Mark items with their side for per-minute calculations
  const clientItemsWithSide = (clientItems || []).map(item => ({
    ...item,
    isAISide: false
  }));

  const aiItemsWithSide = (aiItems || []).map(item => ({
    ...item,
    isAISide: true
  }));

  const clientTotals = AIRudder.calculateLedgerTotals(clientItemsWithSide, params);
  const aiTotals = AIRudder.calculateLedgerTotals(aiItemsWithSide, params);

  const totalAgents = params.totalAgents || 0;
  const deflectionRate = params.deflectionRate || 0;
  const retainedAgents = AIRudder.calculateRetainedAgents(totalAgents, deflectionRate);
  const agentsReplaced = totalAgents - retainedAgents;

  const adminHours = params.adminHours || 0;
  const hourlyRate = params.hourlyRate || 0;
  const adminValue = AIRudder.calculateAdminValue(adminHours, hourlyRate);

  return {
    clientMonthly: clientTotals.monthlyOpex,
    aiMonthly: aiTotals.monthlyOpex,
    clientCapex: clientTotals.capex,
    aiCapex: aiTotals.capex,
    agentsReplaced,
    retainedAgents,
    adminValue
  };
}

/**
 * Calculate payroll saved from deflection
 * @param {number} agentsReplaced - Number of agents replaced by AI
 * @param {number} monthlySalary - Average monthly salary per agent
 * @param {number} legacyLicenseCost - Monthly license cost per agent (optional)
 * @returns {number} - Monthly payroll saved
 */
AIRudder.calculatePayrollSaved = function(agentsReplaced, monthlySalary, legacyLicenseCost = 0) {
  const agents = agentsReplaced || 0;
  const salary = monthlySalary || 0;
  const license = legacyLicenseCost || 0;
  return agents * (salary + license);
}

/**
 * Generate 24-month cumulative ROI timeline
 * @param {number} clientMonthly - Client monthly OpEx
 * @param {number} aiMonthly - AI monthly OpEx
 * @param {number} clientCapex - Client CapEx
 * @param {number} aiCapex - AI CapEx
 * @param {number} adminValue - Monthly admin hours value (benefit offset)
 * @returns {Object} - {labels, clientData, aiData, breakEvenMonth}
 */
AIRudder.generateROITimeline = function(clientMonthly, aiMonthly, clientCapex, aiCapex, adminValue = 0) {
  const labels = [];
  const clientData = [];
  const aiData = [];
  let breakEvenMonth = null;

  const effectiveAIMonthly = aiMonthly - adminValue;

  for (let month = 0; month <= 24; month++) {
    labels.push(`Month ${month}`);

    // Cumulative costs
    const clientCumulative = clientCapex + (clientMonthly * month);
    const aiCumulative = aiCapex + (effectiveAIMonthly * month);

    clientData.push(clientCumulative);
    aiData.push(aiCumulative);

    // Detect break-even point (first time AI becomes cheaper)
    if (breakEvenMonth === null && month > 0 && aiCumulative < clientCumulative) {
      breakEvenMonth = month;
    }
  }

  return {
    labels,
    clientData,
    aiData,
    breakEvenMonth
  };
}

/**
 * Calculate dashboard metrics
 * @param {number} clientMonthly - Client monthly OpEx
 * @param {number} aiMonthly - AI monthly OpEx
 * @param {number} clientCapex - Client CapEx
 * @param {number} aiCapex - AI CapEx
 * @param {number} adminValue - Monthly admin hours value
 * @param {number} payrollSaved - Monthly payroll saved from deflection
 * @returns {Object} - {initialInvestment, monthlySavings, payrollSaved, year1NetSavings, breakEvenMonth}
 */
AIRudder.calculateDashboardMetrics = function(
  clientMonthly,
  aiMonthly,
  clientCapex,
  aiCapex,
  adminValue,
  payrollSaved
) {
  const effectiveAIMonthly = aiMonthly - adminValue;
  const monthlySavings = clientMonthly - effectiveAIMonthly;

  // Year 1 = 12 months of operations
  const year1ClientTotal = clientCapex + (clientMonthly * 12);
  const year1AITotal = aiCapex + (effectiveAIMonthly * 12);
  const year1NetSavings = year1ClientTotal - year1AITotal;

  // Find break-even month
  let breakEvenMonth = null;
  for (let month = 1; month <= 24; month++) {
    const clientCumulative = clientCapex + (clientMonthly * month);
    const aiCumulative = aiCapex + (effectiveAIMonthly * month);

    if (aiCumulative < clientCumulative) {
      breakEvenMonth = month;
      break;
    }
  }

  return {
    initialInvestment: aiCapex,
    monthlySavings,
    payrollSaved,
    year1NetSavings,
    breakEvenMonth
  };
}

/**
 * Format currency value in Thai Baht
 * @param {number} value - Numeric value
 * @returns {string} - Formatted currency string
 */
AIRudder.formatCurrency = function(value) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
}

/**
 * Format number with thousands separator
 * @param {number} value - Numeric value
 * @returns {string} - Formatted number string
 */
AIRudder.formatNumber = function(value) {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
}
