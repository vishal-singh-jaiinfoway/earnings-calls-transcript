"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowUpRight } from "lucide-react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { companies, quarters, years } from "../../../public/data";
import DOMPurify from "dompurify";
import FinancialMetrics from "@/components/ui/financial-metrics";
import MarketMetrics from "@/components/ui/market-metrics";
import ChatBox from "@/components/ui/chatbox";
import FilterOptions from "@/components/ui/filter-options";
import EPSComparisonTrend from "@/components/charts/EPS_comparison_trend";
import CustomHeader from "@/components/ui/header";

export default function HistoricalEarnings() {
    const [chats, setChats] = useState<any>([]);
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/common-chat`;
    const [selectedCompany, setSelectedCompany] = useState<any>(companies[0]);
    const [inputValue, setInputValue] = useState("");
    const [selectedYear, setSelectedYear] = useState<any>(years[0]);
    const [selectedQuarter, setSelectedQuarter] = useState<any>(quarters[0]);
    const [isLoading, setLoading] = useState(false);
    const [isSentimentsLoading, setIsSentimentsLoading] = useState(false);
    const [content, setContent] = useState("");
    const apiUrlSentiments = `${process.env.NEXT_PUBLIC_API_URL}/sentiment-analysis`;
    const messagesEndRef = useRef(null);
    const [inputText, setInputText] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);


    const handleCompanyChange = (value: any) => {
        const selectedTicker = value;
        const selectedCompanyObj = companies.find(
            (company) => company.ticker === selectedTicker,
        );
        setSelectedCompany(selectedCompanyObj); // Now setting the full object
    };

    const handleYearChange = (value: any) => {
        setSelectedYear(value);
    };

    const handleQuarterChange = (value: any) => {
        setSelectedQuarter(value);
    };

    const handleInputChangeWithCompany = (event: { target: { value: SetStateAction<string> } }) => {
        setInputValue(event.target.value);
        setInputText(
            `${event.target.value} ${selectedCompany.name ? "for " + selectedCompany.name : ""
            } ${selectedQuarter ? "for the " + selectedQuarter + " quarter" : ""} ${selectedYear ? "of " + selectedYear : ""
            }`,
        );
    };

    return (
        <div className="flex flex-col bg-gray-50 px-6 py-0 space-y-6">
            {/* Header */}
            <CustomHeader></CustomHeader>

            {/* Filter Options */}
            <FilterOptions
                selectedCompany={selectedCompany}
                selectedYear={selectedYear}
                selectedQuarter={selectedQuarter}
                handleCompanyChange={handleCompanyChange}
                handleQuarterChange={handleQuarterChange}
                handleYearChange={handleYearChange}
            />

            {/* Financial Metrics & Market Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-[40px]">
                <EPSComparisonTrend></EPSComparisonTrend>
                <MarketMetrics />
            </div>
            <ChatBox isOpen={isChatOpen} toggleChat={() => setIsChatOpen(!isChatOpen)} chats={chats} isLoading={isLoading} messagesEndRef={messagesEndRef}></ChatBox>
        </div>
    );
}
