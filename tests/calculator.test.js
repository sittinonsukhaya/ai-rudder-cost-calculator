import { describe, test, expect } from 'vitest';
import {
  calculateRetainedAgents,
  calculateAdminValue,
  calculateEffectiveDeflection,
  calculateChannelCosts,
  calculateLedgerTotals,
  calculateMonthlyCosts,
  calculatePayrollSaved,
  generateROITimeline,
  calculateDashboardMetrics,
  calculateEfficiencyGains,
  calculatePerInteractionCost,
  formatCurrency,
  formatNumber
} from '../js/calculator.js';

describe('calculateRetainedAgents', () => {
  test('calculates retained agents correctly', () => {
    expect(calculateRetainedAgents(100, 0.2)).toBe(80);
    expect(calculateRetainedAgents(100, 0.5)).toBe(50);
    expect(calculateRetainedAgents(100, 0)).toBe(100);
  });

  test('rounds up conservatively', () => {
    expect(calculateRetainedAgents(100, 0.25)).toBe(75);
    expect(calculateRetainedAgents(99, 0.2)).toBe(80);
    expect(calculateRetainedAgents(95, 0.3)).toBe(67);
  });

  test('handles zero and null values', () => {
    expect(calculateRetainedAgents(0, 0.2)).toBe(0);
    expect(calculateRetainedAgents(null, 0.2)).toBe(0);
    expect(calculateRetainedAgents(100, null)).toBe(100);
  });
});

describe('calculateAdminValue', () => {
  test('calculates admin value correctly', () => {
    expect(calculateAdminValue(160, 150)).toBe(24000);
    expect(calculateAdminValue(100, 200)).toBe(20000);
  });

  test('handles zero values', () => {
    expect(calculateAdminValue(0, 150)).toBe(0);
    expect(calculateAdminValue(160, 0)).toBe(0);
  });

  test('handles null values', () => {
    expect(calculateAdminValue(null, 150)).toBe(0);
    expect(calculateAdminValue(160, null)).toBe(0);
  });
});

describe('calculateEffectiveDeflection', () => {
  test('returns weighted average across voice/chat channels', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 },
      { id: 2, type: 'chat', volume: 2000, humanHandleTime: 1 }
    ];
    const channelDeflections = { 1: 0.3, 2: 0.1 };
    const result = calculateEffectiveDeflection(channels, channelDeflections);

    // Voice workload: 5000 * 6 = 30000
    // Chat workload: 2000 * 1 = 2000
    // Total workload: 32000
    // Weighted: (30000 * 0.3 + 2000 * 0.1) / 32000 = (9000 + 200) / 32000 = 9200/32000 = 0.2875
    expect(result).toBeCloseTo(0.2875);
  });

  test('returns 0 when no voice/chat channels', () => {
    const channels = [
      { id: 1, type: 'sms', volume: 5000 },
      { id: 2, type: 'ivr', volume: 2000, humanHandleTime: 3 }
    ];
    expect(calculateEffectiveDeflection(channels, { 1: 0.3, 2: 0.1 })).toBe(0);
  });

  test('returns 0 with empty channels', () => {
    expect(calculateEffectiveDeflection([], {})).toBe(0);
  });

  test('returns 0 with null channels', () => {
    expect(calculateEffectiveDeflection(null, null)).toBe(0);
  });

  test('returns 0 when all voice/chat channels have zero volume', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 0, humanHandleTime: 6 }
    ];
    expect(calculateEffectiveDeflection(channels, { 1: 0.3 })).toBe(0);
  });

  test('defaults missing channel deflection to 0', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 },
      { id: 2, type: 'chat', volume: 2000, humanHandleTime: 1 }
    ];
    // Only channel 1 has deflection; channel 2 defaults to 0
    const result = calculateEffectiveDeflection(channels, { 1: 0.3 });

    // Voice workload: 30000, Chat workload: 2000
    // Weighted: (30000*0.3 + 2000*0) / 32000 = 9000/32000 = 0.28125
    expect(result).toBeCloseTo(0.28125);
  });

  test('uses humanHandleTime=1 default for chat channels', () => {
    const channels = [
      { id: 1, type: 'chat', volume: 1000 }  // no humanHandleTime
    ];
    const result = calculateEffectiveDeflection(channels, { 1: 0.5 });
    // workload: 1000 * 1 = 1000, weighted: 1000*0.5 / 1000 = 0.5
    expect(result).toBe(0.5);
  });

  test('single channel returns its deflection directly', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 }
    ];
    expect(calculateEffectiveDeflection(channels, { 1: 0.2 })).toBeCloseTo(0.2);
  });
});

