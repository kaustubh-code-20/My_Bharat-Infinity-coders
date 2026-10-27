import React, { useState } from 'react';
import { ShieldCheck, Code2, Volume2, VolumeX, RotateCcw, Keyboard, Sparkles } from 'lucide-react';
import { Language } from '../types/index.ts';
import { translations } from '../lib/translations.ts';
import { soundFx } from '../lib/soundEffects.ts';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCodeExport: () => void;
  onOpenShortcuts?: () => void;
  onReplayLoading?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenCodeExport,
  onOpenShortcuts,
  onReplayLoading,
}) => {
  const t = translations[language];
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  const handleLangSelect = (newLang: Language) => {
    soundFx.playClick();
    onLanguageChange(newLang);
  };

  const handleToggleSound = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 text-white border-b border-slate-800 shadow-md backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone with hover lift & glow */}
        <div className="flex items-center gap-3 shrink-0 group cursor-default">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/30 group-hover:scale-105 group-hover:shadow-orange-500/50 transition-all duration-300">
            <ShieldCheck className="w-6 h-6 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="group-hover:text-orange-400 transition-colors">
                {t.appTitle}
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-950/70 border border-orange-800/80 px-2 py-0.5 rounded shadow-xs">
                Bharat
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-[11px] text-slate-400 hidden md:block">
                {t.badgeBharat}
              </p>
              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Shield Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Vernacular Language Switcher */}
          <div className="flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => handleLangSelect('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                language === 'en'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLangSelect('hi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                language === 'hi'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => handleLangSelect('mr')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                language === 'mr'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Quick Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all cursor-pointer active:scale-95 shadow-xs"
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-orange-400" />
            )}
          </button>

          {/* Re-run Diagnostics / Loading Screen */}
          {onReplayLoading && (
            <button
              type="button"
              onClick={() => {
                soundFx.playScanBeep();
                onReplayLoading();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all cursor-pointer active:scale-95 shadow-xs"
              title="Re-run Diagnostics Loading Screen"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:rotate-180 transition-transform duration-500" />
              <span className="hidden md:inline">Diagnostics</span>
            </button>
          )}

          {/* Code & SQL Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onOpenCodeExport();
            }}
            className="btn-shine flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl transition-all whitespace-nowrap active:scale-95 cursor-pointer shadow-xs hover:border-orange-500/40"
            title="View Supabase Schema, Next.js Code & Architecture"
          >
            <Code2 className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Next.js & SQL</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
