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
import { ArrowUp, ChevronDown, SendHorizonalIcon, X } from "lucide-react";
import { Button } from "@mui/material";
import { Menu, MenuButton, MenuItem } from "@headlessui/react";
import { createPortal } from "react-dom";
import DynamicChart from "@/components/charts/dynamicChart";

const options = Object.entries(suggestedQuestions)?.map(([category, data]) => ({
  label: category,
  value: category,
  submenu: Object.entries(data).flatMap(([subCategory, questions]) =>
    questions?.map((question) => ({
      label: question,
      value: question,
    })),
  ),
}));

export default function AggregateDashboard({}) {
  const [chats, setChats] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const foundationModel = useSelector((state) => state.sidebar.foundationModel);
  const fmTemperature = useSelector((state) => state.sidebar.fmTemperature);
  const fmMaxTokens = useSelector((state) => state.sidebar.fmMaxTokens);
  const context = useSelector((state) => state.sidebar.context);
  const persona = useSelector((state) => state.sidebar.persona);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/aggregate-insights-api`;

  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(suggestedQuestions)[0],
  );
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [isLoading, setLoading] = useState(false);

  const startRef = useRef(null);

  const messagesEndRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [fetchUploadChats, setFetchUploadChats] = useState([]);

  const [previousPrompts, setPreviousPrompts] = useState([]);

  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector((state) => state.sidebar.selectedQuarter);

  const [shouldRenderChart, setShouldRenderChart] = useState(false);
  const [chartData, setChartData] = useState([
    {
      segment: "Lending",
      revenue: 325,
    },
    {
      segment: "Financial Services",
      revenue: 151,
    },
    {
      segment: "Technology Platform",
      revenue: 94,
    },
    {
      segment: "Other",
      revenue: 11,
    },
  ]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  useEffect(() => {
    setInputText(
      `${inputValue} ${
        selectedCompanies.length ? "for " + selectedCompanies.join(",") : ""
      } ${selectedQuarter ? "for the " + selectedQuarter + " quarter" : ""} ${
        selectedYear ? "of " + selectedYear : ""
      }`,
    );
  }, [
    inputValue,
    selectedCompanies,
    selectedCategory,
    selectedQuarter,
    selectedYear,
  ]);

  function extractChartData(text) {
    const rows = text
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row.startsWith("|") && row.endsWith("|")); // Filter valid rows

    if (rows.length < 3) return []; // Ensure we have enough rows (header + data)

    const data = [];

    for (let i = 1; i < rows.length - 1; i++) {
      const row = rows[i]
        .split("|") // Split by pipe
        .map((cell) => cell.trim()) // Trim spaces
        .filter((cell) => cell); // Remove empty strings

      if (row.length === 2) {
        const segment = row[0];
        const revenue = parseFloat(row[1].replace("$", "").replace(",", ""));

        if (!isNaN(revenue)) {
          data.push({ segment, revenue });
        }
      }
    }

    return data;
  }

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
          chats: chats,
          context,
          persona,
          foundationModel,
          fmTemperature,
          fmMaxTokens,
          previousPrompts,
          selectedCompanies,
          selectedQuarter,
          selectedYear,
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let resultText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // console.log("extractChartData", extractChartData(resultText));
          // setChartData(extractChartData(resultText));
          setLoading(false);
          setPreviousPrompts((prev) => {
            let temp = [...prev];
            temp.push(inputText);
            return temp;
          });
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

  const handleCategoryChange = (value) => setSelectedCategory(value);

  const handleYearChange = (event) => setSelectedYear(event.target.value);

  const handleQuarterChange = (event) => {
    setSelectedQuarter(event.target.value);
  };

  const handleInputChangeWithCompany = (event) => {
    setInputValue(event.target.value);
    setInputText(
      `${event.target.value} ${
        selectedCompanies.length ? "for " + selectedCompanies.join(",") : ""
      } ${selectedQuarter ? "for the " + selectedQuarter + " quarter" : ""} ${
        selectedYear ? "of " + selectedYear : ""
      }`,
    );
  };
  const handleButtonClick = (question) => {
    setInputValue(question);
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
    <div className="flex flex-col h-full">
      <Head>
        <title>Aggregate Business Insights</title>
      </Head>

      <main className="container mx-auto p-8">
        <div className="bg-white p-8 w-full h-full  shadow-xl flex flex-col space-y-6 border-0 border-gray-200">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <SelectWithSubmenu
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 p-3"
                handleCategoryChange={handleCategoryChange}
                handleButtonClick={handleButtonClick}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="h-[50vh] overflow-y-auto bg-gray-100 shadow-lg p-6 space-y-4 border-0 border-gray-300">
            {chats?.map((m, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl text-md ${
                  m.role === "user"
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <span
                  className={`font-medium ${
                    m.role === "user" ? "text-blue-900" : "text-green-900"
                  }`}
                >
                  {m.role === "user" ? "User: " : "AI: "}
                </span>
                <div className="prose ml-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
                {/* <div>
                  {m.role === "assistant" && chartData.length > 0 && (
                    <DynamicChart data={chartData} />
                  )}
                </div> */}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col justify-center items-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
                <p className="text-sm text-gray-500 mt-2">
                  Generating response...
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedCompanies.length) {
                return alert("Please select at least one company");
              }
              if (!inputValue.trim()) {
                return alert("Please provide some input");
              }
              getAgentResponse();
            }}
            className="flex gap-2"
          >
            <input
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={inputValue}
              placeholder="Ask your question..."
              onChange={handleInputChangeWithCompany}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
            >
              Send
            </button>
          </form>
        </div>

        {/* Chat Popup */}
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

function FetchUploadPopUp({ isOpen, setIsOpen, chats, setChats }) {
  const [inputText, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/fetch-upload`;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollViewRef.current]);

  const getAgentResponse = async () => {
    try {
      setLoading(true);
      setInput("");
      let length = chats.length;
      setChats((prev) => {
        let temp = [
          ...prev,
          {
            id: length + 1,
            text: inputText,
            sender: "user",
          },
        ];

        return temp;
      });
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: inputText,
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

        setChats((prev) => {
          let temp = [...prev];
          temp[length + 1] = { ...temp[length + 1], text: resultText };
          return temp;
        });
      }
    } catch (error) {
      setChats((prev) => {
        prev.pop();
        return prev;
      });
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission (if inside a form)
      getAgentResponse();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end">
      <div
        style={{
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)",
          border: 2,
          borderColor: "blue",
        }}
        className="bg-white shadow-2xl rounded-2xl p-4 m-4 mb-8 h-[500px] w-[800px] flex flex-col"
      >
        <div className="flex justify-center items-center pb-0">
          <h3 className="text-lg font-medium text-gray-700">
            Upload Earnings Calls Transcripts To Get Insights
          </h3>
          <Button
            className="absolute r-0"
            onClick={() => {
              setIsOpen(false);
              setLoading(false);
              setInput("");
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4 bg-white rounded-lg">
          <section className="mt-3 p-4 text-gray-600 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-sm">
              <span className="font-semibold">Prompt type 1:&nbsp;</span>
              Ticker=<span className="text-blue-600">SOFI</span>, Year=
              <span className="text-blue-600">2024</span>, Quarters=
              <span className="text-blue-600">4</span>
            </p>
            <p className="text-sm mt-2">
              <span className="font-semibold">Prompt type 2:&nbsp;</span>
              Ticker=<span className="text-blue-600">[SOFI, JPM, MS]</span>,
              Year=<span className="text-blue-600">2024</span>, Quarters=
              <span className="text-blue-600">4</span>
            </p>
          </section>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex-1 overflow-y-auto">
            {chats?.map((msg, index) => (
              <section
                style={{ marginBottom: msg.id % 2 === 0 ? "60px" : "30px" }}
                key={index}
                className={`flex-1 overflow-y-auto p-[20px] rounded text-sm-200 ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                <div className="prose ml-6 custom-markdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </section>
            ))}
          </div>

          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Uploading transcripts...</p>
            </div>
          )}

          <div ref={scrollViewRef}></div>
        </div>
        <div className="border-t pt-2 flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border-none outline-none px-3 py-2 rounded-lg bg-gray-200"
            onChange={(e) => setInput(e.target.value)}
            value={inputText}
            onKeyDown={handleKeyDown}
          />
          <SendHorizonalIcon
            onClick={getAgentResponse}
            className="w-5 h-5 ml-2"
            color="blue"
          />
        </div>
      </div>
    </div>
  );
}

const SelectWithSubmenu = ({
  className,
  handleCategoryChange,
  handleButtonClick,
}) => {
  const [selected, setSelected] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const submenuRef = useRef(null);
  const parentOptionRef = useRef({});
  let closeTimeout = useRef(null);

  const handleSelect = (value) => {
    setSelected(value);
    setOpenSubmenu(null);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        (!submenuRef.current || !submenuRef.current.contains(event.target))
      ) {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openSubmenuWithDelay = (value) => {
    clearTimeout(closeTimeout.current);
    setOpenSubmenu(value);
  };

  const closeSubmenuWithDelay = () => {
    closeTimeout.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 100);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Menu as="div" className="relative" open={isOpen} onChange={setIsOpen}>
        <MenuButton
          onClick={() => setIsOpen(!isOpen)}
          className={`${className} px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800  text-white hover:bg-gradient-to-r from-blue-600 to-blue-800  transition duration-200 shadow-md`}
        >
          <div className="flex items-center justify-between">
            <span className="w-[12.5rem] truncate">
              {selected || "Select a question"}
            </span>
            <ChevronDown size={20} />
          </div>
        </MenuButton>
        {isOpen && (
          <div className="absolute z-10 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">
            <div className="max-h-[55vh] overflow-y-auto">
              {options?.map((option) => (
                <div key={option.value} className="relative">
                  {option.submenu ? (
                    <>
                      {/* Main Option */}
                      <button
                        ref={(el) =>
                          (parentOptionRef.current[option.value] = el)
                        }
                        onMouseEnter={() => openSubmenuWithDelay(option.value)}
                        onMouseLeave={closeSubmenuWithDelay}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 font-medium text-gray-800 transition duration-150"
                        title={option.label}
                      >
                        {option.label}
                      </button>

                      {/* Submenu */}
                      {openSubmenu === option.value &&
                        createPortal(
                          <div
                            ref={submenuRef}
                            className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg overflow-y-auto max-w-[60vw]"
                            style={{
                              position: "fixed",
                              top:
                                parentOptionRef.current[
                                  option.value
                                ]?.getBoundingClientRect().top || 0,
                              left:
                                parentOptionRef.current[
                                  option.value
                                ]?.getBoundingClientRect().right || 0,
                            }}
                            onMouseEnter={() =>
                              openSubmenuWithDelay(option.value)
                            }
                            onMouseLeave={closeSubmenuWithDelay}
                          >
                            {option?.submenu?.map((subOption) => (
                              <button
                                key={subOption.value}
                                onClick={() => {
                                  handleSelect(option.value);
                                  handleCategoryChange(option.value);
                                  handleButtonClick(subOption.value);
                                }}
                                className="block w-full px-4 py-3 text-left text-gray-800 hover:bg-gradient-to-r from-blue-600 to-blue-800 hover:text-white transition duration-150"
                                title={subOption.label}
                              >
                                {subOption.label}
                              </button>
                            ))}
                          </div>,
                          document.body,
                        )}
                    </>
                  ) : (
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => handleSelect(option.value)}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-100 transition duration-150`}
                          title={option.label}
                        >
                          {option.label}
                        </button>
                      )}
                    </MenuItem>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Menu>
    </div>
  );
};


