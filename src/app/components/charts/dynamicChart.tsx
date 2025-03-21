"use client";
import React, { useEffect, useState } from "react";
import { MessageCircle, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "../ui/chatbox";

// Dynamically import chart modules only on the client
let Bar, Line, Pie, Doughnut, Scatter, Bubble, ChartJS;

if (typeof window !== "undefined") {
    const chartjs = require("chart.js");
    const chartjs2 = require("react-chartjs-2");

    ChartJS = chartjs.Chart;
    Bar = chartjs2.Bar;
    Line = chartjs2.Line;
    Pie = chartjs2.Pie;
    Doughnut = chartjs2.Doughnut;
    Scatter = chartjs2.Scatter;
    Bubble = chartjs2.Bubble;

    const {
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend,
        Filler,
        ArcElement,
    } = chartjs;

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend,
        Filler,
        ArcElement
    );
}

type ChartType =
    | "bar"
    | "stackedBar"
    | "line"
    | "pie"
    | "donut"
    | "scatter"
    | "bubble"
    | "stackedColumn";

interface ChartData {
    [key: string]: string | number;
}

interface Props {
    key: number;
    data: ChartData[];
    chartType: ChartType;
    chartTitle: string;
    chartInsights: string;
}

// 🎨 Color Palette for Theme
const COLORS = [
    "#7C3AED",
    "#DB2777",
    "#A78BFA",
    "#F472B6",
    "#9CA3AF",
    "#1F2937",
    "#E879F9",
    "#6366F1",
];

const DynamicChart = ({ data, chartType, chartTitle, chartInsights }: Props) => {
    const [isClient, setIsClient] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [chats, setChats] = useState([]);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!data || data.length === 0)
        return <div className="text-center text-gray-400 mt-4">No data available</div>;

    const chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "#4B5563",
                    font: {
                        size: 12,
                        family: "Poppins",
                    },
                },
            },
            title: {
                display: true,
                text: chartTitle,
                color: "#7C3AED",
                font: {
                    size: 18,
                    family: "Poppins",
                    weight: "bold",
                },
                padding: { top: 8, bottom: 12 },
            },
        },
    };

    const handleExpandChart = () => {
        setIsDrawerOpen(true);
    };

    if (!isClient) {
        return (
            <div className="flex justify-center items-center h-32 text-gray-500">
                Loading chart...
            </div>
        );
    }

    return (
        <>
            {/* Main Chart Card */}
            <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 relative">
                {/* Expand Icon */}
                <button
                    onClick={handleExpandChart}
                    className="absolute top-4 right-4 text-gray-500 hover:text-purple-500"
                >
                    <Maximize2 className="h-5 w-5" />
                </button>

                {/* Chart Section */}
                <div className="w-full h-[250px] md:h-[350px] relative">
                    {chartType === "bar" && Bar && <Bar data={data} options={chartOptions} />}
                    {chartType === "line" && Line && <Line data={data} options={chartOptions} />}
                    {chartType === "pie" && Pie && <Pie data={data} options={chartOptions} />}
                    {chartType === "donut" && Doughnut && <Doughnut data={data} options={chartOptions} />}
                    {chartType === "scatter" && Scatter && <Scatter data={data} options={chartOptions} />}
                    {chartType === "bubble" && Bubble && <Bubble data={data} options={chartOptions} />}
                </div>

                {/* Chart Insights */}
                {chartInsights && (
                    <div className="text-center text-gray-700 mt-4 text-sm italic bg-gray-100 p-2 rounded-lg">
                        {chartInsights}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        {/* Overlay to close drawer */}
                        <motion.div
                            className="fixed inset-0 z-[9998]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                        />

                        {/* Drawer Container */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-[80%]  bg-white shadow-2xl z-[9999] overflow-hidden"
                        >


                            {/* Drawer Content */}
                            <div className="flex flex-col md:flex-row h-[100%] w-full">
                                {/* Enlarged Chart Section */}
                                {/* Drawer Header */}

                                <div className="flex-1 flex-col p-4 bg-gray-50 overflow-y-auto">
                                    <div className="flex justify-between items-center p-4 border-b">
                                        <button onClick={() => setIsDrawerOpen(false)}>
                                            <X className="h-6 w-6 text-gray-500 hover:text-red-500" />
                                        </button>
                                    </div>
                                    <div className="h-[80%] w-full">
                                        {chartType === "bar" && Bar && <Bar data={data} options={chartOptions} />}
                                        {chartType === "line" && Line && <Line data={data} options={chartOptions} />}
                                        {chartType === "pie" && Pie && <Pie data={data} options={chartOptions} />}
                                        {chartType === "donut" && Doughnut && <Doughnut data={data} options={chartOptions} />}
                                        {chartType === "scatter" && Scatter && <Scatter data={data} options={chartOptions} />}
                                        {chartType === "bubble" && Bubble && <Bubble data={data} options={chartOptions} />}
                                    </div>
                                </div>

                                {/* ChatBox Section */}
                                <div className="w-full md:w-[35%] border-l border-gray-200">
                                    <ChatBox
                                        isOpen={isDrawerOpen}
                                        toggleChat={() => setIsDrawerOpen(!isDrawerOpen)}
                                        chats={chats}
                                        setChats={setChats}
                                        showChat1={false}
                                        showChat2={true}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default DynamicChart;
