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
        ArcElement,
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
    | "bubble"
    | "stackedColumn";

interface ChartData {
    [key: string]: string | number;
}

interface Props {
    key: number;
    data: ChartData[];
    chartType: ChartType;
    chartTitle: string;
}

// 🎨 Purple-Pink Themed Color Palette
const COLORS = [
    "#7C3AED", // Deep Purple
    "#DB2777", // Vivid Pink
    "#A78BFA", // Light Purple
    "#F472B6", // Soft Pink
    "#9CA3AF", // Cool Gray
    "#1F2937", // Dark Gray
];

const DynamicChart = ({ data, chartType, chartTitle }: Props) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
  }, []);

    if (!data || data.length === 0)
        return <div className="text-center text-gray-400 mt-4">No data available</div>;

    // ✅ Transform Data Dynamically
    const chartData = data;

    // 🎯 Updated Chart Options with Theme
    const chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "#E5E7EB", // Light Gray
                    font: {
                        size: 14,
                        family: "Poppins",
                    },
                },
            },
            tooltip: {
                backgroundColor: "rgba(124, 58, 237, 0.9)", // Purple BG
                bodyColor: "#F9FAFB", // White Text
                titleColor: "#F472B6", // Soft Pink
                borderWidth: 1,
                borderColor: "#A78BFA", // Light Purple
                cornerRadius: 10,
                padding: 12,
            },
            title: {
                display: true,
                text: chartTitle,
                color: "#7C3AED",
                font: {
                    size: 20,
                    family: "Poppins",
                    weight: "bold",
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: "rgba(107, 114, 128, 0.2)", // Light Gray Grid
                    borderColor: "#A78BFA",
                },
                ticks: {
                    color: "#9CA3AF", // Cool Gray
                    font: {
                        size: 12,
                        family: "Poppins",
                    },
                },
            },
            y: {
                grid: {
                    color: "rgba(107, 114, 128, 0.2)", // Light Gray Grid
                    borderColor: "#A78BFA",
                },
                ticks: {
                    color: "#9CA3AF",
                    font: {
                        size: 12,
                        family: "Poppins",
                    },
                },
            },
        },
    };

    if (!isClient) {
        return (
            <div className="flex justify-center items-center h-40 text-gray-500">
                Loading chart...
            </div>
        );
    }

    return (
        <div className="w-full mx-auto bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="w-full h-[300px] md:h-[400px] relative">
                {chartType === "bar" && Bar && <Bar data={chartData} options={chartOptions} />}
                {chartType === "stackedBar" && Bar && (
                    <Bar
                        data={{
                            ...chartData,
                            datasets: chartData.datasets.map((dataset) => ({
                                ...dataset,
                                stack: "stack1",
                            })),
                        }}
                        options={{
                            ...chartOptions,
                            scales: {
                                x: { stacked: true },
                                y: { stacked: true },
                            },
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
                {chartType === "stackedColumn" && Bar && (
                    <Bar
                        data={{
                            ...chartData,
                            datasets: chartData.datasets.map((dataset) => ({
                                ...dataset,
                                stack: "stack1",
                            })),
                        }}
                        options={{
                            ...chartOptions,
                            indexAxis: "x",
                            scales: {
                                x: { stacked: true },
                                y: { stacked: true },
                            },
                        }}
                    />
                )}
          </div>
      </div>
  );
};

export default DynamicChart;