describe('calculateChannelCosts', () => {
  test('voice with zero deflection routes all through agent rate', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 10000, humanHandleTime: 6 }
    ];
    const rates = { 1: { client: 2, aiBot: 1, aiAgent: 5 } };
    const result = calculateChannelCosts(channels, rates, 3.5, {});

    // Client: 2 * 10000 * 6 = 120,000
    expect(result.clientTotal).toBe(120000);
    // AI: all agent = 5 * 10000 * 6 = 300,000
    expect(result.aiTotal).toBe(300000);
  });

  test('voice splits AI cost between bot and agent using per-channel deflection', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 10000, humanHandleTime: 6 }
    ];
    const rates = { 1: { client: 2, aiBot: 1, aiAgent: 5 } };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0.2 });

    // Client: 2 * 10000 * 6 = 120,000
    expect(result.clientTotal).toBe(120000);
    // AI bot: 1 * 2000 * 3.5 = 7,000
    // AI agent: 5 * 8000 * 6 = 240,000
    // AI total: 247,000
    expect(result.aiTotal).toBe(247000);
  });

  test('bot uses aiHandleTime, agent uses humanHandleTime for voice', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 1000, humanHandleTime: 10 }
    ];
    const rates = { 1: { client: 1, aiBot: 1, aiAgent: 1 } };
    // Same rate for both, so difference is purely handle time
    const result = calculateChannelCosts(channels, rates, 2, { 1: 0.5 });

    // Bot: 1 * 500 * 2 = 1,000
    // Agent: 1 * 500 * 10 = 5,000
    expect(result.aiTotal).toBe(6000);
  });

  test('SMS uses full volume without deflection (bulk broadcast)', () => {
    const channels = [
      { id: 1, type: 'sms', volume: 50000 }
    ];
    const rates = { 1: { client: 0.5, aiBot: 0, aiAgent: 0.4 } };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0.2 });

    // Client: 0.5 * 50000 = 25,000
    expect(result.clientTotal).toBe(25000);
    // AI: (0 + 0.4) * 50000 = 20,000 (full volume, no deflection split)
    expect(result.aiTotal).toBe(20000);
  });

  test('SMS with both bot and agent rates sums them over full volume', () => {
    const channels = [
      { id: 1, type: 'sms', volume: 10000 }
    ];
    const rates = { 1: { client: 0.5, aiBot: 0.2, aiAgent: 0.3 } };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0.5 });

    // Client: 0.5 * 10000 = 5,000
    expect(result.clientTotal).toBe(5000);
    // AI: (0.2 + 0.3) * 10000 = 5,000 (deflection ignored for SMS)
    expect(result.aiTotal).toBe(5000);
  });

  test('IVR uses full volume with handle time, no deflection, agent rate only', () => {
    const channels = [
      { id: 1, type: 'ivr', volume: 20000, humanHandleTime: 2 }
    ];
    const rates = { 1: { client: 1.5, aiBot: 0, aiAgent: 1.0 } };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0.2 });

    // Client: 1.5 * 20000 * 2 = 60,000
    expect(result.clientTotal).toBe(60000);
    // AI: agentRate * fullVolume * handleTime = 1.0 * 20000 * 2 = 40,000
    // (no deflection split, bot rate ignored for IVR)
    expect(result.aiTotal).toBe(40000);
  });

  test('IVR ignores deflection rate completely', () => {
    const channels = [
      { id: 1, type: 'ivr', volume: 10000, humanHandleTime: 3 }
    ];
    const rates = { 1: { client: 2, aiBot: 0, aiAgent: 1 } };

    const resultLow = calculateChannelCosts(channels, rates, 3.5, { 1: 0.1 });
    const resultHigh = calculateChannelCosts(channels, rates, 3.5, { 1: 0.8 });

    // Both should produce the same AI total since deflection doesn't apply
    expect(resultLow.aiTotal).toBe(resultHigh.aiTotal);
    expect(resultLow.aiTotal).toBe(30000); // 1 * 10000 * 3
  });

  test('chat splits by deflection without handle time', () => {
    const channels = [
      { id: 1, type: 'chat', volume: 2000 }
    ];
    const rates = { 1: { client: 50, aiBot: 15, aiAgent: 30 } };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0.3 });

    // Client: 50 * 2000 = 100,000
    expect(result.clientTotal).toBe(100000);
    // AI bot: 15 * 600 = 9,000
    // AI agent: 30 * 1400 = 42,000
    expect(result.aiTotal).toBe(51000);
  });

  test('handles multiple channels with per-channel deflection', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 },
      { id: 2, type: 'sms', volume: 20000 },
      { id: 3, type: 'chat', volume: 3000 }
    ];
    const rates = {
      1: { client: 2, aiBot: 1, aiAgent: 5 },
      2: { client: 0.5, aiBot: 0.2, aiAgent: 0.4 },
      3: { client: 50, aiBot: 15, aiAgent: 30 }
    };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0.2, 3: 0.2 });

    // Voice client: 2 * 5000 * 6 = 60,000
    // SMS client: 0.5 * 20000 = 10,000
    // Chat client: 50 * 3000 = 150,000
    expect(result.clientTotal).toBe(220000);

    // Voice AI: bot(1*1000*3.5=3500) + agent(5*4000*6=120000) = 123,500
    // SMS AI: (0.2+0.4)*20000 = 12,000 (no deflection, full volume)
    // Chat AI: bot(15*600=9000) + agent(30*2400=72000) = 81,000
    expect(result.aiTotal).toBe(216500);
  });

  test('per-channel deflection: voice at 30%, chat at 10%', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 10000, humanHandleTime: 6 },
      { id: 2, type: 'chat', volume: 5000 }
    ];
    const rates = {
      1: { client: 2, aiBot: 1, aiAgent: 5 },
      2: { client: 50, aiBot: 15, aiAgent: 30 }
    };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0.3, 2: 0.1 });

    // Voice: client=2*10000*6=120000
    // Voice AI: bot(1*3000*3.5=10500) + agent(5*7000*6=210000) = 220500
    // Chat: client=50*5000=250000
    // Chat AI: bot(15*500=7500) + agent(30*4500=135000) = 142500
    expect(result.clientTotal).toBe(370000);
    expect(result.aiTotal).toBe(363000);
  });

  test('zero deflection on one channel, nonzero on another', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 10000, humanHandleTime: 6 },
      { id: 2, type: 'chat', volume: 5000 }
    ];
    const rates = {
      1: { client: 2, aiBot: 1, aiAgent: 5 },
      2: { client: 50, aiBot: 15, aiAgent: 30 }
    };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0, 2: 0.5 });

    // Voice AI: all agent since deflection=0: 5*10000*6 = 300000
    // Chat AI: bot(15*2500=37500) + agent(30*2500=75000) = 112500
    expect(result.aiTotal).toBe(412500);
  });

  test('missing channel in deflection map defaults to 0', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 10000, humanHandleTime: 6 }
    ];
    const rates = { 1: { client: 2, aiBot: 1, aiAgent: 5 } };
    // Channel 1 not in deflections map → defaults to 0
    const result = calculateChannelCosts(channels, rates, 3.5, { 99: 0.5 });

    // All through agent: 5*10000*6 = 300000
    expect(result.aiTotal).toBe(300000);
  });

  test('handles missing rates for a channel', () => {
    const channels = [
      { id: 99, type: 'voice', volume: 1000, humanHandleTime: 5 }
    ];
    const result = calculateChannelCosts(channels, {}, 3.5, { 99: 0.2 });

    expect(result.clientTotal).toBe(0);
    expect(result.aiTotal).toBe(0);
  });

  test('handles empty channels array', () => {
    const result = calculateChannelCosts([], {}, 3.5, { 1: 0.2 });
    expect(result.clientTotal).toBe(0);
    expect(result.aiTotal).toBe(0);
  });

  test('handles null channels', () => {
    const result = calculateChannelCosts(null, null, 3.5, null);
    expect(result.clientTotal).toBe(0);
    expect(result.aiTotal).toBe(0);
  });

  test('handles zero volume', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 0, humanHandleTime: 6 }
    ];
    const rates = { 1: { client: 2, aiBot: 1, aiAgent: 5 } };
    const result = calculateChannelCosts(channels, rates, 3.5, { 1: 0.2 });

    expect(result.clientTotal).toBe(0);
    expect(result.aiTotal).toBe(0);
  });
});

