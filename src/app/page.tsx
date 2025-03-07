'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Smile, TrendingUp } from 'lucide-react';

// Data for the feature chart
const featureData = [
  { name: 'AI Summaries', value: 90, icon: <Brain size={20} /> },
  { name: 'Sentiment Analysis', value: 80, icon: <Smile size={20} /> },
  { name: 'Actionable Insights', value: 85, icon: <TrendingUp size={20} /> },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 rounded shadow-2xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-gray-900">Unlock Insights from Earnings Calls</h1>
        <p className="mt-4 text-lg text-gray-600">
          Get AI-powered summaries, sentiment analysis, and key takeaways from the latest earnings calls of top companies.
        </p>
        <button className="bg-gradient-to-r from-blue-500 to-blue-800 mt-6 px-8 py-3 text-lg font-semibold text-white rounded-lg shadow-lg hover:scale-105 transition-all">
          Get Started
        </button>
      </motion.div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <FeatureCard
          title="AI-Powered Summaries"
          description="Quickly understand earnings calls with AI-generated summaries."
          icon={<Brain size={30} />}
        />
        <FeatureCard
          title="Sentiment Analysis"
          description="Analyze the tone and sentiment of key executives."
          icon={<Smile size={30} />}
        />
        <FeatureCard
          title="Actionable Insights"
          description="Extract key takeaways to make informed investment decisions."
          icon={<TrendingUp size={30} />}
        />
      </div>

      {/* Feature Chart */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-20 bg-white p-6 rounded-2xl shadow-lg max-w-4xl w-full"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Feature Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={featureData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={150}
            // tickFormatter={(value, index) => (
            //   <div className="flex items-center gap-2">
            //     {featureData[index].icon} {value}
            //   </div>
            // )}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div> */}
    </div>
  );
}

function FeatureCard({ title, description, icon }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-r from-blue-500 to-blue-800 p-6 rounded-2xl shadow-md text-center text-white flex flex-col items-center"
    >
      <div className="mb-2">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-gray-200">{description}</p>
    </motion.div>
  );
}
