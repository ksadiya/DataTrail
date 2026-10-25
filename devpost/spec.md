---
doc: spec
status: approved
---

# DataTrail — Technical Specification

## How This Works, In Plain Language

DataTrail is a client-side privacy-policy intelligence tool. When a user feeds it a privacy policy—by picking a built-in real-world policy, pasting raw text, uploading a file, or fetching a URL—the system breaks the text into sentences, paragraphs, and sections.

It then runs a deterministic semantic extraction engine:
1. **Clause Classifier**: Identifies sentences related to personal data categories (e.g. Geolocation, Contacts, Financial, Device IDs, Biometrics).
2. **Four-Stage Journey Builder**: For each data category, it examines sentences matching the 4 lifecycle stages:
   - **COLLECT**: How the data enters (user input, automated sensor, background telemetry, or third parties).
   - **USE**: The specific business or operational purpose claimed.
   - **SHARE**: Disclosures to external entities (affiliates, ad networks, cloud processors, law enforcement).
   - **KEEP**: Retention duration, deletion schedule, or storage terms.
3. **Honesty & Vagueness Detector**: Evaluates each stage's evidence against legal hedging patterns (e.g. *"including without limitation"*, *"may periodically share"*, *"as long as necessary for business purposes"*). If an explicit policy sentence exists, it's labeled **Stated**. If it's overly broad or evasive, it's labeled **Vague** with the hedge highlighted. If the policy is completely silent, it's marked **Not Found**.
4. **Necessity Interpretation Engine**: Synthesizes a transparent assessment of functional necessity vs. collection scope, clearly marked as an analytical interpretation (not a policy claim).
5. **Rights & Grievance Finder**: Scans for Data Protection Officer (DPO) and Grievance Officer contacts, emails, and opt-out endpoints.

All results are displayed in an interactive visual trail with exact verbatim quotes linked back to the original text.

---

## The Core Journey Through the System

Implements `prd.md > The Core Journey`.

1. **Step 1: Arrival & Ingestion**
   - User interacts with `PolicyInputBar`.
   - If a preset is clicked (e.g., Swiggy, Zomato, WhatsApp), the full text is loaded from `src/data/samples.ts`.
   - If raw text is pasted or a `.txt` file dropped, `PolicyInputBar` validates length (>50 words) and passes text to `usePolicyAnalysis`.
   - If a URL is entered, a proxy-aware fetcher attempts retrieval, catching CORS or paywall failures with transparent user notifications.

2. **Step 2: Execution of Policy Analysis**
   - `PolicyAnalyzerEngine.analyze(policyText)` tokenizes text into normalized clauses.
   - Discovers personal data categories and builds the `PolicyAnalysisResult` object.
   - Verifies all extracted quote substrings exist verbatim in the source text.

3. **Step 3: Rendering the Trail & Selecting Data Types**
   - `DataTypeSelector` renders discovered categories with badges showing completeness (e.g. 3/4 stages stated).
   - Selecting a category passes the selected `DataTrailFlow` to `TrailBoard`.

4. **Step 4: Interactive 4-Stage Pathway**
   - `TrailBoard` renders 4 nodes (`Collect`, `Use`, `Share`, `Keep`) connected by animated SVG energy conduits.
   - Each node displays the honesty badge (`Stated`, `Vague`, `Not Found`), a concise 1-sentence finding, and the primary quote preview.

5. **Step 5: Inspecting Evidence & Necessity**
   - Clicking any stage node triggers `EvidenceDrawer`, opening the side panel with verbatim quotations, paragraph context, and highlighted legal hedges.
   - Below the trail, `NecessityCard` displays the contextual proportionality note and runtime honesty disclaimer.
   - `RightsPanel` displays any detected Grievance Officer details or data deletion instructions.

---

## Stack

