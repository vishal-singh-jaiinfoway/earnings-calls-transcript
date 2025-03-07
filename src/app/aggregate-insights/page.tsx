'use client';

import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl"
            >
                <h1 className="text-4xl font-bold text-gray-900">Unlock Insights from Earnings Calls</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Get AI-powered summaries, sentiment analysis, and key takeaways from the latest earnings calls of top companies.
                </p>
                <button className="mt-6 px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Get Started
                </button>
            </motion.div>

            {/* Features Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
                <FeatureCard
                    title="AI-Powered Summaries"
                    description="Quickly understand earnings calls with AI-generated summaries."
                />
                <FeatureCard
                    title="Sentiment Analysis"
                    description="Analyze the tone and sentiment of key executives."
                />
                <FeatureCard
                    title="Actionable Insights"
                    description="Extract key takeaways to make informed investment decisions."
                />
            </div>
        </div>
    );
}

function FeatureCard({ title, description }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md text-center"
        >
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="mt-2 text-gray-600">{description}</p>
        </motion.div>
    );
}
