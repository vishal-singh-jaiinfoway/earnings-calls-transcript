"use client";

import { useRef, useState } from "react";
import DynamicChart from "../components/charts/dynamicChart";
import { useSelector } from "react-redux";

const SUGGESTIONS = [
  "Revenue over the last 5 years",
  "Profit margin",
  "Stock performance trends",
  "Cash flow variation by quarter",
  "Earnings per share (EPS) growth rate",
  "Debt-to-equity ratio analysis",
  "Operating income vs. net income",
  "Quarterly dividend payout trends",
  "Return on equity (ROE) comparison",
  "Gross margin trend over time",
  "Year-over-year revenue growth",
  "Free cash flow analysis",
  "Interest expense as a percentage of revenue",
  "Net profit margin variation by quarter",
  "Impact of foreign exchange rates on revenue",
  "Working capital trend analysis",
  "Cost of goods sold (COGS) comparison",
  "Capital expenditure (CapEx) trend",
  "Long-term vs. short-term debt structure",
  "Inventory turnover rate analysis",
  "EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) trends",
];

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-600"></div>
  </div>
);

const ChartCreator = ({chartData,setChartData}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector((state) => state.sidebar.selectedQuarter);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleGenerateChart = async () => {
    try {
      if (!prompt.trim()) return;
      setIsLoading(true);
      const response = await fetch("/api/charts-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, companies: selectedCompanies ,chartData}),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setChartData((prev) => {
        let temp = [];
        if (prev.length > 0) {
            temp = [...prev];
        }
        temp.unshift(data.data); // Add the latest data at the beginning
        return temp;
    });
    
      setIsLoading(false);
      scrollToBottom()
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };



  return (
    <div className="space-y-6">
      {/* Suggestions */}
      <div className="max-h-[150px] max-w-screen overflow-y-auto border border-gray-300 rounded-lg p-2">
        <div className="flex flex-wrap gap-3">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-full hover:text-purple-600 transition"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Chatbox */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter chart prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
        />
        <button
          onClick={handleGenerateChart}
          className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-400 transition"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
      <div ref={messagesEndRef} />

  {/* Loading Indicator */}
  {isLoading && (
        <div className="flex justify-center my-4">
          <Spinner />
        </div>
      )}
      {/* Chart Preview */}
      <div className="m-4 max-w-screen">
        {chartData?.length > 0 &&
          chartData?.map((chart, index) => (
            <div key={index} className="mb-6">
              <DynamicChart
                data={chart.chartData}
                chartType={chart.chartType}
                chartTitle={chart.title}
              />
            </div>

          ))}
          </div>
    </div>
  );
};

export default ChartCreator;
