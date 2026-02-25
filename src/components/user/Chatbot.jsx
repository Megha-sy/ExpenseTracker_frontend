// src/components/user/Chatbot.jsx
import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your Expense AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }, { sender: "bot", text: "Analyzing your request..." }]);
    setInput("");
  };

  return (
    <div className="pt-20 px-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Chatbot</h1>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-xs ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-200 text-gray-700"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="p-3 border-t flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Ask me about your budget..."
          />
          <button className="ml-3 bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
