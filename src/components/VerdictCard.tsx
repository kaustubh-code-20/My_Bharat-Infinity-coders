import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  Volume2,
  VolumeX,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Cpu,
  Share2,
  Copy,
  Check,
  Link as LinkIcon,
  CreditCard,
  FileWarning,
} from 'lucide-react';
import { Language, ScanResult } from '../types/index.ts';
import { translations } from '../lib/translations.ts';
import { ThreatMeter } from './ThreatMeter.tsx';
import { soundFx } from '../lib/soundEffects.ts';

interface VerdictCardProps {
  result: ScanResult;
  language: Language;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ result, language }) => {
  const t = translations[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (result.verdict === 'Scam' || result.verdict === 'Suspicious') {
      soundFx.playWarning();
    } else {
      soundFx.playSuccess();
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language, result]);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    const explanationText =
      result.explanation[language] || result.plainSummary || result.explanation.en;
    const actionList = (result.actionSteps[language] || []).join('. ');
    const safetyTip = result.safetyTips[language] || '';

    const spokenText = `${
      result.verdict === 'Scam'
        ? language === 'en'
          ? 'Warning! This is likely a scam.'
          : language === 'hi'
          ? 'सावधान! यह धोखाधड़ी यानी स्कैम है।'
          : 'सावधान! हा फसवणुकीचा घोटाळा आहे.'
        : result.verdict === 'Suspicious'
        ? language === 'en'
          ? 'Caution! This message is suspicious.'
          : language === 'hi'
          ? 'चेतावनी! यह संदिग्ध संदेश है।'
          : 'सावधान! हा संशयास्पद मेसेज आहे.'
        : language === 'en'
        ? 'This appears to be a safe message.'
        : language === 'hi'
        ? 'यह सुरक्षित संदेश प्रतीत होता है।'
        : 'हा सुरक्षित मेसेज वाटतो.'
    } ${explanationText} ${
      actionList
        ? (language === 'en'
            ? 'Immediate action steps: '
            : language === 'hi'
            ? 'तुरंत ये कदम उठाएं: '
            : 'त्वरित पुढील पावले उचला: ') + actionList
        : ''
    } ${safetyTip}`;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    const voices = window.speechSynthesis.getVoices();
    const langCode =
      language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    const voice = voices.find(
      (v) =>
        v.lang === langCode ||
        v.lang.startsWith(langCode.slice(0, 2)) ||
        v.lang.toLowerCase().includes('india')
    );

    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = langCode;
    utterance.rate = 0.92;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleShareWhatsApp = () => {
    const explanation =
      result.explanation[language] || result.plainSummary || result.explanation.en;
    const alertPrefix =
      result.verdict === 'Scam'
        ? '🚨 *CYBER SCAM ALERT / सावधान!*'
        : '⚠️ *SUSPICIOUS MESSAGE WARNING*';

    const shareMessage = `${alertPrefix}
*ScamShield Bharat Verification Report*
• Verdict: *${result.verdict.toUpperCase()}* (${result.riskScore}/100 Risk)
• Category: *${result.category.replace('_', ' ').toUpperCase()}*
• Why: ${explanation}

🛡️ *Safety Advice:* Do not click unknown links or share OTPs. In case of fraud, dial 1930 immediately!
_Verified via ScamShield Bharat: Vernacular Cyber Protection_`;

    const encoded = encodeURIComponent(shareMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyReport = () => {
    soundFx.playSuccess();
    const explanation =
      result.explanation[language] || result.plainSummary || result.explanation.en;
    const reportText = `[ScamShield Bharat Report]
Verdict: ${result.verdict} (Risk: ${result.riskScore}/100, Confidence: ${Math.round(result.confidence * 100)}%)
Category: ${result.category}
Engine: ${result.engineUsed}
Analysis: ${explanation}
Helpline: 1930 (National Cyber Crime Portal)`;

    navigator.clipboard.writeText(reportText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const isScam = result.verdict === 'Scam';
  const isSuspicious = result.verdict === 'Suspicious';

  const containerStyles = isScam
    ? 'border-red-300 bg-red-50/50 shadow-red-500/5'
    : isSuspicious
    ? 'border-amber-300 bg-amber-50/50 shadow-amber-500/5'
    : 'border-emerald-300 bg-emerald-50/50 shadow-emerald-500/5';

  const badgeStyles = isScam
    ? 'text-red-700 bg-red-100 border-red-200'
    : isSuspicious
    ? 'text-amber-800 bg-amber-100 border-amber-200'
    : 'text-emerald-700 bg-emerald-100 border-emerald-200';

  const verdictTitle = isScam
    ? t.verdictScam
    : isSuspicious
    ? t.verdictSuspicious
    : t.verdictSafe;

  const explanation =
    result.explanation[language] || result.plainSummary || result.explanation.en;
  const actions = result.actionSteps[language] || result.actionSteps.en || [];
  const safetyTip = result.safetyTips[language] || result.safetyTips.en;

  return (
    <div
      className={`card-hover-elevate rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-5 ${containerStyles}`}
    >
      {/* 1. Dynamic Threat Meter Gauge */}
      <ThreatMeter
        score={result.riskScore}
        verdict={result.verdict}
        language={language}
      />

      {/* 2. Top Summary & Audio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isScam
                ? 'bg-red-600 text-white'
                : isSuspicious
                ? 'bg-amber-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isScam ? (
              <AlertOctagon className="w-6 h-6" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${badgeStyles}`}
              >
                {verdictTitle}
              </span>
            </div>
            {/* Unboxed Metadata with · separator */}
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-1 font-medium">
                {result.engineUsed.includes('Gemini') ? (
                  <Sparkles className="w-3 h-3 text-orange-600" />
                ) : (
                  <Cpu className="w-3 h-3 text-blue-600" />
                )}
                <span>{result.engineUsed}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-semibold">
                {Math.round(result.confidence * 100)}% {language === 'en' ? 'confidence' : language === 'hi' ? 'सटीकता' : 'विश्वासार्हता'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{result.category.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Read Aloud & Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-95 ${
              isPlayingAudio
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>{t.stopListening}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                <span>{t.listenVerdict}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            title="Copy Report to Clipboard"
          >
            {copiedShare ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {copiedShare ? 'Copied' : 'Copy'}
            </span>
          </button>

          {isScam && (
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Share alert on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          )}
        </div>
      </div>

      {/* Extracted Risky Entities (URLs, UPI VPAs, APKs) */}
      {result.extractedEntities && result.extractedEntities.length > 0 && (
        <div className="space-y-2 bg-white/80 p-3.5 rounded-xl border border-black/5">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {language === 'en'
              ? 'Extracted Identifiers & Risk Breakdown:'
              : language === 'hi'
              ? 'पहचाने गए लिंक और UPI पहचानकर्ता:'
              : 'आढळलेले लिंक्स व UPI आयडी:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {result.extractedEntities.map((ent, idx) => (
              <div
                key={idx}
                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${
                  ent.threatLevel === 'dangerous'
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {ent.type === 'url' ? (
                  <LinkIcon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                ) : ent.type === 'upi' ? (
                  <CreditCard className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                ) : (
                  <FileWarning className="w-3.5 h-3.5 text-red-600 shrink-0" />
                )}
                <span className="font-mono font-semibold truncate max-w-xs">
                  {ent.value}
                </span>
                <span className="text-[10px] uppercase font-bold opacity-75">
                  ({ent.threatLevel})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vernacular Explanation */}
      <div className="space-y-1.5">
        <h4 className="text-sm font-bold text-slate-900">
          {t.whyDangerous}
        </h4>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal bg-white/70 p-3.5 rounded-xl border border-black/5">
          {explanation}
        </p>
      </div>

      {/* Red Flags / Detected Indicators */}
      {result.detectedIndicators && result.detectedIndicators.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {language === 'en'
              ? 'Specific Red Flags Detected:'
              : language === 'hi'
              ? 'पहचाने गए मुख्य खतरे:'
              : 'आढळलेले धोके:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.detectedIndicators.map((ind, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-black/5 text-xs text-slate-800 font-medium"
              >
                <span className="text-red-600 font-bold">✕</span>
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immediate Action Steps */}
      {actions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900">
            {t.actionTitle}
          </h4>
          <ul className="space-y-1.5">
            {actions.map((act, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 bg-white/60 p-2.5 rounded-lg border border-black/5"
              >
                <ArrowRight className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Memorable Bharat Safety Rule */}
      {safetyTip && (
        <div className="bg-orange-100/70 border border-orange-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-orange-950 font-medium">
          <ShieldAlert className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{t.safetyTipTitle} </span>
            <span>{safetyTip}</span>
          </div>
        </div>
      )}

      {/* Emergency Action Button: 1930 Helpline */}
      {isScam && (
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href="tel:1930"
            className="flex-1 py-3 px-4 bg-red-700 hover:bg-red-800 active:scale-[0.99] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t.reportHelpline}</span>
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-800 border border-slate-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      )}
    </div>
  );
};
