import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const marketData = [
  { name: "Beta", value: 0.91 },
  { name: "P/E Ratio", value: 31.25 },
  { name: "EPS", value: 12.43 },
  { name: "Dividend Yield", value: 0.81 }
];

function MarketMetrics() {
  return (
    <Card className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-xl rounded-2xl p-6 border border-blue-700">
      <CardHeader className="border-b border-blue-600 pb-4">
        <CardTitle className="text-xl font-bold">Market Metrics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6 text-sm mt-4">
        <div className="space-y-3 w-full md:w-1/2">
          <p><span className="font-semibold">Market Cap:</span> <span className="text-blue-200">$2.89T</span></p>
          <p><span className="font-semibold">Beta:</span> <span className="text-blue-200">0.91</span></p>
          <p><span className="font-semibold">P/E Ratio:</span> <span className="text-blue-200">31.25</span></p>
          <p><span className="font-semibold">EPS:</span> <span className="text-blue-200">12.43</span></p>
          <p><span className="font-semibold">Dividend:</span> <span className="text-blue-200">$3.16</span></p>
          <p><span className="font-semibold">Dividend Yield:</span> <span className="text-blue-200">0.81%</span></p>
          <p className="text-blue-300 font-medium"><span className="font-semibold">Next Earnings Date:</span> 2025-04-23</p>
        </div>
        <div className="w-full md:w-1/2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <XAxis dataKey="name" tick={{ fill: "#D1D5DB" }} />
              <YAxis tick={{ fill: "#D1D5DB" }} />
              <Tooltip cursor={{ stroke: "#F3F4F6" }} />
              <Line type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={3} dot={{ fill: "#93C5FD", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default MarketMetrics;
