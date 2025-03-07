"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { companies, quarters, years } from "../../../public/data";
import DOMPurify from "dompurify";
import FinancialMetrics from "@/components/ui/financial-metrics";
import MarketMetrics from "@/components/ui/market-metrics";
import ChatBox from "@/components/ui/chatbox";
import FilterOptions from "@/components/ui/filter-options";

export default function SentimentAnalysis() {
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

    useEffect(() => {
        getSentimentAnalysis();
    }, [selectedCompany, selectedQuarter, selectedYear]);

    const getAgentResponse = async () => {
        try {
            setLoading(true);
            setInputValue("");
            setChats([...chats, { role: "user", content: inputValue }]);

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputValue,
                    inputText,
                    selectedCompany,
                    selectedQuarter,
                    selectedYear,
                    chats,
                }),
            });

            const reader = res.body?.getReader();
            if (!reader) return;
            const decoder = new TextDecoder();
            let resultText = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                resultText += decoder.decode(value, { stream: true });
                console.log("resultText",resultText)
                setChats([...chats, { role: "assistant", content: DOMPurify.sanitize(resultText) }]);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getSentimentAnalysis = async () => {
        setIsSentimentsLoading(true);
        try {
            const res = await fetch(apiUrlSentiments, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedCompany, selectedYear, selectedQuarter }),
            });

            const reader = res.body?.getReader();
            if (!reader) return;
            const decoder = new TextDecoder();
            let resultText = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                resultText += decoder.decode(value, { stream: true });
                setContent(DOMPurify.sanitize(resultText));
            }
            setIsSentimentsLoading(false);
        } catch (error) {
            console.log(error);
            setContent("<p style='color:red;'>Error: Sorry, something went wrong.</p>");
        }
    };

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
    
      const handleInputChangeWithCompany = (event: { target: { value: SetStateAction<string>; }; }) => {
        console.log("handleInputChangeWithCompany", event.target.value)
    
        setInputValue(event.target.value);
        setInputText(
          `${event.target.value} ${selectedCompany.name ? "for " + selectedCompany.name : ""
          } ${selectedQuarter ? "for the " + selectedQuarter + " quarter" : ""} ${selectedYear ? "of " + selectedYear : ""
          }`,
        );
      };

    return (
        <div className="h-screen flex flex-col bg-gray-50 px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-5 shadow-md rounded-xl border">
                <div className="flex items-center space-x-2 text-blue-700">
                    <ArrowUpRight size={22} />
                    <span className="text-lg font-semibold">See Transcript</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                    {selectedCompany.ticker} {selectedYear}-Q{selectedQuarter} Earnings Call
                </span>
            </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinancialMetrics />
                <MarketMetrics />
            </div>

            {/* Sentiment Analysis Card */}
            <Card className="bg-white shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                    {isSentimentsLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                        </div>
                    ) :
                        <div className="prose ml-6 custom-markdown text-sm">

                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {content}
                            </ReactMarkdown>

                        </div>
                    }
                </CardContent>
                {/* {isChatOpen && <ChatBox chats={chats} isLoading={isLoading} messagesEndRef={messagesEndRef}/>} */}

            </Card>
 {/* Chat Box */}

           
            {/* Chat Input */}
            <div className="flex items-center gap-2 p-4 bg-white shadow-md rounded-xl border">
                <Input
                    value={inputValue}
                    onChange={handleInputChangeWithCompany}
                    placeholder="Ask a question..."
                    className="flex-grow border-none focus:ring-0 text-gray-800"
                />
                <Button
                    onClick={getAgentResponse}
                    className="bg-blue-800 text-white hover:bg-blue-700 transition duration-200 rounded-lg px-6 py-2"
                >
                    Ask
                </Button>
            </div>

             {/* Floating Chat Icon */}
             <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-300 to-blue-800 text-white p-4 rounded-full shadow-lg hover:bg-gradient-to-r from-blue-800 to-blue-300 transition duration-300"
            >
                <MessageCircle size={24} />
            </button>
        </div>
    );
}
