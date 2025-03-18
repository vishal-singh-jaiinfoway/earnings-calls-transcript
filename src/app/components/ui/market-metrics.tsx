"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

// ✅ Dynamically import IgrFinancialChart to prevent SSR issues
const IgrFinancialChart = dynamic(
  () =>
    import("igniteui-react-charts").then((mod) => mod.IgrFinancialChart),
  { ssr: false }
);

function MarketMetrics({ financialMetricsData, isLoading }: any) {
  const [marketData, setMarketData] = useState<any>({});
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);

  useEffect(() => {
    if (financialMetricsData?.marketData) {
      setMarketData(financialMetricsData.marketData);
    } else {
      setMarketData({});
    }
    if (financialMetricsData?.revenueTrends) {
      setRevenueTrends(financialMetricsData.revenueTrends);
    } else {
      setRevenueTrends([]);
    }
  }, [financialMetricsData]);

  return (
    <Card className="bg-white text-gray-800 shadow-sm rounded-xl p-4 border border-gray-200">
      {/* Financial Stock Chart */}
      <CardContent className="w-full h-64">
        {revenueTrends.length > 0 ? (
          <IgrFinancialChart
            width="100%"
            height="100%"
            dataSource={revenueTrends}
            chartTitle="Revenue Trends"
            chartType="Line"
            isToolbarVisible={false}
            brushes={["#6B7280"]}
            outlines={["#6B7280"]}
            negativeOutlines={["#D1D5DB"]}
            zoomSliderType="None"
            xAxisLabelTextColor="#6B7280"
            yAxisLabelTextColor="#6B7280"
            xAxisMajorStroke="#E5E7EB"
            yAxisMajorStroke="#E5E7EB"
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">
            No revenue trends data available.
          </div>
        )}
      </CardContent>

      {/* Market Data */}
      {Object.keys(marketData).length > 0 ? (
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm">
          {[
            { label: "Market Cap", value: formatValue(marketData?.marketCap) },
            { label: "Beta", value: formatValue(marketData?.beta) },
            { label: "P/E Ratio", value: formatValue(marketData?.peRatio, 2) },
            { label: "Dividend", value: formatValue(marketData?.dividend) },
            { label: "Dividend Yield", value: formatPercentage(marketData?.dividendYield) },
            { label: "EPS", value: formatValue(marketData?.eps, 2) },
            { label: "Next Earnings Date", value: marketData?.nextEarningsDate || "N/A" },
            { label: "Highest Price", value: formatValue(marketData?.highestPrice, 2) },
            { label: "Lowest Price", value: formatValue(marketData?.lowestPrice, 2) },
            { label: "Average Price", value: formatValue(marketData?.averagePrice, 2) },
            { label: "Change Percent", value: formatPercentage(marketData?.changePercent) },
          ].map((data, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-200 pb-2"
            >
              <span className="font-medium text-gray-600">{data.label}:</span>
              <span className="text-gray-700">{data.value}</span>
            </div>
          ))}
        </CardContent>
      ) : (
        <div className="text-gray-400 text-center mt-4">
          No market data available.
        </div>
      )}
    </Card>
  );
}

// ✅ Helper to format values with fallback
const formatValue = (value: any, decimalPlaces = 0) => {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  if (typeof value === "number") {
    return value.toFixed(decimalPlaces);
  }
  return value;
};

// ✅ Helper to format percentage values
const formatPercentage = (value: any) => {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  return `${(value * 100).toFixed(2)}%`;
};

export default MarketMetrics;
