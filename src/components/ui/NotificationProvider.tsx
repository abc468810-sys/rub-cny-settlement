'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertTriangle, X } from 'lucide-react';

type NotificationType = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const remove = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-12 right-8 z-[1000] space-y-4 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex items-center space-x-4 min-w-[300px]"
            >
              <div className={`p-2 rounded-xl ${
                n.type === 'SUCCESS' ? 'bg-green-50 text-green-600' :
                n.type === 'WARNING' ? 'bg-orange-50 text-orange-600' :
                n.type === 'ERROR' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {n.type === 'SUCCESS' && <Check size={16} />}
                {n.type === 'INFO' && <Info size={16} />}
                {n.type === 'WARNING' && <AlertTriangle size={16} />}
                {n.type === 'ERROR' && <X size={16} />}
              </div>
              <p className="flex-1 text-[10px] font-black uppercase tracking-widest text-gray-900">{n.message}</p>
              <button onClick={() => remove(n.id)} className="text-gray-300 hover:text-black transition-colors">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotify must be used within NotificationProvider');
  return context;
};
