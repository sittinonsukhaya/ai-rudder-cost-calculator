/**
 * AI Rudder Cost Calculator - Pure Calculation Functions (ES Module)
 *
 * All functions are pure and testable. No DOM dependencies.
 * The only i18n dependency is in generateROITimeline for month labels.
 */

import { t } from './i18n.js';

/**
 * Calculate retained agents after deflection
 * @param {number} totalAgents - Total current agents
 * @param {number} deflectionRate - Deflection rate (0-1)
 * @returns {number} - Retained agents (rounded up conservatively)
 */
export function calculateRetainedAgents(totalAgents, deflectionRate) {
  const total = totalAgents || 0;
  const rate = deflectionRate || 0;
  const retained = total * (1 - rate);
  return Math.ceil(retained);
}

/**
 * Calculate admin hours value
 * @param {number} hoursPerMonth - Admin hours saved per month
 * @param {number} hourlyRate - Hourly rate for admin time
 * @returns {number} - Monthly value of admin hours saved
 */
export function calculateAdminValue(hoursPerMonth, hourlyRate) {
  const hours = hoursPerMonth || 0;
  const rate = hourlyRate || 0;
  return hours * rate;
}

/**
 * Calculate weighted average deflection across voice/chat channels
 * @param {Array} channels - [{id, type, volume, humanHandleTime}]
 * @param {Object} channelDeflections - {channelId: deflectionRate}
 * @returns {number} - Weighted average deflection rate (0-1)
 */
export function calculateEffectiveDeflection(channels, channelDeflections) {
  let totalWorkload = 0;
  let weightedDeflection = 0;
  (channels || []).forEach(ch => {
    if (ch.type !== 'voice' && ch.type !== 'chat') return;
    const workload = (ch.volume || 0) * (ch.humanHandleTime || 1);
    const deflection = (channelDeflections || {})[ch.id] || 0;
    totalWorkload += workload;
    weightedDeflection += workload * deflection;
  });
  return totalWorkload > 0 ? weightedDeflection / totalWorkload : 0;
}

/**
 * Calculate costs from channel rates
 * AI costs are split by per-channel deflection rate:
 *   - Bot-handled volume uses aiBot rate (+ aiHandleTime for voice)
 *   - Agent-handled volume uses aiAgent rate (+ humanHandleTime for voice)
 * @param {Array} channels - [{id, type, volume, humanHandleTime}]
 * @param {Object} rates - {channelId: {client, aiBot, aiAgent}}
 * @param {number} aiHandleTime - AI handle time for voice (bot-handled calls)
 * @param {Object} channelDeflections - {channelId: deflectionRate} per-channel deflection rates
 * @returns {Object} - {clientTotal, aiTotal}
 */
export function calculateChannelCosts(channels, rates, aiHandleTime, channelDeflections = {}) {
  let clientTotal = 0;
  let aiTotal = 0;

  (channels || []).forEach(channel => {
    const rate = (rates || {})[channel.id] || { client: 0, aiBot: 0, aiAgent: 0 };
    const volume = channel.volume || 0;
    const dr = (channel.type === 'voice' || channel.type === 'chat')
      ? ((channelDeflections || {})[channel.id] || 0) : 0;
    const botVolume = volume * dr;
    const agentVolume = volume * (1 - dr);

    if (channel.type === 'voice') {
      // Voice: per minute, deflection applies
      clientTotal += rate.client * volume * (channel.humanHandleTime || 0);
      aiTotal += rate.aiBot * botVolume * (aiHandleTime || 0);
      aiTotal += rate.aiAgent * agentVolume * (channel.humanHandleTime || 0);
    } else if (channel.type === 'chat') {
      // Chat: per session, deflection applies
      clientTotal += rate.client * volume;
      aiTotal += rate.aiBot * botVolume + rate.aiAgent * agentVolume;
    } else if (channel.type === 'sms') {
      // SMS: per message, no deflection (bulk broadcast)
      clientTotal += rate.client * volume;
      aiTotal += (rate.aiBot + rate.aiAgent) * volume;
    } else if (channel.type === 'ivr') {
      // IVR: per minute, no deflection (already automated, platform swap)
      clientTotal += rate.client * volume * (channel.humanHandleTime || 0);
      aiTotal += rate.aiAgent * volume * (channel.humanHandleTime || 0);
    }
  });

  return { clientTotal, aiTotal };
}

