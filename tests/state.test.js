import { describe, test, expect, beforeEach } from 'vitest';
import {
  getState,
  setState,
  subscribe,
  resetState,
  generateChannelId,
  getDefaultState
} from '../js/state.js';

beforeEach(() => {
  resetState();
});

describe('getState', () => {
  test('returns default state initially', () => {
    const state = getState();
    expect(state.totalAgents).toBe(100);
    expect(state.monthlySalary).toBe(25000);
    expect(state.channels).toHaveLength(1);
    expect(state.channels[0].type).toBe('voice');
    expect(state.channelDeflections).toEqual({ 1: 0.20 });
    expect(state.aiHandleTime).toBe(3.5);
  });

  test('returns a deep copy (mutations do not affect state)', () => {
    const state = getState();
    state.totalAgents = 999;
    state.channels.push({ id: 99, type: 'sms', volume: 0 });

    const freshState = getState();
    expect(freshState.totalAgents).toBe(100);
    expect(freshState.channels).toHaveLength(1);
  });
});

describe('setState', () => {
  test('merges partial updates into state', () => {
    setState({ totalAgents: 200 });
    expect(getState().totalAgents).toBe(200);
    expect(getState().monthlySalary).toBe(25000); // unchanged
  });

  test('can update nested objects by replacing them', () => {
    setState({ rates: { 1: { client: 5, ai: 8 } } });
    const state = getState();
    expect(state.rates[1].client).toBe(5);
    expect(state.rates[1].ai).toBe(8);
  });

  test('can update channels array', () => {
    const newChannels = [
      { id: 1, type: 'voice', volume: 3000, humanHandleTime: 4 },
      { id: 2, type: 'chat', volume: 1000 }
    ];
    setState({ channels: newChannels });
    expect(getState().channels).toHaveLength(2);
    expect(getState().channels[1].type).toBe('chat');
  });

  test('can update multiple fields at once', () => {
    setState({ totalAgents: 50, monthlySalary: 30000, channelDeflections: { 1: 0.3 } });
    const state = getState();
    expect(state.totalAgents).toBe(50);
    expect(state.monthlySalary).toBe(30000);
    expect(state.channelDeflections).toEqual({ 1: 0.3 });
  });
});

describe('subscribe', () => {
  test('listener is called on setState', () => {
    let called = false;
    let receivedState = null;

    subscribe((state) => {
      called = true;
      receivedState = state;
    });

    setState({ totalAgents: 50 });
    expect(called).toBe(true);
    expect(receivedState.totalAgents).toBe(50);
  });

  test('multiple listeners all get notified', () => {
    let count = 0;
    subscribe(() => count++);
    subscribe(() => count++);

    setState({ totalAgents: 50 });
    expect(count).toBe(2);
  });

  test('unsubscribe stops notifications', () => {
    let count = 0;
    const unsub = subscribe(() => count++);

    setState({ totalAgents: 50 });
    expect(count).toBe(1);

    unsub();
    setState({ totalAgents: 75 });
    expect(count).toBe(1);
  });

  test('listener receives deep copy of state', () => {
    let receivedState = null;
    subscribe((state) => { receivedState = state; });

    setState({ totalAgents: 50 });
    receivedState.totalAgents = 999;

    expect(getState().totalAgents).toBe(50);
  });
});

describe('resetState', () => {
  test('restores all fields to defaults', () => {
    setState({
      totalAgents: 50,
      monthlySalary: 50000,
      channels: [],
      rates: {},
      channelDeflections: { 1: 0.5 }
    });

    resetState();
    const state = getState();
    const defaults = getDefaultState();

    expect(state.totalAgents).toBe(defaults.totalAgents);
    expect(state.monthlySalary).toBe(defaults.monthlySalary);
    expect(state.channels).toEqual(defaults.channels);
    expect(state.channelDeflections).toEqual(defaults.channelDeflections);
  });

  test('notifies subscribers on reset', () => {
    let notified = false;
    subscribe(() => { notified = true; });

    resetState();
    expect(notified).toBe(true);
  });
});

describe('generateChannelId', () => {
  test('returns incrementing IDs', () => {
    const id1 = generateChannelId();
    const id2 = generateChannelId();
    expect(id2).toBeGreaterThan(id1);
  });

  test('IDs reset after resetState', () => {
    generateChannelId();
    generateChannelId();
    resetState();
    const id = generateChannelId();
    expect(id).toBe(2); // reset to start from 2 (channel 1 is default)
  });
});

describe('getDefaultState', () => {
  test('returns default values', () => {
    const defaults = getDefaultState();
    expect(defaults.totalAgents).toBe(100);
    expect(defaults.channels).toHaveLength(1);
    expect(defaults.clientItems).toEqual([]);
    expect(defaults.aiItems).toEqual([]);
  });

  test('returns a deep copy', () => {
    const d1 = getDefaultState();
    d1.totalAgents = 999;
    const d2 = getDefaultState();
    expect(d2.totalAgents).toBe(100);
  });
});
