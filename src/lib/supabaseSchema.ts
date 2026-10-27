export const SUPABASE_SQL_SCHEMA = `-- ScamShield Bharat: Supabase PostgreSQL Schema
-- Hackathon Submission: Anonymous Scam Reporting, Trend Analytics & Crowdsourced Voting with RLS

-- 1. Create custom enum type for scam verdicts
create type scam_verdict as enum ('Safe', 'Suspicious', 'Scam');

-- 2. Create the scam_reports table
create table if not exists public.scam_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  verdict scam_verdict not null,
  category text not null, -- 'electricity', 'banking_kyc', 'apk_malware', 'upi_lottery', 'general'
  language text default 'en' not null, -- 'en' (English), 'hi' (Hindi), 'mr' (Marathi)
  content_preview text not null, -- Anonymized snippet (first 120 chars, stripped of phone/account digits)
  confidence numeric(4, 2) not null, -- e.g. 0.98
  risk_score smallint default 85 not null, -- 0 to 100
  votes integer default 1 not null, -- Crowdsourced verification count
  engine_used text not null, -- 'Local Rules Engine' | 'Google Gemini 3.8'
  is_verified_fraud boolean default false,
  reporter_state text default 'Bharat'
);

-- 3. Create indices for performance in high-volume query and reporting
create index if not exists idx_scam_reports_created_at on public.scam_reports(created_at desc);
create index if not exists idx_scam_reports_category on public.scam_reports(category);
create index if not exists idx_scam_reports_verdict on public.scam_reports(verdict);
create index if not exists idx_scam_reports_votes on public.scam_reports(votes desc);

-- 4. Enable Row Level Security (RLS)
alter table public.scam_reports enable row level security;

-- 5. RLS Policy: Anyone (including anonymous citizen users) can submit a report
create policy "Allow anonymous scan report submission"
  on public.scam_reports
  for insert
  to anon, authenticated
  with check (true);

-- 6. RLS Policy: Public read-only access to aggregated anonymized scam statistics
create policy "Allow public read-only access to scam stats"
  on public.scam_reports
  for select
  to anon, authenticated
  using (true);

-- 7. RLS Policy: Allow citizens to increment votes for community verification
create policy "Allow public vote upvote"
  on public.scam_reports
  for update
  to anon, authenticated
  using (true)
  with check (true);
`;

export const ENV_LOCAL_TEMPLATE = `# .env.local Template for ScamShield Bharat (Next.js 14)

# 1. Google Gemini API Key (Server-side analysis fallback)
GEMINI_API_KEY="your-gemini-api-key-from-ai-studio"

# 2. Supabase Configuration (Anonymous report logging & analytics)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
`;

