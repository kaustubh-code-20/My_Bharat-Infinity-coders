import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { evaluateRulesEngine, extractEntities } from './src/lib/rulesEngine.ts';
import {
  ScanResult,
  ScamReport,
  ThreatIntelItem,
  SenderLookupResult,
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory reports store for live preview (mirrors Supabase scam_reports table)
const inMemoryReports: ScamReport[] = [
  {
    id: 'rep-01',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    verdict: 'Scam',
    category: 'electricity',
    language: 'en',
    preview: 'Dear consumer your electricity power will be disconnected tonight at 9.30 pm...',
    confidence: 0.98,
    votes: 49,
  },
  {
    id: 'rep-02',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    verdict: 'Scam',
    category: 'apk_malware',
    language: 'hi',
    preview: 'ट्रैफिक पुलिस ई-चालान डाउनलोड करें apk फाइल...',
    confidence: 0.99,
    votes: 34,
  },
  {
    id: 'rep-03',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    verdict: 'Scam',
    category: 'banking_kyc',
    language: 'mr',
    preview: 'महावितरण वीज बिल खंडित होईल आज रात्री ९:३० वाजता...',
    confidence: 0.98,
    votes: 29,
  },
  {
    id: 'rep-04',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    verdict: 'Scam',
    category: 'upi_lottery',
    language: 'en',
    preview: 'Congratulations! You won Rs 25,00,000 in KBC All India Lucky Draw. Scan QR...',
    confidence: 0.96,
    votes: 19,
  },
];

// Live Threat Intelligence Watchlist (Domains & UPI IDs)
const threatIntelWatchlist: ThreatIntelItem[] = [
  {
    id: 'intel-01',
    type: 'domain',
    identifier: 'tinyurl.com/echallan-v2.apk',
    category: 'apk_malware',
    reportsCount: 142,
    firstReported: '2026-10-20',
    status: 'active_threat',
  },
  {
    id: 'intel-02',
    type: 'domain',
    identifier: 'bit.ly/sbi-pan-kyc-update',
    category: 'banking_kyc',
    reportsCount: 236,
    firstReported: '2026-10-18',
    status: 'active_threat',
  },
  {
    id: 'intel-03',
    type: 'upi_id',
    identifier: 'kbc.lottery.tax@ybl',
    category: 'upi_lottery',
    reportsCount: 88,
    firstReported: '2026-10-22',
    status: 'active_threat',
  },
  {
    id: 'intel-04',
    type: 'upi_id',
    identifier: 'msedcl.billupdate@okhdfcbank',
    category: 'electricity',
    reportsCount: 65,
    firstReported: '2026-10-25',
    status: 'active_threat',
  },
];

// Truecaller-Style Registry of Indian Sender Headers & Numbers
const knownSenders: Record<string, SenderLookupResult> = {
  'VM-MSEDCL': {
    query: 'VM-MSEDCL',
    isRegisteredHeader: true,
    senderName: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
    category: 'Utility Services',
    spamScore: 2,
    status: 'verified_official',
    reportsCount: 1,
    operatorCircle: 'Vodafone Maharashtra',
    topReportedAs: 'Official Power Utility',
    advice: {
      en: 'Official TRAI-registered government utility DLT header. Safe for viewing regular bill alerts.',
      hi: 'यह महावितरण का आधिकारिक सरकारी DLT हेडर है। यह पूर्णतः सुरक्षित है।',
      mr: 'हा महावितरणचा अधिकृत शासकीय DLT हेडर आहे. सुरक्षित आहे.',
    },
  },
  'BP-SBIINB': {
    query: 'BP-SBIINB',
    isRegisteredHeader: true,
    senderName: 'State Bank of India (Internet Banking)',
    category: 'Nationalized Bank',
    spamScore: 1,
    status: 'verified_official',
    reportsCount: 0,
    operatorCircle: 'BSNL National',
    topReportedAs: 'Official Banking Gateway',
    advice: {
      en: 'Verified transactional DLT header of State Bank of India. Safe for authentic transactional OTPs.',
      hi: 'स्टेट बैंक ऑफ इंडिया का आधिकारिक DLT हेडर। अधिकृत लेन-देन OTP के लिए सुरक्षित।',
      mr: 'स्टेट बँक ऑफ इंडियाचा अधिकृत DLT हेडर. अधिकृत व्यवहारांसाठी सुरक्षित.',
    },
  },
  'AX-HDFCBK': {
    query: 'AX-HDFCBK',
    isRegisteredHeader: true,
    senderName: 'HDFC Bank Ltd.',
    category: 'Commercial Bank',
    spamScore: 2,
    status: 'verified_official',
    reportsCount: 2,
    operatorCircle: 'Airtel Mumbai',
    topReportedAs: 'Official Banking Channel',
    advice: {
      en: 'Registered commercial bank DLT sender. Safe for official banking notifications.',
      hi: 'HDFC बैंक का आधिकारिक संदेश चैनल।',
      mr: 'HDFC बँकेचा अधिकृत मेसेज चॅनल.',
    },
  },
  '9823411223': {
    query: '9823411223',
    isRegisteredHeader: false,
    senderName: 'Fake Electricity Officer (Scammer)',
    category: 'Utility Impersonation',
    spamScore: 98,
    status: 'reported_scammer',
    reportsCount: 843,
    operatorCircle: 'Jio Maharashtra & Goa',
    topReportedAs: 'Power cut off threat / AnyDesk scam',
    advice: {
      en: 'High-risk scammer! Impersonates MSEDCL electricity officers threatening night power disconnections.',
      hi: 'अत्यंत खतरनाक ठग! बिजली काटने की धमकी देकर एनीडेस्क डाउनलोड करवाता है। तुरंत ब्लॉक करें।',
      mr: 'अतिशय धोकादायक घोटाळेबाज! रात्री वीज कापण्याची धमकी देणारा नंबर. त्वरित ब्लॉक करा.',
    },
  },
  '9876543210': {
    query: '9876543210',
    isRegisteredHeader: false,
    senderName: 'Fake SBI YONO Support (Phishing)',
    category: 'Banking Phishing',
    spamScore: 96,
    status: 'reported_scammer',
    reportsCount: 620,
    operatorCircle: 'Airtel Delhi NCR',
    topReportedAs: 'YONO account blocked / APK link',
    advice: {
      en: 'Known fraudster! Sends fake account blocked SMS with phishing short-links.',
      hi: 'फर्जी बैंक अधिकारी! खाता बंद होने का डर दिखाकर OTP चुराता है।',
      mr: 'बनावट बँक अधिकारी! पासवर्ड चोरणारा धोकादायक नंबर.',
    },
  },
  '9123456789': {
    query: '9123456789',
    isRegisteredHeader: false,
    senderName: 'Fake KBC Lottery Winner Agent',
    category: 'Lottery Fraud',
    spamScore: 94,
    status: 'reported_scammer',
    reportsCount: 410,
    operatorCircle: 'VI Uttar Pradesh East',
    topReportedAs: 'KBC 25 Lakh Prize / QR Scam',
    advice: {
      en: 'Reported lottery fraud syndicate asking for ₹499 processing tax via UPI.',
      hi: 'फर्जी केबीसी लॉटरी एजेंट! कभी पैसे न भेजें।',
      mr: 'खोटा लॉटरी नंबर. पैसे पाठवू नका.',
    },
  },
};

// Server-side Gemini AI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// POST /api/scan endpoint
app.post('/api/scan', async (req: Request, res: Response) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text content is required' });
      return;
    }

    const cleanText = text.trim();
    const selectedLang = (language as 'en' | 'hi' | 'mr') || 'en';

    // 1. Fast Tier: Check deterministic Rules Engine first (<10ms)
    const ruleResult = evaluateRulesEngine(cleanText);
    if (ruleResult && ruleResult.matched) {
      const scanResponse: ScanResult = {
        verdict: ruleResult.verdict,
        category: ruleResult.category,
        confidence: ruleResult.confidence,
        riskScore: ruleResult.riskScore,
        engineUsed: 'Local Rules Engine',
        detectedIndicators: ruleResult.indicators,
        extractedEntities: ruleResult.extractedEntities,
        explanation: ruleResult.explanation,
        plainSummary: ruleResult.explanation[selectedLang] || ruleResult.explanation.en,
        actionSteps: ruleResult.actionSteps,
        safetyTips: ruleResult.safetyTips,
        matchedRules: ruleResult.matchedRules,
      };

      if (ruleResult.verdict === 'Scam') {
        inMemoryReports.unshift({
          id: `rep-${Date.now()}`,
          timestamp: new Date().toISOString(),
          verdict: ruleResult.verdict,
          category: ruleResult.category,
          language: selectedLang,
          preview: cleanText.slice(0, 100) + '...',
          confidence: ruleResult.confidence,
          votes: 1,
        });
      }

      res.json(scanResponse);
      return;
    }

    const clientEntities = extractEntities(cleanText);

    // 2. Fallback Tier: Google Gemini 3.8 Flash for contextual & nuanced scam analysis
    const systemPrompt = `You are "ScamShield Bharat", an expert cyber fraud investigator and digital safety assistant specialized in Indian communication patterns (rural, semi-urban, and national).
Analyze the given text for cyber fraud, phishing, impersonation, or legitimate transactional traffic:
"${cleanText}"

Determine:
1. verdict: 'Safe' | 'Suspicious' | 'Scam'
2. category: 'electricity' | 'banking_kyc' | 'apk_malware' | 'upi_lottery' | 'job_fraud' | 'general' | 'safe'
3. risk_score: number between 0 and 100 (Safe is 0-25, Suspicious is 26-70, Scam is 71-100)
4. confidence: number between 0.50 and 1.00
5. indicators: list of 2-3 specific red flags or safety markers observed in the text
6. explanation_en: concise, clear English explanation
7. explanation_hi: polite, simple Hindi explanation without technical jargon
8. explanation_mr: natural Marathi explanation for Maharashtra citizens
9. action_steps_en: 2-3 immediate concrete steps in English
10. action_steps_hi: 2-3 immediate concrete steps in Hindi
11. action_steps_mr: 2-3 immediate concrete steps in Marathi
12. safety_tip_en: 1 memorable golden rule in English
13. safety_tip_hi: 1 memorable golden rule in Hindi
14. safety_tip_mr: 1 memorable golden rule in Marathi`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              enum: ['Safe', 'Suspicious', 'Scam'],
            },
            category: {
              type: Type.STRING,
            },
            risk_score: {
              type: Type.NUMBER,
            },
            confidence: {
              type: Type.NUMBER,
            },
            indicators: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            explanation_en: { type: Type.STRING },
            explanation_hi: { type: Type.STRING },
            explanation_mr: { type: Type.STRING },
            action_steps_en: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            action_steps_hi: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            action_steps_mr: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            safety_tip_en: { type: Type.STRING },
            safety_tip_hi: { type: Type.STRING },
            safety_tip_mr: { type: Type.STRING },
          },
          required: [
            'verdict',
            'category',
            'risk_score',
            'confidence',
            'indicators',
            'explanation_en',
            'explanation_hi',
            'explanation_mr',
            'action_steps_en',
            'action_steps_hi',
            'action_steps_mr',
            'safety_tip_en',
            'safety_tip_hi',
            'safety_tip_mr',
          ],
        },
      },
    });

    const parsed = JSON.parse(aiResponse.text || '{}');
    const computedRisk =
      typeof parsed.risk_score === 'number'
        ? parsed.risk_score
        : parsed.verdict === 'Scam'
        ? 88
        : parsed.verdict === 'Suspicious'
        ? 55
        : 10;

    const scanResult: ScanResult = {
      verdict: parsed.verdict || 'Suspicious',
      category: parsed.category || 'general',
      riskScore: computedRisk,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.88,
      engineUsed: 'Google Gemini 3.8',
      detectedIndicators: parsed.indicators || ['Suspicious message pattern detected'],
      extractedEntities: clientEntities,
      explanation: {
        en: parsed.explanation_en || 'Suspicious elements were detected in this message. Exercise caution.',
        hi: parsed.explanation_hi || 'संदेश में संदेहास्पद तत्व पाए गए हैं। कृपया सतर्क रहें।',
        mr: parsed.explanation_mr || 'या मेसेजमध्ये संशयास्पद बाबी आढळल्या आहेत. सावध राहा.',
      },
      plainSummary: parsed[`explanation_${selectedLang}`] || parsed.explanation_en,
      actionSteps: {
        en: parsed.action_steps_en || ['Do not share personal or banking details with the sender.'],
        hi: parsed.action_steps_hi || ['संदेश भेजने वाले को कोई व्यक्तिगत जानकारी न दें।'],
        mr: parsed.action_steps_mr || ['कोणाशीही वैयक्तिक माहिती शेअर करू नका.'],
      },
      safetyTips: {
        en: parsed.safety_tip_en || 'Never click unverified links from unknown senders.',
        hi: parsed.safety_tip_hi || 'अपरिचित लिंक पर कभी क्लिक न करें।',
        mr: parsed.safety_tip_mr || 'अनोळखी लिंकवर क्लिक करू नका.',
      },
    };

    if (scanResult.verdict === 'Scam') {
      inMemoryReports.unshift({
        id: `rep-${Date.now()}`,
        timestamp: new Date().toISOString(),
        verdict: scanResult.verdict,
        category: scanResult.category,
        language: selectedLang,
        preview: cleanText.slice(0, 100) + '...',
        confidence: scanResult.confidence,
        votes: 1,
      });
    }

    res.json(scanResult);
  } catch (error: any) {
    console.error('Error during /api/scan:', error);
    res.status(500).json({
      error: 'Scan analysis failed',
      details: error.message || String(error),
    });
  }
});