describe('calculateLedgerTotals', () => {
  test('handles empty items array', () => {
    const result = calculateLedgerTotals([]);
    expect(result.capex).toBe(0);
    expect(result.monthlyOpex).toBe(0);
  });

  test('one-time cost appears only in capex', () => {
    const items = [
      { name: 'Setup Fee', amount: 50000, frequency: 'one-time' }
    ];
    const result = calculateLedgerTotals(items);
    expect(result.capex).toBe(50000);
    expect(result.monthlyOpex).toBe(0);
  });

  test('monthly cost goes to opex', () => {
    const items = [
      { name: 'Platform Fee', amount: 10000, frequency: 'monthly' }
    ];
    const result = calculateLedgerTotals(items);
    expect(result.capex).toBe(0);
    expect(result.monthlyOpex).toBe(10000);
  });

  test('yearly cost divided by 12 goes to opex', () => {
    const items = [
      { name: 'Annual License', amount: 120000, frequency: 'yearly' }
    ];
    const result = calculateLedgerTotals(items);
    expect(result.capex).toBe(0);
    expect(result.monthlyOpex).toBe(10000);
  });

  test('per-agent cost calculated correctly with effective deflection', () => {
    const items = [
      { name: 'CRM License', amount: 2000, frequency: 'per agent' }
    ];
    const params = { totalAgents: 100, effectiveDeflection: 0.2 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(2000 * 80);
  });

  test('per-agent cost without deflection', () => {
    const items = [
      { name: 'CRM License', amount: 2000, frequency: 'per agent' }
    ];
    const params = { totalAgents: 100, effectiveDeflection: 0 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(2000 * 100);
  });

  test('per-agent cost with legacy deflectionRate param', () => {
    const items = [
      { name: 'CRM License', amount: 2000, frequency: 'per agent' }
    ];
    const params = { totalAgents: 100, deflectionRate: 0.2 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(2000 * 80);
  });

  test('handles multiple items with different frequencies', () => {
    const items = [
      { name: 'Setup', amount: 50000, frequency: 'one-time' },
      { name: 'Monthly Fee', amount: 10000, frequency: 'monthly' },
      { name: 'Annual Contract', amount: 120000, frequency: 'yearly' }
    ];
    const result = calculateLedgerTotals(items);
    expect(result.capex).toBe(50000);
    expect(result.monthlyOpex).toBe(10000 + 10000); // 20,000
  });

  test('handles missing global params', () => {
    const items = [
      { name: 'Per Agent', amount: 2000, frequency: 'per agent' }
    ];
    const result = calculateLedgerTotals(items);
    expect(result.monthlyOpex).toBe(0);
  });

  test('allows negative amounts for credits', () => {
    const items = [
      { name: 'Discount', amount: -5000, frequency: 'monthly' }
    ];
    const result = calculateLedgerTotals(items);
    expect(result.monthlyOpex).toBe(-5000);
  });
});

describe('calculateMonthlyCosts', () => {
  test('combines channel costs, ledger costs, and agent salaries', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 10000, humanHandleTime: 6 }
    ];
    const rates = { 1: { client: 2, aiBot: 1, aiAgent: 3 } };
    const clientItems = [
      { name: 'Office Rent', amount: 100000, frequency: 'monthly' }
    ];
    const aiItems = [
      { name: 'Setup', amount: 50000, frequency: 'one-time' },
      { name: 'Platform', amount: 30000, frequency: 'monthly' }
    ];
    const params = { totalAgents: 100, monthlySalary: 25000, channelDeflections: { 1: 0.2 } };

    const result = calculateMonthlyCosts(channels, rates, 3.5, clientItems, aiItems, params);

    // Client: voice(2*10000*6=120000) + rent(100000) + payroll(100*25000=2500000) = 2,720,000
    expect(result.clientMonthly).toBe(2720000);
    // AI channel: bot(1*2000*3.5=7000) + agent(3*8000*6=144000) = 151,000
    // AI total: 151000 + platform(30000) + retainedPayroll(80*25000=2000000) = 2,181,000
    expect(result.aiMonthly).toBe(2181000);
    expect(result.clientCapex).toBe(0);
    expect(result.aiCapex).toBe(50000);
    expect(result.agentsReplaced).toBe(20);
    expect(result.retainedAgents).toBe(80);
  });

  test('includes agent salaries in monthly totals', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 1000, humanHandleTime: 6 }
    ];
    const params = { totalAgents: 50, monthlySalary: 30000, channelDeflections: { 1: 0.2 } };
    const result = calculateMonthlyCosts(channels, {}, 0, [], [], params);

    // Client payroll: 50 * 30000 = 1,500,000
    expect(result.clientMonthly).toBe(1500000);
    // Retained: ceil(50 * 0.8) = 40 agents
    // AI payroll: 40 * 30000 = 1,200,000
    expect(result.aiMonthly).toBe(1200000);
  });

  test('calculates admin value correctly (derived from salary)', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 1000, humanHandleTime: 6 }
    ];
    const params = {
      totalAgents: 100,
      monthlySalary: 25000,
      channelDeflections: { 1: 0.2 },
      adminHours: 160
    };

    const result = calculateMonthlyCosts(channels, {}, 3.5, [], [], params);
    // hourlyRate = 25000 / 160 = 156.25
    // adminValue = 160 * 156.25 = 25000
    expect(result.adminValue).toBe(25000);
  });

  test('handles empty inputs', () => {
    const result = calculateMonthlyCosts([], {}, 0, [], [], {});

    expect(result.clientMonthly).toBe(0);
    expect(result.aiMonthly).toBe(0);
    expect(result.clientCapex).toBe(0);
    expect(result.aiCapex).toBe(0);
  });
});

