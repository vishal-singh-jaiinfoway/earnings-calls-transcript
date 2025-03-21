'use client';

import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const data = {
  cashflowStatementHistory: {
    cashflowStatements: [
      {
        endDate: '2024-12-31T00:00:00.000Z',
        netIncome: 498665000
      },
      {
        endDate: '2023-12-31T00:00:00.000Z',
        netIncome: -300742000
      },
      {
        endDate: '2022-12-31T00:00:00.000Z',
        netIncome: -320407000
      },
      {
        endDate: '2021-12-31T00:00:00.000Z',
        netIncome: -483937000
      }
    ]
  },
  earnings: {
    earningsChart: {
      quarterly: [
        {
          date: '1Q2024',
          actual: 0.0269,
          estimate: -0.005
        },
        {
          date: '2Q2024',
          actual: 0.016,
          estimate: 0.01
        },
        {
          date: '3Q2024',
          actual: 0.0499,
          estimate: 0.04333
        },
        {
          date: '4Q2024',
          actual: 0.05,
          estimate: 0.03667
        }
      ]
    }
  },
  earningsHistory: {
    history: [
      {
        epsActual: 0.0269,
        epsEstimate: -0.005,
        surprisePercent: 6.38,
        quarter: '2024-03-31T00:00:00.000Z'
      },
      {
        epsActual: 0.016,
        epsEstimate: 0.01,
        surprisePercent: 0.6,
        quarter: '2024-06-30T00:00:00.000Z'
      },
      {
        epsActual: 0.0499,
        epsEstimate: 0.04333,
        surprisePercent: 0.1516,
        quarter: '2024-09-30T00:00:00.000Z'
      },
      {
        epsActual: 0.05,
        epsEstimate: 0.03667,
        surprisePercent: 0.3635,
        quarter: '2024-12-31T00:00:00.000Z'
      }
    ]
  }
};

export default function Trends() {
  // ✅ Cash Flow Chart Data
  const cashFlowData = {
    labels: data.cashflowStatementHistory.cashflowStatements.map(item =>
      new Date(item.endDate).getFullYear()
    ),
    datasets: [
      {
        label: 'Net Income ($)',
        data: data.cashflowStatementHistory.cashflowStatements.map(
          item => item.netIncome
        ),
        backgroundColor: data.cashflowStatementHistory.cashflowStatements.map(
          item => (item.netIncome > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)')
        )
      }
    ]
  };

  // ✅ Earnings Chart Data
  const earningsData = {
    labels: data.earnings.earningsChart.quarterly.map(item => item.date),
    datasets: [
      {
        label: 'Actual Earnings',
        data: data.earnings.earningsChart.quarterly.map(item => item.actual),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        fill: true
      },
      {
        label: 'Estimated Earnings',
        data: data.earnings.earningsChart.quarterly.map(item => item.estimate),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        fill: true
      }
    ]
  };

  // ✅ Earnings Surprise Pie Chart Data
  const surpriseData = {
    labels: data.earningsHistory.history.map(item =>
      new Date(item.quarter).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      })
    ),
    datasets: [
      {
        label: 'Surprise %',
        data: data.earningsHistory.history.map(item => item.surprisePercent),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }
    ]
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cash Flow Statement</h2>
      <div style={{ height: '300px' }}>
        <Bar data={cashFlowData} />
      </div>

      <h2>Earnings Chart</h2>
      <div style={{ height: '300px', marginTop: '20px' }}>
        <Line data={earningsData} />
      </div>

      <h2>Earnings Surprise</h2>
      <div style={{ height: '300px', marginTop: '20px' }}>
        <Pie data={surpriseData} />
      </div>
    </div>
  );
}
