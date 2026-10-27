import React from 'react';
import { Command, X, Keyboard } from 'lucide-react';
import { Language } from '../types/index.ts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1', action: 'Switch to Live Alerts & Interception Feed' },
    { key: '2', action: 'Switch to Truecaller Sender & Number Lookup' },
    { key: '3', action: 'Switch to Deep Scanner & OCR Mode' },
    { key: '4', action: 'Switch to 1930 Cyber Safety & Helpline' },
    { key: '/', action: 'Focus Scanner Text Area' },
    { key: 'G', action: 'Open 1930 "Golden Hour" Emergency Protocol' },
    { key: 'M', action: 'Toggle Sound Effects Mute / Unmute' },
    { key: '?', action: 'Show / Hide Keyboard Shortcuts' },
    { key: 'Esc', action: 'Dismiss active alert or close modal' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-5 text-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'en'
                  ? 'Keyboard Shortcuts'
                  : 'कीबोर्ड शॉर्टकट्स'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'en'
                  ? 'Speed up fraud verification with hotkeys'
                  : 'हॉटकीज से तेज़ी से नेविगेट करें'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition-all"
            >
              <span className="text-slate-300 font-medium">{sc.action}</span>
              <kbd className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-orange-400 font-mono font-bold shadow-inner">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
