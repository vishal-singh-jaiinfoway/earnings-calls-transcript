"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";

// ✅ Dynamically import recharts with SSR disabled
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

function FinancialMetrics() {
  const [earningsMetrics, setEarningsMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Handle fallback for undefined state
  const earningsData =
    useSelector((state: any) => state?.sidebar?.earningsData) || {};

  useEffect(() => {
    setIsLoading(true);

    // ✅ Safely extract earnings data
    const data = earningsData?.earningsHistory
      ? extractEarnings(earningsData.earningsHistory, 2024, 1)
      : null;

    if (data) {
      setEarningsMetrics([
        {
          name: `Q${Math.ceil((new Date(data.quarter).getMonth() + 1) / 3)}`,
          value: data.epsActual || 0,
          estimate: data.epsEstimate || 0,
          difference: data.epsDifference || 0,
          surprisePercent: (data.surprisePercent * 100).toFixed(2) + "%",
          currency: data.currency || "USD",
        },
      ]);
    } else {
      setEarningsMetrics([]);
    }

    setIsLoading(false);
  }, [earningsData]);

  return (
    <Card className="bg-white text-gray-800 shadow-md rounded-3xl p-8 border border-gray-300 transition-all hover:shadow-lg">
      <CardHeader className="pb-6 border-b border-gray-200">
        <CardTitle className="text-2xl font-bold text-gray-700">
          Financial Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base mt-6">
        {/* Metrics Section */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-500">Loading data...</p>
          ) : earningsMetrics && earningsMetrics.length > 0 ? (
            earningsMetrics.map((metric, index) => (
              <div key={index} className="space-y-1">
                <p>
                  <span className="font-semibold text-gray-500">Quarter:</span>{" "}
                  <span className="text-gray-800 font-bold">{metric.name}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-500">
                    EPS Actual:
                  </span>{" "}
                  <span className="text-gray-800 font-bold">
                    {metric.value} {metric.currency}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-500">
                    EPS Estimate:
                  </span>{" "}
                  <span className="text-gray-800 font-bold">
                    {metric.estimate} {metric.currency}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-500">
                    Difference:
                  </span>{" "}
                  <span className="text-gray-800 font-bold">
                    {metric.difference} {metric.currency}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-500">
                    Surprise Percent:
                  </span>{" "}
                  <span className="text-gray-800 font-bold">
                    {metric.surprisePercent}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Chart Section */}
        <div className="w-full h-60">
          {isLoading ? (
            <p className="text-gray-500">Loading chart...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsMetrics} barSize={30}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#4B5563", fontSize: 14, fontWeight: "500" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#4B5563", fontSize: 14, fontWeight: "500" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F9FAFB",
                    color: "#4B5563",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  cursor={{ fill: "#E5E7EB" }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#blueGradient)"
                  radius={[12, 12, 0, 0]}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4338CA" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ✅ Extract earnings safely with null checks
const extractEarnings = (earningsHistory: any[], targetYear: number, targetQuarter: number) => {
  if (!earningsHistory?.length) return null;

  return (
    earningsHistory.find((entry) => {
      if (!entry?.quarter) return false;
      const date = new Date(entry.quarter);
      if (isNaN(date.getTime())) return false;
      const year = date.getFullYear();
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return year === targetYear && quarter === targetQuarter;
    }) || null
  );
};

export default FinancialMetrics;