describe('calculatePayrollSaved', () => {
  test('calculates payroll saved from agents replaced', () => {
    expect(calculatePayrollSaved(20, 25000)).toBe(500000);
    expect(calculatePayrollSaved(50, 30000)).toBe(1500000);
  });

  test('includes legacy license cost if provided', () => {
    expect(calculatePayrollSaved(20, 25000, 2000)).toBe(540000);
  });

  test('handles zero values', () => {
    expect(calculatePayrollSaved(0, 25000)).toBe(0);
    expect(calculatePayrollSaved(20, 0)).toBe(0);
  });

  test('handles null values', () => {
    expect(calculatePayrollSaved(null, 25000)).toBe(0);
    expect(calculatePayrollSaved(20, null)).toBe(0);
  });
});

describe('generateROITimeline', () => {
  test('generates 25 data points (Month 0-24)', () => {
    const result = generateROITimeline(100000, 50000, 0, 50000);

    expect(result.labels.length).toBe(25);
    expect(result.clientData.length).toBe(25);
    expect(result.aiData.length).toBe(25);
  });

  test('calculates cumulative direct costs correctly', () => {
    const result = generateROITimeline(100000, 50000, 0, 50000);

    // Month 0: client=0 (capex), ai=50000 (capex)
    expect(result.clientData[0]).toBe(0);
    expect(result.aiData[0]).toBe(50000);
    // Month 1
    expect(result.clientData[1]).toBe(100000);
    expect(result.aiData[1]).toBe(100000);
    // Month 12
    expect(result.clientData[12]).toBe(1200000);
    expect(result.aiData[12]).toBe(650000);
  });

  test('both lines always increase with positive monthly costs', () => {
    const result = generateROITimeline(100000, 80000, 0, 50000);
    for (let i = 1; i < result.clientData.length; i++) {
      expect(result.clientData[i]).toBeGreaterThan(result.clientData[i - 1]);
      expect(result.aiData[i]).toBeGreaterThan(result.aiData[i - 1]);
    }
  });

  test('handles zero monthly costs', () => {
    const result = generateROITimeline(0, 0, 10000, 20000);

    // Only capex, flat lines
    expect(result.clientData[0]).toBe(10000);
    expect(result.clientData[12]).toBe(10000);
    expect(result.aiData[12]).toBe(20000);
  });

  test('includes capex at month 0', () => {
    const result = generateROITimeline(100000, 50000, 20000, 80000);
    expect(result.clientData[0]).toBe(20000);
    expect(result.aiData[0]).toBe(80000);
  });
});

