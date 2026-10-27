import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Scanner } from './components/Scanner.tsx';
import { VerdictCard } from './components/VerdictCard.tsx';
import { AwarenessSection } from './components/AwarenessSection.tsx';
import { CommunityTrends } from './components/CommunityTrends.tsx';
import { CodeExportModal } from './components/CodeExportModal.tsx';
import { LiveMonitor } from './components/LiveMonitor.tsx';
import { SenderLookup } from './components/SenderLookup.tsx';
import { MobileSimulator } from './components/MobileSimulator.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { GoldenHourModal } from './components/GoldenHourModal.tsx';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.tsx';
import { QuickActionsDock } from './components/QuickActionsDock.tsx';
import { Language, ScanResult, IncomingMessage } from './types/index.ts';
import { translations } from './lib/translations.ts';
import { soundFx } from './lib/soundEffects.ts';
import { PhoneCall, ShieldAlert, Sparkles, Smartphone, Check, Clock, Radio, Activity } from 'lucide-react';

export default function App() {
  const [isLoadingScreenActive, setIsLoadingScreenActive] = useState<boolean>(true);
  const [isGoldenHourOpen, setIsGoldenHourOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scamshield_lang') as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        return saved;
      }
    }
    return 'en';
  });

  const [activeTab, setActiveTab] = useState<'alerts' | 'lookup' | 'scan' | 'safety'>('alerts');
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);

  // Live incoming message stream and Truecaller-style overlay
  const [incomingFeed, setIncomingFeed] = useState<IncomingMessage[]>([
    {
      id: 'init-01',
      sender: '+91 98234 11223',
      senderHeader: 'UNKNOWN-MOB',
      channel: 'sms',
      text: 'Dear consumer your electricity power will be disconnected tonight at 9.30 pm from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer Rahul Sharma at 9823411223. Thank you MSEDCL.',
      timestamp: 'Just now',
      scannedResult: {
        verdict: 'Scam',
        category: 'electricity',
        riskScore: 98,
        confidence: 0.98,
        engineUsed: 'Local Rules Engine',
        detectedIndicators: [
          'Fake urgency: threats of immediate power disconnection tonight',
          'Personal 10-digit mobile number claiming to be electricity officer',
        ],
        explanation: {
          en: 'Verified Electricity Bill Scam. Power companies never send disconnection threats from personal numbers.',
          hi: 'यह बिजली बिल धोखाधड़ी है। सरकारी विभाग कभी व्यक्तिगत नंबर से रात में बिजली काटने की धमकी नहीं देता।',
          mr: 'हा वीज बिल घोटाळा आहे. महावितरण कधीही वैयक्तिक मोबाईलवरून वीज तोडण्याची धमकी देत नाही.',
        },
        plainSummary: 'Verified Electricity Bill Scam.',
        actionSteps: {
          en: ['Do not call the phone number', 'Call 1930 Helpline'],
          hi: ['फोन नंबर पर कॉल न करें', '1930 पर शिकायत करें'],
          mr: ['नंबरवर कॉल करू नका', '१९३० वर तक्रार नोंदवा'],
        },
        safetyTips: {
          en: 'Official discoms only send SMS via official 6-character sender IDs.',
          hi: 'बिजली विभाग केवल आधिकारिक 6-अक्षर वाले हेडर से SMS भेजता है।',
          mr: 'महावितरण नेहमी अधिकृत 6-अक्षरी हेडर वापरूनच SMS पाठवते.',
        },
      },
    },
  ]);

  const [currentAlert, setCurrentAlert] = useState<IncomingMessage | null>(null);

  // Manual Scanner State
  const [inputText, setInputText] = useState<string>('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const t = translations[language];

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if (e.key === '1') {
        soundFx.playClick();
        setActiveTab('alerts');
      } else if (e.key === '2') {
        soundFx.playClick();
        setActiveTab('lookup');
      } else if (e.key === '3') {
        soundFx.playClick();
        setActiveTab('scan');
      } else if (e.key === '4') {
        soundFx.playClick();
        setActiveTab('safety');
      } else if (e.key === 'g' || e.key === 'G') {
        soundFx.playClick();
        setIsGoldenHourOpen((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        soundFx.toggleMute();
      } else if (e.key === '?') {
        soundFx.playClick();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCurrentAlert(null);
        setIsGoldenHourOpen(false);
        setIsShortcutsOpen(false);
        setIsCodeModalOpen(false);
      } else if (e.key === '/') {
        e.preventDefault();
        soundFx.playClick();
        setActiveTab('scan');
        setTimeout(() => {
          const textarea = document.querySelector('textarea');
          textarea?.focus();
        }, 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scamshield_lang', newLang);
    }
  };

  const handleIncomingMessage = (msg: IncomingMessage) => {
    setIncomingFeed((prev) => [msg, ...prev]);
    // Pop up Truecaller heads-up overlay immediately
    setCurrentAlert(msg);
  };

  const handleBlockSender = (sender: string) => {
    setIncomingFeed((prev) =>
      prev.map((m) => (m.sender === sender ? { ...m, isBlocked: true } : m))
    );
  };

  const handleScan = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setScanError(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, language }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to scan message');
      }

      const data: ScanResult = await response.json();
      setScanResult(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      soundFx.playWarning();
      setScanError(
        language === 'en'
          ? 'Analysis error. Please try again.'
          : language === 'hi'
          ? 'जाँच के दौरान समस्या आई। कृपया पुनः प्रयास करें।'
          : 'तपासणी दरम्यान त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    soundFx.playClick();
    setInputText('');
    setScanResult(null);
    setScanError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500 selection:text-white relative">
      {/* 1. Professional Cybersecurity Preloader / Loading Screen */}
      {isLoadingScreenActive && (
        <LoadingScreen
          language={language}
          onComplete={() => setIsLoadingScreenActive(false)}
        />
      )}

      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenCodeExport={() => setIsCodeModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onReplayLoading={() => setIsLoadingScreenActive(true)}
      />

      {/* Live Cyber Defense HUD Ticker Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 py-1.5 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>DEFENSE ACTIVE</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="truncate hidden sm:inline">
              TRAI DLT Verified Headers Synced · Local NLP Rules + Gemini 2.5 Defense
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
            <span className="text-orange-400 font-semibold hidden md:inline">
              Golden Hour: 120m Window
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              title="Keyboard Shortcuts"
            >
              <span>Hotkeys:</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 text-orange-300 rounded text-[9px] border border-slate-700">
                ?
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Helpline & Golden Hour Action Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 text-white py-2 px-4 text-xs font-semibold shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <ShieldAlert className="w-4 h-4 text-orange-200 shrink-0 animate-bounce" />
            <span className="truncate">
              {language === 'en'
                ? 'Truecaller Real-Time Scam Protection · National Helpline:'
                : language === 'hi'
                ? 'ट्रूकॉलर स्टाइल रियल-टाइम फ्रॉड प्रोटेक्शन · राष्ट्रीय हेल्पलाइन:'
                : 'ट्रूकॉलर स्टाइल रिअल-टाइम फसवणूक सुरक्षा · हेल्पलाइन:'}{' '}
              <strong className="underline text-white font-bold ml-1">1930</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Golden Hour Interactive Protocol Helper Button */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsGoldenHourOpen(true);
              }}
              className="btn-shine hidden sm:flex items-center gap-1.5 bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/20 transition-all cursor-pointer active:scale-95"
            >
              <Clock className="w-3 h-3 text-orange-300" />
              <span>Golden Hour Checklist</span>
            </button>

            <a
              href="tel:1930"
              className="btn-shine flex items-center gap-1.5 bg-white text-orange-700 px-3 py-1 rounded-full text-[11px] font-extrabold hover:bg-orange-50 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Call 1930</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main App Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Mobile Simulator Shell */}
        <MobileSimulator
          language={language}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentAlert={currentAlert}
          onDismissAlert={() => setCurrentAlert(null)}
          onBlockSender={handleBlockSender}
          isSimulatorMode={isSimulatorMode}
          onToggleSimulatorMode={() => setIsSimulatorMode(!isSimulatorMode)}
        >
          {/* Tab 1: Live Alerts & Interception Stream */}
          {activeTab === 'alerts' && (
            <LiveMonitor
              language={language}
              onIncomingMessage={handleIncomingMessage}
              feed={incomingFeed}
            />
          )}

          {/* Tab 2: Sender & Number Lookup (Truecaller-Style) */}
          {activeTab === 'lookup' && <SenderLookup language={language} />}

          {/* Tab 3: Deep Manual Scanner & OCR */}
          {activeTab === 'scan' && (
            <div className="space-y-5">
              <Scanner
                language={language}
                inputText={inputText}
                setInputText={setInputText}
                onScan={handleScan}
                isLoading={isLoading}
                onClear={handleClear}
              />

              {scanError && (
                <div className="p-3 bg-red-900/40 border border-red-700 text-red-200 rounded-xl text-xs animate-shake">
                  {scanError}
                </div>
              )}

              {scanResult && (
                <VerdictCard result={scanResult} language={language} />
              )}
            </div>
          )}

          {/* Tab 4: Cyber Safety & 1930 Portal */}
          {activeTab === 'safety' && (
            <div className="space-y-5">
              <div className="card-hover-elevate bg-gradient-to-br from-red-950/70 to-slate-900 border border-red-700/60 p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-red-400">
                    <PhoneCall className="w-5 h-5 text-red-500 animate-pulse" />
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {language === 'en'
                        ? 'National Cyber Crime Reporting Helpline 1930'
                        : 'राष्ट्रीय साइबर अपराध हेल्पलाइन 1930'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                    24x7 Active
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {language === 'en'
                    ? 'If you have fallen victim to financial fraud or money was deducted from your account, dial 1930 immediately within the golden hour to freeze fraudulent transactions.'
                    : 'यदि आपके खाते से धोखाधड़ी कर पैसे कट गए हैं, तो तुरंत 1930 पर कॉल करें ताकि बैंक लेनदेन को रोका जा सके।'}
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href="tel:1930"
                    className="btn-shine flex-1 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call 1930 Immediately</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setIsGoldenHourOpen(true);
                    }}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>View Golden Hour Protocol</span>
                  </button>
                </div>
              </div>

              <CommunityTrends language={language} />

              <AwarenessSection language={language} />
            </div>
          )}
        </MobileSimulator>
      </main>

      {/* Footer with Professional Diagnostics & Links */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-6 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-white font-semibold flex items-center justify-center sm:justify-start gap-2">
              <span>ScamShield Bharat (स्कैमशील्ड भारत)</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                Enterprise v2.0
              </span>
            </p>
            <p className="text-[11px] text-slate-500">
              National Cyber Crime Helpline: 1930 · Official Portal:{' '}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 hover:underline"
              >
                cybercrime.gov.in
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundFx.playScanBeep();
                setIsLoadingScreenActive(true);
              }}
              className="text-slate-400 hover:text-orange-400 text-xs transition-colors cursor-pointer"
            >
              Replay Loading Screen
            </button>
            <span className="text-slate-700">·</span>
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              className="text-slate-400 hover:text-orange-400 text-xs transition-colors cursor-pointer"
            >
              Keyboard Hotkeys
            </button>
            <span className="text-slate-700">·</span>
            <button
              type="button"
              onClick={() => setIsCodeModalOpen(true)}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              Supabase SQL & Next.js 14 Code
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Quick Actions Dock (Helpline, Sound, Golden Hour, Scroll Top) */}
      <QuickActionsDock
        language={language}
        onOpenGoldenHour={() => setIsGoldenHourOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onReplayLoading={() => setIsLoadingScreenActive(true)}
      />

      {/* Code & SQL Exporter Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Golden Hour Emergency Protocol Modal */}
      <GoldenHourModal
        isOpen={isGoldenHourOpen}
        onClose={() => setIsGoldenHourOpen(false)}
        language={language}
      />

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        language={language}
      />
    </div>
  );
}
