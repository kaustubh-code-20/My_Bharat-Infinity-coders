import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  ShieldAlert,
  ThumbsUp,
  CheckCircle2,
  AlertTriangle,
  Globe,
  CreditCard,
} from 'lucide-react';
import { Language, ScamReport, ThreatIntelItem } from '../types/index.ts';

interface CommunityTrendsProps {
  language: Language;
}

export const CommunityTrends: React.FC<CommunityTrendsProps> = ({ language }) => {
  const [trends, setTrends] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<ScamReport[]>([]);
  const [watchlist, setWatchlist] = useState<ThreatIntelItem[]>([]);
  const [votedReportIds, setVotedReportIds] = useState<Record<string, boolean>>(
    {}
  );
  const [activeTab, setActiveTab] = useState<'reports' | 'watchlist'>(
    'reports'
  );

  const loadData = () => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.activeTrends) setTrends(data.activeTrends);
        if (data.reports) setRecentReports(data.reports);
      })
      .catch((err) => console.error('Failed to load reports:', err));

    fetch('/api/threat-intel')
      .then((res) => res.json())
      .then((data) => {
        if (data.watchlist) setWatchlist(data.watchlist);
      })
      .catch((err) => console.error('Failed to load threat intel:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (votedReportIds[id]) return;

    try {
      const res = await fetch(`/api/reports/${id}/vote`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setVotedReportIds((prev) => ({ ...prev, [id]: true }));
        setRecentReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, votes: data.votes } : r))
        );
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-600" />
          <h3 className="text-sm font-bold text-slate-900">
            {language === 'en'
              ? 'Community Intelligence & Trends'
              : language === 'hi'
              ? 'समुदाय सतर्कता डेटा (Live Trends)'
              : 'समुदाय सतर्कता डेटा (Live Trends)'}
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {language === 'en' ? 'Crowdsourced RLS Feed' : language === 'hi' ? 'अनाम रिपोर्टिंग' : 'गोपनीय नोंद'}
        </span>
      </div>

      {/* Metric Counters with hover lift */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200/60 transition-all cursor-default">
          <p className="text-[11px] text-slate-500 font-medium">
            {language === 'en' ? 'Power Cutoff' : language === 'hi' ? 'बिजली बिल फ्रॉड' : 'वीज बिल घोटाळा'}
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums">142+</p>
        </div>
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200/60 transition-all cursor-default">
          <p className="text-[11px] text-slate-500 font-medium">
            {language === 'en' ? 'Bank KYC Fraud' : language === 'hi' ? 'बैंक KYC फ्रॉड' : 'बँक केवायसी'}
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums">187+</p>
        </div>
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200/60 transition-all cursor-default">
          <p className="text-[11px] text-slate-500 font-medium">
            {language === 'en' ? 'e-Challan APK' : language === 'hi' ? 'ई-चालान APK' : 'ई-चलन APK'}
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums">98+</p>
        </div>
        <div className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200/60 transition-all cursor-default">
          <p className="text-[11px] text-slate-500 font-medium">
            {language === 'en' ? 'UPI / Lottery' : language === 'hi' ? 'लॉटरी व QR' : 'लॉटरी व QR'}
          </p>
          <p className="text-lg font-extrabold text-slate-900 tabular-nums">76+</p>
        </div>
      </div>

      {/* Sub-tabs: Recent Reports vs Threat Watchlist */}
      <div className="flex border-b border-slate-100 text-xs font-semibold gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`pb-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'reports'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {language === 'en' ? 'Recent Citizen Reports' : language === 'hi' ? 'हालिया रिपोर्ट' : 'नुकतेच आलेले रिपोर्ट'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('watchlist')}
          className={`pb-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'watchlist'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {language === 'en' ? 'Flagged Domains & UPIs' : language === 'hi' ? 'संदेहास्पद डोमेन व UPI' : 'संशयास्पद डोमेन व UPI'}
        </button>
      </div>

      {/* Tab 1: Recent Citizen Reports with Live Community Upvote */}
      {activeTab === 'reports' && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {recentReports.map((rep) => {
            const hasVoted = votedReportIds[rep.id];
            return (
              <div
                key={rep.id}
                className="flex items-center justify-between gap-3 text-xs p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="text-slate-700 truncate font-medium">
                    {rep.preview}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-mono hidden sm:inline">
                    {rep.category.replace('_', ' ')}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleVote(rep.id, e)}
                    disabled={hasVoted}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      hasVoted
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-300 active:scale-95'
                    }`}
                    title="Verify this scam report"
                  >
                    {hasVoted ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ThumbsUp className="w-3 h-3 text-orange-600" />
                    )}
                    <span className="tabular-nums">{rep.votes || 1}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Threat Intel Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {watchlist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 text-xs transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                {item.type === 'domain' ? (
                  <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                )}
                <span className="font-mono font-semibold text-slate-900 truncate">
                  {item.identifier}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                  {item.reportsCount} hits
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
