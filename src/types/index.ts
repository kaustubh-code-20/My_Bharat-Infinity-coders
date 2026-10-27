export type Language = 'en' | 'hi' | 'mr';

export type Verdict = 'Safe' | 'Suspicious' | 'Scam';

export interface ExtractedEntity {
  type: 'url' | 'upi' | 'phone' | 'apk';
  value: string;
  threatLevel: 'safe' | 'suspicious' | 'dangerous';
  reason?: string;
}

export interface ScanResult {
  verdict: Verdict;
  category: 'electricity' | 'banking_kyc' | 'apk_malware' | 'upi_lottery' | 'job_fraud' | 'general' | 'safe';
  riskScore: number; // 0 to 100
  confidence: number; // 0 to 1
  engineUsed: 'Local Rules Engine' | 'Google Gemini 3.8';
  detectedIndicators: string[];
  extractedEntities?: ExtractedEntity[];
  explanation: {
    en: string;
    hi: string;
    mr: string;
  };
  plainSummary: string;
  actionSteps: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  safetyTips: {
    en: string;
    hi: string;
    mr: string;
  };
  matchedRules?: string[];
}

export interface ScamReport {
  id: string;
  timestamp: string;
  verdict: Verdict;
  category: string;
  language: Language;
  preview: string;
  confidence: number;
  votes: number;
  userVoted?: boolean;
}

export interface ThreatIntelItem {
  id: string;
  type: 'domain' | 'upi_id' | 'apk';
  identifier: string;
  category: string;
  reportsCount: number;
  firstReported: string;
  status: 'active_threat' | 'blocked';
}

export interface SenderLookupResult {
  query: string;
  isRegisteredHeader: boolean;
  senderName: string;
  category: string;
  spamScore: number; // 0 (clean) to 100 (critical scam)
  status: 'verified_official' | 'reported_scammer' | 'unverified_personal' | 'safe_contact';
  reportsCount: number;
  operatorCircle?: string;
  topReportedAs?: string;
  advice: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface IncomingMessage {
  id: string;
  sender: string;
  senderHeader: string;
  channel: 'sms' | 'whatsapp';
  text: string;
  timestamp: string;
  scannedResult?: ScanResult;
  isBlocked?: boolean;
}
