// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FiSend } from 'react-icons/fi';
// import { Line } from 'react-chartjs-2';
// import 'chart.js/auto';

// const ChatDemo = () => {
//   const [step, setStep] = useState(0);
//   const [userMessage, setUserMessage] = useState('');
//   const [aiResponse, setAiResponse] = useState('');
//   const [followUpMessage, setFollowUpMessage] = useState('');
//   const [showChart, setShowChart] = useState(false);

//   useEffect(() => {
//     const startFlow = async () => {
//       await delay(1000);
//       setStep(1);
//       await delay(1500);
//       setStep(2);

//       // Type user message
//       await typeText('What were the key insights from the last earnings call?', setUserMessage);
//       await delay(1000);
//       setStep(3);

//       // Type AI response
//       await typeText(
//         "The key insights include revenue growth of 15%, reduced operational costs, and a higher profit margin.",
//         setAiResponse
//       );
//       await delay(1500);
//       setStep(4);
//       await delay(1000);

//       // Type follow-up question
//       await typeText('Would you like to see trends?', setFollowUpMessage);
//       setStep(5);

//       await delay(1000);

//       // Type user reply
//       await typeText('Yes', setUserMessage);
//       await delay(1000);
//       setShowChart(true);

//       // Reset after a few seconds
//       await delay(4000);
//       resetFlow();
//     };

//     startFlow();
//   }, []);

//   const typeText = (text = '', setText) => {
//     return new Promise((resolve) => {
//       let i = 0;
//       setText(''); // Ensure text starts from empty string
//       const interval = setInterval(() => {
//         if (i < text.length) {
//           setText((prev) => (prev || '') + text[i]);
//           i++;
//         } else {
//           clearInterval(interval);
//           resolve();
//         }
//       }, 30);
//     });
//   };

//   const delay = (ms) => new Promise((res) => setTimeout(res, ms));

//   const resetFlow = () => {
//     setStep(0);
//     setUserMessage('');
//     setAiResponse('');
//     setFollowUpMessage('');
//     setShowChart(false);

//     setTimeout(() => {
//       setStep(1);
//     }, 1000);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
//       {/* Start Button */}
//       {step === 0 && (
//         <motion.button
//           onClick={() => setStep(1)}
//           className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           exit={{ scale: 0 }}
//         >
//           Open AI Chat
//         </motion.button>
//       )}

//       {/* Chat Window */}
//       {step >= 1 && (
//         <motion.div
//           className="w-full max-w-lg bg-gray-950 rounded-xl shadow-2xl p-6 space-y-4 border border-gray-800"
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ type: 'spring', stiffness: 100 }}
//         >
//           <div className="h-72 overflow-y-auto space-y-3">
//             {/* User Message */}
//             {step >= 2 && userMessage && (
//               <motion.div
//                 className="flex justify-end"
//                 initial={{ x: 50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.1 }}
//               >
//                 <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
//                   {userMessage}
//                 </div>
//               </motion.div>
//             )}

//             {/* AI Response */}
//             {step >= 3 && aiResponse && (
//               <motion.div
//                 className="flex justify-start"
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg shadow-md">
//                   {aiResponse}
//                 </div>
//               </motion.div>
//             )}

//             {/* AI Follow-up */}
//             {step >= 4 && followUpMessage && (
//               <motion.div
//                 className="flex justify-start"
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg shadow-md">
//                   {followUpMessage}
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* Input Field */}
//           {step < 5 && (
//             <motion.div
//               initial={{ y: 30, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="flex items-center gap-2"
//             >
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
//                 value={userMessage || ''}
//                 readOnly
//               />
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition">
//                 <FiSend />
//               </button>
//             </motion.div>
//           )}
//         </motion.div>
//       )}

//       {/* Chart */}
//       {showChart && (
//         <motion.div
//           className="w-full max-w-lg mt-6"
//           initial={{ y: 50, opacity: 0, scale: 0.8 }}
//           animate={{ y: 0, opacity: 1, scale: 1 }}
//           transition={{ type: 'spring', stiffness: 100 }}
//         >
//           <Line
//             data={{
//               labels: ['Q1', 'Q2', 'Q3', 'Q4'],
//               datasets: [
//                 {
//                   label: 'Revenue Growth',
//                   data: [10, 15, 20, 25],
//                   borderColor: '#3b82f6',
//                   backgroundColor: 'rgba(59, 130, 246, 0.5)',
//                   fill: true,
//                   tension: 0.4,
//                 },
//               ],
//             }}
//             options={{
//               responsive: true,
//               scales: {
//                 x: { grid: { display: false } },
//                 y: { grid: { display: true } },
//               },
//               plugins: {
//                 legend: {
//                   labels: { color: '#ffffff' },
//                 },
//               },
//             }}
//           />
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default ChatDemo;
