"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  IgrFinancialChart,
  IgrFinancialChartModule,
} from "igniteui-react-charts";

IgrFinancialChartModule.register();

const fullData = [
  { date: new Date(2023, 0, 1), open: 50, high: 52, low: 49, close: 51 },
  { date: new Date(2023, 1, 1), open: 51, high: 54, low: 50, close: 52 },
  { date: new Date(2023, 2, 1), open: 52, high: 56, low: 51, close: 55 },
  { date: new Date(2023, 3, 1), open: 55, high: 58, low: 54, close: 56 },
  { date: new Date(2023, 4, 1), open: 56, high: 60, low: 55, close: 58 },
  { date: new Date(2023, 5, 1), open: 58, high: 63, low: 57, close: 60 },
  { date: new Date(2023, 6, 1), open: 60, high: 64, low: 59, close: 62 },
  { date: new Date(2023, 7, 1), open: 62, high: 66, low: 61, close: 64 },
  { date: new Date(2023, 8, 1), open: 64, high: 68, low: 63, close: 66 },
  { date: new Date(2023, 9, 1), open: 66, high: 70, low: 65, close: 68 },
  { date: new Date(2023, 10, 1), open: 68, high: 72, low: 67, close: 70 },
  { date: new Date(2023, 11, 1), open: 70, high: 74, low: 69, close: 72 },
  { date: new Date(2024, 0, 1), open: 72, high: 76, low: 71, close: 74 },
  { date: new Date(2024, 1, 1), open: 74, high: 78, low: 73, close: 76 },
  { date: new Date(2024, 2, 1), open: 76, high: 80, low: 75, close: 78 },
  { date: new Date(2024, 3, 1), open: 78, high: 82, low: 77, close: 80 },
];

const marketData = [
  { label: "Market Cap", value: "$2.89T" },
  { label: "Beta", value: "0.91" },
  { label: "P/E Ratio", value: "31.25" },
  { label: "EPS", value: "12.43" },
  { label: "Dividend", value: "$3.16" },
  { label: "Dividend Yield", value: "0.81%" },
  { label: "Next Earnings Date", value: "2025-04-23" },
];

const TIME_RANGES = [
  { label: "1M", value: "1M" },
  { label: "6M", value: "6M" },
  { label: "1Y", value: "1Y" },
  { label: "5Y", value: "5Y" },
];

function MarketMetrics() {
  const [filteredData, setFilteredData] = useState(fullData);
  const [activeRange, setActiveRange] = useState("1Y");

  // ✅ Filter data based on selected range
  const filterData = (range: string) => {
    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case "1M":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "6M":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1Y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "5Y":
        startDate.setFullYear(endDate.getFullYear() - 5);
        break;
      default:
        startDate = new Date(fullData[0].date);
    }

    const filtered = fullData.filter(
      (data) => data.date >= startDate && data.date <= endDate,
    );

    setFilteredData(filtered);
    setActiveRange(range);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-xl rounded-2xl p-6 border border-blue-700">
      {/* Financial Stock Chart */}
      <CardContent className="w-full h-64">
        <IgrFinancialChart
          width="100%"
          height="100%"
          dataSource={filteredData}
          chartTitle="Microsoft Revenue Trends"
          chartType="Line" // Options: Candle, Bar, Column, Line, OHLC
          isToolbarVisible={true}
          brushes={["#60A5FA"]}
          outlines={["#60A5FA"]}
          negativeOutlines={["#93C5FD"]}
          zoomSliderType="None"
          xAxisLabelTextColor="#D1D5DB"
          yAxisLabelTextColor="#D1D5DB"
          xAxisMajorStroke="#374151"
          yAxisMajorStroke="#374151"
        />
      </CardContent>

      {/* Market Data */}
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
        {marketData.map((data, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-blue-700 pb-2"
          >
            <span className="font-semibold text-blue-300">{data.label}:</span>
            <span className="text-blue-200">{data.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default MarketMetrics;
