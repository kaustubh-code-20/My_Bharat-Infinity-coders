import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  PhoneCall,
  Volume2,
  VolumeX,
  X,
  Ban,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Language, IncomingMessage } from '../types/index.ts';

interface TruecallerAlertProps {
  message: IncomingMessage;
  language: Language;
  onDismiss: () => void;
  onBlock: (sender: string) => void;
}

export const TruecallerAlert: React.FC<TruecallerAlertProps> = ({
  message,
  language,
  onDismiss,
  onBlock,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const result = message.scannedResult;
  const isScam = result?.verdict === 'Scam';
  const isSuspicious = result?.verdict === 'Suspicious';
  const score = result?.riskScore || (isScam ? 95 : isSuspicious ? 65 : 10);

  useEffect(() => {
    // Play light alert sound effect using Web Audio API synthesis
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = isScam ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isScam ? 880 : 587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio autoplay policy fallback
    }

    // Attempt browser vibration if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(isScam ? [100, 50, 100] : [50]);
      } catch (e) {}
    }
  }, [message]);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window) || !result) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    const explanation =
      result.explanation[language] || result.plainSummary || result.explanation.en;
    const spoken = `${
      isScam
        ? language === 'en'
          ? 'Warning! Truecaller fraud alert. High risk scam detected from ' + message.sender
          : language === 'hi'
          ? 'सावधान! यह धोखाधड़ी का संदेश है।'
          : 'सावधान! हा फसवणुकीचा मेसेज आहे.'
        : 'Truecaller alert: '
    } ${explanation}`;

    const utterance = new SpeechSynthesisUtterance(spoken);
    const langCode =
      language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.lang = langCode;
    utterance.rate = 0.92;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleBlockClick = () => {
    setBlocked(true);
    onBlock(message.sender);
    setTimeout(() => {
      onDismiss();
    }, 1200);
  };

  const explanation =
    result?.explanation[language] || result?.plainSummary || result?.explanation.en || '';

  return (
    <div className="absolute top-2 left-2 right-2 z-50 animate-in slide-in-from-top-4 duration-300">
      <div
        className={`rounded-2xl border shadow-2xl p-4 backdrop-blur-md transition-all ${
          isScam
            ? 'bg-red-950/95 border-red-500/80 text-white'
            : isSuspicious
            ? 'bg-amber-950/95 border-amber-500/80 text-white'
            : 'bg-emerald-950/95 border-emerald-500/80 text-white'
        }`}
      >
        {/* Top Channel & Header Row */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider ${
                message.channel === 'whatsapp'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
            </span>
            <span className="text-xs font-mono font-bold truncate max-w-[150px]">
              {message.sender}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 tabular-nums">
              {score}/100 Risk
            </span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verdict & Threat Banner */}
        <div className="py-2.5 space-y-1.5">
          <div className="flex items-center gap-2">
            {isScam ? (
              <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            ) : isSuspicious ? (
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <h4 className="text-sm font-bold tracking-tight">
              {isScam
                ? language === 'en'
                  ? 'Truecaller Alert: Likely Scam Detected!'
                  : language === 'hi'
                  ? 'चेतावनी: धोखाधड़ी संदेश की पहचान!'
                  : 'सावधान: फसवणूक मेसेज आढळला!'
                : isSuspicious
                ? language === 'en'
                  ? 'Suspicious Message Warning'
                  : 'संदिग्ध संदेश'
                : 'Safe Message'}
            </h4>
          </div>

          <p className="text-xs text-white/90 leading-relaxed font-normal line-clamp-2 bg-black/20 p-2 rounded-lg">
            {explanation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleBlockClick}
            disabled={blocked}
            className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            {blocked ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Blocked</span>
              </>
            ) : (
              <>
                <Ban className="w-3.5 h-3.5" />
                <span>Block & Report</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleSpeech}
            className="py-2 px-3 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {isPlayingAudio ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Listen</span>
          </button>

          {isScam && (
            <a
              href="tel:1930"
              className="py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Call National Cyber Helpline 1930"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>1930</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
