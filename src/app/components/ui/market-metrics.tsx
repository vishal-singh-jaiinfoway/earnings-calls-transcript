"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  IgrFinancialChart,
  IgrFinancialChartModule,
} from "igniteui-react-charts";
import { useEffect, useState } from "react";

IgrFinancialChartModule.register();

function MarketMetrics({ financialMetricsData, isLoading }: any) {
  const [marketData, setMarketData] = useState({});
  const [revenueTrends, setRevenueTrends] = useState([]);

  useEffect(() => {
    if (financialMetricsData?.marketData) {
      setMarketData(financialMetricsData?.marketData);
    } else {
      setMarketData({});
    }
    if (financialMetricsData?.revenueTrends) {
      setRevenueTrends(financialMetricsData?.revenueTrends);
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
            { label: "Market Cap", value: marketData?.marketCap?.toLocaleString() || "N/A" },
            { label: "Beta", value: marketData?.beta ?? "N/A" },
            { label: "P/E Ratio", value: marketData?.peRatio?.toFixed(2) || "N/A" },
            { label: "Dividend", value: marketData?.dividend || "N/A" },
            { label: "Dividend Yield", value: marketData?.dividendYield ?? "N/A" },
            { label: "EPS", value: marketData?.eps?.toFixed(2) || "N/A" },
            { label: "Next Earnings Date", value: marketData?.nextEarningsDate || "N/A" },
            { label: "Highest Price", value: marketData?.highestPrice?.toFixed(2) || "N/A" },
            { label: "Lowest Price", value: marketData?.lowestPrice?.toFixed(2) || "N/A" },
            { label: "Average Price", value: marketData?.averagePrice?.toFixed(2) || "N/A" },
            {
              label: "Change Percent",
              value: marketData?.changePercent
                ? `${(marketData?.changePercent * 100).toFixed(2)}%`
                : "N/A",
            },
          ].map((data, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
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

export default MarketMetrics;
