import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../types/index.ts';

interface LoadingScreenProps {
  onComplete: () => void;
  language: Language;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, language }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const steps = [
    {
      title: {
        en: 'Initializing Bharat Threat Intelligence Engine...',
        hi: 'भारत साइबर थ्रेट इंटेलिजेंस इंजन शुरू हो रहा है...',
        mr: 'भारत सायबर धोका गुप्तचर प्रणाली सुरू होत आहे...',
      },
      icon: Cpu,
    },
    {
      title: {
        en: 'Syncing TRAI DLT Headers & Telecom Sender DB...',
        hi: 'TRAI DLT आधिकारिक हेडर व टेलीकॉम डेटाबेस लिंक हो रहा है...',
        mr: 'TRAI DLT अधिकृत हेडर व टेलिकॉम डेटाबेस सिंक होत आहे...',
      },
      icon: ShieldCheck,
    },
    {
      title: {
        en: 'Activating Multilingual AI Models (Hindi, Marathi, English)...',
        hi: 'बहुभाषी AI स्कैम डिटेक्शन मॉडल सक्रिय हो रहे हैं...',
        mr: 'बहुभाषिक AI फसवणूक प्रतिबंधक मॉडेल सक्रिय होत आहेत...',
      },
      icon: Sparkles,
    },
    {
      title: {
        en: 'Connecting to National Cyber Helpline 1930 Gateway...',
        hi: 'राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 गेटवे कनेक्ट हो रहा है...',
        mr: 'राष्ट्रीय सायबर गुन्हे हेल्पलाइन १९३० गेटवे जोडले जात आहे...',
      },
      icon: ShieldAlert,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Smoothly accelerate towards 100%
        const increment = prev < 40 ? 5 : prev < 75 ? 8 : 12;
        return Math.min(100, prev + increment);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 25) {
      setCurrentStep(0);
    } else if (progress < 55) {
      setCurrentStep(1);
    } else if (progress < 85) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }

    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(onComplete, 600);
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white transition-all duration-700 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="ScamShield Loading Screen"
    >
      {/* Background Cyber Grid & Glow Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex flex-col items-center text-center space-y-7">
        {/* Animated Cyber Shield Core */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Radar Rings */}
          <div className="absolute w-28 h-28 rounded-full border border-orange-500/30 animate-ping opacity-40 pointer-events-none" />
          <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-orange-500/40 animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-orange-600/20 to-amber-500/10 blur-md" />

          {/* Core Shield Emblem */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-[0_0_35px_rgba(234,88,12,0.5)] border border-orange-400/40 transition-transform duration-300">
            <ShieldCheck className="w-9 h-9 text-white drop-shadow-md animate-pulse" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-800/80 text-[11px] font-bold text-orange-400 uppercase tracking-widest shadow-inner">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            <span>National Cyber Protection · भारत</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ScamShield <span className="text-orange-500">Bharat</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            स्कैमशील्ड भारत · Real-Time Fraud & Truecaller Interception
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-orange-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span>Initializing System</span>
            </span>
            <span className="font-mono tabular-nums text-slate-200 text-sm font-bold">
              {progress}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full border border-slate-800 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(249,115,22,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Diagnostics Step Checklist */}
        <div className="w-full bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2.5 backdrop-blur-md shadow-xl">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep || progress === 100;
            const isCurrent = idx === currentStep && progress < 100;
            const StepIcon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'text-emerald-400'
                    : isCurrent
                    ? 'text-orange-300 font-bold translate-x-1'
                    : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    isCompleted
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-400'
                      : isCurrent
                      ? 'bg-orange-950 border border-orange-500 text-orange-400 animate-pulse'
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <StepIcon className="w-3 h-3" />
                  )}
                </div>
                <span className="truncate">
                  {step.title[language] || step.title.en}
                </span>
              </div>
            );
          })}
        </div>

        {/* Skip / Enter Button for Instant Accessibility */}
        <div className="flex items-center justify-between w-full pt-1">
          <span className="text-[11px] text-slate-500 font-mono">
            National Helpline: 1930 Active
          </span>

          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-800 transition-all cursor-pointer group active:scale-95"
          >
            <span>Skip intro</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-orange-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
