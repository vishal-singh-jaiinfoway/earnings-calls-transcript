"use client";

import React, { useEffect, useState } from "react";

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
    const [isClient, setIsClient] = useState(false);
    const [ChartJS, setChartJS] = useState<any>(null);
    const [Bar, setBar] = useState<any>(null);
    const [Line, setLine] = useState<any>(null);
    const [Pie, setPie] = useState<any>(null);
    const [Doughnut, setDoughnut] = useState<any>(null);
    const [Scatter, setScatter] = useState<any>(null);
    const [Bubble, setBubble] = useState<any>(null);

    // Dynamically import chart.js and react-chartjs-2 on client
    useEffect(() => {
        setIsClient(true);

        const loadChartModules = async () => {
            const chartjs = await import("chart.js");
            const chartjs2 = await import("react-chartjs-2");

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

        chartjs.Chart.register(
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

        setChartJS(chartjs.Chart);
        setBar(chartjs2.Bar);
        setLine(chartjs2.Line);
        setPie(chartjs2.Pie);
        setDoughnut(chartjs2.Doughnut);
        setScatter(chartjs2.Scatter);
        setBubble(chartjs2.Bubble);
    };

      loadChartModules();
  }, []);

    // Handle no data scenario
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
        data: data.map((item) => item[key] as number || 0),
        backgroundColor: [
            "rgba(91, 44, 111, 0.2)",
            "rgba(108, 52, 131, 0.2)",
            "rgba(210, 180, 222, 0.2)",
            "rgba(233, 30, 99, 0.2)",
            "rgba(248, 187, 208, 0.2)",
            "rgba(112, 123, 124, 0.2)"
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

    // ✅ Only render chart if it's client-side and modules are loaded
    if (!isClient || !ChartJS || !Bar) {
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
