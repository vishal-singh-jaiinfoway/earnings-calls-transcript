"use client";

import React, { useEffect, useState } from "react";

// Dynamically import chart modules only on the client
let Bar, Line, Pie, Doughnut, Scatter, Bubble, ChartJS;

if (typeof window !== "undefined") {
    const chartjs = require("chart.js");
    const chartjs2 = require("react-chartjs-2");

    ChartJS = chartjs.Chart;
    Bar = chartjs2.Bar;
    Line = chartjs2.Line;
    Pie = chartjs2.Pie;
    Doughnut = chartjs2.Doughnut;
    Scatter = chartjs2.Scatter;
    Bubble = chartjs2.Bubble;

    const {
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
        ArcElement
    } = chartjs;

    ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
    );
}

type ChartType =
    | "bar"
    | "stackedBar"
    | "line"
    | "pie"
    | "donut"
    | "scatter"
    | "bubble";

interface ChartData {
    [key: string]: string | number;
}

interface Props {
    key: number;
    data: ChartData[];
    chartType: ChartType;
    chartTitle: string;
}

const DynamicChart = ({ data, chartType, chartTitle }: Props) => {
    const [isClient, setIsClient] = useState(false); // ✅ Track client-side rendering

    useEffect(() => {
        setIsClient(true); // Enable chart rendering on client
    }, []);

    if (!data || data.length === 0) return <div>No data available</div>;

    // Safely determine the label key
    const labelKey = Object.keys(data[0]).find(
        (key) => typeof data[0][key] === "string"
  );

    if (!labelKey) return <div>Invalid data format</div>;

    const labels = data.map((item) => item[labelKey] as string);
    const keys = Object.keys(data[0]).filter((key) => key !== labelKey);

    const chartData = {
        labels,
        datasets: keys.map((key, index) => ({
            label: key,
            data: data.map((item) => item[key] as number),
            backgroundColor: [
                "rgba(91, 44, 111, 0.2)", // Deep Purple
                "rgba(108, 52, 131, 0.2)", // Royal Purple
                "rgba(210, 180, 222, 0.2)", // Lavender
                "rgba(233, 30, 99, 0.2)", // Hot Pink
                "rgba(248, 187, 208, 0.2)", // Soft Pink
                "rgba(112, 123, 124, 0.2)" // Slate Gray
            ][index % 6],
            borderColor: [
                "rgba(91, 44, 111, 1)",
                "rgba(108, 52, 131, 1)",
                "rgba(210, 180, 222, 1)",
                "rgba(233, 30, 99, 1)",
                "rgba(248, 187, 208, 1)",
                "rgba(112, 123, 124, 1)"
            ][index % 6],
            borderWidth: 2,
            hoverBackgroundColor: "rgba(0, 0, 0, 0.1)",
            hoverBorderColor: "#000",
            borderRadius: 8,
            fill: true,
            tension: 0.4
        }))
  };

    const chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "#333",
                    font: {
                        size: 14,
                        family: "Poppins"
                    }
                }
            },
            tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                bodyColor: "#333",
                titleColor: "#333",
                borderWidth: 1,
                borderColor: "#ddd",
                cornerRadius: 8
            },
            title: {
                display: true,
                text: chartTitle,
                color: "#333",
                font: {
                    size: 18,
                    family: "Poppins",
                weight: "bold"
            },
            padding: {
                top: 10,
                    bottom: 30
                }
            }
        },

        scales: {
            x: {
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                  borderColor: "#ddd"
              },
              ticks: {
                  color: "#333",
                  font: {
                      size: 12,
                      family: "Poppins"
                  }
              }
          },
          y: {
              grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                borderColor: "#ddd"
            },
            ticks: {
                color: "#333",
                font: {
                    size: 12,
                      family: "Poppins"
                  }
              }
          }
      }
  };

    // ✅ Only render chart if it's client-side
    if (!isClient) {
        return <div className="text-gray-500">Loading chart...</div>;
    }

    return (
        <div style={{ width: "100%", height: "400px" }}>
            {chartType === "bar" && Bar && <Bar data={chartData} options={chartOptions} />}
            {chartType === "stackedBar" && Bar && (
                <Bar
                    data={{
                        ...chartData,
                        datasets: chartData.datasets.map((dataset) => ({
                            ...dataset,
                          stack: "stack1"
                      }))
                  }}
                  options={{
                      ...chartOptions,
                      scales: {
                          x: { stacked: true },
                          y: { stacked: true }
                      }
                  }}
              />
          )}
            {chartType === "line" && Line && <Line data={chartData} options={chartOptions} />}
            {chartType === "pie" && Pie && <Pie data={chartData} options={chartOptions} />}
            {chartType === "donut" && Doughnut && (
              <Doughnut data={chartData} options={chartOptions} />
          )}
            {chartType === "scatter" && Scatter && (
              <Scatter data={chartData} options={chartOptions} />
          )}
            {chartType === "bubble" && Bubble && (
              <Bubble data={chartData} options={chartOptions} />
          )}
      </div>
  );
};

export default DynamicChart;
