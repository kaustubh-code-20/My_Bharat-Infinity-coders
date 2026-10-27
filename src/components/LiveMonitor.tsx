import React, { useState } from 'react';
import {
  MessageSquare,
  Zap,
  Smartphone,
  Landmark,
  QrCode,
  ShieldCheck,
  Clipboard,
  Play,
  CheckCircle2,
  AlertOctagon,
  Ban,
} from 'lucide-react';
import { Language, IncomingMessage, ScanResult } from '../types/index.ts';
import { soundFx } from '../lib/soundEffects.ts';

interface LiveMonitorProps {
  language: Language;
  onIncomingMessage: (msg: IncomingMessage) => void;
  feed: IncomingMessage[];
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({
  language,
  onIncomingMessage,
  feed,
}) => {
  const [clipboardStatus, setClipboardStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const presets = [
    {
      id: 'p-electricity',
      label: '⚡ Electricity Scam SMS',
      sender: '+91 98234 11223',
      header: 'UNKNOWN-MOB',
      channel: 'sms' as const,
      text: 'Dear consumer your electricity power will be disconnected tonight at 9.30 pm from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer Rahul Sharma at 9823411223. Thank you MSEDCL.',
    },
    {
      id: 'p-apk',
      label: '📱 WhatsApp APK Malware',
      sender: '+91 70012 34567',
      header: 'WHATSAPP-CALL',
      channel: 'whatsapp' as const,
      text: 'Traffic Police Notice: Vehicle MH12AB1234 has pending fine of Rs 1500. Download and install government e-challan app: http://tinyurl.com/echallan-v2.apk to avoid court summons.',
    },
    {
      id: 'p-kyc',
      label: '🏦 SBI KYC Phishing SMS',
      sender: '+91 98765 43210',
      header: 'UNKNOWN-MOB',
      channel: 'sms' as const,
      text: 'Dear SBI Customer, Your YONO account has been suspended today due to KYC expired. Please click here http://bit.ly/sbi-pan-kyc-update to update your PAN Card immediately within 24 hours.',
    },
    {
      id: 'p-lottery',
      label: '🎁 KBC UPI Prize (WhatsApp)',
      sender: '+91 91234 56789',
      header: 'WHATSAPP-CALL',
      channel: 'whatsapp' as const,
      text: 'Congratulations! You won Rs 25,00,000 in KBC All India Lucky Draw. Scan this QR code or accept PhonePe collect request of Rs 499 processing tax to receive prize money directly into your bank.',
    },
    {
      id: 'p-safe',
      label: '✅ Safe Official Bank OTP',
      sender: 'BP-SBIINB',
      header: 'BP-SBIINB',
      channel: 'sms' as const,
      text: '749281 is your Secret OTP for online purchase of Rs 420.00 at IRCTC with SBI Card ending in 4102. Valid for 10 mins. Do not share OTP with anyone including bank staff.',
    },
  ];

  const triggerPreset = async (preset: (typeof presets)[0]) => {
    soundFx.playScanBeep();
    setIsProcessing(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: preset.text, language }),
      });
      const scanned: ScanResult = await res.json();

      const newMsg: IncomingMessage = {
        id: `msg-${Date.now()}`,
        sender: preset.sender,
        senderHeader: preset.header,
        channel: preset.channel,
        text: preset.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        scannedResult: scanned,
      };

      onIncomingMessage(newMsg);
    } catch (e) {
      console.error('Trigger scan error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanClipboard = async () => {
    try {
      setClipboardStatus('Reading clipboard...');
      const clipText = await navigator.clipboard.readText();
      if (!clipText || clipText.trim().length < 5) {
        setClipboardStatus('No valid text found in clipboard.');
        setTimeout(() => setClipboardStatus(null), 2500);
        return;
      }

      soundFx.playScanBeep();
      setClipboardStatus('Scanning clipboard text...');
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clipText, language }),
      });
      const scanned: ScanResult = await res.json();

      const newMsg: IncomingMessage = {
        id: `msg-${Date.now()}`,
        sender: 'Clipboard Import',
        senderHeader: 'COPIED-TEXT',
        channel: 'sms',
        text: clipText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        scannedResult: scanned,
      };

      onIncomingMessage(newMsg);
      setClipboardStatus('Scanned successfully!');
      setTimeout(() => setClipboardStatus(null), 2000);
    } catch (err) {
      console.error('Clipboard error:', err);
      setClipboardStatus('Clipboard access denied. Please paste manually.');
      setTimeout(() => setClipboardStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Simulation Trigger Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-orange-400" />
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100">
              {language === 'en'
                ? 'Simulate Live Incoming Messages'
                : 'लाइव संदेश आने का परीक्षण करें'}
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
            Truecaller Engine Live
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-normal">
          {language === 'en'
            ? 'Tap any scenario below to trigger a real-time incoming SMS or WhatsApp notification with instant heads-up scam detection.'
            : 'नीचे दिए गए किसी भी विकल्प पर क्लिक करके वास्तविक समय में आने वाले फ्रॉड संदेश का अलर्ट देखें।'}
        </p>

        {/* Trigger Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => triggerPreset(preset)}
              disabled={isProcessing}
              className="group py-2.5 px-3 bg-slate-800 hover:bg-slate-700/90 active:scale-[0.98] border border-slate-700 hover:border-orange-500/50 rounded-xl text-left text-xs text-slate-200 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="font-semibold truncate">{preset.label}</span>
              <span className="text-[10px] text-orange-400 font-mono shrink-0 group-hover:translate-x-1 transition-transform">
                Send &gt;
              </span>
            </button>
          ))}
        </div>

        {/* Auto-Scan Clipboard Action */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleScanClipboard}
            className="btn-shine flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Auto-Scan Copied Text (Clipboard)</span>
          </button>
          {clipboardStatus && (
            <span className="text-xs text-orange-300 truncate font-medium">
              {clipboardStatus}
            </span>
          )}
        </div>
      </div>

      {/* Live Incoming Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">
              {language === 'en'
                ? 'Device Message Inbox & Interception Stream'
                : 'डिवाइस संदेश और सुरक्षा स्ट्रीम'}
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {feed.length} messages
          </span>
        </div>

        {feed.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No incoming messages yet. Tap a simulation button above to watch real-time scam detection in action!
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {feed.map((msg) => {
              const res = msg.scannedResult;
              const isScam = res?.verdict === 'Scam';
              const isSafe = res?.verdict === 'Safe';

              return (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                    isScam
                      ? 'bg-red-50/70 border-red-200'
                      : isSafe
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded ${
                          msg.channel === 'whatsapp'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {msg.channel}
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {msg.sender}
                      </span>
                      {msg.isBlocked && (
                        <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Ban className="w-2.5 h-2.5" />
                          <span>Blocked</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-slate-800 line-clamp-2 leading-relaxed">
                    {msg.text}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] font-semibold border-t border-black/5">
                    <span
                      className={`flex items-center gap-1 ${
                        isScam
                          ? 'text-red-700'
                          : isSafe
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {isScam ? (
                        <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>
                        {res?.verdict} ({res?.riskScore}/100 Risk)
                      </span>
                    </span>

                    <span className="text-slate-500 font-mono text-[10px]">
                      {res?.engineUsed}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
