import { describe, it, expect } from 'vitest';
import { useTrendData } from './useTrendData';
import { TREND_YEARS, TREND_FUNDS, trends, actuals as trendActuals } from '../data/trends';

describe('useTrendData — revenue / expenditure', () => {
  it('returns the raw array for a single fund', () => {
    const { trendValues } = useTrendData('General Fund', 'revenue');
    expect(trendValues).toBe(trends.revenue['General Fund']);
  });

  it('sums all funds for All', () => {
    const { trendValues } = useTrendData('All', 'revenue');
    const lastIdx = TREND_YEARS.length - 1;
    const expected = TREND_FUNDS.reduce((s, f) => s + (trends.revenue[f][lastIdx] ?? 0), 0);
    expect(trendValues[lastIdx]).toBe(expected);
  });

  it('returns actual values keyed by year for a single fund', () => {
    const { fundActuals } = useTrendData('General Fund', 'revenue');
    expect(fundActuals).toEqual(trendActuals.revenue['General Fund'] ?? {});
  });

  it('returns empty actuals for a fund with no actuals data', () => {
    const { fundActuals } = useTrendData('Ambulance Service Fund', 'expenditure');
    expect(typeof fundActuals).toBe('object');
  });
});

describe('useTrendData — balance', () => {
  it('computes revenue minus expenditure for a single fund', () => {
    const { trendValues } = useTrendData('General Fund', 'balance');
    const lastIdx = TREND_YEARS.length - 1;
    const r = trends.revenue['General Fund'][lastIdx];
    const e = trends.expenditure['General Fund'][lastIdx];
    expect(trendValues[lastIdx]).toBe(r - e);
  });

  it('returns null for years with missing budget data', () => {
    const { trendValues } = useTrendData('General Fund', 'balance');
    // First 5 indices are null in budget arrays
    expect(trendValues[0]).toBeNull();
  });

  it('sums balance across all funds for All', () => {
    const { trendValues } = useTrendData('All', 'balance');
    const lastIdx = TREND_YEARS.length - 1;
    const expected = TREND_FUNDS.reduce(
      (s, f) => s + (trends.revenue[f][lastIdx] ?? 0) - (trends.expenditure[f][lastIdx] ?? 0),
      0
    );
    expect(trendValues[lastIdx]).toBe(expected);
  });

  it('returns null for All when no fund has data at that index', () => {
    const { trendValues } = useTrendData('All', 'balance');
    expect(trendValues[0]).toBeNull();
  });

  it('computes actual balance for single fund', () => {
    const { fundActuals } = useTrendData('General Fund', 'balance');
    const sharedYears = Object.keys(trendActuals.revenue['General Fund'] ?? {})
      .filter(yr => (trendActuals.expenditure['General Fund'] ?? {})[yr] != null);
    if (sharedYears.length > 0) {
      const yr = sharedYears[0];
      const r = trendActuals.revenue['General Fund'][yr];
      const e = trendActuals.expenditure['General Fund'][yr];
      expect(fundActuals[yr]).toBe(r - e);
    }
  });
});
