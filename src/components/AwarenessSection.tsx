import React from 'react';
import { Zap, Smartphone, Landmark, QrCode, Shield, Check } from 'lucide-react';
import { Language } from '../types/index.ts';
import { translations } from '../lib/translations.ts';

interface AwarenessSectionProps {
  language: Language;
}

export const AwarenessSection: React.FC<AwarenessSectionProps> = ({ language }) => {
  const t = translations[language];

  const awarenessData = [
    {
      icon: Zap,
      category: 'electricity',
      title: {
        hi: 'बिजली बिल कटने की फर्जी धमकी',
        mr: 'महावितरण वीज बिल कट घोटाळा',
        en: 'Electricity Disconnection Threats',
      },
      modus: {
        hi: 'धमकी भरा SMS आता है कि "आज रात 9:30 बजे बिजली काट दी जाएगी क्योंकि बिल अपडेट नहीं हुआ।" एक 10-अंकों के नंबर पर तुरंत कॉल करने को कहा जाता है।',
        mr: 'SMS येतो की "आज रात्री वीज पुरवठा खंडित होईल, तातडीने वीज अधिकाऱ्याला फोन करा." हा वैयक्तिक १० अंकी नंबर असतो.',
        en: 'SMS claims your electricity will be disconnected tonight. Urges calling a personal 10-digit mobile number immediately.',
      },
      defense: {
        hi: 'बिजली विभाग कभी व्यक्तिगत मोबाइल नंबर से कॉल करने को नहीं कहता। केवल आधिकारिक महावितरण/DISCOM ऐप से ही बिल भरें।',
        mr: 'महावितरण कधीही वैयक्तिक मोबाईल नंबर देत नाही. फक्त अधिकृत ॲप किंवा केंद्रावरच बिल भरावे.',
        en: 'Official electricity boards never ask you to call personal mobile numbers or install screen sharing apps.',
      },
    },
    {
      icon: Smartphone,
      category: 'apk_malware',
      title: {
        hi: 'व्हाट्सएप व SMS पर APK डाउनलोड',
        mr: 'व्हाट्सॲप द्वारे APK व्हायरस',
        en: 'Untrusted APK Malware Downloads',
      },
      modus: {
        hi: 'ट्रैफिक चालान, पीएम योजना या लॉटरी के नाम पर .apk फाइल या लिंक भेजी जाती है। इंस्टॉल करते ही यह फोन के बैंक OTP चुरा लेता है।',
        mr: 'ई-चलन किंवा शासकीय योजनेच्या नावाखाली .apk फाइल पाठवली जाते. ही फाइल डाऊनलोड करताच फोनमधील OTP हॅक होतो.',
        en: 'Fraudsters send .apk links disguised as police e-challans or PM schemes. Once installed, it steals banking SMS and OTPs.',
      },
      defense: {
        hi: 'व्हाट्सएप या अनजान लिंक से कभी कोई ऐप (.apk) डाउनलोड न करें। केवल Google Play Store से ही ऐप इंस्टॉल करें।',
        mr: 'व्हाट्सॲप किंवा मेसेजमधील कोणत्याही लिंकवरून APK डाऊनलोड करू नका. केवळ Google Play Store चा वापर करा.',
        en: 'Never install raw .apk files sent via SMS or messaging apps. Only install from Google Play Store.',
      },
    },
    {
      icon: Landmark,
      category: 'banking_kyc',
      title: {
        hi: 'बैंक खाता ब्लॉक व KYC समाप्ति SMS',
        mr: 'बँक खाते ब्लॉक व पॅन अपडेट धमकी',
        en: 'Bank Account Block & KYC Suspension',
      },
      modus: {
        hi: '"आपका SBI/PNB खाता बंद कर दिया गया है। 24 घंटे में पैन अपडेट करने के लिए इस लिंक पर क्लिक करें।" लिंक नकली बैंक वेबसाइट खोलती है।',
        mr: '"तुमचे बँक खाते ब्लॉक झाले आहे, केवायसीसाठी लिंकवर क्लिक करा." अशी भीती दाखवून बँक पासवर्ड चोरला जातो.',
        en: 'Phishing SMS claims your bank account/YONO is blocked. Prompts clicking short links (bit.ly/tinyurl) to update PAN.',
      },
      defense: {
        hi: 'बैंक कभी भी SMS में लिंक भेजकर पैन या आधार अपडेट नहीं करवाते। सीधे अपनी बैंक शाखा जाएं।',
        mr: 'बँक कधीही SMS मधील लिंकवरून पॅन अपडेट करण्यास सांगत नाही. थेट बँकेच्या शाखेत जा.',
        en: 'Banks never ask you to update KYC details through SMS hyperlinks. Visit your bank branch directly.',
      },
    },
    {
      icon: QrCode,
      category: 'upi_lottery',
      title: {
        hi: 'UPI QR कोड व लॉटरी इनाम फ्रॉड',
        mr: 'UPI QR स्कॅन व बक्षीस फसवणूक',
        en: 'UPI QR Code & Lottery Collect Scams',
      },
      modus: {
        hi: '"आपने 25 लाख जीते हैं, पैसे खाते में लेने के लिए यह QR कोड स्कैन करें या PhonePe रिक्वेस्ट पर पिन डालें।"',
        mr: '"तुम्हाला २५ लाखांची लॉटरी लागली आहे, पैसे मिळवण्यासाठी हा QR कोड स्कॅन करा आणि पिन टाका."',
        en: 'Victim is told they won cash or a refund, and is asked to scan a QR code or enter their UPI PIN to "receive" funds.',
      },
      defense: {
        hi: 'स्वर्ण नियम: पैसे प्राप्त करने के लिए कभी भी QR कोड स्कैन करने या UPI PIN दर्ज करने की आवश्यकता नहीं होती!',
        mr: 'सुवर्ण नियम: पैसे स्वीकारण्यासाठी कधीही QR कोड स्कॅन करावा लागत नाही किंवा UPI PIN टाकावा लागत नाही!',
        en: 'Golden Rule: You NEVER enter your UPI PIN or scan a QR code to receive money. PIN is strictly for paying.',
      },
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {t.awarenessTitle}
        </h3>
        <p className="text-xs text-slate-500">{t.awarenessSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {awarenessData.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {item.title[language]}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'hi' ? 'ठगी का तरीका और बचाव' : language === 'mr' ? 'फसवणूक व उपाय' : 'Modus & Prevention'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p>
                  <strong className="text-slate-900 font-semibold">
                    {language === 'hi' ? 'ठगी कैसे होती है: ' : language === 'mr' ? 'फसवणूक कशी होते: ' : 'How it works: '}
                  </strong>
                  {item.modus[language]}
                </p>
                <p className="text-emerald-800 font-medium pt-1 border-t border-slate-200 flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item.defense[language]}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
