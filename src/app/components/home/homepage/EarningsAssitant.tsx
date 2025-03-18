'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {  MessageCircle, Mic, SendHorizonalIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

const ChatStep = ({ isOpen, setIsOpen, onExploreMore }) => {
    const [inputText, setInputText] = useState('')
    const [messages, setMessages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isResponseDone, setIsResponseDone] = useState(false);
    const messagesEndRef = useRef(null);
    const intervalRef = useRef(null);
  
    const [isFinalResponseDone, setIsFinalResponseDone] = useState(false);
    const chatRef = useRef(null); // Create a ref for the chat container
  
    // Close chat on outside click
    useEffect(() => {
      if (typeof window != undefined) {
      function handleClickOutside(event) {
        if (chatRef.current && !chatRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    }, []);
  
  
    useEffect(() => {
      if (isOpen) {
        resetChat();
        typeResponse(`Hi there! I'm Earnings Assistant, your AI assistant for earnings calls. How can I help you today?`, true);
      }
      return () => clearInterval(intervalRef.current);
    }, [isOpen]);
  
    useEffect(() => {
      scrollToBottom();
    }, [isFinalResponseDone])
  
    const resetChat = () => {
      setMessages([]);
      setIsGenerating(false);
      setIsResponseDone(false);
      clearInterval(intervalRef.current);
      setIsFinalResponseDone(false)
    };
  
    const autoTypePrompt = (text) => {
      let i = 0;
      let generatedPrompt = '';
  
      intervalRef.current = setInterval(() => {
        if (i < text.length) {
          generatedPrompt += text.charAt(i);
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.type === 'user') {
              return [...prev.slice(0, -1), { type: 'user', text: generatedPrompt }];
            }
            return [...prev, { type: 'user', text: generatedPrompt }];
          });
          i++;
          scrollToBottom();
        } else {
          clearInterval(intervalRef.current);
          handleSend(text);
        }
      }, 20);
    };
  
    const typeResponse = (text, startPrompt = false) => {
      let i = 0;
      let generatedResponse = '';
  
      intervalRef.current = setInterval(() => {
        if (i < text.length) {
          generatedResponse += text.charAt(i);
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.type === 'bot') {
              return [...prev.slice(0, -1), { type: 'bot', text: generatedResponse }];
            }
            return [...prev, { type: 'bot', text: generatedResponse }];
          });
          i++;
          scrollToBottom();
        } else {
          clearInterval(intervalRef.current);
          setIsGenerating(false);
          setIsResponseDone(true);
  
          if (startPrompt) {
            autoTypePrompt(`What are the most common questions asked during the Q&A portion of earnings calls?`);
          } else {
            setIsFinalResponseDone(true);
          }
        }
      }, 20);
    };
  
    const handleSend = (prompt) => {
      if (!prompt || isGenerating) return;
      setIsGenerating(true);
  
      // Simulate AI response
      setTimeout(() => {
        typeResponse(
          `Here are the most common themes and questions that emerged:
  1. Wealth Management Business  
  - Questions about client onboarding processes and regulatory focus  
  - Inquiries on non-U.S. wealth management business size  
  - Interest in growth prospects and ability to onboard new clients...`
        );
      }, 1000);
    };
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    const closeChat = () => {
      resetChat();
      setIsOpen(false);
    };
  
    return (
      <>
        {/* Chat Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={chatRef} // Attach ref to chat container
  
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="fixed top-0 right-0 w-[360px] h-screen bg-white shadow-xl flex flex-col border-l border-gray-200 z-[5000]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 bg-purple-600 text-white">
                <span className="text-lg font-semibold">AI Assistant</span>
                <button onClick={closeChat}>
                  <X size={24} />
                </button>
              </div>
  
  
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 shadow-sm rounded-md max-w-[75%] text-sm ${msg.type === 'user'
                      ? 'bg-purple-100 text-purple-700 ml-auto'
                      : 'bg-gray-100 text-gray-700 mr-auto'
                      }`}
                  >
                    {msg.text}
                  </motion.div>
                ))}
                {
                  isFinalResponseDone && (
                    <motion.div
                      key="explore-container"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 30, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      className="flex justify-center my-4"
                    >
                      <motion.button
                        key="explore"
                        onClick={() => {
                          onExploreMore();
                          setIsOpen(false);
                        }}
                        className="py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-md hover:from-purple-600 hover:to-purple-700 transition-all"
                      >
                        Explore More
                      </motion.button>
                    </motion.div>
                  )
                }
  
                <div ref={messagesEndRef} />
              </div>
  
              {/* Typing Input */}
              <div className="p-4 border-t bg-purple-50">
                <AnimatePresence mode="popLayout">
                  <div className='flex flex-row'>
                    <motion.input type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                      placeholder="Ask a question..."
                      disabled={isGenerating}
                      className="bg-gray-100 flex-1 py-2 px-4 border border-gray-300  focus:outline-none disabled:opacity-50"
                    >
                    </motion.input>
                    <motion.button
                      onClick={handleSend}
                      disabled={isGenerating}
                      className={`p-3 rounded-full ${isGenerating
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-purple-500'
                        }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Mic size={20} />
                    </motion.button>
                    <motion.button
                      onClick={handleSend}
                      disabled={isGenerating}
                      className={`p-3 rounded-full ${isGenerating
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-purple-500'
                        }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <SendHorizonalIcon size={20} />
                    </motion.button>
                  </div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Chat Icon */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-400 text-white p-4 rounded-full shadow-lg z-50"
        >
          <MessageCircle size={28} />
        </motion.button>
      </>
    );
  };
  
  export default ChatStep;