describe('calculateDashboardMetrics', () => {
  test('calculates all metrics correctly (hard savings only, no adminValue)', () => {
    // clientMonthly and aiMonthly already include agent salaries
    const result = calculateDashboardMetrics(
      2500000, 2000000, 0, 50000
    );

    // monthlySavings = 2500000 - 2000000 = 500,000 (hard savings only)
    expect(result.clientMonthly).toBe(2500000);
    expect(result.aiMonthly).toBe(2000000);
    expect(result.monthlySavings).toBe(500000);
    expect(result.initialInvestment).toBe(50000);

    // costReduction = 500000 / 2500000 * 100 = 20%
    expect(result.costReduction).toBe(20);

    // year1Client = 0 + 2500000*12 = 30,000,000
    // year1AI = 50000 + 2000000*12 = 24,050,000
    // year1NetSavings = 30000000 - 24050000 = 5,950,000
    expect(result.year1NetSavings).toBe(5950000);

    // roi = 5950000 / 50000 * 100 = 11900%
    expect(result.roi).toBe(11900);
  });

  test('finds break-even month', () => {
    const result = calculateDashboardMetrics(100000, 50000, 0, 50000);
    // Month 1: client=100000, ai=50000+50000=100000 (not less)
    // Month 2: client=200000, ai=50000+100000=150000 (less!)
    expect(result.breakEvenMonth).toBe(2);
  });

  test('returns null break-even when never reached', () => {
    const result = calculateDashboardMetrics(50000, 100000, 0, 1000000);
    expect(result.breakEvenMonth).toBeNull();
  });

  test('calculates hard savings only (no admin value)', () => {
    const result = calculateDashboardMetrics(100000, 50000, 0, 0);
    // monthlySavings = 100000 - 50000 = 50,000 (hard savings only)
    expect(result.monthlySavings).toBe(50000);
  });

  test('calculates cost reduction percentage', () => {
    const result = calculateDashboardMetrics(200000, 100000, 0, 0);
    // monthlySavings = 100000, costReduction = 100000/200000*100 = 50%
    expect(result.costReduction).toBe(50);
    expect(result.monthlySavings).toBe(100000);
  });

  test('handles zero client monthly for cost reduction', () => {
    const result = calculateDashboardMetrics(0, 0, 0, 0);
    expect(result.costReduction).toBe(0);
  });

  test('calculates year 1 net savings accounting for initial investment', () => {
    const result = calculateDashboardMetrics(200000, 100000, 0, 100000);
    // year1Client = 200000*12 = 2,400,000
    // year1AI = 100000 + 100000*12 = 1,300,000
    // year1NetSavings = 1,100,000
    expect(result.year1NetSavings).toBe(1100000);
  });

  test('calculates ROI percentage', () => {
    const result = calculateDashboardMetrics(200000, 100000, 0, 100000);
    // year1NetSavings = 1,100,000
    // roi = 1100000 / 100000 * 100 = 1100%
    expect(result.roi).toBe(1100);
  });

  test('returns null ROI when no investment', () => {
    const result = calculateDashboardMetrics(200000, 100000, 0, 0);
    expect(result.roi).toBeNull();
  });
});

