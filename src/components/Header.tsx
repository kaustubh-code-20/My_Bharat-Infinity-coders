import React from 'react';
import { ShieldCheck, Code2 } from 'lucide-react';
import { Language } from '../types/index.ts';
import { translations } from '../lib/translations.ts';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCodeExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenCodeExport,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30 hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{t.appTitle}</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded">
                Bharat
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden md:block">
              {t.badgeBharat}
            </p>
          </div>
        </div>

        {/* Action Controls & Language Switcher (Order: English -> Hindi -> Marathi) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Vernacular Language Switcher */}
          <div className="flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                language === 'en'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                language === 'hi'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('mr')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                language === 'mr'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Hackathon Code & SQL Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenCodeExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl transition-all whitespace-nowrap active:scale-95 cursor-pointer shadow-xs"
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
