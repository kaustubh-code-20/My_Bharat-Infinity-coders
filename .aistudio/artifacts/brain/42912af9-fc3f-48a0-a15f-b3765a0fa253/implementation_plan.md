# ScamShield Bharat - Real-Time Truecaller-Style Mobile Prototype

An interactive, mobile-optimized cybersecurity prototype simulating real-time SMS and WhatsApp scam detection on a smartphone device, featuring Truecaller-style heads-up alert overlays, instant sender ID/phone lookup, automated clipboard scanning, and 1-tap emergency cyber helpline connectivity.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following confirmed decisions guide this real-time mobile prototype:

- **Confirmed Experience Model**: Interactive smartphone device simulator with a toggle for direct full-screen responsive mobile view, optimized for realistic touch demonstration on phones, tablets, and desktop viewports.
- **Confirmed Real-Time Alert Engine**: Truecaller-style floating popup overlay that intercepts simulated incoming SMS and WhatsApp notifications in real time, displaying color-coded risk assessment (Safe, Suspicious, Likely Scam), 0–100 Threat Meter, voice read-aloud, and instant "Block & Report" controls.
- **Confirmed Truecaller Feature Suite**:
  1. **Sender ID & Phone Spam Lookup**: Query 10-digit mobile numbers or official 6-character alphanumeric headers (e.g. `VM-MSEDCL`, `BP-SBIINB`, `+91 98234 11223`) to view spam score, community reports, and verification status.
  2. **Simulated Live Stream (SMS & WhatsApp)**: Preset triggers for high-frequency Indian fraud messages (Electricity cutoffs, e-Challan APKs, SBI YONO KYC, KBC UPI lottery) and safe bank OTPs, plus a custom message injector.
  3. **Auto-Scan Clipboard**: Instant detection and 1-tap scan when suspicious text is copied.
  4. **1-Tap 1930 Emergency Helpline**: Direct dialer and reporting integration with the National Cyber Crime Portal.

---

## 1. Overview & Core Concept

- **What It Does**: Simulates how ScamShield Bharat operates as an on-device background security service on Android/iOS (similar to Truecaller / Google Phone Spam Protection). When an incoming SMS or WhatsApp notification arrives, the detection engine analyzes the sender signature and text in real-time (<10ms for rules, Gemini AI fallback), displaying an instant heads-up alert overlay before the user opens any dangerous links.
- **Target Persona**: Hackathon judges, civic technology evaluators, and smartphone users in Tier 3/4 Bharat experiencing unsolicited predatory messages.
- **Key Value**: Demonstrates realistic on-device defense without requiring users to manually copy-paste every message into a separate app.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Interactive Mobile Shell**:
   - Modern smartphone canvas with dynamic status bar (time, 5G signal, battery), notch/dynamic island, and realistic navigation bar.
   - Device Mode Toggle: Switch between "Mobile Phone Simulator Frame" (ideal for desktop presentation) and "Full-Screen Mobile PWA" (for testing directly on mobile devices).
2. **Bottom Navigation (4 Mobile Tabs)**:
   - **Tab 1: Live Monitor & Feed**: Shows real-time incoming SMS and WhatsApp feed with spam/safe status tags, trigger buttons for testing scenarios, and floating overlay alerts.
   - **Tab 2: Sender & Number Lookup (Truecaller style)**: Search any phone number (e.g. `9823411223`) or sender header (e.g. `VM-MSEDCL`) to see spam reports, category, risk score, and carrier/origin info.
   - **Tab 3: Scanner & OCR**: The core deep manual scanner with on-device Tesseract OCR screenshot extraction and Threat Meter.
   - **Tab 4: Awareness & 1930 Helpline**: Educational guides on the top 4 Indian scams and direct dialer to the 1930 Cyber Helpline.
3. **Truecaller-Style Heads-Up Scam Overlay**:
   - When an incoming scam message arrives, a high-contrast floating card slides down over the screen.
   - Visual Threat Meter (e.g. `98/100`), Red Banner ("Likely Scam: Electricity Cutoff Fraud"), and quick action buttons:
     - `Block & Report`
     - `Listen in Hindi/Marathi/English` (Web Speech API)
     - `Call 1930 Helpline`
     - `Dismiss / View Details`

---

## 3. Technical Architecture & Data Strategy

- **Backend Endpoints**:
  - `POST /api/scan`: Two-Tier Rules + Gemini 3.8 Flash analysis.
  - `GET /api/lookup/:query`: Truecaller-style sender verification (checks official TRAI DLT headers vs reported 10-digit scam numbers).
  - `POST /api/reports/:id/vote`: Crowdsourced community verification.
  - `GET /api/threat-intel`: Watchlist of flagged domains and UPI VPAs.