export const NEXTJS_API_ROUTE_CODE = `// app/api/scan/route.ts
// Next.js 14 App Router Route Handler for ScamShield Bharat
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

function extractEntities(text: string) {
  const entities: any[] = [];
  const urls = text.match(/(https?:\\/\\/[^\\s]+|bit\\.ly\\/[^\\s]+|tinyurl\\.com\\/[^\\s]+|[a-zA-Z0-9-]+\\.(?:top|xyz|club|apk|ru|link|online)[^\\s]*)/gi) || [];
  urls.forEach((u) => {
    entities.push({ type: 'url', value: u, threatLevel: /\\.(top|xyz|apk|link)/i.test(u) ? 'dangerous' : 'suspicious' });
  });

  const upis = text.match(/([a-zA-Z0-9._-]+@(upi|ybl|axl|ibl|oksbi|okhdfcbank|paytm|apl))/gi) || [];
  upis.forEach((upi) => {
    entities.push({ type: 'upi', value: upi, threatLevel: /(msedcl|electricity|discom|sbi|kyc)/i.test(upi) ? 'dangerous' : 'suspicious' });
  });

  return entities;
}

function evaluateLocalRules(rawText: string) {
  const text = rawText.trim().toLowerCase();
  const entities = extractEntities(rawText);

  // 1. Electricity Bill Cutoff Threat
  if (/(electricity|power|bijli|light bill|msedcl|mahavitaran).*(disconnect|cutoff|tonight|9:30 pm|bill not updated)/i.test(text)) {
    return {
      verdict: 'Scam' as const,
      category: 'electricity',
      confidence: 0.98,
      riskScore: 98,
      engineUsed: 'Local Rules Engine',
      extractedEntities: entities,
      explanation: {
        en: 'This is an Electricity Bill Scam. Power companies never send cutoff threats from personal 10-digit mobile numbers.',
        hi: 'यह 100% बिजली बिल धोखाधड़ी है। कोई भी सरकारी बिजली विभाग कभी व्यक्तिगत मोबाइल नंबर से रात में बिजली काटने की धमकी नहीं देता।',
        mr: 'हा १००% वीज बिल घोटाळा आहे. महावितरण कधीही वैयक्तिक मोबाईल नंबरवरून वीज तोडण्याची धमकी देत नाही.',
      },
      actionSteps: [
        'Do not call the phone number in the SMS',
        'Never install AnyDesk or download any APK',
        'Verify bill status on the official electricity DISCOM portal',
        'Call National Cyber Crime Helpline 1930 immediately',
      ]
    };
  }

  // 2. Untrusted APK Download Link
  if (/(\\.apk|pm-yojana\\.apk|challan\\.apk|sbi-rewards\\.apk)/i.test(text)) {
    return {
      verdict: 'Scam' as const,
      category: 'apk_malware',
      confidence: 0.99,
      riskScore: 99,
      engineUsed: 'Local Rules Engine',
      extractedEntities: entities,
      explanation: {
        en: 'Dangerous Malware Alert! Untrusted .apk files forwarded via SMS/WhatsApp steal banking OTPs.',
        hi: 'अत्यंत खतरनाक! यह संदेश फोन में APK वायरस डाउनलोड करवाकर बैंक OTP चोरी करने का प्रयास है।',
        mr: 'अतिशय धोकादायक! हा मेसेज APK व्हायरस डाऊनलोड करून बँक OTP चोरण्याचा प्रयत्न आहे.',
      },
      actionSteps: [
        'Never install .apk files received over WhatsApp or SMS',
        'Only install banking and utility apps from Google Play Store',
        'If downloaded, switch on Airplane mode and delete the file immediately',
      ]
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { text, language = 'en' } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const ruleMatch = evaluateLocalRules(text);
    if (ruleMatch) {
      return NextResponse.json(ruleMatch);
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: \`Analyze for Indian cyber scams: "\${text}"\`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ['Safe', 'Suspicious', 'Scam'] },
            category: { type: Type.STRING },
            risk_score: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            explanation_en: { type: Type.STRING },
            explanation_hi: { type: Type.STRING },
            explanation_mr: { type: Type.STRING },
            action_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['verdict', 'confidence', 'risk_score', 'explanation_en', 'explanation_hi', 'explanation_mr'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return NextResponse.json({
      verdict: parsed.verdict || 'Suspicious',
      category: parsed.category || 'general',
      riskScore: parsed.risk_score || 75,
      confidence: parsed.confidence || 0.85,
      engineUsed: 'Google Gemini 3.8',
      extractedEntities: extractEntities(text),
      explanation: {
        en: parsed.explanation_en,
        hi: parsed.explanation_hi,
        mr: parsed.explanation_mr,
      },
      actionSteps: parsed.action_steps || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Scan failed' }, { status: 500 });
  }
}
`;

export const FOLDER_STRUCTURE_TREE = `scamshield-bharat/
├── .env.local.example
├── README.md
├── schema.sql                     <-- Supabase schema with RLS & voting
├── next.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── public/
│   ├── manifest.json              <-- PWA Manifest
│   ├── icon-192.svg
│   └── icon-512.svg
└── app/
    ├── layout.tsx                 <-- Root layout with Devanagari fonts & PWA tags
    ├── page.tsx                   <-- Main UI with Threat Meter, OCR & Speech
    ├── globals.css                <-- Tailwind CSS imports
    └── api/
        ├── scan/
        │   └── route.ts           <-- Two-tier engine (Rules + Gemini 3.8)
        └── reports/
            ├── route.ts           <-- Anonymous Supabase logging endpoint
            └── [id]/
                └── vote/
                    └── route.ts   <-- Crowdsourced verification voting API
`;
