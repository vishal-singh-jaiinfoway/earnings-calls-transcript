"use client";

import React, { useEffect, useState } from "react";
import {
    IgrCategoryChartModule,
    IgrPieChartModule,
    IgrDataChartCoreModule,
    IgrDataChartCategoryModule,
    IgrCategoryChart,
    IgrPieChart,
    IgrDataChart,
    IgrCategoryXAxis,
    IgrNumericYAxis,
    IgrScatterSeries,
} from "igniteui-react-charts";

// ✅ Check for window to avoid SSR error
const isClient = typeof window !== "undefined";

// ✅ Register Ignite UI modules only on client side
if (isClient) {
    IgrCategoryChartModule.register();
    IgrPieChartModule.register();
    IgrDataChartCoreModule.register();
    IgrDataChartCategoryModule.register();
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

// 🎨 Color Palette
const COLORS = [
    "#7C3AED", // Purple
    "#8B5CF6", // Soft Purple
    "#F472B6", // Pink
    "#EC4899", // Deep Pink
    "#4B5563", // Dark Gray
    "#9CA3AF", // Mid Gray
];

const DynamicChart = ({ data, chartType, chartTitle }: Props) => {
    const [isMounted, setIsMounted] = useState(false);

    // ✅ Set isMounted to true after client-side mount
    useEffect(() => {
      if (isClient) {
          setIsMounted(true);
      }
  }, []);

    if (!data || data.length === 0)
        return (
            <div className="bg-gray-50 text-center p-6 rounded-xl shadow-md text-gray-500">
                📉 No data available.
            </div>
        );

    // ✅ Identify label key for x-axis (first string key is treated as label)
    const labelKey = Object.keys(data[0]).find(
        (key) => typeof data[0][key] === "string"
    );

    if (!labelKey)
        return (
            <div className="bg-white text-center p-6 rounded-xl shadow-md text-red-500">
                ⚠️ Invalid data format.
            </div>
        );

    const keys = Object.keys(data[0]).filter((key) => key !== labelKey);

    // 🎯 Render appropriate chart only after client-side mount
    const renderChart = () => {
        if (!isMounted || !isClient) {
            return (
                <div className="flex justify-center items-center h-80 text-gray-500">
                    ⏳ Loading chart...
                </div>
            );
        }

      switch (chartType) {
          case "bar":
          case "stackedBar":
              return (
                  <div className="w-full h-80">
                      <IgrCategoryChart
                          dataSource={data}
                          chartType="Column"
                          isStacked={chartType === "stackedBar"}
                          xAxisLabel={labelKey}
                          yAxisTitle="Values"
                          width="100%"
                          height="100%"
                          brushes={COLORS.slice(0, 4)}
                          outlines={COLORS.slice(0, 4)}
                      />
                  </div>
              );

        case "line":
            return (
                <div className="w-full h-80">
                    <IgrCategoryChart
                        dataSource={data}
                        chartType="Line"
                        xAxisLabel={labelKey}
                        yAxisTitle="Values"
                        width="100%"
                        height="100%"
                        brushes={COLORS.slice(0, 4)}
                        outlines={COLORS.slice(0, 4)}
                    />
                </div>
            );

        case "pie":
        case "donut":
            const pieData = keys.map((key) => ({
                category: key,
                value: data.reduce((sum, item) => sum + (item[key] as number), 0),
            }));

            return (
                <div className="w-full h-80 flex justify-center items-center">
                    <IgrPieChart
                        dataSource={pieData}
                        labelMemberPath="category"
                        valueMemberPath="value"
                        width="100%"
                        height="100%"
                        innerRadius={chartType === "donut" ? 50 : 0}
                        radiusFactor={0.7}
                        brushes={COLORS}
                        outlines={COLORS}
                    />
                </div>
            );

        case "scatter":
            return (
                <div className="w-full h-80">
                    <IgrCategoryChart
                        dataSource={data}
                        width="100%"
                        height="100%"
                        xAxisLabel={labelKey}
                        yAxisTitle="Values"
                        brushes={COLORS.slice(0, 4)}
                        outlines={COLORS.slice(0, 4)}
                    />
                </div>
            );

        case "bubble":
            return (
                <div className="w-full h-80">
                    <IgrDataChart width="100%" height="100%" dataSource={data}>
                        <IgrCategoryXAxis name="xAxis" label={labelKey} />
                        <IgrNumericYAxis name="yAxis" />
                        {keys.map((key, index) => (
                            <IgrScatterSeries
                                key={key}
                                name={key}
                                xAxisName="xAxis"
                                yAxisName="yAxis"
                                xMemberPath={labelKey}
                                yMemberPath={key}
                                markerType="Circle"
                                brush={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </IgrDataChart>
                </div>
            );

        default:
            return (
                <div className="bg-gray-50 text-center p-6 rounded-xl shadow-md text-red-500">
                    ❌ Invalid chart type.
                </div>
            );
    }
  };

    return (
      <div className="bg-gradient-to-b from-purple-50 to-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-200">
          {/* Header Section */}
          <h3 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
              📊 {chartTitle}
          </h3>

          {/* Chart Section */}
          <div className="w-full h-80 rounded-lg overflow-hidden transition-all">
              {renderChart()}
          </div>
      </div>
  );
};

export default DynamicChart;