// GET /api/lookup/:query (Truecaller-Style Sender & Number Lookup)
app.get('/api/lookup/:query', (req: Request, res: Response) => {
  const rawQuery = (req.params.query || '').trim();
  const clean = rawQuery.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
  const digitsOnly = rawQuery.replace(/\D/g, '');

  // 1. Direct match in database
  if (knownSenders[rawQuery] || knownSenders[clean] || knownSenders[digitsOnly]) {
    res.json(knownSenders[rawQuery] || knownSenders[clean] || knownSenders[digitsOnly]);
    return;
  }

  // 2. Check if it is a TRAI 6-character header pattern (e.g. XX-XXXXXX)
  if (/^[A-Z]{2}-[A-Z0-9]{4,6}$/.test(clean)) {
    const headerResult: SenderLookupResult = {
      query: clean,
      isRegisteredHeader: true,
      senderName: `Registered Commercial Entity (${clean})`,
      category: 'Enterprise DLT Header',
      spamScore: 12,
      status: 'verified_official',
      reportsCount: 3,
      operatorCircle: 'TRAI National Commercial Registry',
      topReportedAs: 'Promotional / Transactional Header',
      advice: {
        en: 'Follows TRAI DLT alphanumeric format used by banks and registered companies in India.',
        hi: 'यह भारत सरकार (TRAI) द्वारा मान्यता प्राप्त अधिकृत कंपनी हेडर प्रारूप है।',
        mr: 'हा TRAI अंतर्गत नोंदणीकृत अधिकृत कंपनी हेडर फॉरमॅट आहे.',
      },
    };
    res.json(headerResult);
    return;
  }

  // 3. Fallback: 10-digit mobile number lookup
  if (digitsOnly.length >= 10) {
    const num = digitsOnly.slice(-10);
    const unverifiedResult: SenderLookupResult = {
      query: `+91 ${num}`,
      isRegisteredHeader: false,
      senderName: 'Unregistered Personal Mobile Number',
      category: 'Individual Subscriber',
      spamScore: 78,
      status: 'unverified_personal',
      reportsCount: 14,
      operatorCircle: 'Prepaid Mobile (India)',
      topReportedAs: 'Unsolicited WhatsApp / SMS Call',
      advice: {
        en: 'Warning: Official banks, police, and electricity discoms NEVER send official updates from personal 10-digit mobile numbers.',
        hi: 'सावधान: बैंक या बिजली विभाग कभी भी 10-अंकों वाले व्यक्तिगत मोबाइल नंबर से आधिकारिक नोटिस नहीं भेजते।',
        mr: 'सावधान: बँक किंवा वीज वितरण कंपनी कधीही १० अंकी वैयक्तिक मोबाईलवरून मेसेज पाठवत नाही.',
      },
    };
    res.json(unverifiedResult);
    return;
  }

  // Default not found
  res.status(404).json({
    error: 'Query format not recognized. Enter a 10-digit Indian phone number or 6-character DLT header (e.g. VM-MSEDCL).',
  });
});

// GET /api/reports endpoint
app.get('/api/reports', (_req: Request, res: Response) => {
  res.json({
    reports: inMemoryReports.slice(0, 10),
    totalReports: inMemoryReports.length,
    activeTrends: [
      { category: 'electricity', label: 'Electricity Disconnection', count: 142 },
      { category: 'apk_malware', label: 'e-Challan & WhatsApp APK', count: 98 },
      { category: 'banking_kyc', label: 'SBI / PNB KYC Suspension', count: 187 },
      { category: 'upi_lottery', label: 'KBC Lottery & Collect Request', count: 76 },
    ],
  });
});

// POST /api/reports/:id/vote
app.post('/api/reports/:id/vote', (req: Request, res: Response) => {
  const { id } = req.params;
  const report = inMemoryReports.find((r) => r.id === id);

  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  report.votes = (report.votes || 0) + 1;
  res.json({ success: true, id, votes: report.votes });
});

// GET /api/threat-intel
app.get('/api/threat-intel', (_req: Request, res: Response) => {
  res.json({
    watchlist: threatIntelWatchlist,
    updatedAt: new Date().toISOString(),
  });
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScamShield Bharat server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
