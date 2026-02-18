/**
 * AI Rudder Cost Calculator - Chart Module (ES Module)
 *
 * Chart.js lifecycle wrapper for the ROI timeline chart.
 * Shows cumulative direct costs with shaded savings area.
 * Expects Chart.js to be loaded globally via CDN.
 */

import { formatCurrency } from './calculator.js';
import { t } from './i18n.js';

let roiChart = null;

/**
 * Initialize or update the ROI chart
 * @param {Object} timeline - {labels, clientData, aiData}
 */
export function updateChartData(timeline) {
  const canvas = document.getElementById('roiChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (roiChart) {
    roiChart.data.labels = timeline.labels;
    roiChart.data.datasets[0].data = timeline.clientData;
    roiChart.data.datasets[1].data = timeline.aiData;
    roiChart.update('none');
    return;
  }

  roiChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeline.labels,
      datasets: [
        {
          label: t('chart.currentSystem'),
          data: timeline.clientData,
          borderColor: '#c0392b',
          backgroundColor: 'rgba(192, 57, 43, 0.1)',
          borderWidth: 3,
          tension: 0.1,
          fill: false,
          order: 1
        },
        {
          label: t('chart.aiRudder'),
          data: timeline.aiData,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 3,
          tension: 0.1,
          fill: {
            target: 0,
            above: 'rgba(192, 57, 43, 0.06)',
            below: 'rgba(39, 133, 106, 0.10)'
          },
          order: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: { size: 13, weight: '500' },
            padding: 12
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
            }
          }
        },
        filler: {
          propagate: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

/**
 * Destroy the chart instance
 */
export function destroyChart() {
  if (roiChart) {
    roiChart.destroy();
    roiChart = null;
  }
}
