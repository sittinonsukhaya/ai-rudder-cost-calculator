/**
 * AI Rudder Cost Calculator - UI Module
 *
 * Handles all DOM manipulation and user interactions
 */

import {
  calculateMonthlyCosts,
  calculatePayrollSaved,
  generateROITimeline,
  calculateDashboardMetrics,
  formatCurrency,
  formatNumber
} from './calculator.js';

import {
  saveScenario,
  loadScenario,
  listScenarios,
  deleteScenario
} from './storage.js';

// Global state
let clientItems = [];
let aiItems = [];
let roiChart = null;

/**
 * Initialize the application
 */
function init() {
  setupEventListeners();
  loadScenariosDropdown();
  recalculate();

  // Set default values
  document.getElementById('totalVolume').value = 10000;
  document.getElementById('humanTime').value = 6;
  document.getElementById('aiTime').value = 3.5;
  document.getElementById('totalAgents').value = 100;
  document.getElementById('monthlySalary').value = 25000;
  document.getElementById('deflectionRate').value = 20;
  document.getElementById('adminHours').value = 160;
  document.getElementById('hourlyRate').value = 150;

  recalculate();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Global parameters
  document.getElementById('totalVolume').addEventListener('input', recalculate);
  document.getElementById('humanTime').addEventListener('input', recalculate);
  document.getElementById('aiTime').addEventListener('input', recalculate);
  document.getElementById('totalAgents').addEventListener('input', recalculate);
  document.getElementById('monthlySalary').addEventListener('input', recalculate);

  // Operation efficiency
  document.getElementById('deflectionRate').addEventListener('input', handleDeflectionChange);
  document.getElementById('adminHours').addEventListener('input', recalculate);
  document.getElementById('hourlyRate').addEventListener('input', recalculate);

  // Add item buttons
  document.getElementById('addClientItem').addEventListener('click', () => addCostItem('client'));
  document.getElementById('addAIItem').addEventListener('click', () => addCostItem('ai'));

  // Scenario management
  document.getElementById('saveScenarioBtn').addEventListener('click', handleSaveScenario);
  document.getElementById('loadScenarioBtn').addEventListener('click', handleLoadScenario);
  document.getElementById('deleteScenarioBtn').addEventListener('click', handleDeleteScenario);
}

/**
 * Handle deflection rate slider change
 */
function handleDeflectionChange(e) {
  const value = e.target.value;
  document.getElementById('deflectionValue').textContent = `${value}%`;
  recalculate();
}

/**
 * Get global parameters from UI
 */
function getGlobalParams() {
  return {
    volume: parseFloat(document.getElementById('totalVolume').value) || 0,
    humanTime: parseFloat(document.getElementById('humanTime').value) || 0,
    aiTime: parseFloat(document.getElementById('aiTime').value) || 0,
    totalAgents: parseFloat(document.getElementById('totalAgents').value) || 0,
    monthlySalary: parseFloat(document.getElementById('monthlySalary').value) || 0,
    deflectionRate: parseFloat(document.getElementById('deflectionRate').value) / 100 || 0,
    adminHours: parseFloat(document.getElementById('adminHours').value) || 0,
    hourlyRate: parseFloat(document.getElementById('hourlyRate').value) || 0
  };
}

/**
 * Add a cost item
 */
function addCostItem(side) {
  const item = {
    id: Date.now(),
    name: '',
    amount: 0,
    frequency: 'monthly',
    category: 'technology'
  };

  if (side === 'client') {
    clientItems.push(item);
  } else {
    aiItems.push(item);
  }

  renderCostItems();
  recalculate();
}

/**
 * Remove a cost item
 */
function removeCostItem(side, id) {
  if (side === 'client') {
    clientItems = clientItems.filter(item => item.id !== id);
  } else {
    aiItems = aiItems.filter(item => item.id !== id);
  }

  renderCostItems();
  recalculate();
}

/**
 * Update a cost item
 */
