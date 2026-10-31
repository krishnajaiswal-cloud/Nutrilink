export const formatAge = (months) => `${Math.floor(months / 12)}y ${months % 12}m`;

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));

export const getTrend = (child) => {
  const measurements = child.measurements;
  const baseline = measurements[0];
  const latest = measurements[measurements.length - 1];
  const delta = Number((latest.weight - baseline.weight).toFixed(1));
  if (delta > 0.5 && child.latestStatus !== 'Severe wasting') return 'Improving';
  if (delta < 0 && child.risk !== 'Insufficient data') return 'Deteriorating';
  if (child.risk === 'Insufficient data') return 'Insufficient data';
  return 'Stable';
};

export const getOutcome = (child) => {
  if (child.risk === 'Insufficient data') return 'Insufficient data';
  const severity = {
    'No acute concern': 0,
    'At risk': 1,
    'Moderate underweight': 2,
    'Moderate wasting': 2,
    'Severe underweight': 3,
    'Severe wasting': 3,
  };
  const baselineSeverity = severity[child.baselineStatus] ?? 0;
  const latestSeverity = severity[child.latestStatus] ?? baselineSeverity;
  if (latestSeverity > baselineSeverity) return 'Deteriorating';
  if (latestSeverity < baselineSeverity) return 'Improving';
  const baseline = child.measurements[0].weight;
  const latest = child.measurements.at(-1).weight;
  if (latest - baseline > 0.5 && child.latestStatus !== 'Severe wasting') return 'Improving';
  if (latest < baseline) return 'Deteriorating';
  return 'Stable';
};
