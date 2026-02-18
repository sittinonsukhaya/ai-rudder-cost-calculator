/**
 * AI Rudder Cost Calculator - App Orchestrator (ES Module)
 *
 * Wires state, UI, storage, chart, i18n. Sets up event delegation.
 * Single entry point loaded by index.html.
 *
 * KEY DESIGN: subscribe() only triggers recalculate() (updates dashboard,
 * chart, derived metrics). DOM re-renders for channels, rates, and cost items
 * happen ONLY on structural changes (add/remove/type-change/scenario-load)
 * to prevent input focus loss.
 */

import { getState, setState, subscribe, resetState, generateChannelId } from './state.js';
import {
  calculateMonthlyCosts,
  calculatePayrollSaved,
  calculateDashboardMetrics,
  calculateEfficiencyGains,
  calculatePerInteractionCost,
  generateROITimeline
} from './calculator.js';
import { saveScenario, loadScenario, listScenarios, deleteScenario } from './storage.js';
import {
  renderChannels,
  renderRates,
  renderCostItems,
  renderDashboard,
  renderEfficiencyGains,
  renderScenariosDropdown,
  showModal,
  showToast
} from './ui.js';
import { updateChartData, destroyChart } from './chart.js';
import { t, setLanguage, getLanguage, translatePage } from './i18n.js';

// ===== DOM References =====
const channelsContainer = document.getElementById('channelsContainer');
const ratesContainer = document.getElementById('ratesContainer');
const clientItemsContainer = document.getElementById('clientItems');
const aiItemsContainer = document.getElementById('aiItems');

// ===== Recalculate (no DOM re-render) =====

function recalculate() {
  const state = getState();

  const results = calculateMonthlyCosts(
    state.channels,
    state.rates,
    state.aiHandleTime,
    state.clientItems,
    state.aiItems,
    {
      totalAgents: state.totalAgents,
      monthlySalary: state.monthlySalary,
      deflectionRate: state.deflectionRate,
      adminHours: state.adminHours
    }
  );

  const metrics = calculateDashboardMetrics(
    results.clientMonthly,
    results.aiMonthly,
    results.clientCapex,
    results.aiCapex
  );

  const perInteractionCosts = calculatePerInteractionCost(
    results.clientMonthly,
    results.aiMonthly,
    state.channels
  );

  renderDashboard(metrics, perInteractionCosts);

  const efficiencyGains = calculateEfficiencyGains({
    totalAgents: state.totalAgents,
    monthlySalary: state.monthlySalary,
    deflectionRate: state.deflectionRate,
    adminHours: state.adminHours,
    channels: state.channels
  });

  renderEfficiencyGains(efficiencyGains);

  const timeline = generateROITimeline(
    results.clientMonthly,
    results.aiMonthly,
    results.clientCapex,
    results.aiCapex
  );

  updateChartData(timeline);
}

// ===== Structural Render Helpers =====

/**
 * Re-render all dynamic DOM sections (channels, rates, cost items).
 * Called on init and scenario load.
 */
function renderStructure() {
  const state = getState();
  renderChannels(channelsContainer, state.channels);
  renderRates(ratesContainer, state.channels, state.rates, state.aiHandleTime);
  renderCostItems(clientItemsContainer, state.clientItems, 'client');
  renderCostItems(aiItemsContainer, state.aiItems, 'ai');
}

/**
 * Re-render only channels and rates table.
 * Called when channels are added, removed, or change type.
 */
function renderChannelsAndRates() {
  const state = getState();
  renderChannels(channelsContainer, state.channels);
  renderRates(ratesContainer, state.channels, state.rates, state.aiHandleTime);
}

// ===== Language Switch =====

/**
 * Switch UI language, re-translate everything, and re-render dynamic content.
 */