describe('formatCurrency', () => {
  test('formats Thai Baht correctly', () => {
    expect(formatCurrency(1000)).toBe('฿1,000');
    expect(formatCurrency(1000000)).toBe('฿1,000,000');
  });

  test('handles zero', () => {
    expect(formatCurrency(0)).toBe('฿0');
  });

  test('handles negative values', () => {
    expect(formatCurrency(-5000)).toBe('-฿5,000');
  });

  test('handles null and undefined', () => {
    expect(formatCurrency(null)).toBe('฿0');
    expect(formatCurrency(undefined)).toBe('฿0');
  });
});

describe('formatNumber', () => {
  test('formats numbers with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  test('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  test('handles null and undefined', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
  });
});

describe('Real-world scenario: Multi-channel call center with per-channel deflection', () => {
  test('Voice + Chat channels with 100 agents, per-channel deflection, split AI rates', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 },
      { id: 2, type: 'chat', volume: 2000 }
    ];
    const rates = {
      1: { client: 2, aiBot: 1, aiAgent: 5 },
      2: { client: 50, aiBot: 15, aiAgent: 30 }
    };
    const clientItems = [
      { name: 'CRM Licenses', amount: 2000, frequency: 'per agent' },
      { name: 'PBX Maintenance', amount: 120000, frequency: 'yearly' }
    ];
    const aiItems = [
      { name: 'Setup Fee', amount: 50000, frequency: 'one-time' },
      { name: 'AI Platform', amount: 30000, frequency: 'monthly' },
      { name: 'AI Licenses', amount: 1500, frequency: 'per agent' }
    ];
    const params = {
      totalAgents: 100,
      monthlySalary: 25000,
      channelDeflections: { 1: 0.2, 2: 0.2 },
      adminHours: 160
    };

    const result = calculateMonthlyCosts(channels, rates, 3.5, clientItems, aiItems, params);

    // Channel costs:
    // Voice client: 2 * 5000 * 6 = 60,000
    // Chat client: 50 * 2000 = 100,000
    // Effective deflection for ledger:
    //   Voice workload: 5000*6=30000, Chat workload: 2000*1=2000
    //   Weighted: (30000*0.2 + 2000*0.2)/(30000+2000) = 6400/32000 = 0.2
    // retainedAgents = ceil(100 * (1-0.2)) = 80
    // Ledger client: CRM(2000*80=160,000) + PBX(120000/12=10,000) = 170,000
    // Agent payroll: 100 * 25000 = 2,500,000
    // Total client: 60,000 + 100,000 + 170,000 + 2,500,000 = 2,830,000
    expect(result.clientMonthly).toBe(2830000);

    // Voice AI:
    //   bot: 1 * 1000 * 3.5 = 3,500
    //   agent: 5 * 4000 * 6 = 120,000
    //   subtotal: 123,500
    // Chat AI:
    //   bot: 15 * 400 = 6,000
    //   agent: 30 * 1600 = 48,000
    //   subtotal: 54,000
    // Ledger AI: Platform(30,000) + Licenses(1500*80=120,000) = 150,000
    // Retained payroll: 80 * 25000 = 2,000,000
    // Total AI: 123,500 + 54,000 + 150,000 + 2,000,000 = 2,327,500
    expect(result.aiMonthly).toBe(2327500);

    expect(result.aiCapex).toBe(50000);
    expect(result.agentsReplaced).toBe(20);
    // adminValue = 160 * (25000/160) = 160 * 156.25 = 25,000
    expect(result.adminValue).toBe(25000);

    // Dashboard metrics (hard savings only — no adminValue)
    const metrics = calculateDashboardMetrics(
      result.clientMonthly, result.aiMonthly,
      result.clientCapex, result.aiCapex
    );

    // monthlySavings = 2830000 - 2327500 = 502,500 (hard savings only)
    // costReduction = 502500 / 2830000 * 100 ≈ 18%
    expect(metrics.clientMonthly).toBe(2830000);
    expect(metrics.aiMonthly).toBe(2327500);
    expect(metrics.monthlySavings).toBe(502500);
    expect(metrics.costReduction).toBe(18);
    expect(metrics.initialInvestment).toBe(50000);
    expect(metrics.breakEvenMonth).toBe(1);

    // year1Client = 0 + 2830000*12 = 33,960,000
    // year1AI = 50000 + 2327500*12 = 50000 + 27,930,000 = 27,980,000
    // year1Net = 33960000 - 27980000 = 5,980,000
    // roi = 5980000 / 50000 * 100 = 11960%
    expect(metrics.year1NetSavings).toBe(5980000);
    expect(metrics.roi).toBe(11960);

    // Payroll saved is still tracked
    const payrollSaved = calculatePayrollSaved(20, 25000);
    expect(payrollSaved).toBe(500000);
  });
});

