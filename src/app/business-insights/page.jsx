"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  suggestedQuestions,
  companies,
  years,
  quarters,
} from "../../../public/data";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  SendHorizonalIcon,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BusinessInsights({
  isChatOpen,
  setIsChatOpen,
  chats,
  setChats,
}) {
  const foundationModel = useSelector((state) => state.sidebar.foundationModel);
  const fmTemperature = useSelector((state) => state.sidebar.fmTemperature);
  const fmMaxTokens = useSelector((state) => state.sidebar.fmMaxTokens);
  const context = useSelector((state) => state.sidebar.context);
  const persona = useSelector((state) => state.sidebar.persona);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/business-insights-api`;
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(suggestedQuestions)[0],
  );
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedQuarter, setSelectedQuarter] = useState(quarters[0]);
  const [isLoading, setLoading] = useState(false);

  const startRef = useRef(null);

  const messagesEndRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [checked, setChecked] = useState(false);
  const [fetchUploadChats, setFetchUploadChats] = useState([]);

  const [filters, setFilters] = useState([
    selectedCompany.name,
    selectedYear,
    selectedQuarter,
  ]);

  const removeFilter = (filterToRemove) => {
    setFilters(filters.filter((filter) => filter !== filterToRemove));
  };

  useEffect(() => {
    if (checked) {
      getSentimentAnalysis();
    }
  }, [checked, selectedCompany?.name, selectedQuarter, selectedYear]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  const getAgentResponse = async () => {
    try {
      setLoading(true);
      setInputText("");
      setInputValue("");
      let length = chats.length;
      setChats((prev) => {
        let temp = [
          ...prev,
          {
            role: "user",
            content: inputValue,
          },
        ];

        return temp;
      });

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: inputText,
          inputValue,
          selectedCompany,
          selectedQuarter,
          selectedYear,
          context,
          persona,
          foundationModel,
          fmTemperature,
          fmMaxTokens,
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let resultText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setLoading(false);
          break;
        }
        resultText += decoder.decode(value, { stream: true });
        const sanitizedMarkdown = DOMPurify.sanitize(resultText);
        setChats((prev) => {
          let temp = [...prev];
          temp[length + 1] = {
            role: "assistant",
            content: sanitizedMarkdown,
          };
          return temp;
        });
      }
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
        body: JSON.stringify({
          checked,
          selectedCompany,
          selectedYear,
          selectedQuarter,
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let resultText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsSentimentsLoading(false);
          break;
        }
        resultText += decoder.decode(value, { stream: true });

        const sanitizedMarkdown = DOMPurify.sanitize(resultText);
        setContent(sanitizedMarkdown);
      }
    } catch (error) {
      console.log(error);
      setContent(
        `<p style="color:red;">Error: ${"Sorry,something went wrong"}</p>`,
      );
    }
  };

  const handleCompanyChange = (event) => {
    const selectedTicker = event.target.value;
    const selectedCompanyObj = companies.find(
      (company) => company.ticker === selectedTicker,
    );
    setSelectedCompany(selectedCompanyObj); // Now setting the full object
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleQuarterChange = (event) => {
    setSelectedQuarter(event.target.value);
  };

  const handleInputChangeWithCompany = (event) => {
    setInputValue(event.target.value);
    setInputText(
      `${event.target.value} ${
        selectedCompany.name ? "for " + selectedCompany.name : ""
      } ${selectedQuarter ? "for the " + selectedQuarter + " quarter" : ""} ${
        selectedYear ? "of " + selectedYear : ""
      }`,
    );
  };

  const handleButtonClick = (question) => {
    const formattedQuestion = `${question} ${
      selectedCompany.name ? "for " + selectedCompany.name : ""
    } ${selectedQuarter ? "for the " + selectedQuarter + " quarter" : ""} ${
      selectedYear ? "of " + selectedYear : ""
    }`;
    setInputValue(question);
    setInputText(formattedQuestion);
    scrollToBottom();
    setSelectedQuestion(question);
  };

  const scrollToTop = () => {
    if (startRef.current) {
      startRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col shadow-lg border border-gray-200 h-[80vh]">
      <Head>
        <title>Business Insights</title>
      </Head>

      {/* Header */}
      {/* <header className="bg-blue-800  text-white py-5 px-6 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-extrabold tracking-wide">
            Business Insights
          </h1>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="container mx-auto flex-grow overflow-y-auto shadow-lg">
        <div className="bg-white p-6 w-full rounded-lg shadow-lg flex flex-col space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-2">
            <FilterOptions
              selectedCompany={selectedCompany}
              selectedYear={selectedYear}
              selectedQuarter={selectedQuarter}
              selectedCategory={selectedCategory}
              handleCompanyChange={handleCompanyChange}
              handleQuarterChange={handleQuarterChange}
              handleYearChange={handleYearChange}
              handleCategoryChange={handleCategoryChange}
            ></FilterOptions>
             <SuggestedQuestions
            suggestedQuestions={suggestedQuestions}
            selectedCategory={selectedCategory}
            handleButtonClick={handleButtonClick}
          ></SuggestedQuestions>
          </div>

         
        
         
        </div>

        <div className="flex flex-col">
        <div className="flex-grow h-[40vh] min-h-0 overflow-y-auto bg-gray-100 rounded-lg p-4 space-y-4 shadow-lg">
            {chats?.map((m, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  m.role === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <span
                  className={`font-semibold ${
                    m.role === "user" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  {m.role === "user" ? "User: " : "AI: "}
                </span>
                <div className="prose ml-6 custom-markdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Generating response...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              getAgentResponse();
            }}
            className="flex"
          >
            <input
              className="flex-grow p-2 border border-gray-300"
              value={inputValue}
              placeholder="Ask your question..."
              onChange={handleInputChangeWithCompany}
            />
            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>

        {isChatOpen && (
          <FetchUploadPopUp
            isOpen={isChatOpen}
            setIsOpen={setIsChatOpen}
            chats={fetchUploadChats}
            setChats={setFetchUploadChats}
          />
        )}
      </main>
    </div>
  );
}



