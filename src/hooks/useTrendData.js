import { trends, TREND_FUNDS, TREND_YEARS, actuals as trendActuals } from '../data/trends';

export function useTrendData(fund, type) {
  if (type === 'balance') {
    if (fund === 'All') {
      const trendValues = TREND_YEARS.map((_, i) => {
        const hasData = TREND_FUNDS.some(f => trends.revenue[f][i] != null);
        if (!hasData) return null;
        return TREND_FUNDS.reduce((s, f) => s + (trends.revenue[f][i] ?? 0) - (trends.expenditure[f][i] ?? 0), 0);
      });
      const fundActuals = TREND_YEARS.reduce((out, yr) => {
        const hasRev = TREND_FUNDS.some(f => trendActuals.revenue[f]?.[yr] != null);
        if (!hasRev) return out;
        out[yr] = TREND_FUNDS.reduce((s, f) =>
          s + (trendActuals.revenue[f]?.[yr] ?? 0) - (trendActuals.expenditure[f]?.[yr] ?? 0), 0);
        return out;
      }, {});
      return { trendValues, fundActuals };
    }

    const trendValues = TREND_YEARS.map((_, i) => {
      const r = trends.revenue[fund][i], e = trends.expenditure[fund][i];
      return (r != null && e != null) ? r - e : null;
    });
    const fundActuals = {};
    TREND_YEARS.forEach(yr => {
      const r = trendActuals.revenue[fund]?.[yr], e = trendActuals.expenditure[fund]?.[yr];
      if (r != null && e != null) fundActuals[yr] = r - e;
    });
    return { trendValues, fundActuals };
  }

  const trendValues = fund === 'All'
    ? TREND_YEARS.map((_, i) => TREND_FUNDS.reduce((sum, f) => sum + (trends[type][f][i] ?? 0), 0))
    : trends[type][fund];
  const fundActuals = fund === 'All'
    ? TREND_YEARS.reduce((out, yr) => {
        const total = TREND_FUNDS.reduce((s, f) => s + (trendActuals[type][f]?.[yr] ?? 0), 0);
        if (total) out[yr] = total;
        return out;
      }, {})
    : (trendActuals[type][fund] ?? {});

  return { trendValues, fundActuals };
}
