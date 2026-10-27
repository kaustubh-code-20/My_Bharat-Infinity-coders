import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Language } from '../types/index.ts';

interface ThreatMeterProps {
  score: number; // 0 to 100
  verdict: 'Safe' | 'Suspicious' | 'Scam';
  language: Language;
}

export const ThreatMeter: React.FC<ThreatMeterProps> = ({
  score,
  verdict,
  language,
}) => {
  // Clamped score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Gauge calculation for 180-degree semi-circle
  const radius = 64;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const isScam = verdict === 'Scam';
  const isSuspicious = verdict === 'Suspicious';
  const isSafe = verdict === 'Safe';

  const riskColor = isScam
    ? '#dc2626'
    : isSuspicious
    ? '#d97706'
    : '#059669';

  const riskTierText = {
    en: isScam
      ? 'Critical Scam Threat'
      : isSuspicious
      ? 'Suspicious Risk'
      : 'Minimal Risk (Safe)',
    hi: isScam
      ? 'गंभीर साइबर खतरा (Scam)'
      : isSuspicious
      ? 'संदिग्ध जोखिम (Suspicious)'
      : 'सुरक्षित (Safe)',
    mr: isScam
      ? 'धोकादायक घोटाळा (Scam)'
      : isSuspicious
      ? 'संशयास्पद धोका (Suspicious)'
      : 'सुरक्षित (Safe)',
  }[language];

  return (
    <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs hover:border-slate-300 transition-all">
      {/* Semi-Circular SVG Gauge */}
      <div className="relative flex flex-col items-center">
        <svg
          width="160"
          height="95"
          viewBox="0 0 160 95"
          className="overflow-visible"
        >
          {/* Background Arc */}
          <path
            d="M 16 85 A 64 64 0 0 1 144 85"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 16 85 A 64 64 0 0 1 144 85"
            fill="none"
            stroke={riskColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute bottom-1 text-center">
          <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
            {clampedScore}
          </span>
          <span className="text-xs text-slate-400 font-semibold">/100</span>
        </div>
      </div>

      {/* Risk Tier Description */}
      <div className="flex-1 text-center sm:text-left space-y-1">
        <div className="flex items-center justify-center sm:justify-start gap-1.5">
          {isScam ? (
            <AlertOctagon className="w-4 h-4 text-red-600" />
          ) : isSuspicious ? (
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === 'en'
              ? 'Threat Assessment'
              : language === 'hi'
              ? 'खतरा मूल्यांकन'
              : 'धोका मूल्यमापन'}
          </span>
        </div>

        <h3
          className="text-base font-bold tracking-tight"
          style={{ color: riskColor }}
        >
          {riskTierText}
        </h3>

        <p className="text-xs text-slate-600 leading-normal">
          {isScam
            ? language === 'en'
              ? 'Multiple fraudulent triggers detected. High likelihood of financial loss or malware infection.'
              : language === 'hi'
              ? 'धोखाधड़ी के गंभीर संकेत पाए गए हैं। वित्तीय हानि या वायरस की प्रबल संभावना है।'
              : 'फसवणुकीचे स्पष्ट पुरावे आढळले आहेत. आर्थिक नुकसान किंवा व्हायरसचा मोठा धोका आहे.'
            : isSuspicious
            ? language === 'en'
              ? 'Unverified urgency or suspicious links. Do not click links without secondary bank verification.'
              : language === 'hi'
              ? 'संदिग्ध लिंक या दबावयुक्त भाषा। बैंक या संस्था से पुष्टि किए बिना लिंक पर क्लिक न करें।'
              : 'संशयास्पद मजकूर किंवा अनोळखी लिंक. बँकेशी प्रत्यक्ष बोलल्याशिवाय कोणतीही कृती करू नका.'
            : language === 'en'
            ? 'Standard security headers and transactional phrasing detected. No malicious vectors found.'
            : language === 'hi'
            ? 'मानक सुरक्षा व वैध लेनदेन संदेश। कोई दुर्भावनापूर्ण तत्व नहीं मिला।'
            : 'अधिकृत व सुरक्षित संदेश. कोणताही धोका आढळला नाही.'}
        </p>
      </div>
    </div>
  );
};
