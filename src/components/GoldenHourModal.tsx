import React, { useState } from 'react';
import {
  PhoneCall,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  X,
  CreditCard,
  Building,
  HelpCircle,
} from 'lucide-react';
import { Language } from '../types/index.ts';
import { soundFx } from '../lib/soundEffects.ts';

interface GoldenHourModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const GoldenHourModal: React.FC<GoldenHourModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [bankName, setBankName] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const toggleStep = (stepIdx: number) => {
    soundFx.playClick();
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIdx]: !prev[stepIdx],
    }));
  };

  const steps = [
    {
      title: {
        en: 'Step 1: Call National Cyber Helpline 1930',
        hi: 'चरण 1: तुरंत राष्ट्रीय हेल्पलाइन 1930 पर कॉल करें',
        mr: 'पायरी 1: त्वरित राष्ट्रीय सायबर हेल्पलाइन 1930 वर कॉल करा',
      },
      desc: {
        en: 'Dial 1930 within the first 2 hours ("Golden Hour"). The operator flags the transaction on the Citizen Financial Cyber Fraud Reporting System to freeze fraudulent bank transfers before cash-out.',
        hi: 'धोखाधड़ी के 2 घंटे के भीतर 1930 डायल करें। नोडल अधिकारी तुरंत पैसे को फ्रॉड खाते में फ्रीज कर देते हैं।',
        mr: 'पहिल्या २ तासांत १९३० डायल करा. अधिकारी फसवणूक झालेले पैसे थांबवण्यासाठी खाती गोठवतात.',
      },
      actionText: 'Call 1930',
      actionHref: 'tel:1930',
    },
    {
      title: {
        en: 'Step 2: Note Down UTR / Transaction Reference ID',
        hi: 'चरण 2: 12-अंकों का UTR या रेफरेंस नंबर नोट करें',
        mr: 'पायरी 2: १२ अंकी UTR किंवा ट्रान्झॅक्शन आयडी नोंदवा',
      },
      desc: {
        en: 'Check your debit SMS or mobile banking statement for the 12-digit UTR (Unique Transaction Reference) number or UPI reference. This is required by the 1930 operator.',
        hi: 'बैंक SMS में दिए गए 12-अंकों के UTR या UPI रेफरेंस नंबर को नोट कर लें।',
        mr: 'बँकेच्या मेसेजमधील १२ अंकी UTR किंवा UPI नंबर तयार ठेवा.',
      },
    },
    {
      title: {
        en: 'Step 3: Alert Your Bank To Freeze Immediate Debit',
        hi: 'चरण 3: अपनी बैंक शाखा या कस्टमर केयर को सूचित करें',
        mr: 'पायरी 3: तात्काळ डेबिट थांबवण्यासाठी बँकेशी संपर्क साधा',
      },
      desc: {
        en: 'Call your bank’s dedicated cyber fraud emergency desk (SBI: 1800111109, HDFC: 18001600, ICICI: 18001080) to request a lien/hold on unauthorized debits.',
        hi: 'अपने बैंक के फ्रॉड हेल्पलाइन पर कॉल करके डेबिट कार्ड या नेट बैंकिंग को तुरंत ब्लॉक करवाएं।',
        mr: 'बँकेच्या कस्टमर केअरला कॉल करून कार्ड व नेट बँकिंग तात्काळ ब्लॉक करा.',
      },
    },
    {
      title: {
        en: 'Step 4: File Official FIR on cybercrime.gov.in',
        hi: 'चरण 4: cybercrime.gov.in पर आधिकारिक शिकायत दर्ज करें',
        mr: 'पायरी 4: cybercrime.gov.in वर तक्रार नोंदवून पावती घ्या',
      },
      desc: {
        en: 'Log on to cybercrime.gov.in, select "Report Financial Fraud", enter the 1930 acknowledgment token, and upload screenshots of the fraudulent SMS, fake links, or WhatsApp chat.',
        hi: 'पोर्टल पर जाकर 1930 टोकन नंबर दर्ज करें और फ्रॉड SMS/चैट के स्क्रीनशॉट अपलोड करें।',
        mr: 'पोर्टलवर जाऊन पुरावे आणि १९३० कडून मिळालेला टोकन नंबर अपलोड करा.',
      },
      actionText: 'cybercrime.gov.in',
      actionHref: 'https://cybercrime.gov.in',
    },
  ];

  const handleCopyTemplate = () => {
    soundFx.playSuccess();
    const text = `[Cybercrime 1930 Complaint Details]
• Victim Bank: ${bankName || 'Not specified'}
• Debited Amount: ₹${amount || 'Not specified'}
• Transaction Reference / UTR: ${utrNumber || 'Not specified'}
• Date & Time: ${new Date().toLocaleString()}
• Incident Type: Unauthorized Financial Cyber Fraud
• Helpline Dialed: 1930 Golden Hour Protocol`;

    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Emergency Red Badge */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-900 border-b border-red-900/40 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0 animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {language === 'en'
                    ? '1930 "Golden Hour" Protocol'
                    : language === 'hi'
                    ? '1930 "गोल्डन ऑवर" आपातकालीन प्रक्रिया'
                    : '१९३० "गोल्डन अवर" आपत्कालीन कृती'}
                </h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  Critical
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'en'
                  ? 'First 2 hours are crucial to freeze money before fraudsters transfer it across mule accounts.'
                  : 'पैसे वापस पाने के लिए पहले 2 घंटे के भीतर तुरंत 1930 पर कार्रवाई करें।'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="px-6 py-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Checklist Progress:</span>
            <span className="font-bold text-orange-400">
              {completedCount} of {steps.length} completed
            </span>
          </div>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Direct 1930 Emergency Dial Action Card */}
          <div className="p-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2 py-0.5 rounded">
                National Cyber Crime Helpline
              </span>
              <p className="text-xl font-black">Dial 1930 Immediately</p>
              <p className="text-xs text-white/90">
                Toll-free 24x7 service run by Ministry of Home Affairs (I4C).
              </p>
            </div>
            <a
              href="tel:1930"
              className="py-3 px-6 bg-white hover:bg-orange-50 active:scale-95 text-red-700 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 1930 Now</span>
            </a>
          </div>

          {/* Quick Helper for Filling Details to Tell the 1930 Operator */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                <span>Quick Transaction Info for 1930 Operator</span>
              </h4>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Info</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Your Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. SBI, HDFC, PNB"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Debited Amount (₹)</label>
                <input
                  type="text"
                  placeholder="e.g. 25,000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">12-digit UTR / Ref No.</label>
                <input
                  type="text"
                  placeholder="e.g. 408221987410"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Step-by-Step Interactive Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Action Steps Checklist:
            </h4>

            {steps.map((st, idx) => {
              const isDone = Boolean(completedSteps[idx]);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-700/50'
                      : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-600 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-bold ${
                          isDone ? 'text-emerald-300 line-through' : 'text-white'
                        }`}
                      >
                        {st.title[language] || st.title.en}
                      </p>
                      {st.actionText && (
                        <a
                          href={st.actionHref}
                          target={st.actionHref.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all"
                        >
                          <span>{st.actionText}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {st.desc[language] || st.desc.en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Remember: Never share OTPs or download screen-sharing APKs.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
