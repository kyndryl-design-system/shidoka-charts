import 'shidoka-charts/components/chart';
import { renderBoxedLegend } from 'shidoka-charts/common/legend';

const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
const datasets = [
  {
    label: 'Electronics',
    data: [65, 59, 80, 81, 56, 55],
    backgroundColor: '#4285F4',
  },
  {
    label: 'Clothing',
    data: [28, 48, 40, 19, 86, 27],
    backgroundColor: '#EA4335',
  },
  {
    label: 'Home Goods',
    data: [35, 40, 60, 70, 45, 80],
    backgroundColor: '#FBBC05',
  },
];

// setup charts once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const chart1 = document.getElementById('chart1');
  chart1.labels = labels;
  chart1.datasets = datasets;

  const chart2 = document.getElementById('chart2');
  chart2.labels = labels;
  chart2.datasets = datasets;

  const chart3 = document.getElementById('chart3');
  chart3.labels = labels;
  chart3.datasets = datasets;

  chart3.addEventListener('chart-ready', () => {
    setupCustomLegend(chart3);
  });
});

function setupCustomLegend(chartElement) {
  const legendContainer = document.getElementById('custom-legend-container');

  renderBoxedLegend(chartElement.chart, legendContainer);
}
