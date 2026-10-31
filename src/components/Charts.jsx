import { useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, BarElement, ArcElement, Tooltip } from 'chart.js';
import { centres } from '../data/demoData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#142f3e', padding: 10, titleFont: { family: 'Inter' }, bodyFont: { family: 'Inter' } } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#a5b8ad', font: { size: 10 } }, border: { display: false } },
    y: { grid: { color: '#34433c' }, ticks: { color: '#a5b8ad', font: { size: 10 } }, border: { display: false } },
  },
};

export function RiskChart({ children, compact = false }) {
  const groups = ['High', 'Moderate', 'Low', 'Insufficient data'];
  const counts = groups.map((group) => children.filter((child) => child.risk === group).length);
  return <div className={`chart-wrap ${compact ? 'chart-compact' : ''}`}><Doughnut data={{ labels: groups, datasets: [{ data: counts, backgroundColor: ['#d97867', '#dfb35e', '#6fa580', '#b8c2b9'], borderWidth: 0, hoverOffset: 4 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } } } }} /></div>;
}

export function CentreChart() {
  const data = centres.map((centre, index) => ({ label: centre.id.replace('AWC-', 'Centre '), progress: [78, 64, 86, 59][index], verified: [71, 58, 80, 52][index] }));
  return <div className="chart-wrap chart-medium"><Bar data={{ labels: data.map((item) => item.label), datasets: [{ label: 'Task completion', data: data.map((item) => item.progress), backgroundColor: '#65a77d', borderRadius: 5, barThickness: 18 }, { label: 'Verification', data: data.map((item) => item.verified), backgroundColor: '#384f42', borderRadius: 5, barThickness: 18 }] }} options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, min: 0, max: 100, ticks: { ...chartOptions.scales.y.ticks, callback: (v) => `${v}%` } } }, plugins: { ...chartOptions.plugins, legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 7, color: '#b2c2b9', padding: 18 } } } }} /></div>;
}

export function TrendChart({ child, metric = 'weight', withPrediction = true, comparison = false }) {
  const labels = child.measurements.map((item) => new Date(`${item.date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' }));
  const actual = child.measurements.map((item) => item[metric]);
  const referenceStep = metric === 'weight' ? 0.22 : 0.8;
  const reference = child.measurements.map((item, index) => Number((actual[0] + index * referenceStep).toFixed(1)));
  const prediction = actual.map(() => null);
  if (withPrediction) {
    prediction[prediction.length - 1] = actual.at(-1);
    prediction.push(Number((actual.at(-1) + referenceStep).toFixed(1)));
    labels.push('Nov*');
  }
  const datasets = [
    { label: `Recorded ${metric}`, data: actual, borderColor: '#43856b', backgroundColor: '#43856b', pointRadius: 3, borderWidth: 2.5, tension: 0.32 },
    { label: 'Illustrative reference (not WHO standard)', data: reference, borderColor: '#879b90', backgroundColor: '#879b90', borderDash: [5, 5], pointRadius: 0, borderWidth: 1.5, tension: 0.3 },
  ];
  if (withPrediction) datasets.push({ label: 'Simulated prediction', data: prediction, borderColor: '#e49d43', backgroundColor: '#e49d43', borderDash: [4, 4], pointRadius: 3, borderWidth: 2, spanGaps: true, tension: 0.3 });
  if (comparison) datasets.splice(1, 1, { label: 'Illustrative baseline/follow-up comparison', data: actual.map((_, index) => index === 0 || index === actual.length - 1 ? actual[index] : null), borderColor: '#5877ba', backgroundColor: '#5877ba', pointRadius: 6, showLine: false });
  const unit = metric === 'weight' ? 'kg' : 'cm';
  return <div className="chart-wrap chart-large"><Line data={{ labels, datasets }} options={{ ...chartOptions, interaction: { intersect: false, mode: 'index' }, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, title: { display: true, text: `${metric === 'weight' ? 'Weight' : 'Height'} (${unit})`, color: '#a5b8ad', font: { size: 10 } } } }, plugins: { ...chartOptions.plugins, legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 7, color: '#b2c2b9', padding: 14, font: { size: 10 } } } } }} /></div>;
}

export function OutcomeChart({ children }) {
  const groups = ['Improving', 'Stable', 'Deteriorating', 'Insufficient data'];
  const values = useMemo(() => groups.map((status) => children.filter((child) => child.outcome === status).length), [children]);
  return <div className="chart-wrap chart-medium"><Bar data={{ labels: groups, datasets: [{ data: values, backgroundColor: ['#53b99a', '#8dcbbb', '#e87968', '#b8c5c9'], borderRadius: 5, barThickness: 28 }] }} options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, beginAtZero: true, ticks: { ...chartOptions.scales.y.ticks, precision: 0 } } } }} /></div>;
}

export function BaselineFollowupChart({ children }) {
  const selected = children.filter((child) => child.risk !== 'Insufficient data').slice(0, 6);
  return <div className="chart-wrap chart-medium"><Bar data={{
    labels: selected.map((child) => child.id.replace('NL-', '')),
    datasets: [
      { label: 'Baseline weight (kg)', data: selected.map((child) => child.measurements[0].weight), backgroundColor: '#c4d9c5', borderRadius: 4, barThickness: 12 },
      { label: 'Latest weight (kg)', data: selected.map((child) => child.measurements.at(-1).weight), backgroundColor: '#43856b', borderRadius: 4, barThickness: 12 },
    ],
  }} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 7, color: '#b2c2b9', padding: 14, font: { size: 10 } } } } }} /></div>;
}
