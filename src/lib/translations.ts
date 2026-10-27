import { Language } from '../types/index.ts';

export interface UIStrings {
  appTitle: string;
  tagline: string;
  badgeBharat: string;
  tabPaste: string;
  tabScreenshot: string;
  pastePlaceholder: string;
  scanButton: string;
  scanning: string;
  ocrProcessing: string;
  quickExamplesLabel: string;
  verdictSafe: string;
  verdictSuspicious: string;
  verdictScam: string;
  listenVerdict: string;
  stopListening: string;
  reportHelpline: string;
  reportHelplineSubtitle: string;
  whyDangerous: string;
  actionTitle: string;
  safetyTipTitle: string;
  engineUsedLabel: string;
  confidenceLabel: string;
  clear: string;
  nationalHelpline: string;
  awarenessTitle: string;
  awarenessSubtitle: string;
  viewCodeExport: string;
  offlineReadyNotice: string;
}

export const translations: Record<Language, UIStrings> = {
  hi: {
    appTitle: 'स्कैमशील्ड भारत',
    tagline: 'भारत के छोटे शहरों और ग्रामीण क्षेत्रों के लिए डिजिटल सुरक्षा कवच',
    badgeBharat: 'टियर ३ और ४ भारत के लिए विशेष',
    tabPaste: 'संदेश / लिंक पेस्ट करें',
    tabScreenshot: 'स्क्रीनशॉट अपलोड (OCR)',
    pastePlaceholder: 'यहाँ संदेहास्पद SMS, व्हाट्सएप फॉरवर्ड या लिंक पेस्ट करें (उदा. "बिजली बिल नहीं भरा तो आज रात 9:30 बजे बिजली काट दी जाएगी...")',
    scanButton: 'जाँचें (Check Scam)',
    scanning: 'जाँच की जा रही है...',
    ocrProcessing: 'चित्र से टेक्स्ट निकाला जा रहा है (Tesseract OCR)...',
    quickExamplesLabel: 'जाँचने के लिए उदाहरण चुनें:',
    verdictSafe: 'सुरक्षित (Safe)',
    verdictSuspicious: 'संदिग्ध (Suspicious)',
    verdictScam: 'धोखाधड़ी (Likely Scam)',
    listenVerdict: 'आवाज़ में सुनें (Listen)',
    stopListening: 'आवाज़ रोकें (Stop)',
    reportHelpline: '1930 पर तुरंत रिपोर्ट करें',
    reportHelplineSubtitle: 'राष्ट्रीय साइबर अपराध हेल्पलाइन (भारत सरकार)',
    whyDangerous: 'यह खतरनाक क्यों है?',
    actionTitle: 'तुरंत क्या करें:',
    safetyTipTitle: 'भारत सुरक्षा नियम:',
    engineUsedLabel: 'जाँच माध्यम:',
    confidenceLabel: 'सटीकता दर:',
    clear: 'साफ़ करें',
    nationalHelpline: 'हेल्पलाइन 1930',
    awarenessTitle: 'भारत में सबसे अधिक होने वाले ४ साइबर फ्रॉड',
    awarenessSubtitle: 'जानें और अपने परिवार को जागरूक रखें',
    viewCodeExport: 'हैकथॉन कोड और Supabase SQL देखें',
    offlineReadyNotice: 'तेज़ और कम इंटरनेट (2G/3G) पर भी पूरी तरह कार्यक्षम',
  },
  mr: {
    appTitle: 'स्कॅमशील्ड भारत',
    tagline: 'ग्रामीण व निमशहरी महाराष्ट्रासाठी डिजिटल सुरक्षा कवच',
    badgeBharat: 'टियर ३ आणि ४ भारतासाठी',
    tabPaste: 'मेसेज / लिंक पेस्ट करा',
    tabScreenshot: 'स्क्रीनशॉट अपलोड करा (OCR)',
    pastePlaceholder: 'येथे संशयास्पद SMS, व्हॉट्सॲप मेसेज किंवा लिंक पेस्ट करा (उदा. "महावितरण वीज बिल अपडेट नाही, आज रात्री वीज पुरवठा खंडित होईल...")',
    scanButton: 'तपासा (Check Scam)',
    scanning: 'तपासणी सुरू आहे...',
    ocrProcessing: 'फोटोमधून मजकूर काढत आहे (Tesseract OCR)...',
    quickExamplesLabel: 'चाचणीसाठी नमुना मेसेज निवडा:',
    verdictSafe: 'सुरक्षित (Safe)',
    verdictSuspicious: 'संशयास्पद (Suspicious)',
    verdictScam: 'घोटाळा (Likely Scam)',
    listenVerdict: 'आवाजात ऐका (Listen)',
    stopListening: 'आवाज थांबवा (Stop)',
    reportHelpline: '१९३० वर त्वरित तक्रार नोंदवा',
    reportHelplineSubtitle: 'राष्ट्रीय सायबर हेल्पलाईन (भारत सरकार)',
    whyDangerous: 'हा मेसेज धोकादायक का आहे?',
    actionTitle: 'त्वरित काय करावे:',
    safetyTipTitle: 'सुरक्षेचा नियम:',
    engineUsedLabel: 'तपासणी पद्धत:',
    confidenceLabel: 'विश्वासार्हता:',
    clear: 'साफ करा',
    nationalHelpline: 'सायबर हेल्पलाइन १९३०',
    awarenessTitle: 'महाराष्ट्रात सर्वाधिक होणारे ४ सायबर घोटाळे',
    awarenessSubtitle: 'स्वतः सावध राहा आणि कुटुंबाला सुरक्षित ठेवा',
    viewCodeExport: 'हॅकथॉन कोड व Supabase SQL पहा',
    offlineReadyNotice: 'कमी इंटरनेट (2G/3G) वरही त्वरित कार्यक्षम',
  },
  en: {
    appTitle: 'ScamShield Bharat',
    tagline: 'Vernacular Scam Checker for Tier 3 & 4 Bharat',
    badgeBharat: 'Built for Tier 3 & 4 India',
    tabPaste: 'Paste Text / Link',
    tabScreenshot: 'Upload Screenshot (OCR)',
    pastePlaceholder: 'Paste suspicious SMS, WhatsApp message, or link here (e.g. "Dear consumer your electricity power will be disconnected tonight...")',
    scanButton: 'Check Message (Scan)',
    scanning: 'Scanning message...',
    ocrProcessing: 'Extracting text via on-device Tesseract OCR...',
    quickExamplesLabel: 'Try Quick Test Scenarios:',
    verdictSafe: 'Safe Message',
    verdictSuspicious: 'Suspicious Warning',
    verdictScam: 'Likely Scam Alert',
    listenVerdict: 'Read Aloud (Voice)',
    stopListening: 'Stop Audio',
    reportHelpline: 'Report to 1930 Helpline',
    reportHelplineSubtitle: 'National Cyber Crime Portal (Govt. of India)',
    whyDangerous: 'Why is this dangerous?',
    actionTitle: 'Immediate Steps to Take:',
    safetyTipTitle: 'Bharat Safety Rule:',
    engineUsedLabel: 'Detection Engine:',
    confidenceLabel: 'Confidence Score:',
    clear: 'Clear',
    nationalHelpline: 'Cyber Helpline 1930',
    awarenessTitle: 'Top 4 Active Cyber Frauds in India',
    awarenessSubtitle: 'Empower yourself and your community with cyber literacy',
    viewCodeExport: 'View Hackathon Code & Supabase SQL',
    offlineReadyNotice: 'Ultra-lightweight and optimized for low-bandwidth 2G/3G networks',
  },
};

