/**
 * AI Rudder Cost Calculator - Storage Module (ES Module)
 *
 * Handles localStorage operations for saving/loading scenarios.
 */

const STORAGE_KEY_PREFIX = 'airudder_scenario_';
const SCENARIOS_LIST_KEY = 'airudder_scenarios_list';

/**
 * Save a scenario to localStorage
 * @param {string} name - Scenario name
 * @param {Object} data - Scenario data (full state)
 * @returns {boolean} - Success status
 */
export function saveScenario(name, data) {
  if (!name || !name.trim()) {
    return false;
  }

  try {
    const scenario = {
      name: name.trim(),
      timestamp: new Date().toISOString(),
      ...data
    };

    localStorage.setItem(
      STORAGE_KEY_PREFIX + name.trim(),
      JSON.stringify(scenario)
    );

    const scenarios = listScenarios();
    const existingIndex = scenarios.findIndex(s => s.name === name.trim());

    if (existingIndex === -1) {
      scenarios.push({ name: name.trim(), timestamp: scenario.timestamp });
    } else {
      scenarios[existingIndex].timestamp = scenario.timestamp;
    }

    localStorage.setItem(SCENARIOS_LIST_KEY, JSON.stringify(scenarios));
    return true;
  } catch (error) {
    console.error('Failed to save scenario:', error);
    return false;
  }
}

/**
 * Load a scenario from localStorage
 * @param {string} name - Scenario name
 * @returns {Object|null} - Scenario data or null if not found
 */
export function loadScenario(name) {
  if (!name || !name.trim()) {
    return null;
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + name.trim());
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load scenario:', error);
    return null;
  }
}

/**
 * List all saved scenarios
 * @returns {Array} - Array of {name, timestamp} objects
 */
export function listScenarios() {
  try {
    const data = localStorage.getItem(SCENARIOS_LIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to list scenarios:', error);
    return [];
  }
}

/**
 * Delete a scenario from localStorage
 * @param {string} name - Scenario name
 * @returns {boolean} - Success status
 */
export function deleteScenario(name) {
  if (!name || !name.trim()) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + name.trim());

    const scenarios = listScenarios();
    const filtered = scenarios.filter(s => s.name !== name.trim());
    localStorage.setItem(SCENARIOS_LIST_KEY, JSON.stringify(filtered));

    return true;
  } catch (error) {
    console.error('Failed to delete scenario:', error);
    return false;
  }
}

/**
 * Export scenario to JSON string
 * @param {string} name - Scenario name
 * @returns {string|null} - JSON string or null
 */
export function exportToJSON(name) {
  const scenario = loadScenario(name);
  return scenario ? JSON.stringify(scenario, null, 2) : null;
}

/**
 * Clear all scenarios
 * @returns {boolean} - Success status
 */
export function clearAllScenarios() {
  try {
    const scenarios = listScenarios();
    scenarios.forEach(scenario => {
      localStorage.removeItem(STORAGE_KEY_PREFIX + scenario.name);
    });
    localStorage.removeItem(SCENARIOS_LIST_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear scenarios:', error);
    return false;
  }
}
