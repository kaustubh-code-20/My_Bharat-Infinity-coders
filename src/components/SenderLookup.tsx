import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  AlertOctagon,
  PhoneCall,
  Building,
  UserX,
  Radio,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { Language, SenderLookupResult } from '../types/index.ts';

interface SenderLookupProps {
  language: Language;
}

export const SenderLookup: React.FC<SenderLookupProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SenderLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleQueries = [
    { label: '9823411223 (Scam)', val: '9823411223' },
    { label: 'VM-MSEDCL (Official)', val: 'VM-MSEDCL' },
    { label: 'BP-SBIINB (Bank)', val: 'BP-SBIINB' },
    { label: '9876543210 (Phishing)', val: '9876543210' },
    { label: '9123456789 (Lottery)', val: '9123456789' },
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lookup/${encodeURIComponent(q)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Lookup query not recognized');
      }
      const data: SenderLookupResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(
        err.message ||
          (language === 'en'
            ? 'Number or header format not recognized.'
            : 'नंबर या हेडर अमान्य है।')
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const isScammer = result?.status === 'reported_scammer';
  const isOfficial = result?.status === 'verified_official';
  const isUnverified = result?.status === 'unverified_personal';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-5">
      {/* Search Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'en'
              ? 'Truecaller-Style Sender & Number Lookup'
              : language === 'hi'
              ? 'संदेश भेजने वाले नंबर या हेडर की जाँच'
              : 'मेसेज पाठवणारा नंबर व हेडर तपासणी'}
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-normal">
          {language === 'en'
            ? 'Verify any 10-digit phone number or official 6-character TRAI DLT header (e.g. VM-MSEDCL) against verified databases.'
            : 'किसी भी १०-अंकों के मोबाइल नंबर या बैंक हेडर की सत्यता जांचें।'}
        </p>
      </div>

      {/* Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={
              language === 'en'
                ? 'Enter 10-digit number or header (e.g. 9823411223, VM-MSEDCL)'
                : '10-अंकों का नंबर या हेडर दर्ज करें'
            }
            className="w-full pl-3.5 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
          />
        </div>

        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>Search</span>
          )}
        </button>
      </div>

      {/* Sample Quick Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-slate-500">
          Try Quick Lookup:
        </span>
        {sampleQueries.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(item.val);
              handleSearch(item.val);
            }}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-all cursor-pointer active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Profile Card Output */}
      {result && (
        <div
          className={`rounded-2xl border p-4 sm:p-5 space-y-4 transition-all ${
            isScammer
              ? 'bg-red-50/70 border-red-300 text-red-950'
              : isOfficial
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/70 border-amber-300 text-amber-950'
          }`}
        >
          {/* Header Profile Row */}
          <div className="flex items-start justify-between gap-3 border-b border-black/5 pb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${
                  isScammer
                    ? 'bg-red-600'
                    : isOfficial
                    ? 'bg-emerald-600'
                    : 'bg-amber-600'
                }`}
              >
                {isScammer ? (
                  <AlertOctagon className="w-6 h-6" />
                ) : isOfficial ? (
                  <Building className="w-6 h-6" />
                ) : (
                  <UserX className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 truncate">
                    {result.senderName}
                  </h4>
                  {isOfficial && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>TRAI Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono mt-0.5">
                  <span className="font-bold text-slate-900">{result.query}</span>
                  <span aria-hidden="true">·</span>
                  <span>{result.category}</span>
                </div>
              </div>
            </div>

            {/* Spam Score Badge */}
            <div className="text-right shrink-0">
              <span
                className={`text-lg font-black tabular-nums ${
                  isScammer
                    ? 'text-red-600'
                    : isOfficial
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {result.spamScore}%
              </span>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Spam Score
              </p>
            </div>
          </div>

          {/* Details & Reports Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5">
              <span className="text-[10px] text-slate-500 block">Operator Circle</span>
              <span className="font-semibold text-slate-800">
                {result.operatorCircle || 'National Telecom'}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5">
              <span className="text-[10px] text-slate-500 block">Community Reports</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {result.reportsCount} citizen reports
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 block">Top Reported As</span>
              <span className="font-semibold text-slate-800 truncate block">
                {result.topReportedAs || 'Unregistered SIM'}
              </span>
            </div>
          </div>

          {/* Localized Safety Guidance */}
          <p className="text-xs text-slate-800 bg-white/70 p-3 rounded-xl border border-black/5 leading-relaxed font-medium">
            <strong>Bharat Safety Advice: </strong>
            {result.advice[language] || result.advice.en}
          </p>

          {isScammer && (
            <div className="flex gap-2 pt-1">
              <a
                href="tel:1930"
                className="flex-1 py-2 px-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Report 1930</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