function switchLanguage(lang) {
  setLanguage(lang);
  translatePage();
  renderStructure();
  destroyChart();
  recalculate();

  // Update toggle button active states
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Wire language toggle buttons
document.querySelectorAll('.lang-toggle button').forEach(btn => {
  btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
});

// ===== State Subscription =====
// Only recalculate on state changes - never re-render dynamic DOM
subscribe(() => recalculate());

// ===== Event Delegation =====

// --- Section 1: Client Operations (fixed fields) ---
document.getElementById('totalAgents').addEventListener('input', (e) => {
  setState({ totalAgents: parseFloat(e.target.value) || 0 });
});

document.getElementById('monthlySalary').addEventListener('input', (e) => {
  setState({ monthlySalary: parseFloat(e.target.value) || 0 });
});

// --- Section 1: Channels - value changes (volume, handle time) ---
channelsContainer.addEventListener('input', (e) => {
  const el = e.target;
  const channelId = Number(el.dataset.channelId);
  const field = el.dataset.field;

  if (!channelId || !field) return;
  // Type changes handled by 'change' event below
  if (field === 'type') return;

  const state = getState();
  const channels = state.channels.map(ch => {
    if (ch.id !== channelId) return ch;
    const updated = { ...ch };
    if (field === 'volume') {
      updated.volume = parseFloat(el.value) || 0;
    } else if (field === 'humanHandleTime') {
      updated.humanHandleTime = parseFloat(el.value) || 0;
    } else if (field === 'name') {
      updated.name = el.value;
    }
    return updated;
  });

  setState({ channels });
  // Re-render rates table when name changes (safe: user is typing in channels, not rates)
  if (field === 'name') {
    const updated = getState();
    renderRates(ratesContainer, updated.channels, updated.rates, updated.aiHandleTime);
  }
});

// --- Section 1: Channel type dropdown change (structural) ---
channelsContainer.addEventListener('change', (e) => {
  const el = e.target;
  if (el.tagName !== 'SELECT' || el.dataset.field !== 'type') return;

  const channelId = Number(el.dataset.channelId);
  const state = getState();
  const channels = state.channels.map(ch => {
    if (ch.id !== channelId) return ch;
    const updated = { ...ch, type: el.value };
    if (el.value === 'voice') {
      if (!updated.humanHandleTime) updated.humanHandleTime = 6;
    } else if (el.value === 'chat') {
      if (!updated.humanHandleTime) updated.humanHandleTime = 5;
    } else {
      delete updated.humanHandleTime;
    }
    return updated;
  });

  const rates = { ...state.rates };
  if (!rates[channelId]) {
    rates[channelId] = { client: 0, aiBot: 0, aiAgent: 0 };
  }

  setState({ channels, rates });
  // Structural change: re-render channels and rates
  renderChannelsAndRates();
});

// --- Section 1: Remove channel (structural) ---
channelsContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="remove-channel"]');
  if (!btn) return;

  const channelId = Number(btn.dataset.channelId);
  const state = getState();
  const channels = state.channels.filter(ch => ch.id !== channelId);
  const rates = { ...state.rates };
  delete rates[channelId];
  setState({ channels, rates });
  // Structural change: re-render channels and rates
  renderChannelsAndRates();
});

// --- Section 1: Add channel (structural) ---
document.getElementById('addChannelBtn').addEventListener('click', () => {
  const state = getState();
  const newId = generateChannelId();
  const channels = [...state.channels, {
    id: newId,
    type: 'voice',
    name: '',
    volume: 0,
    humanHandleTime: 6
  }];
  const rates = { ...state.rates, [newId]: { client: 0, aiBot: 0, aiAgent: 0 } };
  setState({ channels, rates });
  // Structural change: re-render channels and rates
  renderChannelsAndRates();
});

// --- Section 2: Rates - value changes ---
ratesContainer.addEventListener('input', (e) => {
  const el = e.target;

  // AI Handle Time field
  if (el.id === 'aiHandleTime') {
    setState({ aiHandleTime: parseFloat(el.value) || 0 });
    return;
  }

  // Channel rate inputs
  const channelId = Number(el.dataset.channelId);
  const rateSide = el.dataset.rateSide;

  if (!channelId || !rateSide) return;

  const state = getState();
  const rates = { ...state.rates };
  const existing = rates[channelId] || { client: 0, ai: 0 };
  rates[channelId] = {
    ...existing,
    [rateSide]: parseFloat(el.value) || 0
  };

  setState({ rates });
  // No DOM re-render - recalculate fires via subscribe
});

// --- Section 3: Additional Costs - value changes ---
function handleCostItemInput(e) {
  const el = e.target;
  const itemId = Number(el.dataset.itemId);
  const side = el.dataset.side;
  const field = el.dataset.field;

  if (!itemId || !side || !field) return;

  const state = getState();
  const key = side === 'client' ? 'clientItems' : 'aiItems';
  const items = state[key].map(item => {
    if (item.id !== itemId) return item;
    const updated = { ...item };
    if (field === 'amount') {
      updated.amount = parseFloat(el.value) || 0;
    } else {
      updated[field] = el.value;
    }
    return updated;
  });

  setState({ [key]: items });
  // No DOM re-render - recalculate fires via subscribe
}

clientItemsContainer.addEventListener('input', handleCostItemInput);
clientItemsContainer.addEventListener('change', handleCostItemInput);
aiItemsContainer.addEventListener('input', handleCostItemInput);
aiItemsContainer.addEventListener('change', handleCostItemInput);

// --- Section 3: Add/Remove cost items (structural) ---
document.querySelector('.cost-columns').addEventListener('click', (e) => {
  // Add item
  const addBtn = e.target.closest('[data-action="add-item"]');
  if (addBtn) {
    const side = addBtn.dataset.side;
    const state = getState();
    const newItem = {
      id: Date.now() + Math.random(),
      name: '',
      amount: 0,
      frequency: 'monthly'
    };

    if (side === 'client') {
      setState({ clientItems: [...state.clientItems, newItem] });
      renderCostItems(clientItemsContainer, getState().clientItems, 'client');
    } else {
      setState({ aiItems: [...state.aiItems, newItem] });
      renderCostItems(aiItemsContainer, getState().aiItems, 'ai');
    }
    return;
  }

  // Remove item
  const removeBtn = e.target.closest('[data-action="remove-item"]');
  if (removeBtn) {
    const itemId = Number(removeBtn.dataset.itemId);
    const side = removeBtn.dataset.side;
    const state = getState();

    if (side === 'client') {
      setState({ clientItems: state.clientItems.filter(i => i.id !== itemId) });
      renderCostItems(clientItemsContainer, getState().clientItems, 'client');
    } else {
      setState({ aiItems: state.aiItems.filter(i => i.id !== itemId) });
      renderCostItems(aiItemsContainer, getState().aiItems, 'ai');
    }
  }
});

