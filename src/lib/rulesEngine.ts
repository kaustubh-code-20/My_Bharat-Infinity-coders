import { ScanResult, ExtractedEntity } from '../types/index.ts';

interface RuleMatch {
  matched: boolean;
  verdict: 'Safe' | 'Suspicious' | 'Scam';
  category: ScanResult['category'];
  confidence: number;
  riskScore: number; // 0 to 100
  indicators: string[];
  extractedEntities: ExtractedEntity[];
  matchedRules: string[];
  explanation: {
    en: string;
    hi: string;
    mr: string;
  };
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
}

export function extractEntities(text: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];

  // 1. Extract URLs & Domains
  const urlRegex = /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|is\.gd\/[^\s]+|t\.me\/[^\s]+|[a-zA-Z0-9-]+\.(?:top|xyz|club|apk|ru|link|online|site|live|vip)[^\s]*)/gi;
  const urls = text.match(urlRegex) || [];
  urls.forEach((u) => {
    const isHighRiskTld = /\.(top|xyz|club|apk|ru|link|online|site|vip)/i.test(u);
    const isShortener = /(bit\.ly|tinyurl|is\.gd|ngrok|cutt\.ly)/i.test(u);
    entities.push({
      type: 'url',
      value: u.replace(/[.,;!?)]+$/, ''),
      threatLevel: isHighRiskTld || isShortener ? 'dangerous' : 'suspicious',
      reason: isHighRiskTld
        ? 'High-risk untrusted TLD often used in disposable cyber fraud campaigns'
        : isShortener
        ? 'Obfuscated short link hiding true destination URL'
        : 'External hyperlink detected',
    });
  });

  // 2. Extract UPI IDs / VPAs
  const upiRegex = /([a-zA-Z0-9._-]+@(upi|ybl|axl|ibl|oksbi|okhdfcbank|paytm|apl|barodampay|postbank))/gi;
  const upis = text.match(upiRegex) || [];
  upis.forEach((upi) => {
    const isFakeOfficial = /(msedcl|electricity|discom|sbi|kyc|police|challan|kbc|refund)/i.test(upi);
    entities.push({
      type: 'upi',
      value: upi,
      threatLevel: isFakeOfficial ? 'dangerous' : 'suspicious',
      reason: isFakeOfficial
        ? 'Impersonating official government or banking entity on a private UPI VPA'
        : 'UPI payment identifier detected in message',
    });
  });

  // 3. Extract APK Filenames or Links
  const apkRegex = /([a-zA-Z0-9_-]+\.apk)/gi;
  const apks = text.match(apkRegex) || [];
  apks.forEach((apk) => {
    entities.push({
      type: 'apk',
      value: apk,
      threatLevel: 'dangerous',
      reason: 'Malicious Android package payload capable of intercepting SMS/OTPs',
    });
  });

  // 4. Extract 10-digit Indian mobile numbers
  const phoneRegex = /(?:\+91[-\s]?)?[6-9]\d{9}\b/g;
  const phones = text.match(phoneRegex) || [];
  phones.forEach((p) => {
    if (entities.length < 6) {
      entities.push({
        type: 'phone',
        value: p,
        threatLevel: 'suspicious',
        reason: 'Personal mobile number claiming official utility/banking authority',
      });
    }
  });

  return entities;
}

