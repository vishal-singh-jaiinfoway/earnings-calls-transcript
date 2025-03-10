import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// Sample data
const data = {
  labels: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"],
  datasets: [
    {
      label: "Actual EPS",
      data: [1.2, 1.5, 1.7, 1.8, 2.0, 2.3],
      borderColor: "#E11D48", // Strong Red
      backgroundColor: "rgba(225, 29, 72, 0.2)",
      pointBackgroundColor: "#E11D48",
      pointBorderColor: "#B91C1C",
      pointRadius: 6,
      pointHoverRadius: 8,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
    {
      label: "Expected EPS",
      data: [1.3, 1.4, 1.6, 1.9, 1.9, 2.2],
      borderColor: "#10B981", // Strong Green
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      pointBackgroundColor: "#10B981",
      pointBorderColor: "#047857",
      pointRadius: 6,
      pointHoverRadius: 8,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#F9FAFB",
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      backgroundColor: "#1E293B",
      titleColor: "#F9FAFB",
      bodyColor: "#F9FAFB",
      cornerRadius: 8,
      borderWidth: 1,
      borderColor: "#94A3B8",
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#E5E7EB",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
    y: {
      ticks: {
        color: "#E5E7EB",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
  },
  elements: {
    point: {
      hoverBorderWidth: 0, // Disable default hover outline
    },
  },
};

// Custom plugin to add glow effect to points
const glowPlugin = {
  id: "glow",
  beforeDraw: (chart: any) => {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset: any, i: number) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((point: any) => {
        if (point.active) {
          ctx.save();
          ctx.shadowColor = dataset.borderColor;
          ctx.shadowBlur = 15; // Adjust glow intensity
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.options.radius + 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fillStyle = dataset.pointBackgroundColor;
          ctx.fill();
          ctx.restore();
        }
      });
    });
  },
};

const EPSComparisonTrend = () => {
  return (
    <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl rounded-2xl p-6 border border-gray-700">
      {/* <CardHeader className="border-b border-gray-600 pb-4">
        <CardTitle className="text-xl font-bold">EPS Comparison & Trend</CardTitle>
      </CardHeader> */}
      <CardContent className="w-full h-96">
        <Line data={data} options={options} plugins={[glowPlugin]} />
      </CardContent>
    </Card>
  );
};

export default EPSComparisonTrend;
