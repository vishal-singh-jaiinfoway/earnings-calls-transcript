'use client';

import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse('');

    const res = await fetch('/api/ollama', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });

    if (!res.ok) {
      console.error('Failed to generate response');
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
let count=0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }else{
        count++;
        result += decoder.decode(value);
        console.log("count",count);
      console.log("result",result);
      setResponse(result);
      }

      
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </form>
      <div className="mt-4 p-2 border border-gray-300 rounded-md overflow-auto">
      {response}
      </div>
    </div>
  );
}
