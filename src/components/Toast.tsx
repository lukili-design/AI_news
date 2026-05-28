/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let bgColor = 'bg-white border-slate-200 text-slate-800';
          let iconColor = 'text-blue-500';

          switch (toast.type) {
            case 'success':
              Icon = CheckCircle2;
              bgColor = 'bg-emerald-50 border-emerald-200 text-emerald-900';
              iconColor = 'text-emerald-500';
              break;
            case 'error':
              Icon = AlertCircle;
              bgColor = 'bg-rose-50 border-rose-200 text-rose-900';
              iconColor = 'text-rose-500';
              break;
            case 'warning':
              Icon = AlertTriangle;
              bgColor = 'bg-amber-50 border-amber-200 text-amber-900';
              iconColor = 'text-amber-500';
              break;
            case 'info':
              Icon = Info;
              bgColor = 'bg-sky-50 border-sky-200 text-sky-900';
              iconColor = 'text-sky-500';
              break;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgColor}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-sm font-medium leading-relaxed">{toast.text}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
