# DataTrail — Interactive Privacy-Policy Intelligence

> Built for the **Devpost Build With AI: Basics** Hackathon.
> An interactive privacy-intelligence web application that turns real privacy policies into an evidence-backed personal data journey: **COLLECT → USE → SHARE → KEEP**.

---

## 🌟 The Vision: Claims, Not Runtime Truth

Most privacy tools are generic summarizers, chatbots, or arbitrary "privacy grade" scorecards. DataTrail takes a fundamentally different, investigative approach:

- **Follow One Data Type**: Choose a personal data type (e.g., *Precise Geolocation & GPS*, *Contact List*, *Device Identifiers*, *Financial Records*) and follow it through four critical lifecycle stages:
  1. **COLLECT**: How the data enters (user input, automated sensor, or background tracking).
  2. **USE**: Stated operational and commercial purposes.
  3. **SHARE**: Disclosures to third parties (delivery partners, advertising networks, corporate affiliates).
  4. **KEEP**: Retention duration, deletion schedule, or vague clauses.
- **Honesty Badges**: Every stage clearly separates:
  - 🟢 **STATED**: Verbatim policy claim explicitly declared in the text.
  - 🟡 **VAGUE**: Corporate hedging and discretionary phrasing (*"as long as necessary"*, *"including but not limited to"*, *"commercial partners"*).
  - ⚪ **NOT FOUND**: Direct silence or omission in the policy.
  - 🟣 **INTERPRETED**: Transparent analytical assessments clearly distinguished from raw policy quotes.
- **Zero Hallucinations Guarantee**: All extracted quotations are verified substrings from the actual input text.
- **Runtime Honesty**: DataTrail is explicit that a privacy policy represents legal claims, not runtime device telemetry or network packet monitoring.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher (tested on Node.js v24)
- npm or pnpm

### Installation
```bash
git clone <repo-url>
cd datatrail
npm install
```

### Running Locally
To launch the interactive development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Automated Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Architecture & Tech Stack

- **Framework**: [Vite 6](https://vite.dev) + [React 19](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com) with custom obsidian dark theme (`#090D16`), precise typography, and animated energy trails.
- **Icons**: [Lucide React](https://lucide.dev)
- **Engine**: In-memory deterministic NLP tokenizer, category matcher, vagueness hedge evaluator, and quote substring verifier (`src/engine/`).
- **Testing**: [Vitest](https://vitest.dev)

---

## 🗺️ Devpost Learn Documentation

DataTrail follows the official Devpost Learn AI Basics Skill Pack:
- `devpost/scope.md`: Approved initial product scope and proof-of-concept boundary.
- `devpost/prd.md` & `devpost/prd.html`: Approved Product Requirements Document with core user journey.
- `devpost/spec.md` & `devpost/spec.html`: Approved Technical Specification and architecture blueprint.
- `devpost/checklist.md`: Verified build checklist tracking the 4 completed slices.
- `devpost/app-map.html`: Interactive Application Map and code tour.

---

## 🎥 Hackathon Demo Walkthrough

1. Open `http://localhost:5173`.
2. Notice the curated India-relevant real policy samples (Swiggy, Zomato, WhatsApp).
3. Select **Swiggy** (or paste any custom privacy policy text).
4. In the **Discovered Data Types** matrix, select **Precise Geolocation & GPS**.
5. Walk through the interactive 4-stage trail:
   - **COLLECT**: Notice the **STATED** badge and verbatim quote describing foreground and background GPS tracking.
   - **USE**: Notice operational delivery estimates vs. marketing recommendations.
   - **SHARE**: Notice the **VAGUE** badge flagging sharing with unnamed advertising networks.
   - **KEEP**: Notice the **VAGUE** badge flagging retention *"for as long as necessary"*.
6. Click **Inspect Evidence →** on any stage to open the side drawer, view the verified verbatim clauses, and observe detected legal hedges.
7. Click **Locate in Full Policy Text** to open the full document inspector and see the exact clause highlighted in context.
8. Scroll to the **Necessity & Proportionality** card to view the contextual assessment and runtime uncertainty disclaimer.
9. Review the **Data Subject Rights & Grievance Contacts** panel displaying the designated Grievance Officer details and deletion mechanisms.
10. Switch to another data type (e.g. *Contact List*) or paste a different policy to watch the trail dynamically reconfigure with 100% genuine evidence.

---

## 📜 License
MIT
