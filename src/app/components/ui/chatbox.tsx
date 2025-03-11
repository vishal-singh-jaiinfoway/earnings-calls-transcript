"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

function ChatBox({
  isOpen,
  toggleChat,
  chats,
  isLoading,
  messagesEndRef
}: {
  isOpen: boolean;
  toggleChat: () => void;
  chats: any;
  isLoading: boolean;
  messagesEndRef: any
}) {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");

    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "This is an AI response!", sender: "ai" }]);
    }, 1000);
  }

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col w-[350px] sm:w-[400px] md:w-[450px] bg-white shadow-xl rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 rounded-t-2xl">
        {/* <span className="text-lg font-semibold">Chat with AI</span> */}
        <button onClick={toggleChat} className="text-gray-800  hover:text-gray-900">
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="h-[60vh] overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl text-sm max-w-[75%] break-words ${msg.sender === "user"
              ? "bg-blue-500 text-white ml-auto shadow-md"
              : "bg-gray-200 text-gray-800"
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 p-4 border-t bg-white rounded-b-2xl">
        <Input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          onClick={sendMessage}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default ChatBox;
