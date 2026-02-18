/**
 * AI Rudder Cost Calculator - UI Module (ES Module)
 *
 * DOM rendering, event delegation, modals, validation, toasts.
 * Uses escapeHTML for all user-entered text.
 */

import { formatCurrency, formatNumber } from './calculator.js';
import { t } from './i18n.js';

// ===== SVG Icons (inline, no CDN) =====
const ICONS = {
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  save: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  folderOpen: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
};

// ===== Utility =====

/**
 * Escape HTML to prevent XSS
 */
export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Channel Type Config =====

/**
 * Get channel types with translated labels.
 * Called fresh each render so labels reflect current language.
 */
function getChannelTypes() {
  return {
    voice: { label: t('channel.voice'), unit: t('channel.perMinute'), hasHandleTime: true },
    sms: { label: t('channel.sms'), unit: t('channel.perMessage'), hasHandleTime: false },
    chat: { label: t('channel.chat'), unit: t('channel.perSession'), hasHandleTime: true }
  };
}

// ===== Rendering Functions =====

/**
 * Render channel cards in Section 1
 */
export function renderChannels(container, channels) {
  if (!container) return;

  const channelTypes = getChannelTypes();

  container.innerHTML = channels.map(channel => {
    const config = channelTypes[channel.type] || channelTypes.voice;
    const hasHandleTime = config.hasHandleTime;
    const fieldsClass = hasHandleTime ? 'channel-card-fields three-col' : 'channel-card-fields';

    // Use voice-specific or chat-specific handle time labels
    const handleTimeLabel = channel.type === 'chat' ? t('field.chatHandleTime') : t('field.handleTime');
    const handleTimeDesc = channel.type === 'chat' ? t('field.chatHandleTimeDesc') : t('field.handleTimeDesc');

    return `
      <div class="channel-card" data-channel-id="${channel.id}">
        <div class="channel-card-header">
          <select data-channel-id="${channel.id}" data-field="type" style="max-width:120px;">
            ${Object.entries(channelTypes).map(([key, val]) =>
              `<option value="${key}" ${channel.type === key ? 'selected' : ''}>${val.label}</option>`
            ).join('')}
          </select>
          <button class="btn btn-ghost" data-action="remove-channel" data-channel-id="${channel.id}" title="${t('misc.removeChannel')}">
            ${ICONS.x}
          </button>
        </div>
        <div class="${fieldsClass}">
          <div class="field-group">
            <label class="field-label">
              ${t('field.channelName')}
              <span class="field-description">${t('field.channelNameDesc')}</span>
            </label>
            <input type="text" value="${escapeHTML(channel.name || '')}" placeholder="${t('misc.placeholder.channelName')}"
                   data-channel-id="${channel.id}" data-field="name">
          </div>
          <div class="field-group">
            <label class="field-label">
              ${t('field.volume')}
              <span class="field-description">${t('field.volumeDesc')}</span>
            </label>
            <input type="number" value="${channel.volume || 0}" min="0" step="100"
                   data-channel-id="${channel.id}" data-field="volume">
          </div>
          ${hasHandleTime ? `
          <div class="field-group">
            <label class="field-label">
              ${handleTimeLabel}
              <span class="field-description">${handleTimeDesc}</span>
            </label>
            <input type="number" value="${channel.humanHandleTime || 0}" min="0" step="0.5"
                   data-channel-id="${channel.id}" data-field="humanHandleTime">
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render rates comparison table in Section 2
 * Adds numbered labels when multiple channels of the same type exist
 */
export function renderRates(container, channels, rates, aiHandleTime, chatAiHandleTime) {
  if (!container) return;

  const channelTypes = getChannelTypes();
  const hasVoice = channels.some(c => c.type === 'voice');
  const hasChat = channels.some(c => c.type === 'chat');

  if (channels.length === 0) {
    container.innerHTML = `<p style="color: var(--muted-text); font-size: 14px;">${t('misc.noChannels')}</p>`;
    return;
  }

  // Count channels per type for numbered labels
  const typeCounts = {};
  channels.forEach(c => { typeCounts[c.type] = (typeCounts[c.type] || 0) + 1; });

  // Track which index we're at for each type
  const typeIndex = {};

  let html = `
    <table class="rates-table">
      <thead>
        <tr>
          <th>${t('rates.channel')}</th>
          <th>${t('rates.clientRate')}</th>
          <th>${t('rates.aiBotRate')}</th>
          <th>${t('rates.aiAgentRate')}</th>
        </tr>
      </thead>
      <tbody>
  `;

  channels.forEach(channel => {
    const config = channelTypes[channel.type] || channelTypes.voice;
    const rate = rates[channel.id] || { client: 0, aiBot: 0, aiAgent: 0 };

    // Use channel name if provided, otherwise fall back to type label with numbering
    typeIndex[channel.type] = (typeIndex[channel.type] || 0) + 1;
    const label = channel.name
      ? escapeHTML(channel.name)
      : (typeCounts[channel.type] > 1
        ? `${config.label} #${typeIndex[channel.type]}`
        : config.label);

    html += `
      <tr data-channel-id="${channel.id}">
        <td>
          <span class="channel-label">${label}</span>
          <span class="unit">${config.unit}</span>
        </td>
        <td>
          <input type="number" value="${rate.client}" min="0" step="0.1"
                 data-channel-id="${channel.id}" data-rate-side="client">
        </td>
        <td>
          <input type="number" value="${rate.aiBot}" min="0" step="0.1"
                 data-channel-id="${channel.id}" data-rate-side="aiBot">
        </td>
        <td>
          <input type="number" value="${rate.aiAgent}" min="0" step="0.1"
                 data-channel-id="${channel.id}" data-rate-side="aiAgent">
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';

  if (hasVoice || hasChat) {
    html += '<div class="grid-2" style="margin-top: 16px;">';
    if (hasVoice) {
      html += `
        <div class="field-group">
          <label class="field-label">
            ${t('field.voiceAiHandleTime')}
            <span class="field-description">${t('field.voiceAiHandleTimeDesc')}</span>
          </label>
          <input type="number" id="aiHandleTime" value="${aiHandleTime}" min="0" step="0.1">
        </div>
      `;
    }
    if (hasChat) {
      html += `
        <div class="field-group">
          <label class="field-label">
            ${t('field.chatAiHandleTime')}
            <span class="field-description">${t('field.chatAiHandleTimeDesc')}</span>
          </label>
          <input type="number" id="chatAiHandleTime" value="${chatAiHandleTime}" min="0" step="0.1">
        </div>
      `;
    }
    html += '</div>';
  }

  container.innerHTML = html;
}

/**
 * Render cost items for one side (client or AI)
 */
export function renderCostItems(container, items, side) {
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center; color: var(--muted-text); padding: 24px 0; font-size: 14px;">${t('misc.noCostItems')}</div>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cost-item" data-item-id="${item.id}" data-side="${side}">
      <div class="cost-item-header">
        <input type="text" value="${escapeHTML(item.name)}" placeholder="${t('misc.placeholder.costName')}"
               data-item-id="${item.id}" data-side="${side}" data-field="name">
        <button class="btn btn-ghost" data-action="remove-item" data-item-id="${item.id}" data-side="${side}" title="${t('misc.remove')}">
          ${ICONS.x}
        </button>
      </div>
      <div class="cost-item-fields">
        <input type="number" value="${item.amount}" placeholder="${t('field.amount')}" min="0" step="100"
               data-item-id="${item.id}" data-side="${side}" data-field="amount">
        <select data-item-id="${item.id}" data-side="${side}" data-field="frequency">
          <option value="one-time" ${item.frequency === 'one-time' ? 'selected' : ''}>${t('freq.oneTime')}</option>
          <option value="monthly" ${item.frequency === 'monthly' ? 'selected' : ''}>${t('freq.monthly')}</option>
          <option value="yearly" ${item.frequency === 'yearly' ? 'selected' : ''}>${t('freq.yearly')}</option>
          <option value="per agent" ${item.frequency === 'per agent' ? 'selected' : ''}>${t('freq.perAgent')}</option>
        </select>
      </div>
    </div>
  `).join('');
}

/**
 * Render dashboard metrics
 * 3 sections: Cost Comparison → Direct Savings → Efficiency Gains
 */
export function renderDashboard(metrics, perInteractionCosts) {
  const setIfExists = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  setIfExists('metricClientMonthly', formatCurrency(metrics.clientMonthly));
  setIfExists('metricAIMonthly', formatCurrency(metrics.aiMonthly));
  setIfExists('metricMonthlySavings', formatCurrency(metrics.monthlySavings));
  setIfExists('metricCostReduction', `${formatNumber(metrics.costReduction)}%`);
  setIfExists('metricInitialInvestment', formatCurrency(metrics.initialInvestment));
  setIfExists('metricBreakEven',
    metrics.breakEvenMonth !== null
      ? t('chart.month').replace('{n}', metrics.breakEvenMonth)
      : t('misc.na')
  );
  setIfExists('metricYear1Savings', formatCurrency(metrics.year1NetSavings));
  setIfExists('metricROI',
    metrics.roi !== null
      ? `${formatNumber(metrics.roi)}%`
      : '-'
  );

  // Per-interaction cost hints
  if (perInteractionCosts) {
    const pic = perInteractionCosts;
    setIfExists('metricClientPerInteraction',
      pic.client > 0
        ? t('metric.perInteraction').replace('{amount}', formatCurrency(Math.round(pic.client)))
        : ''
    );
    setIfExists('metricAIPerInteraction',
      pic.ai > 0
        ? t('metric.perInteraction').replace('{amount}', formatCurrency(Math.round(pic.ai)))
        : ''
    );
  }
}

/**
 * Render efficiency gains section in the dashboard
 */
export function renderEfficiencyGains(data) {
  const setIfExists = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  // Agents Freed Up
  setIfExists('metricAgentsFreed', `${formatNumber(data.aiCapacity)} agents`);
  setIfExists('metricAgentsFreedHint',
    t('efficiency.agentsFreedHint')
      .replace('{pct}', formatNumber(data.automatedPct))
  );

  // Hours Reclaimed
  setIfExists('metricHoursReclaimed', `${formatNumber(data.hoursReclaimed)} hrs/mo`);
  setIfExists('metricHoursReclaimedHint',
    t('efficiency.hoursReclaimedHint')
      .replace('{n}', formatNumber(data.hoursReclaimed))
      .replace('{eq}', data.agentEquivalent)
  );

  // Extra Serving Capacity
  setIfExists('metricExtraCapacity', data.extraCapacity > 0 ? `+${formatNumber(data.extraCapacity)}` : '-');
  setIfExists('metricExtraCapacityHint',
    data.extraCapacity > 0
      ? t('efficiency.extraCapacityHint').replace('{n}', formatNumber(data.extraCapacity))
      : ''
  );

  // Capacity Increase
  setIfExists('metricCapacityIncrease', data.capacityIncrease > 0 ? `+${formatNumber(data.capacityIncrease)}%` : '-');

  // Estimated Value
  setIfExists('metricEfficiencyValue', formatCurrency(data.estimatedValue));

  // Deflection slider display (still in input section)
  setIfExists('deflectionValue', `${data.automatedPct}%`);
}

/**
 * Render scenarios dropdown
 */
export function renderScenariosDropdown(scenarios) {
  const dropdown = document.getElementById('scenarioDropdown');
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">${t('misc.selectScenario')}</option>`;
  scenarios.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.name;
    option.textContent = scenario.name;
    dropdown.appendChild(option);
  });
}

// ===== Modal =====

/**
 * Show a modal dialog
 * @param {Object} config - {title, message, inputPlaceholder?, onConfirm, confirmLabel?, confirmClass?}
 */
export function showModal(config) {
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const message = document.getElementById('modalMessage');
  const input = document.getElementById('modalInput');
  const confirmBtn = document.getElementById('modalConfirm');
  const cancelBtn = document.getElementById('modalCancel');

  if (!overlay) return;

  title.textContent = config.title || '';
  message.textContent = config.message || '';

  if (config.inputPlaceholder) {
    input.style.display = 'block';
    input.value = '';
    input.placeholder = config.inputPlaceholder;
    setTimeout(() => input.focus(), 100);
  } else {
    input.style.display = 'none';
  }

  confirmBtn.textContent = config.confirmLabel || t('btn.confirm');
  confirmBtn.className = `btn ${config.confirmClass || 'btn-primary'}`;

  cancelBtn.textContent = t('btn.cancel');

  // Clean up old listeners
  const newConfirm = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
  const newCancel = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

  newConfirm.addEventListener('click', () => {
    const value = config.inputPlaceholder ? input.value : true;
    hideModal();
    if (config.onConfirm) config.onConfirm(value);
  });

  newCancel.addEventListener('click', hideModal);

  overlay.classList.add('active');

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideModal();
  }, { once: true });
}

/**
 * Hide the modal
 */
export function hideModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
}

// ===== Toast =====

/**
 * Show a toast message
 * @param {string} message - Toast text
 * @param {string} type - 'success' | 'error' | '' (default)
 */
export function showToast(message, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===== Validation =====

/**
 * Show validation error on a field
 */
export function showValidationError(el, msg) {
  const group = el.closest('.field-group');
  if (!group) return;

  group.classList.add('field-error');
  let errorEl = group.querySelector('.error-message');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    group.appendChild(errorEl);
  }
  errorEl.textContent = msg;
}

/**
 * Clear validation error on a field
 */
export function clearValidationError(el) {
  const group = el.closest('.field-group');
  if (!group) return;

  group.classList.remove('field-error');
  const errorEl = group.querySelector('.error-message');
  if (errorEl) errorEl.remove();
}

// ===== Export icons for use in HTML =====
export { ICONS };
