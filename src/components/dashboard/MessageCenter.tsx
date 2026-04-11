'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ShieldCheck, User } from 'lucide-react';

const scrambleChars = "0123456789ABCDEF!@#$%^&*";

function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((char, index) => {
        if (index < iteration) return char;
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }).join(""));
      
      iteration += 1/3;
      if (iteration >= text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

export default function MessageCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setLogs] = useState<{ id: string; sender: string; text: string; time: string; type: 'IN' | 'OUT' }[]>([
    { id: '1', sender: 'Node Controller BJN-01', text: 'System: Secure bridge link established. Protocol v2.4 active.', time: '14:20', type: 'IN' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'Merchant',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'OUT' as const
    };

    setLogs(prev => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      const reply = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'Node Controller BJN-01',
        text: 'Instruction acknowledged. Verifying binary stream...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'IN' as const
      };
      setLogs(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[500] no-print">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative border border-white/10"
      >
        <MessageSquare size={24} />
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            <header className="p-8 bg-gray-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Institutional Link</p>
                  <p className="text-xs font-bold">Node BJN-01 Controller</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </header>

            <div 
              ref={scrollRef}
              className="flex-1 p-8 space-y-6 overflow-y-auto no-scrollbar bg-gray-50"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.type === 'OUT' ? 'items-end' : 'items-start'} space-y-2`}>
                  <div className={`max-w-[85%] p-5 rounded-2xl text-[11px] font-medium leading-relaxed ${
                    msg.type === 'OUT' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.type === 'IN' ? <ScrambleText text={msg.text} /> : msg.text}
                  </div>
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest px-1">{msg.sender} · {msg.time}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100 flex items-center space-x-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Institutional Command..." 
                className="flex-1 text-[11px] font-bold outline-none py-3 px-5 bg-gray-50 rounded-2xl border border-transparent focus:border-gray-200 transition-all"
              />
              <button 
                type="submit"
                className="p-3 bg-black text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