/**
 * Calculate ledger totals from dynamic cost items
 * Handles: one-time, monthly, yearly, per-agent
 * @param {Array} items - [{id, name, amount, frequency}]
 * @param {Object} params - {totalAgents, effectiveDeflection}
 * @returns {Object} - {capex, monthlyOpex}
 */
export function calculateLedgerTotals(items, params = {}) {
  if (!items || items.length === 0) {
    return { capex: 0, monthlyOpex: 0 };
  }

  const { totalAgents = 0, effectiveDeflection = 0, deflectionRate = 0 } = params;
  const defRate = effectiveDeflection || deflectionRate || 0;
  const retainedAgents = calculateRetainedAgents(totalAgents, defRate);

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
 * Calculate monthly costs combining channel costs + ledger costs
 * @param {Array} channels - Channel definitions
 * @param {Object} rates - Channel rates keyed by channel id
 * @param {number} aiHandleTime - Shared AI handle time for voice
 * @param {Array} clientItems - Client additional cost items
 * @param {Array} aiItems - AI additional cost items
 * @param {Object} params - {totalAgents, monthlySalary, channelDeflections, adminHours}
 * @returns {Object}
 */
export function calculateMonthlyCosts(channels, rates, aiHandleTime,
                                       clientItems, aiItems, params) {
  const p = params || {};

  const channelDeflections = p.channelDeflections || {};
  const effectiveDeflection = calculateEffectiveDeflection(channels, channelDeflections);

  const channelCosts = calculateChannelCosts(channels, rates, aiHandleTime, channelDeflections);
  const ledgerParams = { totalAgents: p.totalAgents, effectiveDeflection };
  const clientLedger = calculateLedgerTotals(clientItems, ledgerParams);
  const aiLedger = calculateLedgerTotals(aiItems, ledgerParams);

  const totalAgents = p.totalAgents || 0;
  const retainedAgents = calculateRetainedAgents(totalAgents, effectiveDeflection);
  const agentsReplaced = totalAgents - retainedAgents;

  const adminHours = p.adminHours || 0;
  const hourlyRate = (p.monthlySalary || 0) / 160;
  const adminValue = calculateAdminValue(adminHours, hourlyRate);

  const monthlySalary = p.monthlySalary || 0;

  return {
    clientMonthly: channelCosts.clientTotal + clientLedger.monthlyOpex + (totalAgents * monthlySalary),
    aiMonthly: channelCosts.aiTotal + aiLedger.monthlyOpex + (retainedAgents * monthlySalary),
    clientCapex: clientLedger.capex,
    aiCapex: aiLedger.capex,
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
export function calculatePayrollSaved(agentsReplaced, monthlySalary, legacyLicenseCost = 0) {
  const agents = agentsReplaced || 0;
  const salary = monthlySalary || 0;
  const license = legacyLicenseCost || 0;
  return agents * (salary + license);
}

/**
 * Generate 24-month cumulative ROI timeline
 * Shows DIRECT operational costs only (no payroll/admin offsets).
 * Both lines always go up, making the chart intuitive.
 * Payroll and admin savings are shown in dashboard metrics instead.
 * @param {number} clientMonthly - Client monthly OpEx
 * @param {number} aiMonthly - AI monthly OpEx
 * @param {number} clientCapex - Client CapEx
 * @param {number} aiCapex - AI CapEx
 * @returns {Object} - {labels, clientData, aiData}
 */
export function generateROITimeline(clientMonthly, aiMonthly, clientCapex, aiCapex) {
  const labels = [];
  const clientData = [];
  const aiData = [];

  for (let month = 0; month <= 24; month++) {
    labels.push(t('chart.month').replace('{n}', month));
    clientData.push(clientCapex + (clientMonthly * month));
    aiData.push(aiCapex + (aiMonthly * month));
  }

  return { labels, clientData, aiData };
}

/**
 * Calculate dashboard metrics (hard savings only)
 * clientMonthly and aiMonthly already include agent payroll,
 * so payroll savings emerge naturally from the difference.
 * Admin/efficiency gains are tracked separately in calculateEfficiencyGains().
 * @param {number} clientMonthly - Client total monthly spend (channels + payroll + additional)
 * @param {number} aiMonthly - AI total monthly spend (channels + retained payroll + additional)
 * @param {number} clientCapex - Client CapEx
 * @param {number} aiCapex - AI CapEx
 * @returns {Object}
 */
export function calculateDashboardMetrics(
  clientMonthly, aiMonthly, clientCapex, aiCapex
) {
  // Monthly savings = direct cost difference only (hard savings)
  const monthlySavings = clientMonthly - aiMonthly;

  const year1ClientTotal = clientCapex + (clientMonthly * 12);
  const year1AITotal = aiCapex + (aiMonthly * 12);
  const year1NetSavings = year1ClientTotal - year1AITotal;

  let breakEvenMonth = null;
  for (let month = 1; month <= 24; month++) {
    const clientCumulative = clientCapex + (clientMonthly * month);
    const aiCumulative = aiCapex + (aiMonthly * month);

    if (aiCumulative < clientCumulative) {
      breakEvenMonth = month;
      break;
    }
  }

  // Cost Reduction = Monthly Savings / Client Monthly × 100 (hard savings only)
  const costReduction = clientMonthly > 0
    ? Math.round((monthlySavings / clientMonthly) * 100)
    : 0;

  // ROI = year 1 net savings / initial investment
  const roi = aiCapex > 0 ? Math.round(year1NetSavings / aiCapex * 100) : null;

  return {
    clientMonthly,
    aiMonthly,
    monthlySavings,
    costReduction,
    initialInvestment: aiCapex,
    year1NetSavings,
    breakEvenMonth,
    roi
  };
}

/**
 * Calculate efficiency gains (soft savings) — separate from direct cost savings
 * @param {Object} params - {totalAgents, monthlySalary, channelDeflections, adminHours, channels}
 * @returns {Object}
 */
export function calculateEfficiencyGains(params) {
  const { totalAgents, monthlySalary, channelDeflections, adminHours, channels } = params || {};
  const effectiveDeflection = calculateEffectiveDeflection(channels, channelDeflections);
  const retainedAgents = calculateRetainedAgents(totalAgents, effectiveDeflection);
  const agentsReplaced = (totalAgents || 0) - retainedAgents;
  const hourlyRate = (monthlySalary || 0) / 160;
  const hoursValue = (adminHours || 0) * hourlyRate;
  const capacityBase = retainedAgents * 160;
  const capacityIncrease = capacityBase > 0 ? Math.round(((adminHours || 0) / capacityBase) * 100) : 0;

  // Blended avg handle time from voice + chat channels (SMS excluded)
  let totalMinutes = 0;
  let totalInteractions = 0;
  (channels || []).forEach(ch => {
    if (ch.type === 'voice' || ch.type === 'chat') {
      const ht = ch.humanHandleTime || 0;
      const vol = ch.volume || 0;
      if (ht > 0 && vol > 0) {
        totalMinutes += vol * ht;
        totalInteractions += vol;
      }
    }
  });
  const blendedHandleTime = totalInteractions > 0 ? totalMinutes / totalInteractions : 0;
  const extraCapacity = blendedHandleTime > 0 ? Math.round((adminHours || 0) * 60 / blendedHandleTime) : 0;
  const agentEquivalent = ((adminHours || 0) / 160).toFixed(1);

  return {
    aiCapacity: agentsReplaced,
    totalAgents: totalAgents || 0,
    automatedPct: Math.round((effectiveDeflection || 0) * 100),
    hoursReclaimed: adminHours || 0,
    agentEquivalent: parseFloat(agentEquivalent),
    extraCapacity,
    capacityIncrease,
    estimatedValue: hoursValue
  };
}

/**
 * Calculate per-interaction cost for client and AI
 * @param {number} clientMonthly - Client total monthly spend
 * @param {number} aiMonthly - AI total monthly spend
 * @param {Array} channels - Channel definitions with volume
 * @returns {Object} - {client, ai} per-interaction costs
 */
export function calculatePerInteractionCost(clientMonthly, aiMonthly, channels) {
  const totalVolume = (channels || []).reduce((sum, ch) => sum + (ch.volume || 0), 0);
  return {
    client: totalVolume > 0 ? clientMonthly / totalVolume : 0,
    ai: totalVolume > 0 ? aiMonthly / totalVolume : 0
  };
}

/**
 * Format currency value in Thai Baht
 * @param {number} value - Numeric value
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value) {
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
export function formatNumber(value) {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
}
