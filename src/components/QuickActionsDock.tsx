import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Clock,
  Volume2,
  VolumeX,
  ArrowUp,
  Keyboard,
  Shield,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types/index.ts';
import { soundFx } from '../lib/soundEffects.ts';

interface QuickActionsDockProps {
  language: Language;
  onOpenGoldenHour: () => void;
  onOpenShortcuts: () => void;
  onReplayLoading: () => void;
}

export const QuickActionsDock: React.FC<QuickActionsDockProps> = ({
  language,
  onOpenGoldenHour,
  onOpenShortcuts,
  onReplayLoading,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleScrollTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scroll to top floating pill */}
      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollTop}
          className="group flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-full text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-orange-400" />
          <span className="hidden sm:inline">Top</span>
        </button>
      )}

      {/* Floating Action Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl ring-1 ring-white/10 transition-all hover:border-orange-500/40 hover:shadow-orange-500/10">
        {/* Golden Hour Button */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onOpenGoldenHour();
          }}
          className="relative group p-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          title="1930 Golden Hour Emergency Protocol"
        >
          <Clock className="w-4 h-4 text-red-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="sr-only">Golden Hour Protocol</span>

          {/* Hover Tooltip */}
          <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col items-end pointer-events-none whitespace-nowrap z-50">
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl">
              1930 Golden Hour Protocol
            </span>
          </div>
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={handleToggleSound}
          className="relative group p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          title={isMuted ? 'Unmute Sound Effects (M)' : 'Mute Sound Effects (M)'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-orange-400" />
          )}

          {/* Hover Tooltip */}
          <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col items-end pointer-events-none whitespace-nowrap z-50">
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl">
              {isMuted ? 'Sound: Muted (Press M)' : 'Sound: Active (Press M)'}
            </span>
          </div>
        </button>

        {/* Replay System Loading Screen */}
        <button
          type="button"
          onClick={() => {
            soundFx.playScanBeep();
            onReplayLoading();
          }}
          className="relative group p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          title="Re-run Cyber Diagnostics Loading Screen"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />

          {/* Hover Tooltip */}
          <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col items-end pointer-events-none whitespace-nowrap z-50">
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl">
              Re-run System Diagnostics
            </span>
          </div>
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onOpenShortcuts();
          }}
          className="relative group p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4 text-slate-400" />

          {/* Hover Tooltip */}
          <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col items-end pointer-events-none whitespace-nowrap z-50">
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl">
              Shortcuts (Press ?)
            </span>
          </div>
        </button>

        {/* 1930 Emergency Helpline Quick Dial */}
        <a
          href="tel:1930"
          className="group flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-xs font-black rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          title="Call 1930 National Cyber Helpline"
        >
          <PhoneCall className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>1930</span>
        </a>
      </div>
    </div>
  );
};
