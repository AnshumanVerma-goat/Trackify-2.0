import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Zap, BrainCircuit, Target } from 'lucide-react';
import api from '../api';

export default function AIPage() {
  const [messages, setMessages] = useState<{sender: 'user'|'ai', text: string}[]>([
    { sender: 'ai', text: 'Hi! I am your advanced Trackify Assistant. I can analyze your tasks, suggest a study plan, or give you personalized recommendations based on your progress. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const newMsg = { sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: textToSend });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action: string) => {
    setLoading(true);
    try {
      if (action === 'plan') {
        const res = await api.get('/ai/daily-plan');
        setMessages(prev => [...prev, { sender: 'ai', text: res.data.plan }]);
      } else if (action === 'prioritize') {
        await api.post('/ai/prioritize');
        setMessages(prev => [...prev, { sender: 'ai', text: "I have prioritized your tasks! Check the Tasks page." }]);
      } else if (action === 'recommend') {
        const res = await api.get('/ai/study-recommendation');
        setMessages(prev => [...prev, { sender: 'ai', text: res.data.recommendation }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Failed to execute action." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
      <div className="md:col-span-4 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors"></div>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.5)] relative z-10 rotate-3 group-hover:rotate-6 transition-transform">
            <Bot size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3 relative z-10">Trackify Assistant</h2>
          <p className="text-slate-400 text-sm relative z-10 leading-relaxed">Context-aware productivity AI. I know your goals, habits, and upcoming tasks.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 h-full border border-white/5 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none"></div>
          <h3 className="text-lg font-semibold mb-5 text-white flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" /> Smart Actions
          </h3>
          <div className="flex flex-col gap-3 relative z-10">
            <button onClick={() => executeAction('plan')} disabled={loading} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left disabled:opacity-50 group/btn">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/btn:bg-indigo-500/30 transition-colors shrink-0"><Target size={20}/></div>
              <div>
                <div className="font-medium text-slate-200">Plan My Day</div>
                <div className="text-xs text-slate-400 mt-0.5">Generate a timeline from pending tasks</div>
              </div>
            </button>
            <button onClick={() => executeAction('prioritize')} disabled={loading} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left disabled:opacity-50 group/btn">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover/btn:bg-pink-500/30 transition-colors shrink-0"><Zap size={20}/></div>
              <div>
                <div className="font-medium text-slate-200">Prioritize Tasks</div>
                <div className="text-xs text-slate-400 mt-0.5">Sort your backlog intelligently</div>
              </div>
            </button>
            <button onClick={() => executeAction('recommend')} disabled={loading} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left disabled:opacity-50 group/btn">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover/btn:bg-purple-500/30 transition-colors shrink-0"><BrainCircuit size={20}/></div>
              <div>
                <div className="font-medium text-slate-200">What Should I Study?</div>
                <div className="text-xs text-slate-400 mt-0.5">Get data-driven study recommendations</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="md:col-span-8 glass-panel rounded-3xl border border-white/5 shadow-xl flex flex-col overflow-hidden h-[80vh]">
        {/* Header */}
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0b0f19]/80 relative overflow-hidden shrink-0">
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 relative">
                <Bot size={20} className="text-indigo-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0b0f19] rounded-full"></div>
             </div>
             <div>
                <h3 className="font-semibold text-lg text-white">Assistant</h3>
                <span className="text-xs text-slate-400">Online & Ready</span>
             </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/10">
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg ${m.sender === 'user' ? 'bg-slate-800 border border-white/10' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
                {m.sender === 'user' ? <User size={18} className="text-slate-400" /> : <Bot size={18} className="text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-6 py-4 text-[15px] leading-relaxed shadow-lg ${m.sender === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-[#1e293b] border border-white/5 text-slate-200 rounded-tl-none prose prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-indigo-300'}`}>
                {m.text.split('\n').map((line, idx) => {
                  if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    return <li key={idx} className="ml-4 list-disc">{line.substring(2)}</li>;
                  }
                  if (line.match(/^\d+\.\s/)) {
                     return <li key={idx} className="ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
                  }
                  return (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  )
                })}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                <Bot size={18} className="text-white" />
              </div>
              <div className="max-w-[75%] rounded-2xl px-6 py-5 bg-[#1e293b] border border-white/5 text-slate-200 rounded-tl-none flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-[#0b0f19] border-t border-white/5 shrink-0">
          <div className="relative">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask me anything about your studies..."
              className="w-full bg-[#1e293b]/50 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner text-[15px]"
            />
            <button 
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="absolute right-1.5 top-1.5 bottom-1.5 w-12 flex items-center justify-center rounded-full bg-indigo-500 text-white disabled:opacity-50 disabled:bg-slate-700 transition-all hover:bg-indigo-400 shadow-md"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