describe('calculateEfficiencyGains', () => {
  test('calculates AI capacity from per-channel deflection', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 }
    ];
    const result = calculateEfficiencyGains({
      totalAgents: 100,
      monthlySalary: 25000,
      channelDeflections: { 1: 0.2 },
      adminHours: 160,
      channels
    });

    expect(result.aiCapacity).toBe(20);
    expect(result.totalAgents).toBe(100);
    expect(result.automatedPct).toBe(20);
  });

  test('calculates hours reclaimed and agent equivalent', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 }
    ];
    const result = calculateEfficiencyGains({
      totalAgents: 100,
      monthlySalary: 25000,
      channelDeflections: { 1: 0.2 },
      adminHours: 160,
      channels
    });

    expect(result.hoursReclaimed).toBe(160);
    // 160 / 160 = 1.0
    expect(result.agentEquivalent).toBe(1.0);
  });

  test('calculates extra serving capacity with voice+chat blended handle time', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 },
      { id: 2, type: 'chat', volume: 2000, humanHandleTime: 10 }
    ];
    const result = calculateEfficiencyGains({
      totalAgents: 100,
      monthlySalary: 25000,
      channelDeflections: { 1: 0.2, 2: 0.2 },
      adminHours: 160,
      channels
    });

    // Blended: (5000*6 + 2000*10) / (5000+2000) = (30000+20000)/7000 = 50000/7000 ≈ 7.14
    // extraCapacity = 160 * 60 / 7.14 ≈ 1344
    const blended = 50000 / 7000;
    const expected = Math.round(160 * 60 / blended);
    expect(result.extraCapacity).toBe(expected);
  });

  test('excludes SMS from handle time calculation', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 1000, humanHandleTime: 5 },
      { id: 2, type: 'sms', volume: 5000, humanHandleTime: 0 }
    ];
    const result = calculateEfficiencyGains({
      totalAgents: 50,
      monthlySalary: 30000,
      channelDeflections: { 1: 0.3 },
      adminHours: 80,
      channels
    });

    // Only voice counted: blended = 5 min
    // extraCapacity = 80 * 60 / 5 = 960
    expect(result.extraCapacity).toBe(960);
  });

  test('calculates capacity increase percentage', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 }
    ];
    const result = calculateEfficiencyGains({
      totalAgents: 100,
      monthlySalary: 25000,
      channelDeflections: { 1: 0.2 },
      adminHours: 160,
      channels
    });

    // retainedAgents = 80, capacityBase = 80*160 = 12800
    // capacityIncrease = 160/12800*100 = 1%
    expect(result.capacityIncrease).toBe(1);
  });

  test('calculates estimated value from salary', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 }
    ];
    const result = calculateEfficiencyGains({
      totalAgents: 100,
      monthlySalary: 25000,
      channelDeflections: { 1: 0.2 },
      adminHours: 160,
      channels
    });

    // hourlyRate = 25000/160 = 156.25
    // estimatedValue = 160 * 156.25 = 25000
    expect(result.estimatedValue).toBe(25000);
  });

  test('handles zero/null inputs gracefully', () => {
    const result = calculateEfficiencyGains({});
    expect(result.aiCapacity).toBe(0);
    expect(result.totalAgents).toBe(0);
    expect(result.automatedPct).toBe(0);
    expect(result.hoursReclaimed).toBe(0);
    expect(result.agentEquivalent).toBe(0);
    expect(result.extraCapacity).toBe(0);
    expect(result.capacityIncrease).toBe(0);
    expect(result.estimatedValue).toBe(0);
  });

  test('weighted deflection across channels with different rates', () => {
    const channels = [
      { id: 1, type: 'voice', volume: 10000, humanHandleTime: 6 },
      { id: 2, type: 'chat', volume: 5000, humanHandleTime: 1 }
    ];
    const result = calculateEfficiencyGains({
      totalAgents: 100,
      monthlySalary: 25000,
      channelDeflections: { 1: 0.3, 2: 0.1 },
      adminHours: 160,
      channels
    });

    // effectiveDeflection:
    //   voice workload: 10000*6=60000, chat workload: 5000*1=5000
    //   weighted: (60000*0.3 + 5000*0.1)/65000 = (18000+500)/65000 ≈ 0.2846
    //   automatedPct = round(0.2846 * 100) = 28
    expect(result.automatedPct).toBe(28);
    // retainedAgents = ceil(100 * (1-0.2846)) = ceil(71.54) = 72
    expect(result.aiCapacity).toBe(100 - 72); // 28
  });
});

describe('calculatePerInteractionCost', () => {
  test('calculates per-interaction cost with mixed channels', () => {
    const channels = [
      { volume: 5000 },
      { volume: 2000 },
      { volume: 3000 }
    ];
    const result = calculatePerInteractionCost(1000000, 500000, channels);

    // totalVolume = 10000
    // client = 1000000/10000 = 100
    // ai = 500000/10000 = 50
    expect(result.client).toBe(100);
    expect(result.ai).toBe(50);
  });

  test('handles zero volume', () => {
    const channels = [{ volume: 0 }];
    const result = calculatePerInteractionCost(100000, 50000, channels);

    expect(result.client).toBe(0);
    expect(result.ai).toBe(0);
  });

  test('handles empty channels', () => {
    const result = calculatePerInteractionCost(100000, 50000, []);

    expect(result.client).toBe(0);
    expect(result.ai).toBe(0);
  });

  test('handles null channels', () => {
    const result = calculatePerInteractionCost(100000, 50000, null);

    expect(result.client).toBe(0);
    expect(result.ai).toBe(0);
  });
});
