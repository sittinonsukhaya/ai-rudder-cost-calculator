import { describe, test, expect, beforeEach } from 'vitest';
import {
  saveScenario,
  loadScenario,
  listScenarios,
  deleteScenario,
  exportToJSON,
  clearAllScenarios
} from '../js/storage.js';

// Mock localStorage
const store = {};
const localStorageMock = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};

globalThis.localStorage = localStorageMock;

beforeEach(() => {
  localStorageMock.clear();
});

describe('saveScenario', () => {
  test('saves a scenario successfully', () => {
    const data = { totalAgents: 100, channels: [] };
    const result = saveScenario('Test Scenario', data);
    expect(result).toBe(true);
  });

  test('returns false for empty name', () => {
    expect(saveScenario('', {})).toBe(false);
    expect(saveScenario(null, {})).toBe(false);
    expect(saveScenario('  ', {})).toBe(false);
  });

  test('trims scenario name', () => {
    saveScenario('  My Scenario  ', { totalAgents: 50 });
    const loaded = loadScenario('My Scenario');
    expect(loaded).not.toBeNull();
    expect(loaded.name).toBe('My Scenario');
  });

  test('overwrites existing scenario with same name', () => {
    saveScenario('Test', { totalAgents: 100 });
    saveScenario('Test', { totalAgents: 200 });
    const loaded = loadScenario('Test');
    expect(loaded.totalAgents).toBe(200);
    expect(listScenarios()).toHaveLength(1);
  });
});

describe('loadScenario', () => {
  test('loads a saved scenario', () => {
    saveScenario('Test', { totalAgents: 100, channels: [{ id: 1 }] });
    const loaded = loadScenario('Test');
    expect(loaded.totalAgents).toBe(100);
    expect(loaded.channels).toHaveLength(1);
  });

  test('returns null for non-existent scenario', () => {
    expect(loadScenario('NonExistent')).toBeNull();
  });

  test('returns null for empty name', () => {
    expect(loadScenario('')).toBeNull();
    expect(loadScenario(null)).toBeNull();
  });
});

describe('listScenarios', () => {
  test('returns empty array when no scenarios saved', () => {
    expect(listScenarios()).toEqual([]);
  });

  test('lists all saved scenarios', () => {
    saveScenario('Scenario A', {});
    saveScenario('Scenario B', {});
    const list = listScenarios();
    expect(list).toHaveLength(2);
    expect(list.map(s => s.name)).toContain('Scenario A');
    expect(list.map(s => s.name)).toContain('Scenario B');
  });
});

describe('deleteScenario', () => {
  test('deletes an existing scenario', () => {
    saveScenario('ToDelete', {});
    expect(listScenarios()).toHaveLength(1);

    const result = deleteScenario('ToDelete');
    expect(result).toBe(true);
    expect(listScenarios()).toHaveLength(0);
    expect(loadScenario('ToDelete')).toBeNull();
  });

  test('returns false for empty name', () => {
    expect(deleteScenario('')).toBe(false);
    expect(deleteScenario(null)).toBe(false);
  });
});

describe('exportToJSON', () => {
  test('exports scenario as JSON string', () => {
    saveScenario('Export Test', { totalAgents: 75 });
    const json = exportToJSON('Export Test');
    expect(json).not.toBeNull();
    const parsed = JSON.parse(json);
    expect(parsed.totalAgents).toBe(75);
  });

  test('returns null for non-existent scenario', () => {
    expect(exportToJSON('NonExistent')).toBeNull();
  });
});

describe('clearAllScenarios', () => {
  test('removes all scenarios', () => {
    saveScenario('A', {});
    saveScenario('B', {});
    saveScenario('C', {});
    expect(listScenarios()).toHaveLength(3);

    const result = clearAllScenarios();
    expect(result).toBe(true);
    expect(listScenarios()).toEqual([]);
  });
});
