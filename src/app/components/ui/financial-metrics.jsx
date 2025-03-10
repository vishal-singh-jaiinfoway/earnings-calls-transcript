"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "EPS Estimated", value: 2.82 },
  { name: "EPS Actual", value: 2.94 },
  { name: "Revenue Actual (B$)", value: 61.86 }
];

function FinancialMetrics() {
  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl rounded-3xl p-8 border border-gray-700 transition-all hover:shadow-2xl">
      <CardHeader className="pb-6 border-b border-gray-600">
        <CardTitle className="text-2xl font-bold text-gray-100">
          Financial Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base mt-6">
        {/* Metrics Section */}
        <div className="space-y-4">
          <p>
            <span className="font-semibold text-gray-400">Announce Date:</span>{" "}
            <span className="text-gray-100 font-bold">2024-04-25</span>
          </p>
          <p>
            <span className="font-semibold text-gray-400">EPS Estimated:</span>{" "}
            <span className="text-gray-100 font-bold">$2.82</span>
          </p>
          <p>
            <span className="font-semibold text-gray-400">EPS Actual:</span>{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-bold">
              $2.94
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-400">
              EPS Surprise (%):
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-bold">
              Beat by 4.3%
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-400">Revenue Actual:</span>{" "}
            <span className="text-gray-100 font-bold">$61.86B</span>
          </p>
          <p>
            <span className="font-semibold text-gray-400">
              Revenue Surprise:
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-bold">
              Beat by $996.18M
            </span>
          </p>
        </div>

        {/* Chart Section */}
        <div className="w-full h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={40}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#D1D5DB", fontSize: 14, fontWeight: "500" }}
                axisLine={{ stroke: "#6B7280" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#D1D5DB", fontSize: 14, fontWeight: "500" }}
                axisLine={{ stroke: "#6B7280" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  color: "#D1D5DB",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
                cursor={{ fill: "#374151" }}
              />
              <Bar
                dataKey="value"
                fill="url(#blueGradient)"
                radius={[12, 12, 0, 0]}
                barSize={30}
              />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default FinancialMetrics;
