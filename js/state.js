/**
 * AI Rudder Cost Calculator - Reactive State Module (ES Module)
 *
 * Provides getState/setState/subscribe/resetState with pub/sub pattern.
 */

const defaultState = {
  // Section 1: Client Operations
  totalAgents: 100,
  monthlySalary: 25000,
  channels: [
    {
      id: 1,
      type: 'voice',
      name: '',
      volume: 5000,
      humanHandleTime: 6
    }
  ],

  // Section 2: Rates (split AI: bot rate for deflected, agent rate for human-assisted)
  rates: {
    1: { client: 2, aiBot: 2, aiAgent: 4 }
  },
  aiHandleTime: 3.5,

  // Section 3: Additional Costs
  clientItems: [],
  aiItems: [],

  // Section 4: Efficiency Offset
  // hourlyRate is derived from monthlySalary / 160
  deflectionRate: 0.20,
  adminHours: 160
};

let state = structuredClone(defaultState);
let listeners = [];
let nextChannelId = 2;

/**
 * Get current state (deep copy)
 * @returns {Object}
 */
export function getState() {
  return structuredClone(state);
}

/**
 * Update state by merging partial updates, then notify subscribers
 * @param {Object} partial - Partial state to merge
 */
export function setState(partial) {
  state = { ...state, ...partial };
  listeners.forEach(fn => fn(getState()));
}

/**
 * Subscribe to state changes
 * @param {Function} listener - Called with new state on each change
 * @returns {Function} - Unsubscribe function
 */
export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(fn => fn !== listener);
  };
}

/**
 * Reset state to defaults
 */
export function resetState() {
  state = structuredClone(defaultState);
  nextChannelId = 2;
  listeners.forEach(fn => fn(getState()));
}

/**
 * Generate a unique channel ID
 * @returns {number}
 */
export function generateChannelId() {
  return nextChannelId++;
}

/**
 * Get the default state (for reference/tests)
 * @returns {Object}
 */
export function getDefaultState() {
  return structuredClone(defaultState);
}
