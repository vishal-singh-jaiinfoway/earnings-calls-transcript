"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, MicIcon, SendHorizonalIcon, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { companies } from "../../../../public/data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import VoiceRecorder from "./voice-input";

interface Chat {
  content: string;
  role: "user" | "assistant";
}

interface ChatBoxProps {
  isOpen: boolean;
  toggleChat: () => void;
  chats: any;
  setChats: any;
  showChat1?: boolean;
  showChat2?: boolean;
}

function ChatBox({ isOpen, toggleChat, chats, setChats, showChat1 = true, showChat2 = false }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [greetingShown, setGreetingShown] = useState(false);

  const selectedCompanies = useSelector(
    (state: any) => state?.sidebar.selectedCompanies
  );
  const selectedYear = useSelector((state: any) => state?.sidebar.selectedYear);
  const selectedQuarter = useSelector(
    (state: any) => state?.sidebar.selectedQuarter
  );
  const selectedModel = useSelector(
    (state: any) => state?.sidebar.foundationModel
  );
  const selectedPersona = useSelector((state: any) => state?.sidebar.persona);

  const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/common-chat`;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as any).scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);


  // Show greeting when chatbox is opened for the first time
  useEffect(() => {
    if (isOpen && !greetingShown && !chats.length) {
      setChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "👋 Hi there! How can I assist you today?",
        },
      ]);
      setGreetingShown(true);
    } 
  }, [isOpen, greetingShown]);

  const handleOpenChat = () => {
    toggleChat();
  };

  // Close chatbox when clicking outside
  useEffect(() => {
    if (typeof window != undefined) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          chatBoxRef.current &&
          !chatBoxRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          toggleChat(); // Close chatbox if click is outside
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

  }, [isOpen, toggleChat]);

  const getAgentResponse = async () => {
    try {
      if (!selectedCompanies?.length) {
        alert("Please select at least one company.");
        return;
      }
      if (!selectedYear) {
        alert("Please select a year.");
        return;
      }
      if (!selectedQuarter) {
        alert("Please select a quarter.");
        return;
      }

      setLoading(true);
      setInput("");
      let length = chats.length;
      setChats((prev: Chat[]) => [
        ...prev,
        {
          role: "user",
          content: input,
        },
      ]);
      if (messagesEndRef.current) {
        (messagesEndRef.current as any).scrollIntoView({ behavior: "smooth" });
      }
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: input,
          chats: chats,
          context: "",
          persona: selectedPersona,
          foundationModel: selectedModel,
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
          setLoading(false);
          setPreviousPrompts((prev: string[]) => [...prev, input]);
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
        if (messagesEndRef.current) {
          (messagesEndRef.current as any).scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showChat1 ? <>
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={handleOpenChat}
          className="fixed bottom-4 right-4 bg-[#DA6486] text-white p-4 rounded-full shadow-lg hover:bg-[#E88FA7] hover:scale-110 transition-transform"
        >
          <MessageCircle size={28} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-[350px] sm:w-[400px] md:w-[450px] h-full bg-white shadow-lg z-[10000] border-l border-gray-300 flex flex-col"
            >
            <div
              className="flex justify-between items-center p-4 bg-purple-600 text-white"
            >
              <span className="text-lg font-semibold">AI Assistant</span>
              <button onClick={toggleChat}>
                <X size={24} />
              </button>
            </div>

            <div className="h-[calc(100vh-120px)] overflow-y-auto p-4 space-y-3 bg-gray-50 relative">

              {chats.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-sm max-w-[75%] shadow ${msg.role === "user"
                    ? "bg-purple-100 text-purple-800 ml-auto"
                    : "bg-gray-100 text-gray-800"
                    }`}
                >
                  <div className="prose ml-4 leading-relaxed font-medium">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />


            </div>
            {loading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-spin h-10 w-10 border-t-4 border-purple-500 rounded-full"></div>
                </div>
              )}
            <div className="flex items-center gap-2 p-4 bg-purple-50 border-t border-gray-300">
              <Input
                className="flex-1 border border-gray-300 bg-white text-gray-700 placeholder-gray-400 rounded-lg px-4 py-2 shadow-sm focus:outline-none"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && getAgentResponse()}
              />
              <VoiceRecorder onVoiceInput={(text: string) => setInput(text)} />
              <SendHorizonalIcon
                onClick={getAgentResponse}
                className="text-purple-800 cursor-pointer"
                role="button"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </> : <div className="h-full bg-white shadow-lg border-l border-gray-300 flex flex-col"
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-4 bg-purple-600 text-white"
        >
          <span className="text-lg font-semibold">AI Assistant</span>

        </div>

        {/* Messages */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-4 space-y-3 bg-gray-50 relative">

          {chats.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-sm max-w-[75%] shadow ${msg.role === "user"
                ? "bg-purple-100 text-purple-800 ml-auto"
                : "bg-gray-100 text-gray-800"
                }`}
            >
              <div className="prose ml-4 leading-relaxed font-medium">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              {loading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-spin h-10 w-10 border-t-4 border-purple-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />


        </div>

        {/* Input */}
        <div className="flex items-center gap-2 p-4 bg-purple-50 border-t border-gray-300">
          <Input
            className="flex-1 border border-gray-300 bg-white text-gray-700 placeholder-gray-400 rounded-lg px-4 py-2 shadow-sm focus:outline-none"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getAgentResponse()}
          />
          <VoiceRecorder onVoiceInput={(text: string) => setInput(text)} />
          <SendHorizonalIcon
            onClick={getAgentResponse}
            className="text-purple-800 cursor-pointer"
            role="button"
          />
        </div>
      </div>}
    </>
  );
}

export default ChatBox;
