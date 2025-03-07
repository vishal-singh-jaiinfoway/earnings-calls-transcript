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
    <Card className="bg-white text-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200">
      <CardHeader className="pb-4 border-b border-gray-300">
        <CardTitle className="text-xl font-bold text-gray-900">Financial Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mt-4">
        <div className="space-y-2">
          <p><span className="font-semibold text-gray-700">Announce Date:</span> <span className="text-gray-600">2024-04-25</span></p>
          <p><span className="font-semibold text-gray-700">EPS Estimated:</span> <span className="text-gray-600">$2.82</span></p>
          <p><span className="font-semibold text-gray-700">EPS Actual:</span> <span className="text-green-600 font-medium">$2.94</span></p>
          <p><span className="font-semibold text-gray-700">EPS Surprise (%):</span> <span className="text-green-600 font-medium">Beat by 4.3%</span></p>
          <p><span className="font-semibold text-gray-700">Revenue Actual:</span> <span className="text-gray-600">$61.86B</span></p>
          <p><span className="font-semibold text-gray-700">Revenue Surprise:</span> <span className="text-green-600 font-medium">Beat by $996.18M</span></p>
        </div>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fill: "#4B5563" }} />
              <YAxis tick={{ fill: "#4B5563" }} />
              <Tooltip cursor={{ fill: "#F3F4F6" }} />
              <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default FinancialMetrics;