- **Runtime & Build Tooling**: Vite 6 + React 19 + TypeScript 5
  - *Rationale*: Instant local startup, ultra-fast HMR, type-safe development, zero runtime server requirements for judges and reviewers.
  - *Docs*: [Vite Documentation](https://vite.dev), [React 19](https://react.dev)
- **Styling & UI**: Tailwind CSS v3 / PostCSS + Lucide React
  - *Rationale*: Precision control over obsidian/slate dark theme, editorial typography, and micro-interactions without heavy UI frameworks.
  - *Docs*: [Tailwind CSS](https://tailwindcss.com/docs), [Lucide React](https://lucide.dev)
- **Engine Architecture**: In-memory deterministic NLP & regex classification engine (`PolicyAnalyzerEngine`) with exact quote verification
  - *Rationale*: Guarantees zero hallucinations, 100% quotation fidelity, instant analysis, and works 100% offline without mandatory API keys.
- **Testing**: Vitest
  - *Rationale*: Fast unit and integration testing of policy parsing and clause matching.
  - *Docs*: [Vitest](https://vitest.dev)

---

## Where It Runs and How Someone Tries It

- **Runtime**: Browser-based Single Page Application running via standard Node.js dev server or preview build.
- **Requirements**: Node.js v18+ (tested on v24).
- **Start Command**:
  ```bash
  npm install
  npm run dev
  ```
  App opens at `http://localhost:5173`.
- **Demo Recording Instructions**:
  1. Open `http://localhost:5173`.
  2. Select the built-in real-world sample (e.g. Swiggy / Food Delivery).
  3. Click "Investigate Policy".
  4. Select **Precise Geolocation** data type.
  5. Walk through the four nodes: **Collect → Use → Share → Keep**.
  6. Point out the honesty labels: **Stated** for Collect/Use, **Vague** for Share (advertising partners), **Not Found** or vague for Keep.
  7. Open the Evidence Drawer to show the exact policy sentences highlighted.
  8. Switch to **Contact List** or paste a different policy to show that the analysis dynamically adapts with different quotes and findings.
- **Submission**: Short video walkthrough and public GitHub repository.

---

## Look and Feel

Implements `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.

- **Dark Obsidian Surface**: Deep charcoal background (`#090D16`), card containers (`#0F172A`), borders (`#1E293B`).
- **Precision Neon Accents**:
  - Cyan (`#06B6D4`) for interactive triggers and headers.
  - Emerald (`#10B981`) for `Stated` direct claims.
  - Amber (`#F59E0B`) for `Vague` evasive qualifiers.
  - Slate Rose (`#64748B` / `#F43F5E`) for `Not Found` omissions.
  - Electric Violet (`#8B5CF6`) for `Interpreted` analytical assessments.
- **Typography**: Inter / system sans-serif for clean UI; JetBrains Mono / monospace font for policy clauses and verbatim quotations.
- **Motion**: Subtle CSS pulse along the connecting trail SVG lines, smooth drawer slide-ins, and category pill transitions.

---

## Components

### 1. Header & Navigation (`src/components/Header.tsx`)
Displays DataTrail brand, tagline ("Personal Data Journey Investigation"), and honesty badge ("Policy Disclosures • Not Runtime Truth").
PRD ref: `prd.md > Screens and Layout (The Investigation Docket)`.

### 2. Policy Input Bar (`src/components/PolicyInputBar.tsx`)
Provides sample policy buttons (Swiggy, Zomato, WhatsApp), custom text paste area with word counter, `.txt` file dropzone, and URL fetch input.
PRD ref: `prd.md > Features and Behavior (1. Multi-Source Policy Ingestion)`.

### 3. Data Type Selector (`src/components/DataTypeSelector.tsx`)
Renders discovered personal data categories as selectable tabs/pills with visual completion indicators.
PRD ref: `prd.md > Features and Behavior (2. Intelligent Data Type Discovery)`.

### 4. Trail Board (`src/components/TrailBoard.tsx`)
The centerpiece: displays the 4-stage sequential path (`COLLECT → USE → SHARE → KEEP`). Shows stage cards, honesty badges, concise findings, and quote previews.
PRD ref: `prd.md > Features and Behavior (3. The Four-Stage Trail)`.

### 5. Evidence Drawer (`src/components/EvidenceDrawer.tsx`)
Side sheet that opens when clicking a stage or the "View Evidence" button. Displays verbatim policy sentences, paragraph context, and highlights legal hedge words.
PRD ref: `prd.md > Features and Behavior (4. Verbatim Evidence & Verifiability)`.

### 6. Necessity & Interpretation Card (`src/components/NecessityCard.tsx`)
Displays the analytical assessment of whether the collection scope matches the app's core utility, with prominent "Interpretation" disclaimer.
PRD ref: `prd.md > Features and Behavior (5. Necessity & Proportionality Analysis)`.

### 7. Rights & Contacts Panel (`src/components/RightsPanel.tsx`)
Extracts and displays Grievance Officer details, contact email, and data deletion instructions.
PRD ref: `prd.md > Features and Behavior (6. Privacy Rights & Contact Discovery)`.

### 8. Policy Text Inspector Modal (`src/components/PolicyTextInspector.tsx`)
Full-text viewer with search and jump-to-quote highlighting.
PRD ref: `prd.md > Screens and Layout (The Evidence & Clause Inspector)`.

---

## Data Model

```typescript
export type HonestyStatus = 'stated' | 'vague' | 'not_found' | 'interpreted';

export type StageName = 'collect' | 'use' | 'share' | 'keep';

export interface VerbatimEvidence {
  quote: string;
  sourceSection?: string;
  hedgesFound?: string[]; // e.g. ["including but not limited to", "from time to time"]
  lineNumber?: number;
}

export interface TrailStage {
  stage: StageName;
  title: string;
  status: HonestyStatus;
  headline: string;
  summary: string;
  evidence: VerbatimEvidence[];
  vaguenessReason?: string;
}

export interface DataTypeTrail {
  id: string; // e.g. "location", "contacts", "device_ids", "financial", "biometric"
  label: string;
  iconName: string;
  description: string;
  stages: Record<StageName, TrailStage>;
  necessityNote: {
    coreUtilityRelation: string;
    proportionalityAssessment: string;
    status: 'proportional' | 'excessive_scope' | 'vague_justification';
  };
}

export interface PolicyAnalysisResult {
  policyTitle: string;
  wordCount: number;
  timestamp: string;
  discoveredDataTypes: DataTypeTrail[];
  rightsAndContacts: {
    grievanceOfficerFound: boolean;
    grievanceOfficerDetails?: string;
    dpoEmail?: string;
    deletionProcedureStated: boolean;
    deletionSummary?: string;
    evidenceQuotes: string[];
  };
  rawText: string;
}
```

---

## File Structure

```
datatrail/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── policy.ts
│   ├── data/
│   │   └── samples.ts               # Curated real-world privacy policies (Swiggy, Zomato, WhatsApp)
│   ├── engine/
│   │   ├── analyzer.ts              # Core deterministic policy analysis engine
│   │   ├── patterns.ts              # Categorization, stage regex, and vagueness hedge dictionary
│   │   ├── quoteVerifier.ts         # Verbatim quote substring validator
│   │   └── rightsExtractor.ts       # Grievance officer and DPO email detector
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── PolicyInputBar.tsx
│   │   ├── DataTypeSelector.tsx
│   │   ├── TrailBoard.tsx
│   │   ├── TrailNodeCard.tsx
│   │   ├── EvidenceDrawer.tsx
│   │   ├── NecessityCard.tsx
│   │   ├── RightsPanel.tsx
│   │   └── PolicyTextInspector.tsx
│   └── hooks/
│       └── usePolicyAnalysis.ts
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   ├── prd.html
│   ├── spec.md
│   ├── spec.html
│   └── checklist.md
└── .gitignore
```

---

## External Services and Dependencies

- None required for core execution.
- 100% self-contained client-side deterministic parsing.
- Optional client-side URL fetching: Uses `fetch` with CORS error catch and clean fallback message.

---

## Important Failure Modes

1. **CORS / Network Block on Remote Policy URL**
   - *What breaks*: Browsers block cross-origin requests to third-party domains.
   - *Fallback*: System catches the fetch error immediately, displays an honest explanatory modal (*"Remote website blocked browser cross-origin fetch due to CORS policies"*), and loads the text via paste clipboard or lets the user switch to a pre-loaded real sample.

2. **Unrecognized or Minimal Text Input**
   - *What breaks*: User pastes random text or a policy under 50 words that contains no privacy terms.
   - *Fallback*: Analyzer validates text density, presents an honest alert (*"No privacy or data collection clauses could be identified in this text"*), and invites the user to load a sample or paste a valid privacy policy document.

3. **Missing Policy Stages (e.g. No Retention Policy Found)**
   - *What breaks*: The policy never mentions how long data is retained or how deletion works.
   - *Handling*: Handled by design: stage node turns slate-gray with **NOT FOUND** badge, explicitly noting: *"The policy makes no disclosure regarding data retention or deletion for this category."*

---

## What Was Simplified and Why

- **Client-Side Regex & Rule-Based NLP Engine** instead of heavy backend vector database or mandatory LLM cloud dependency.
  - *Why*: Ensures instantaneous analysis (<100ms), 100% offline reliability for judges, zero API quota errors, and strictly guarantees zero hallucinated quotes by extracting only verified substrings from the actual input text.
- **Pre-packaged Real India-Relevant Policies** included directly in code.
  - *Why*: Gives judges an immediate 1-click test of real policies (e.g. Indian food delivery, ride hailing, social messaging) without having to find and copy 10-page legal documents themselves.

---

## Decisions and Open Issues

- **Learner Decision**: Focused on the 4-stage data trail (**Collect → Use → Share → Keep**) rather than a generic summarizer or numeric score.
- **Technical Choice**: React 19 + TypeScript + Tailwind CSS for maximum visual polish, responsive mobile/desktop display, and lightning-fast developer velocity.
- **Genuine Learner Uncertainty**: How to reliably extract quotes without an expensive LLM hallucinating fake sentences.
  - *Resolution*: Implemented `quoteVerifier.ts` which tests every extracted clause against `rawText.includes(quote)` to guarantee 100% quotation accuracy.