// --- Section 4: Efficiency Offset ---
document.getElementById('deflectionRate').addEventListener('input', (e) => {
  setState({ deflectionRate: parseFloat(e.target.value) / 100 || 0 });
});

document.getElementById('adminHours').addEventListener('input', (e) => {
  setState({ adminHours: parseFloat(e.target.value) || 0 });
});

// --- Scenario Management ---
document.getElementById('saveScenarioBtn').addEventListener('click', () => {
  showModal({
    title: t('modal.saveTitle'),
    message: t('modal.saveMsg'),
    inputPlaceholder: t('modal.savePlaceholder'),
    confirmLabel: t('btn.save'),
    onConfirm: (name) => {
      if (!name || !name.trim()) {
        showToast(t('toast.enterName'), 'error');
        return;
      }
      const state = getState();
      if (saveScenario(name.trim(), state)) {
        showToast(t('toast.scenarioSaved').replace('{name}', name.trim()), 'success');
        renderScenariosDropdown(listScenarios());
      } else {
        showToast(t('toast.saveFailed'), 'error');
      }
    }
  });
});

document.getElementById('loadScenarioBtn').addEventListener('click', () => {
  const dropdown = document.getElementById('scenarioDropdown');
  const name = dropdown.value;

  if (!name) {
    showToast(t('toast.selectFirst'), 'error');
    return;
  }

  showModal({
    title: t('modal.loadTitle'),
    message: t('modal.loadMsg').replace('{name}', name),
    confirmLabel: t('btn.load'),
    onConfirm: () => {
      const scenario = loadScenario(name);
      if (!scenario) {
        showToast(t('toast.loadFailed'), 'error');
        return;
      }

      // Destroy chart before full re-render
      destroyChart();

      // Migrate old rate format { client, ai } → { client, aiBot, aiAgent }
      const migratedRates = Object.fromEntries(
        Object.entries(scenario.rates || {}).map(([id, rate]) => {
          if ('ai' in rate && !('aiBot' in rate)) {
            return [id, { client: rate.client || 0, aiBot: rate.ai || 0, aiAgent: rate.ai || 0 }];
          }
          return [id, rate];
        })
      );

      // Map loaded scenario back into state
      setState({
        totalAgents: scenario.totalAgents || 100,
        monthlySalary: scenario.monthlySalary || 25000,
        channels: scenario.channels || [{ id: 1, type: 'voice', volume: 5000, humanHandleTime: 6 }],
        rates: migratedRates,
        aiHandleTime: scenario.aiHandleTime || 3.5,
        clientItems: (scenario.clientItems || []).map(item => ({
          ...item,
          id: item.id || Date.now() + Math.random()
        })),
        aiItems: (scenario.aiItems || []).map(item => ({
          ...item,
          id: item.id || Date.now() + Math.random()
        })),
        deflectionRate: scenario.deflectionRate || 0.20,
        adminHours: scenario.adminHours || 160
      });

      // Re-render all dynamic DOM sections
      renderStructure();
      // Sync fixed DOM inputs from state
      syncFixedInputs();
      showToast(t('toast.scenarioLoaded').replace('{name}', name), 'success');
    }
  });
});

document.getElementById('deleteScenarioBtn').addEventListener('click', () => {
  const dropdown = document.getElementById('scenarioDropdown');
  const name = dropdown.value;

  if (!name) {
    showToast(t('toast.selectFirst'), 'error');
    return;
  }

  showModal({
    title: t('modal.deleteTitle'),
    message: t('modal.deleteMsg').replace('{name}', name),
    confirmLabel: t('btn.delete'),
    confirmClass: 'btn-danger',
    onConfirm: () => {
      if (deleteScenario(name)) {
        showToast(t('toast.scenarioDeleted').replace('{name}', name), 'success');
        renderScenariosDropdown(listScenarios());
      } else {
        showToast(t('toast.deleteFailed'), 'error');
      }
    }
  });
});

// ===== Helpers =====

/**
 * Sync fixed DOM inputs from state (after scenario load)
 */
function syncFixedInputs() {
  const state = getState();
  document.getElementById('totalAgents').value = state.totalAgents;
  document.getElementById('monthlySalary').value = state.monthlySalary;
  document.getElementById('deflectionRate').value = Math.round(state.deflectionRate * 100);
  document.getElementById('adminHours').value = state.adminHours;
}

// ===== Initialize =====

// Set initial language toggle state from persisted preference
const initLang = getLanguage();
if (initLang !== 'en') {
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === initLang);
  });
  translatePage();
}

renderScenariosDropdown(listScenarios());
renderStructure();
recalculate();
