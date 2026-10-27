import React, { useState, useRef, useMemo } from 'react';
import {
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Search,
  Sparkles,
  Link as LinkIcon,
  CreditCard,
  FileWarning,
} from 'lucide-react';
import Tesseract from 'tesseract.js';
import { Language } from '../types/index.ts';
import { translations, sampleScenarios } from '../lib/translations.ts';
import { extractEntities } from '../lib/rulesEngine.ts';

interface ScannerProps {
  language: Language;
  inputText: string;
  setInputText: (text: string) => void;
  onScan: () => void;
  isLoading: boolean;
  onClear: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  language,
  inputText,
  setInputText,
  onScan,
  isLoading,
  onClear,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const [ocrStatusText, setOcrStatusText] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live client-side entity extraction for real-time visual feedback
  const detectedPills = useMemo(() => {
    if (!inputText || inputText.length < 5) return [];
    return extractEntities(inputText);
  }, [inputText]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      setOcrProgress(10);
      setOcrStatusText(t.ocrProcessing);

      const result = await Tesseract.recognize(file, 'eng+hin', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            setOcrProgress(pct);
          }
        },
      });

      const extracted = result?.data?.text?.trim() || '';
      if (extracted) {
        setInputText(extracted);
        setOcrStatusText(
          '✓ ' +
            (language === 'en'
              ? 'Text extracted successfully!'
              : language === 'hi'
              ? 'टेक्स्ट सफलतापूर्वक निकाला गया!'
              : 'मजकूर यशस्वीरित्या काढला गेला!')
        );
      } else {
        setOcrStatusText(
          language === 'en'
            ? 'No clear text detected in image.'
            : language === 'hi'
            ? 'चित्र से कोई स्पष्ट टेक्स्ट नहीं मिला।'
            : 'फोटोमधून मजकूर सापडला नाही.'
        );
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
      setOcrStatusText(
        language === 'en'
          ? 'OCR Error: Please paste or type text directly.'
          : language === 'hi'
          ? 'OCR त्रुटि: कृपया संदेश टाइप या पेस्ट करें।'
          : 'OCR त्रुटी: कृपया मेसेज टाईप करा.'
      );
    } finally {
      setTimeout(() => {
        setOcrProgress(null);
      }, 1500);
    }
  };

  const handleLoadScenario = (scenarioText: string) => {
    setInputText(scenarioText);
    setImagePreview(null);
    setOcrStatusText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all duration-200 overflow-hidden">
      {/* Input Mode Selector */}
      <div className="flex border-b border-slate-200 bg-slate-50/70">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'border-orange-600 text-orange-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.tabPaste}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'image'
              ? 'border-orange-600 text-orange-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{t.tabScreenshot}</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Tab 1: Text Paste */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <div className="relative group">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                placeholder={t.pastePlaceholder}
                className="w-full p-3.5 text-sm sm:text-base text-slate-900 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-y leading-relaxed"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={onClear}
                  className="absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1 shadow-xs transition-colors cursor-pointer"
                >
                  {t.clear}
                </button>
              )}
            </div>

            {/* Live Detected Identifiers Preview */}
            {detectedPills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500">
                  {language === 'en' ? 'Live Detected:' : 'पहचाने गए:'}
                </span>
                {detectedPills.map((pill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {pill.type === 'url' ? (
                      <LinkIcon className="w-3 h-3 text-blue-600" />
                    ) : pill.type === 'upi' ? (
                      <CreditCard className="w-3 h-3 text-orange-600" />
                    ) : (
                      <FileWarning className="w-3 h-3 text-red-600" />
                    )}
                    <span className="truncate max-w-[140px]">{pill.value}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{inputText.length} characters</span>
              <span className="hidden sm:inline">{t.offlineReadyNotice}</span>
            </div>
          </div>
        )}

        {/* Tab 2: Screenshot Upload (Tesseract OCR) */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-slate-50/60 hover:bg-orange-50/20 transition-all duration-200"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-orange-600 mx-auto mb-2 transition-transform group-hover:scale-110" />
              <p className="text-sm font-bold text-slate-800">
                {language === 'en'
                  ? 'Click to upload WhatsApp / SMS screenshot'
                  : language === 'hi'
                  ? 'स्क्रीनशॉट यहाँ क्लिक करके अपलोड करें'
                  : 'स्क्रीनशॉट येथे क्लिक करून अपलोड करा'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, WebP — {language === 'en' ? 'processed privately on-device' : 'फोन पर ही प्रोसेस होता है'}
              </p>
            </div>

            {/* OCR Progress */}
            {ocrProgress !== null && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-orange-800">
                  <span>{t.ocrProcessing}</span>
                  <span className="tabular-nums">{ocrProgress}%</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
              </div>
            )}

            {ocrStatusText && ocrProgress === null && (
              <p className="text-xs font-medium text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                {ocrStatusText}
              </p>
            )}

            {imagePreview && (
              <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-lg border border-slate-200">
                <img
                  src={imagePreview}
                  alt="Screenshot preview"
                  className="w-16 h-16 object-cover rounded-md border border-slate-300"
                />
                <div className="text-xs text-slate-600 flex-1 truncate">
                  <p className="font-semibold text-slate-800">
                    {language === 'en' ? 'Screenshot Loaded' : 'चित्र लोड हुआ'}
                  </p>
                  <p className="truncate text-slate-500">
                    {language === 'en' ? 'Extracted text is ready below.' : 'टेक्स्ट नीचे लोड हो गया है।'}
                  </p>
                </div>
              </div>
            )}

            {inputText && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'en' ? 'Extracted Text:' : 'निकाला गया टेक्स्ट:'}
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={4}
                  className="w-full p-3 text-xs sm:text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Quick Test Scenarios with Hover Animations */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-600">
            {t.quickExamplesLabel}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sampleScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => handleLoadScenario(scenario.text)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left flex items-center gap-2 active:scale-95 cursor-pointer ${
                  inputText === scenario.text
                    ? 'bg-orange-50 border-orange-400 text-orange-950 font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    scenario.expectedVerdict === 'Scam'
                      ? 'bg-red-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span>{scenario.title[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Scan Button with tactile hover and active scales */}
        <button
          type="button"
          onClick={onScan}
          disabled={isLoading || !inputText.trim()}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-900/10 hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.scanning}</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 text-orange-400" />
              <span>{t.scanButton}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