const ScrollToTop = ({ scrollToTop }) => {
  const [isVisible, setIsVisible] = useState(true);

  // useEffect(() => {
  //   const toggleVisibility = () => {
  //     console.log("toggleVisibility", window.scrollY);
  //     setIsVisible(window.scrollY > 300);
  //   };

  //   window.addEventListener("scroll", toggleVisibility);
  //   return () => window.removeEventListener("scroll", toggleVisibility);
  // }, []);

  const comeIntoView = () => {
    scrollToTop();
  };

  return (
    <button
      onClick={comeIntoView}
      className={`fixed bottom-2 right-0 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <ArrowUp size={20}></ArrowUp>
    </button>
  );
};

 

const SuggestedQuestions = ({
  suggestedQuestions,
  selectedCategory,
  handleButtonClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleQuestions, setVisibleQuestions] = useState(0);

  const questions = suggestedQuestions[selectedCategory]["Common Questions"];

  useEffect(() => {
    console.log("questions",questions)
    if (isOpen) {
      setVisibleQuestions(0); // Reset questions when reopening

      // Reveal questions one by one with a delay
      questions.forEach((_, index) => {
        setTimeout(() => {
          setVisibleQuestions((prev) => prev + 1);
        }, index * 300); // Delay each question by 300ms
      });
    }
  }, [isOpen, selectedCategory]); // Reset when dropdown opens or category changes

  return (
    <div className="relative">
      {/* Toggle Dropdown */}
      <button
        className="w-[250px] flex flex-row items-center justify-center bg-gradient-to-r from-blue-300 to-blue-800 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Hide Questions" : "Suggested Questions"}
        {isOpen ? (
          <ChevronUp size={20}></ChevronUp>
        ) : (
          <ChevronDown size={20}></ChevronDown>
        )}
      </button>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="absolute mt-2 bg-white w-full border border-gray-300 rounded shadow-lg h-[260px] overflow-y-auto p-2">
          {questions.slice(0, visibleQuestions)?.map((question, index) => (
            <div
              key={index}
              // className="opacity-0 -translate-x-10 animate-slide-in"
            >
              <button
                className="text-black border-b border-gray-300 block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                onClick={() => {
                  handleButtonClick(question);
                  setIsOpen(false);
                }}
              >
                {question}
              </button>
            </div>
          
          
          ))}
        </div>
      )}
    </div>
  );
};

function FilterOptions({
  selectedCompany,
  selectedYear,
  selectedQuarter,
  selectedCategory,
  handleCompanyChange,
  handleYearChange,
  handleQuarterChange,
  handleCategoryChange,
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Company Select */}
      <div>
        <Label className="text-md font-bold text-gray-700">Company</Label>
        <Select
          onValueChange={handleCompanyChange}
          value={selectedCompany.ticker}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            {companies?.map((company, index) => (
              <SelectItem key={index} value={company.ticker}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Select */}
      <div>
        <Label className="text-md font-bold text-gray-700">Year</Label>
        <Select onValueChange={handleYearChange} value={selectedYear}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            {years?.map((year, index) => (
              <SelectItem key={index} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quarter Select */}
      <div>
        <Label className="text-md font-bold text-gray-700">Quarter</Label>
        <Select onValueChange={handleQuarterChange} value={selectedQuarter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a quarter" />
          </SelectTrigger>
          <SelectContent>
            {quarters?.map((quarter, index) => (
              <SelectItem key={index} value={quarter}>
                {quarter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quarter Category */}
      <div>
        <Label className="text-md font-bold text-gray-700">Category</Label>
        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(suggestedQuestions)?.map((category, index) => (
              <SelectItem key={index} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 