export interface SampleScenario {
  id: string;
  title: Record<Language, string>;
  category: string;
  expectedVerdict: 'Scam' | 'Safe' | 'Suspicious';
  text: string;
}

export const sampleScenarios: SampleScenario[] = [
  {
    id: 'sample-electricity',
    title: {
      hi: 'बिजली बिल कटने की धमकी',
      mr: 'महावितरण वीज बिल घोटाळा',
      en: 'Electricity Disconnection Threat',
    },
    category: 'electricity',
    expectedVerdict: 'Scam',
    text: 'Dear consumer your electricity power will be disconnected tonight at 9.30 pm from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer Rahul Sharma at 9823411223. Thank you MSEDCL.',
  },
  {
    id: 'sample-apk',
    title: {
      hi: 'फर्जी ई-चालान APK लिंक',
      mr: 'बनावट ई-चलन APK लिंक',
      en: 'Malicious e-Challan APK Link',
    },
    category: 'apk_malware',
    expectedVerdict: 'Scam',
    text: 'Traffic Police Alert: Your vehicle MH12AB1234 has pending fine of Rs 1500. Download and install government e-challan app to view photos and avoid court summons: http://tinyurl.com/echallan-v2.apk',
  },
  {
    id: 'sample-kyc',
    title: {
      hi: 'एसबीआई बैंक खाता ब्लॉक SMS',
      mr: 'बँक खाते ब्लॉक व KYC धमकी',
      en: 'SBI Bank Account Blocked / KYC',
    },
    category: 'banking_kyc',
    expectedVerdict: 'Scam',
    text: 'Dear SBI Customer, Your YONO account has been suspended today due to KYC expired. Please click here http://bit.ly/sbi-pan-kyc-update to update your PAN Card immediately within 24 hours to avoid permanent deactivation.',
  },
  {
    id: 'sample-upi',
    title: {
      hi: 'KBC 25 लाख लॉटरी व QR कोड',
      mr: 'केबीसी लॉटरी व QR कोड फसवणूक',
      en: 'KBC Lottery & UPI QR Prize',
    },
    category: 'upi_lottery',
    expectedVerdict: 'Scam',
    text: 'Congratulations! You won Rs 25,00,000 in KBC All India Lucky Draw. Scan this QR code or accept PhonePe collect request of Rs 499 processing tax to receive prize money directly into your bank.',
  },
  {
    id: 'sample-safe',
    title: {
      hi: 'वैध बैंक OTP संदेश',
      mr: 'सुरक्षित बँक OTP मेसेज',
      en: 'Legitimate Bank Transaction OTP',
    },
    category: 'safe',
    expectedVerdict: 'Safe',
    text: '749281 is your Secret OTP for online purchase of Rs 420.00 at IRCTC with SBI Card ending in 4102. Valid for 10 mins. Do not share OTP with anyone including bank staff.',
  },
];
