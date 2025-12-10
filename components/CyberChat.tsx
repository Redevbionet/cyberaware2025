import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const CyberChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'สวัสดีครับ ผมคือ CyberGuard AI ผู้ช่วยด้านความปลอดภัยไซเบอร์ มีข้อสงสัยเกี่ยวกับการป้องกันภัยคุกคามหรือประเภทของการโจมตีถามได้เลยครับ',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMessage.text);
      const botMessage: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center space-x-3">
        <div className="bg-cyber-accent/20 p-2 rounded-full">
          <Bot className="w-6 h-6 text-cyber-accent" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">CyberGuard AI Assistant</h3>
          <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm md:text-base shadow-md ${
                msg.role === 'user'
                  ? 'bg-cyber-accent text-slate-900 rounded-br-none'
                  : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
              }`}
            >
              <div className="flex items-start gap-2">
                {msg.role === 'model' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.role === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
              </div>
              <div className={`text-[10px] mt-1 text-right opacity-70 ${msg.role === 'user' ? 'text-slate-800' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 p-3 rounded-lg rounded-bl-none border border-slate-600 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyber-accent" />
              <span className="text-sm text-slate-300">กำลังประมวลผล...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ถามเกี่ยวกับภัยไซเบอร์..."
            className="flex-1 bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-cyber-accent hover:bg-cyan-400 text-slate-900 p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CyberChat;