export function evaluateRulesEngine(rawText: string): RuleMatch | null {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const extractedEntities = extractEntities(text);

  // 1. Electricity / Power Disconnection Scam
  const electricityKeywords = /(electricity|power supply|bijli|bijlee|light bill|power cut|disconnected tonight|bill was not updated|msedcl|mahavitaran|discom|uppcl|dhbvn|sbpdcl|nbpdcl|महावितरण|वीज पुरवठा|खंडित|लाईट बिल|बिजली बिल)/i;
  const disconnectionUrgency = /(disconnected|disconnect|cutoff|cut off|tonight at \d{1,2}|9:30 pm|8:30 pm|immediately|संपर्क करा|बंद करण्यात येईल|काट दी जाएगी)/i;
  const contactPersonalNumber = /(call officer|contact immediately|phone no|call on \+?91|call\s*:\s*\d{10}|\+91\d{10}|\d{10})/i;

  if (electricityKeywords.test(lower) && (disconnectionUrgency.test(lower) || contactPersonalNumber.test(lower))) {
    const indicators: string[] = [
      'Fake urgency: threats of immediate power disconnection tonight',
      'Personal 10-digit mobile number claiming to be electricity officer',
      'Impersonation of state electricity board (MSEDCL / DISCOM)',
    ];

    return {
      matched: true,
      verdict: 'Scam',
      category: 'electricity',
      confidence: 0.98,
      riskScore: 98,
      indicators,
      extractedEntities,
      matchedRules: ['RULE_ELECTRICITY_DISCONNECT_FRAUD_V2'],
      explanation: {
        en: 'This is a verified Electricity Bill Scam. Power companies (like MSEDCL or state DISCOMs) never send disconnection threats with personal 10-digit mobile numbers or demand urgent calls.',
        hi: 'यह 100% बिजली बिल धोखाधड़ी (Scam) है। कोई भी सरकारी बिजली विभाग (जैसे महावितरण/MSEDCL या राज्य DISCOM) कभी भी किसी व्यक्तिगत 10-अंकों वाले मोबाइल नंबर से रात को बिजली काटने का SMS नहीं भेजता।',
        mr: 'हा १००% वीज बिल घोटाळा (Scam) आहे. महावितरण किंवा वीज मंडळ कधीही अशा वैयक्तिक मोबाईल नंबरवरून रात्री वीज खंडित करण्याचा धमकी देणारा SMS पाठवत नाही.',
      },
      actionSteps: {
        en: [
          'DO NOT call the phone number provided in the SMS.',
          'DO NOT click any link or install AnyDesk/QuickSupport/APK.',
          'Verify your bill status directly via the official DISCOM app or electricity counter.',
          'Report immediately to the Cyber Crime Helpline 1930.',
        ],
        hi: [
          'संदेश में दिए गए किसी भी फोन नंबर पर कॉल न करें।',
          'किसी भी लिंक पर क्लिक न करें या कोई ऐप (AnyDesk/TeamViewer/APK) डाउनलोड न करें।',
          'अपना बिजली बिल केवल आधिकारिक महावितरण ऐप या बिजली कार्यालय जाकर ही जांचें।',
          'साइबर हेल्पलाइन 1930 पर तुरंत शिकायत दर्ज कराएं।',
        ],
        mr: [
          'मेसेजमधील कोणत्याही फोन नंबरवर कॉल करू नका.',
          'कोणत्याही अनोळखी लिंकवर क्लिक करू नका किंवा APK ॲप इन्स्टॉल करू नका.',
          'आपले वीज बिल फक्त अधिकृत महावितरण ॲप किंवा वीज केंद्रावर जाऊनच तपासा.',
          'सायबर सेल १८३० / १९३० वर त्वरित तक्रार नोंदवा.',
        ],
      },
      safetyTips: {
        en: 'Official discoms only send SMS via official 6-character sender IDs (e.g. VM-MSEDCL), never personal mobile numbers.',
        hi: 'बिजली विभाग केवल आधिकारिक 6-अक्षर वाले हेडर (जैसे VM-MSEDCL) से आधिकारिक बिल लिंक भेजता है, कभी भी व्यक्तिगत 10 अंकों के नंबर से नहीं।',
        mr: 'महावितरण नेहमी अधिकृत 6-अक्षरी हेडर (उदा. VM-MSEDCL) वापरूनच अधिकृत SMS पाठवते.',
      },
    };
  }

  // 2. Malicious APK Download / Side-loaded Malware
  const apkKeywords = /(\.apk|download app|install apk|pm-yojana\.apk|sbi-rewards\.apk|challan\.apk|e-challan.*link|drive\.google\.com\/.*\.apk|mediafire\.com|whatsapp.*update.*link)/i;
  if (apkKeywords.test(lower)) {
    return {
      matched: true,
      verdict: 'Scam',
      category: 'apk_malware',
      confidence: 0.99,
      riskScore: 99,
      indicators: [
        'Dangerous .apk executable file download link',
        'Attempting to bypass Google Play Store security mechanisms',
        'Trojan malware disguised as bank reward or traffic police e-challan',
      ],
      extractedEntities,
      matchedRules: ['RULE_MALICIOUS_APK_PAYLOAD_V2'],
      explanation: {
        en: 'Extremely dangerous malware! The sender is prompting you to download an untrusted APK file outside Google Play Store. It will steal your SMS OTPs and bank credentials.',
        hi: 'अत्यंत खतरनाक! यह संदेश आपके फोन में खतरनाक APK (मैलवेयर/वायरस) इंस्टॉल कराने का प्रयास कर रहा है। इसे इंस्टॉल करते ही आपके बैंक के OTP और स्क्रीन की जानकारी हैकर्स तक पहुंच जाएगी।',
        mr: 'अतिशय धोकादायक! हा मेसेज तुमच्या फोनमध्ये अनधिकृत APK (व्हायरस) इन्स्टॉल करण्याचा प्रयत्न करत आहे. यामुळे तुमचा बँक OTP आणि बँक खाते चोरीला जाऊ शकते.',
      },
      actionSteps: {
        en: [
          'Never click or download raw .apk files sent via SMS or WhatsApp.',
          'If already downloaded, turn on Airplane mode immediately and delete the file from Downloads.',
          'Alert your bank immediately to pause online transactions.',
        ],
        hi: [
          'इस लिंक पर कतई क्लिक न करें और APK फाइल डाउनलोड न करें।',
          'यदि गलती से फाइल डाउनलोड हो गई है, तो तुरंत फोन को Airplane Mode पर डालें और फ़ाइल डिलीट करें।',
          'अपने बैंक को कॉल करके अस्थायी रूप से नेट बैंकिंग ब्लॉक कराएं।',
        ],
        mr: [
          'या लिंकवर चुकूनही क्लिक करू नका आणि APK फाइल डाउनलोड करू नका.',
          'जर फाइल डाउनलोड झाली असेल, तर त्वरित Airplane Mode चालू करून ती फाइल डिलीट करा.',
          'बँकेला संपर्क करून नेट बँकिंग ब्लॉक करा.',
        ],
      },
      safetyTips: {
        en: 'Legitimate banks and government departments never distribute software via .apk download links.',
        hi: 'भारत सरकार, पुलिस या बैंक कभी भी WhatsApp या SMS पर APK फाइल नहीं भेजते। सभी अधिकृत ऐप केवल Google Play Store से ही लें।',
        mr: 'शासकीय संस्था किंवा बँका कधीही व्हॉट्सॲपवर APK फाइल पाठवत नाहीत. नेहमी Google Play Store वरूनच ॲप डाऊनलोड करा.',
      },
    };
  }

  // 3. Banking KYC Expiry / Account Blocked Fraud (SBI, PNB, HDFC, YONO)
  const kycKeywords = /(kyc expired|account blocked|pan card.*update|yono.*block|account suspended|dear customer your (sbi|pnb|bank|hdfc|icici|bob|kotak|union bank)|sbi reward points|पॅन कार्ड|केवायसी|खाते ब्लॉक|खाता बंद)/i;
  const kycAction = /(click here to update|bit\.ly|tinyurl|is\.gd|cutt\.ly|ngrok|update now|verify aadhaar|अपडेट करा|लिंकवर क्लिक करा)/i;

  if (kycKeywords.test(lower) && (kycAction.test(lower) || /http/i.test(lower))) {
    return {
      matched: true,
      verdict: 'Scam',
      category: 'banking_kyc',
      confidence: 0.97,
      riskScore: 95,
      indicators: [
        'Fake bank account suspension threat designed to cause panic',
        'Suspicious URL shortener or unverified domain (bit.ly/tinyurl/ngrok)',
        'Illegitimate request to update PAN or Aadhaar card via SMS link',
      ],
      extractedEntities,
      matchedRules: ['RULE_BANKING_KYC_PHISHING_V2'],
      explanation: {
        en: 'This is a classic Banking KYC phishing trap. Banks in India never send short links or threaten instant account deactivation via SMS.',
        hi: 'यह एक बैंक KYC फ़िशिंग धोखाधड़ी है। बैंक कभी भी SMS में लिंक भेजकर पैन कार्ड या आधार अपडेट करने को नहीं कहते, न ही इस तरह खाता तुरंत बंद किया जाता है।',
        mr: 'हा बँक केवायसी (KYC) फसवणुकीचा प्रकार आहे. कोणतीही बँक SMS मधील लिंकद्वारे पॅन किंवा आधार अपडेट करण्यास सांगत नाही.',
      },
      actionSteps: {
        en: [
          'Do not click the link or enter banking login credentials.',
          'Never disclose your OTP or debit card PIN to anyone.',
          'Visit your official home branch directly for genuine KYC queries.',
        ],
        hi: [
          'लिंक पर क्लिक न करें और न ही अपना बैंक यूजर आईडी या पासवर्ड दर्ज करें।',
          'कभी भी किसी को कॉल पर आया OTP न बताएं।',
          'अपनी नजदीकी बैंक शाखा में जाकर ही KYC स्थिति की पुष्टि करें।',
        ],
        mr: [
          'मेसेजमधील लिंकवर क्लिक करू नका आणि बँकेचा पासवर्ड टाकू नका.',
          'कोणालाही OTP शेअर करू नका.',
          'आपल्या बँकेच्या शाखेत जाऊनच प्रत्यक्ष खात्री करा.',
        ],
      },
      safetyTips: {
        en: 'Per RBI guidelines, banks never demand immediate re-KYC via random SMS hyperlinks.',
        hi: 'आरबीआई (RBI) के दिशानिर्देशानुसार बैंक कभी भी ऑनलाइन लिंक से री-केवाईसी नहीं करवाते।',
        mr: 'RBI च्या नियमांनुसार बँका अशा मेसेज लिंकवरून केवायसी अपडेट करून घेत नाहीत.',
      },
    };
  }

  // 4. UPI Lottery / Scratch Card / QR Code Collect Fraud
  const lotteryKeywords = /(kbc|kaun banega crorepati|lottery winner|you won|cash prize|scratch card|₹\s*\d{3,7}|won 25,00,000|phonepe reward|gpay cashback|लॉटरी|लकी ड्रॉ|इनाम जिंकले|बक्षीस जिंकले)/i;
  const upiCollectOrQr = /(scan qr to receive|pay registration fee|send money to claim|accept request|claim prize|क्युआर कोड स्कॅन करा)/i;

  if (lotteryKeywords.test(lower) && (upiCollectOrQr.test(lower) || /upi|gpay|phonepe|paytm/i.test(lower))) {
    return {
      matched: true,
      verdict: 'Scam',
      category: 'upi_lottery',
      confidence: 0.96,
      riskScore: 92,
      indicators: [
        'Unrealistic lottery reward or cashback promise (e.g. KBC prize)',
        'Demanding UPI PIN entry or QR scan to "receive" money',
        'Upfront "registration" or "clearance tax" fee demand',
      ],
      extractedEntities,
      matchedRules: ['RULE_UPI_LOTTERY_QR_FRAUD_V2'],
      explanation: {
        en: 'This is a verified UPI / Lottery scam. Remember: YOU NEVER ENTER A UPI PIN TO RECEIVE MONEY. A UPI PIN is strictly for sending money out of your account.',
        hi: 'यह फर्जी लॉटरी और UPI फ्रॉड है! याद रखें: पैसे प्राप्त करने के लिए कभी भी QR कोड स्कैन करने या UPI PIN दर्ज करने की आवश्यकता नहीं होती। PIN केवल पैसे भेजने के लिए होता है।',
        mr: 'हा १००% खोटा लॉटरी आणि UPI घोटाळा आहे! लक्षात ठेवा: पैसे स्वीकारण्यासाठी कधीही UPI PIN टाकावा लागत नाही किंवा QR स्कॅन करावा लागत नाही.',
      },
      actionSteps: {
        en: [
          'Never pay "processing fees" or "clearance tax" to claim any prize.',
          'Decline any unexpected collect request on PhonePe, Google Pay, or Paytm.',
          'Block the sender immediately.',
        ],
        hi: [
          'किसी भी प्रकार का "प्रक्रिया शुल्क" या एडवांस न भेजें।',
          'PhonePe / GPay / Paytm पर आए किसी भी अनजान रिक्वेस्ट को तुरंत "Decline" करें।',
          'भेजने वाले नंबर को तुरंत ब्लॉक करें।',
        ],
        mr: [
          'कोणतीही ॲडव्हान्स फी किंवा टॅक्स म्हणून पैसे पाठवू नका.',
          'PhonePe किंवा Google Pay वरील संशयास्पद रिक्वेस्ट Reject करा.',
          'नंबर त्वरित ब्लॉक करा.',
        ],
      },
      safetyTips: {
        en: 'Golden Rule: Scanning a QR code or entering your PIN always deducts money, never credits.',
        hi: 'गोल्डन रूल: QR कोड स्कैन करने से बैंक से पैसे कटते हैं, आते नहीं!',
        mr: 'सुवर्ण नियम: QR कोड स्कॅन केल्यावर खात्यातून पैसे जातात, येत नाहीत!',
      },
    };
  }

  // 5. Legitimate Safe Transactional Message Detection
  const safeOtpPattern = /(is your secret one time password|otp for your transaction|do not share with anyone|valid for \d{1,2} minutes|never share your otp|dispatched.*tracking|delivered successfully|ordered successfully)/i;
  const noMaliciousLinks = !/(\.apk|bit\.ly|tinyurl|is\.gd|ngrok|cutt\.ly|drive\.google|\.xyz|\.top)/i.test(lower);
  const noThreatLanguage = !/(disconnected|blocked|suspended|penalty|fine|arrest|police|court|fir)/i.test(lower);

  if (safeOtpPattern.test(lower) && noMaliciousLinks && noThreatLanguage) {
    return {
      matched: true,
      verdict: 'Safe',
      category: 'safe',
      confidence: 0.94,
      riskScore: 5,
      indicators: [
        'Standard bank or service transactional OTP pattern',
        'Explicit security warning: "Do not share OTP with anyone"',
        'No malicious external links or urgent cancellation threats',
      ],
      extractedEntities,
      matchedRules: ['RULE_STANDARD_SAFE_OTP_V2'],
      explanation: {
        en: 'This appears to be a legitimate transaction or service OTP message. It warns against sharing the code, which is standard security protocol.',
        hi: 'यह एक वैध (Safe) लेनदेन या डिलीवरी संदेश प्रतीत होता है। इसमें गोपनीय OTP है जिसे आपको किसी भी व्यक्ति के साथ साझा नहीं करना चाहिए।',
        mr: 'हा एक अधिकृत आणि सुरक्षित (Safe) मेसेज वाटतो. यामधील OTP गोपनीय ठेवा आणि कोणालाही सांगू नका.',
      },
      actionSteps: {
        en: [
          'Only enter this OTP on the verified website or app you initiated.',
          'Never read this code to any caller claiming to be bank staff.',
        ],
        hi: [
          'यह OTP केवल स्वयं उसी ऐप या वेबसाइट में दर्ज करें जहाँ आपने स्वयं लेनदेन शुरू किया था।',
          'किसी भी कॉल करने वाले को यह OTP कभी न बताएं।',
        ],
        mr: [
          'हा OTP फक्त तुम्ही स्वतः सुरू केलेल्या ॲप किंवा वेबसाईटवरच वापरा.',
          'कोणत्याही फोन कॉलवर हा OTP सांगू नका.',
        ],
      },
      safetyTips: {
        en: 'Legitimate bank employees will never ask for your OTP over a phone call.',
        hi: 'असली बैंक कर्मचारी कभी भी फोन पर OTP नहीं पूछते।',
        mr: 'बँकेचे खरे कर्मचारी फोनवर कधीही OTP मागत नाहीत.',
      },
    };
  }

  return null;
}
