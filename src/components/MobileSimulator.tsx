import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Scan,
  Shield,
  Wifi,
  Battery,
  Smartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Language, IncomingMessage } from '../types/index.ts';
import { TruecallerAlert } from './TruecallerAlert.tsx';
import { soundFx } from '../lib/soundEffects.ts';

interface MobileSimulatorProps {
  language: Language;
  activeTab: 'alerts' | 'lookup' | 'scan' | 'safety';
  setActiveTab: (tab: 'alerts' | 'lookup' | 'scan' | 'safety') => void;
  currentAlert: IncomingMessage | null;
  onDismissAlert: () => void;
  onBlockSender: (sender: string) => void;
  isSimulatorMode: boolean;
  onToggleSimulatorMode: () => void;
  children: React.ReactNode;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  language,
  activeTab,
  setActiveTab,
  currentAlert,
  onDismissAlert,
  onBlockSender,
  isSimulatorMode,
  onToggleSimulatorMode,
  children,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab: 'alerts' | 'lookup' | 'scan' | 'safety') => {
    soundFx.playClick();
    setActiveTab(tab);
  };

  const navItems = [
    { id: 'alerts', label: 'Live Alerts', icon: Bell },
    { id: 'lookup', label: 'Sender ID', icon: Search },
    { id: 'scan', label: 'Scanner', icon: Scan },
    { id: 'safety', label: '1930 Helpline', icon: Shield },
  ] as const;

  if (!isSimulatorMode) {
    // Full-screen responsive mode (for direct mobile devices)
    return (
      <div className="relative w-full max-w-5xl mx-auto space-y-6">
        {/* View Mode Switcher Header */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              ScamShield Truecaller Engine: Running
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onToggleSimulatorMode();
            }}
            className="btn-shine flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5 text-orange-400" />
            <span>Switch to Phone Frame View</span>
          </button>
        </div>

        {/* Floating Heads-Up Overlay if triggered */}
        {currentAlert && (
          <TruecallerAlert
            message={currentAlert}
            language={language}
            onDismiss={onDismissAlert}
            onBlock={onBlockSender}
          />
        )}

        {/* Mobile Navigation Tabs with Hover Lift */}
        <div className="flex bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60 hover:-translate-y-0.5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div>{children}</div>
      </div>
    );
  }

  // Realistic Smartphone Device Simulator Frame (Ideal for demo and desktop presentation)
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Simulator Mode Control */}
      <div className="flex items-center justify-between w-full max-w-sm sm:max-w-md px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-400">
            Simulated 5G Android / iOS
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onToggleSimulatorMode();
          }}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Full Width Mode</span>
        </button>
      </div>

      {/* Phone Hardware Shell with Hover Shine & Elevation */}
      <div className="phone-screen-glare relative w-full max-w-[400px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(234,88,12,0.2)] border-4 border-slate-800 hover:border-slate-700 ring-1 ring-slate-900/50 flex flex-col overflow-hidden transition-all duration-300">
        {/* Dynamic Island / Earpiece with hover reaction */}
        <div className="group absolute top-4 left-1/2 -translate-x-1/2 z-40 w-28 hover:w-36 h-5 bg-black rounded-full flex items-center justify-between px-3 transition-all duration-300 cursor-pointer shadow-md">
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
        </div>

        {/* Inner Screen Canvas */}
        <div className="relative flex-1 bg-slate-100 rounded-[38px] flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="h-10 pt-1.5 px-6 flex items-center justify-between text-xs font-bold text-slate-800 shrink-0 select-none">
            <span className="tabular-nums font-mono">{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Floating Truecaller Scam Alert (Heads-Up Banner) */}
          {currentAlert && (
            <TruecallerAlert
              message={currentAlert}
              language={language}
              onDismiss={onDismissAlert}
              onBlock={onBlockSender}
            />
          )}

          {/* Scrollable Mobile Screen Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 pb-20">
            {children}
          </div>

          {/* Fixed Mobile Bottom Tab Bar (Truecaller Style) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 grid grid-cols-4 items-center px-1 z-30">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`relative flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer group hover:-translate-y-0.5 ${
                    isActive ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-1 w-6 h-0.5 bg-orange-600 rounded-full" />
                  )}
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'stroke-[2.5] text-orange-600' : 'stroke-2'
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-1 font-medium tracking-tight truncate max-w-[80px] ${
                      isActive ? 'font-bold text-orange-600' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* iOS / Android Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/80 rounded-full z-40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
