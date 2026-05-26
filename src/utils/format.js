export const fmtValue = v => {
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1e6) return `${sign}$${+(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${+(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toLocaleString()}`;
};

export const fmtAxis = v => {
  if (v === 0) return '$0';
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1e6) return `${sign}$${+(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${+(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs}`;
};
