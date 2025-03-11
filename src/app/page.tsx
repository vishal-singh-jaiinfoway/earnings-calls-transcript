'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Brain, Smile, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import ChatDemo from './components/ui/chatDemo';

// Simulated Stock Market Data
const stockData = [
  { name: 'Jan', value: 70 },
  { name: 'Feb', value: 80 },
  { name: 'Mar', value: 75 },
  { name: 'Apr', value: 90 },
  { name: 'May', value: 85 },
];

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="relative h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      {/* Background Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stockData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#bbb"
              tick={{ fontSize: 14, fill: '#bbb' }}
              tickLine={false}
              axisLine={{ stroke: '#444' }}
            />
            <YAxis
              stroke="#bbb"
              tick={{ fontSize: 14, fill: '#bbb' }}
              tickLine={false}
              axisLine={{ stroke: '#444' }}
              domain={[60, 100]}
            />
            <CartesianGrid stroke="#444" strokeDasharray="4 4" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#222',
                border: '1px solid #555',
                borderRadius: '8px',
                color: '#ddd',
              }}
              itemStyle={{ color: '#ddd' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#blueGradient)"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, index } = props;
                const isActive = index === activeIndex;

                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 8 : 6}
                    fill="#3b82f6"
                    stroke={isActive ? '#60a5fa' : '#3b82f6'}
                    strokeWidth={isActive ? 3 : 2}
                    className={`transition-all duration-200 ${isActive ? 'glow' : ''
                      }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                );
              }}
              activeDot={{
                r: 10,
                fill: '#60a5fa',
                strokeWidth: 3,
                stroke: '#3b82f6',
                className: 'glow',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl relative z-10"
      >
        <h1 className="text-5xl font-extrabold text-white leading-tight">
          Unlock Insights from Earnings Calls
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Get AI-powered summaries, sentiment analysis, and key takeaways from the latest earnings calls of top companies.
        </p>

      </motion.div>
      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl relative z-10">
        <FeatureCard
          title="AI-Powered Summaries"
          description="Quickly understand earnings calls with AI-generated summaries."
          icon={<Brain size={30} />}
          gradient="from-blue-600 to-blue-800"
        />
        <FeatureCard
          title="Sentiment Analysis"
          description="Analyze the tone and sentiment of key executives."
          icon={<Smile size={30} />}
          gradient="from-blue-600 to-blue-800"
        />
        <FeatureCard
          title="Actionable Insights"
          description="Extract key takeaways to make informed investment decisions."
          icon={<TrendingUp size={30} />}
          gradient="from-blue-600 to-blue-800"
        />
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  gradient,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-r ${gradient} p-6 rounded-2xl shadow-md text-center text-white flex flex-col items-center`}
    >
      <div className="mb-2">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-gray-200">{description}</p>
    </motion.div>
  );
}

// CSS for glow effect
const styles = `
  .glow {
    filter: drop-shadow(0px 0px 10px #3b82f6);
  }
`;

export const GlobalStyles = () => <style>{styles}</style>;
