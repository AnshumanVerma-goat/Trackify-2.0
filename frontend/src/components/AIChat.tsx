import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../api';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([
    { sender: 'ai', text: 'Hi! I am Trackify AI. How can I help you study today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // ✅ FIXED FUNCTION
  const sendMessage = async (textToSend: string = input) => {
    if (!textToSend.trim()) return;

    const newMsg = { sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: textToSend });

      // 🔥 Debug log (very important)
      console.log("AI RESPONSE:", res.data);

      // ✅ Flexible response parsing (handles ANY backend format)
      const botReply =
        res.data?.reply ||
        res.data?.response ||
        res.data?.message ||
        res.data?.text ||
        "Hmm… I couldn't generate a response.";

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: botReply }
      ]);

    } catch (err) {
      console.error("AI ERROR:", err);

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "⚠️ AI is reachable but something went wrong."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] z-50 transition-all ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Sparkles size={24} className="animate-pulse" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] glass-panel rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 bg-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                    Trackify AI
                    <Sparkles size={12} className="text-indigo-400" />
                  </h3>
                  <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block animate-pulse"></span> Context-Aware
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg ${m.sender === 'user' ? 'bg-slate-800 border border-white/10' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
                    {m.sender === 'user' ? <User size={14} className="text-slate-400" /> : <Bot size={14} className="text-white" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-lg ${m.sender === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-white/10 border border-white/5 text-slate-200 rounded-tl-none backdrop-blur-md'}`}>
                    {m.text.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Message Trackify AI..."
                  className="w-full bg-[#030712] border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center rounded-full bg-indigo-500 text-white disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}