'use client';

import { useState } from 'react';
import ExecutiveSummary from './ExecutiveSummary';
import FinancialPerformance from './FinancialPerformance';
import MarketTrends from './MarketTrends';
import CompetitiveInsights from './CompetitiveInsights';
import Commentary from './Commentary';
import Guidance from './Guidance';
import ChatBox from "@/components/ui/chatbox";

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);

  const [chats, setChats] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const TABS = [
    {
      id: "executive-summary",
      label: "Executive Summary",
      component: <ExecutiveSummary />,
    },
    {
      id: "financial-performance",
      label: "Financial Performance",
      component: (
        <FinancialPerformance
          chartData={chartData}
          setChartData={setChartData}
        />
      ),
    },
    {
      id: "market-trends",
      label: "Market & Segment Trends",
      component: <MarketTrends />,
    },
    {
      id: "competitive-insights",
      label: "Competitive Strategy Insights",
      component: <CompetitiveInsights />,
    },
    {
      id: "commentary",
      label: "Management Commentary & Market Sentiment",
      component: <Commentary />,
    },
    {
      id: "guidance",
      label: "Forward-Looking Guidance & Risk Factors",
      component: <Guidance />,
    },
  ];
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="min-h-screen bg-purple-50 text-gray-800 p-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="mx-[auto]">
        {TABS.map(
          (tab) =>
            activeTab === tab.id && <div key={tab.id}>{tab.component}</div>,
        )}
      </div>
      {/* Chatbox */}
      <ChatBox
        isOpen={isChatOpen}
        toggleChat={() => setIsChatOpen(!isChatOpen)}
        chats={chats}
        setChats={setChats}
      />
    </div>
  );
};

export default Dashboard;