function updateCostItem(side, id, field, value) {
  const items = side === 'client' ? clientItems : aiItems;
  const item = items.find(i => i.id === id);

  if (item) {
    if (field === 'amount') {
      item[field] = parseFloat(value) || 0;
    } else {
      item[field] = value;
    }
    recalculate();
  }
}

/**
 * Render cost items
 */
function renderCostItems() {
  renderSideItems('client', clientItems);
  renderSideItems('ai', aiItems);
}

/**
 * Render items for one side
 */
function renderSideItems(side, items) {
  const container = document.getElementById(side === 'client' ? 'clientItems' : 'aiItems');

  if (items.length === 0) {
    container.innerHTML = '<div class="text-center text-slate-400 py-8">No cost items added yet</div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cost-item">
      <div class="grid grid-cols-12 gap-2 items-center">
        <div class="col-span-4">
          <input
            type="text"
            value="${item.name}"
            placeholder="Cost Name"
            class="text-sm"
            oninput="window.updateItem('${side}', ${item.id}, 'name', this.value)"
          >
        </div>
        <div class="col-span-3">
          <input
            type="number"
            value="${item.amount}"
            placeholder="Amount"
            min="0"
            step="100"
            class="text-sm"
            oninput="window.updateItem('${side}', ${item.id}, 'amount', this.value)"
          >
        </div>
        <div class="col-span-3">
          <select
            class="text-sm"
            onchange="window.updateItem('${side}', ${item.id}, 'frequency', this.value)"
          >
            <option value="one-time" ${item.frequency === 'one-time' ? 'selected' : ''}>One-time</option>
            <option value="monthly" ${item.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
            <option value="yearly" ${item.frequency === 'yearly' ? 'selected' : ''}>Yearly</option>
            <option value="per minute" ${item.frequency === 'per minute' ? 'selected' : ''}>Per Minute</option>
            <option value="per session" ${item.frequency === 'per session' ? 'selected' : ''}>Per Session</option>
            <option value="per agent" ${item.frequency === 'per agent' ? 'selected' : ''}>Per Agent</option>
          </select>
        </div>
        <div class="col-span-2 text-right">
          <button
            onclick="window.removeItem('${side}', ${item.id})"
            class="text-red-500 hover:text-red-700 p-2"
            title="Remove item"
          >
            <i data-feather="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Re-initialize Feather icons
  if (window.feather) {
    feather.replace();
  }
}

/**
 * Recalculate everything and update UI
 */
function recalculate() {
  const params = getGlobalParams();

  // Calculate monthly costs
  const results = calculateMonthlyCosts(clientItems, aiItems, params);

  // Calculate payroll saved
  const payrollSaved = calculatePayrollSaved(
    results.agentsReplaced,
    params.monthlySalary,
    0 // No legacy license cost tracked separately for now
  );

  // Update efficiency offset displays
  document.getElementById('agentsReplaced').textContent =
    `${formatNumber(results.agentsReplaced)} of ${formatNumber(params.totalAgents)}`;
  document.getElementById('trafficToAI').textContent =
    `${formatNumber(params.deflectionRate * 100)}%`;
  document.getElementById('payrollDisplay').textContent =
    `${formatCurrency(payrollSaved)}/mo`;
  document.getElementById('adminValueDisplay').textContent =
    `${formatCurrency(results.adminValue)}/mo`;

  // Calculate dashboard metrics
  const metrics = calculateDashboardMetrics(
    results.clientMonthly,
    results.aiMonthly,
    results.clientCapex,
    results.aiCapex,
    results.adminValue,
    payrollSaved
  );

  // Update dashboard
  document.getElementById('metricInitialInvestment').textContent =
    formatCurrency(metrics.initialInvestment);
  document.getElementById('metricMonthlySavings').textContent =
    formatCurrency(metrics.monthlySavings);
  document.getElementById('metricPayrollSaved').textContent =
    formatCurrency(metrics.payrollSaved);
  document.getElementById('metricYear1Savings').textContent =
    formatCurrency(metrics.year1NetSavings);
  document.getElementById('metricBreakEven').textContent =
    metrics.breakEvenMonth !== null ? `Month ${metrics.breakEvenMonth}` : 'N/A';

  // Update chart
  updateChart(results, params);
}

/**
 * Update ROI chart
 */
function updateChart(results, params) {
  const timeline = generateROITimeline(
    results.clientMonthly,
    results.aiMonthly,
    results.clientCapex,
    results.aiCapex,
    results.adminValue
  );

  const ctx = document.getElementById('roiChart').getContext('2d');

  if (roiChart) {
    roiChart.destroy();
  }

  roiChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeline.labels,
      datasets: [
        {
          label: 'Client Current State',
          data: timeline.clientData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          tension: 0.1,
          fill: false
        },
        {
          label: 'AI Rudder Solution',
          data: timeline.aiData,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 3,
          tension: 0.1,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: { size: 14, weight: '500' },
            padding: 15
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          },
          grid: {
            color: '#e5e7eb'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Handle save scenario
 */
function handleSaveScenario() {
  const name = prompt('Enter scenario name:');
  if (!name) return;

  const data = {
    globalParams: getGlobalParams(),
    clientItems: clientItems.map(({ id, ...rest }) => rest), // Remove IDs
    aiItems: aiItems.map(({ id, ...rest }) => rest)
  };

  if (saveScenario(name, data)) {
    alert(`Scenario "${name}" saved successfully!`);
    loadScenariosDropdown();
  } else {
    alert('Failed to save scenario');
  }
}

/**
 * Handle load scenario
 */
function handleLoadScenario() {
  const dropdown = document.getElementById('scenarioDropdown');
  const name = dropdown.value;

  if (!name) {
    alert('Please select a scenario from the dropdown');
    return;
  }

  const scenario = loadScenario(name);
  if (!scenario) {
    alert('Failed to load scenario');
    return;
  }

  // Load global params
  const params = scenario.globalParams || {};
  document.getElementById('totalVolume').value = params.volume || 0;
  document.getElementById('humanTime').value = params.humanTime || 0;
  document.getElementById('aiTime').value = params.aiTime || 0;
  document.getElementById('totalAgents').value = params.totalAgents || 0;
  document.getElementById('monthlySalary').value = params.monthlySalary || 0;
  document.getElementById('deflectionRate').value = (params.deflectionRate || 0) * 100;
  document.getElementById('deflectionValue').textContent = `${Math.round((params.deflectionRate || 0) * 100)}%`;
  document.getElementById('adminHours').value = params.adminHours || 0;
  document.getElementById('hourlyRate').value = params.hourlyRate || 0;

  // Load items (add IDs back)
  clientItems = (scenario.clientItems || []).map(item => ({
    ...item,
    id: Date.now() + Math.random()
  }));

  aiItems = (scenario.aiItems || []).map(item => ({
    ...item,
    id: Date.now() + Math.random()
  }));

  renderCostItems();
  recalculate();

  alert(`Scenario "${name}" loaded successfully!`);
}

/**
 * Handle delete scenario
 */
function handleDeleteScenario() {
  const dropdown = document.getElementById('scenarioDropdown');
  const name = dropdown.value;

  if (!name) {
    alert('Please select a scenario from the dropdown');
    return;
  }

  if (!confirm(`Are you sure you want to delete scenario "${name}"?`)) {
    return;
  }

  if (deleteScenario(name)) {
    alert(`Scenario "${name}" deleted successfully!`);
    loadScenariosDropdown();
  } else {
    alert('Failed to delete scenario');
  }
}

/**
 * Load scenarios dropdown
 */
function loadScenariosDropdown() {
  const dropdown = document.getElementById('scenarioDropdown');
  const scenarios = listScenarios();

  dropdown.innerHTML = '<option value="">Select a scenario...</option>';

  scenarios.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.name;
    option.textContent = scenario.name;
    dropdown.appendChild(option);
  });
}

// Expose functions to window for inline event handlers
window.updateItem = updateCostItem;
window.removeItem = removeCostItem;

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
