import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Scanner } from './components/Scanner.tsx';
import { VerdictCard } from './components/VerdictCard.tsx';
import { AwarenessSection } from './components/AwarenessSection.tsx';
import { CommunityTrends } from './components/CommunityTrends.tsx';
import { CodeExportModal } from './components/CodeExportModal.tsx';
import { LiveMonitor } from './components/LiveMonitor.tsx';
import { SenderLookup } from './components/SenderLookup.tsx';
import { MobileSimulator } from './components/MobileSimulator.tsx';
import { Language, ScanResult, IncomingMessage } from './types/index.ts';
import { translations } from './lib/translations.ts';
import { PhoneCall, ShieldAlert, Sparkles, Smartphone, Check } from 'lucide-react';

export default function App() {
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
    setInputText('');
    setScanResult(null);
    setScanError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenCodeExport={() => setIsCodeModalOpen(true)}
      />

      {/* Emergency Helpline Banner */}
      <div className="bg-orange-600 text-white py-2 px-4 text-xs font-semibold shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <ShieldAlert className="w-4 h-4 text-orange-200 shrink-0" />
            <span className="truncate">
              {language === 'en'
                ? 'Truecaller Real-Time Scam Protection · National Helpline:'
                : language === 'hi'
                ? 'ट्रूकॉलर स्टाइल रियल-टाइम फ्रॉड प्रोटेक्शन · राष्ट्रीय हेल्पलाइन:'
                : 'ट्रूकॉलर स्टाइल रिअल-टाइम फसवणूक सुरक्षा · हेल्पलाइन:'}{' '}
              <strong className="underline text-white font-bold ml-1">1930</strong>
            </span>
          </div>

          <a
            href="tel:1930"
            className="flex items-center gap-1.5 bg-white text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold hover:bg-orange-50 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Call 1930</span>
          </a>
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
                <div className="p-3 bg-red-900/40 border border-red-700 text-red-200 rounded-xl text-xs">
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
              <div className="bg-red-950/60 border border-red-700/60 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-red-400">
                  <PhoneCall className="w-5 h-5" />
                  <h3 className="font-bold text-sm">
                    {language === 'en'
                      ? 'National Cyber Crime Reporting Helpline 1930'
                      : 'राष्ट्रीय साइबर अपराध हेल्पलाइन 1930'}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'en'
                    ? 'If you have fallen victim to financial fraud or money was deducted from your account, dial 1930 immediately within the golden hour to freeze fraudulent transactions.'
                    : 'यदि आपके खाते से धोखाधड़ी कर पैसे कट गए हैं, तो तुरंत 1930 पर कॉल करें ताकि बैंक लेनदेन को रोका जा सके।'}
                </p>
                <a
                  href="tel:1930"
                  className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 1930 Immediately</span>
                </a>
              </div>

              <CommunityTrends language={language} />

              <AwarenessSection language={language} />
            </div>
          )}
        </MobileSimulator>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-6 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-white font-semibold">
              ScamShield Bharat (स्कैमशील्ड भारत) · Real-Time Mobile Truecaller Prototype
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

          <div className="flex items-center gap-3">
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

      {/* Code & SQL Exporter Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
