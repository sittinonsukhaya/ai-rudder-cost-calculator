import { describe, test, expect } from 'vitest';
import {
  calculateRetainedAgents,
  calculateAdminValue,
  calculateLedgerTotals,
  calculateMonthlyCosts,
  calculatePayrollSaved,
  generateROITimeline,
  calculateDashboardMetrics,
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
    expect(calculateRetainedAgents(100, 0.25)).toBe(75); // 75 (exact)
    expect(calculateRetainedAgents(99, 0.2)).toBe(80); // 79.2 rounded up
    expect(calculateRetainedAgents(95, 0.3)).toBe(67); // 66.5 rounded up
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

  test('per-minute cost calculated correctly', () => {
    const items = [
      { name: 'SIP Minutes', amount: 2, frequency: 'per minute', isAISide: false }
    ];
    const params = { volume: 10000, humanTime: 5, aiTime: 3 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(2 * 10000 * 5); // 100,000
  });

  test('per-minute cost uses aiTime for AI side', () => {
    const items = [
      { name: 'AI SIP Minutes', amount: 4, frequency: 'per minute', isAISide: true }
    ];
    const params = { volume: 10000, humanTime: 6, aiTime: 3.5 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(4 * 10000 * 3.5); // 140,000
  });

  test('per-session cost calculated correctly', () => {
    const items = [
      { name: 'Per Call Fee', amount: 5, frequency: 'per session' }
    ];
    const params = { volume: 10000 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(5 * 10000); // 50,000
  });

  test('per-agent cost calculated correctly with deflection', () => {
    const items = [
      { name: 'CRM License', amount: 2000, frequency: 'per agent' }
    ];
    const params = { totalAgents: 100, deflectionRate: 0.2 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(2000 * 80); // 160,000 (80 retained agents)
  });

  test('per-agent cost without deflection', () => {
    const items = [
      { name: 'CRM License', amount: 2000, frequency: 'per agent' }
    ];
    const params = { totalAgents: 100, deflectionRate: 0 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(2000 * 100); // 200,000
  });

  test('handles multiple items with different frequencies', () => {
    const items = [
      { name: 'Setup', amount: 50000, frequency: 'one-time' },
      { name: 'Monthly Fee', amount: 10000, frequency: 'monthly' },
      { name: 'Annual Contract', amount: 120000, frequency: 'yearly' },
      { name: 'Per Minute', amount: 2, frequency: 'per minute', isAISide: false }
    ];
    const params = { volume: 10000, humanTime: 5 };
    const result = calculateLedgerTotals(items, params);
    expect(result.capex).toBe(50000);
    expect(result.monthlyOpex).toBe(10000 + 10000 + 100000); // 120,000
  });

  test('handles zero volume gracefully', () => {
    const items = [
      { name: 'Per Minute', amount: 2, frequency: 'per minute' }
    ];
    const params = { volume: 0, humanTime: 5 };
    const result = calculateLedgerTotals(items, params);
    expect(result.monthlyOpex).toBe(0);
  });

  test('handles missing global params', () => {
    const items = [
      { name: 'Per Agent', amount: 2000, frequency: 'per agent' }
    ];
    const result = calculateLedgerTotals(items);
    expect(result.monthlyOpex).toBe(0); // No agents = 0 cost
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
  test('calculates costs for both sides correctly', () => {
    const clientItems = [
      { name: 'Agent Salaries', amount: 1000000, frequency: 'monthly' }
    ];
    const aiItems = [
      { name: 'Setup', amount: 50000, frequency: 'one-time' },
      { name: 'Platform', amount: 30000, frequency: 'monthly' }
    ];
    const params = { totalAgents: 100, deflectionRate: 0.2 };

    const result = calculateMonthlyCosts(clientItems, aiItems, params);

    expect(result.clientMonthly).toBe(1000000);
    expect(result.aiMonthly).toBe(30000);
    expect(result.clientCapex).toBe(0);
    expect(result.aiCapex).toBe(50000);
    expect(result.agentsReplaced).toBe(20);
    expect(result.retainedAgents).toBe(80);
  });

  test('calculates admin value correctly', () => {
    const params = {
      totalAgents: 100,
      deflectionRate: 0.2,
      adminHours: 160,
      hourlyRate: 150
    };

    const result = calculateMonthlyCosts([], [], params);

    expect(result.adminValue).toBe(24000);
  });

  test('handles empty item arrays', () => {
    const result = calculateMonthlyCosts([], [], {});

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

  test('calculates cumulative costs correctly', () => {
    const result = generateROITimeline(100000, 50000, 0, 50000);

    // Month 0
    expect(result.clientData[0]).toBe(0);
    expect(result.aiData[0]).toBe(50000);

    // Month 1
    expect(result.clientData[1]).toBe(100000);
    expect(result.aiData[1]).toBe(100000);

    // Month 12
    expect(result.clientData[12]).toBe(1200000);
    expect(result.aiData[12]).toBe(50000 + 600000);
  });

  test('finds break-even month correctly', () => {
    const result = generateROITimeline(100000, 50000, 0, 50000);
    expect(result.breakEvenMonth).toBe(2); // AI becomes cheaper at month 2
  });

  test('returns null break-even when AI never becomes cheaper', () => {
    const result = generateROITimeline(50000, 100000, 0, 1000000);
    expect(result.breakEvenMonth).toBeNull();
  });

  test('applies admin value offset to AI costs', () => {
    const result = generateROITimeline(100000, 50000, 0, 50000, 10000);

    // AI monthly = 50000 - 10000 = 40000
    // Month 1: 50000 + (40000 * 1) = 90000
    expect(result.aiData[1]).toBe(90000);
  });

  test('handles zero monthly costs', () => {
    const result = generateROITimeline(0, 0, 10000, 20000);

    expect(result.clientData[12]).toBe(10000);
    expect(result.aiData[12]).toBe(20000);
    expect(result.breakEvenMonth).toBeNull();
  });
});

describe('calculateDashboardMetrics', () => {
  test('calculates all metrics correctly', () => {
    const result = calculateDashboardMetrics(
      2000000,  // clientMonthly
      300000,   // aiMonthly
      0,        // clientCapex
      50000,    // aiCapex
      24000,    // adminValue
      500000    // payrollSaved
    );

    expect(result.initialInvestment).toBe(50000);
    expect(result.monthlySavings).toBe(2000000 - (300000 - 24000)); // 1,724,000
    expect(result.payrollSaved).toBe(500000);
    expect(result.year1NetSavings).toBe(
      (0 + 2000000 * 12) - (50000 + (300000 - 24000) * 12)
    ); // ~20.6M
  });

  test('finds break-even month', () => {
    const result = calculateDashboardMetrics(
      100000,
      50000,
      0,
      50000,
      0,
      0
    );

    expect(result.breakEvenMonth).toBe(2);
  });

  test('returns null break-even when never reached', () => {
    const result = calculateDashboardMetrics(
      50000,
      100000,
      0,
      1000000,
      0,
      0
    );

    expect(result.breakEvenMonth).toBeNull();
  });

  test('applies admin value offset', () => {
    const result = calculateDashboardMetrics(
      100000,
      50000,
      0,
      0,
      10000,  // adminValue
      0
    );

    // Monthly savings = 100000 - (50000 - 10000) = 60000
    expect(result.monthlySavings).toBe(60000);
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

describe('Real-world scenarios', () => {
  test('Example: Basic call center with 100 agents, 20% deflection', () => {
    const clientItems = [
      { name: 'Agent Salaries', amount: 2500000, frequency: 'monthly' },
      { name: 'CRM Licenses', amount: 2000, frequency: 'per agent' },
      { name: 'SIP Minutes', amount: 2, frequency: 'per minute', isAISide: false },
      { name: 'PBX Maintenance', amount: 120000, frequency: 'yearly' }
    ];

    const aiItems = [
      { name: 'Setup Fee', amount: 50000, frequency: 'one-time' },
      { name: 'AI Platform', amount: 30000, frequency: 'monthly' },
      { name: 'AI Licenses', amount: 1500, frequency: 'per agent' },
      { name: 'AI SIP Minutes', amount: 4, frequency: 'per minute', isAISide: true }
    ];

    const params = {
      volume: 10000,
      humanTime: 6,
      aiTime: 3.5,
      totalAgents: 100,
      deflectionRate: 0.2,
      adminHours: 160,
      hourlyRate: 150
    };

    const result = calculateMonthlyCosts(clientItems, aiItems, params);

    // Client costs
    // Salaries: 2,500,000
    // CRM: 2000 × 80 = 160,000
    // SIP: 2 × 10000 × 6 = 120,000
    // PBX: 120000/12 = 10,000
    // Total: 2,790,000
    expect(result.clientMonthly).toBe(2790000);

    // AI costs
    // Platform: 30,000
    // Licenses: 1500 × 80 = 120,000
    // SIP: 4 × 10000 × 3.5 = 140,000
    // Total: 290,000
    expect(result.aiMonthly).toBe(290000);

    expect(result.aiCapex).toBe(50000);
    expect(result.agentsReplaced).toBe(20);
    expect(result.adminValue).toBe(24000);

    // Calculate payroll saved
    const payrollSaved = calculatePayrollSaved(20, 25000, 2000);
    expect(payrollSaved).toBe(540000);

    // Dashboard metrics
    const metrics = calculateDashboardMetrics(
      result.clientMonthly,
      result.aiMonthly,
      result.clientCapex,
      result.aiCapex,
      result.adminValue,
      payrollSaved
    );

    expect(metrics.initialInvestment).toBe(50000);
    expect(metrics.monthlySavings).toBe(2790000 - (290000 - 24000)); // 2,524,000
    expect(metrics.payrollSaved).toBe(540000);
    expect(metrics.breakEvenMonth).toBe(1); // Should break even very fast
  });
});
