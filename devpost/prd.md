---
doc: prd
status: approved
---

# DataTrail — Product Requirements Document (PRD)

An interactive privacy-intelligence web application that turns real privacy policies into an evidence-backed personal data journey: **COLLECT → USE → SHARE → KEEP**.
Source: `scope.md > # DataTrail` & `scope.md > The Unique Kernel`.

---

## The Core Journey

Source: `scope.md > The Core Loop` & `scope.md > What "Working" Looks Like`.

1. **Arrival & Input Selection**: User lands on DataTrail's calm, dark investigative interface. They can choose an instant real-world sample policy (e.g., QuickCommerce / Food Delivery in India, Ridesharing, Social Messaging), paste any custom privacy policy text, upload a digital `.txt` file, or fetch a policy via URL.
2. **Analysis & Dynamic Discovery**: The user triggers "Investigate Policy". The system reads and analyzes the text, parsing sections, extracting clauses, and identifying discovered personal data types (e.g., *Precise Geolocation*, *Device Identifiers*, *Contact List / Phonebook*, *Financial & Payment Data*, *Biometric Info*, *Browsing & Activity Logs*).
3. **Data Type Selection**: The user selects one specific data type to investigate (e.g., *Precise Geolocation*).
4. **Interactive Trail Visualization (Collect → Use → Share → Keep)**:
   - A sequential horizontal/vertical trail renders the four distinct stages for that selected data type.
   - Each stage displays an honest status badge:
     - **Stated (Direct Claim)**: Explicitly claimed in policy text with verbatim extracted evidence sentence.
     - **Vague**: Policy uses evasive, broad, or discretionary language (e.g., "may collect from time to time", "including but not limited to", "for general business enhancements").
     - **Not Found (Missing)**: Policy mentions nothing about this stage for this data type (e.g., no retention duration or no specific third-party recipients).
     - **Interpreted**: Highlighting analytical inferences clearly separated from raw policy claims.
5. **Deep Evidence Drawer / Inspector**:
   - Clicking any stage opens verbatim policy clauses with high-fidelity exact match highlighting in the full policy context.
   - Highlights ambiguous qualifiers and legal hedges.
6. **Necessity & Proportionality Note**:
   - An analytical observation clearly labeled **"Interpretation — Not a Policy Claim"** evaluating why the service claims this data is needed vs. whether the collection scope appears broad for the core utility.
7. **Next Steps & Rights Discovery**:
   - Displays explicit policy-stated contact points (Data Protection Officer email, grievance officer, opt-out portals) if found in the text.
   - Explicitly notes if no grievance officer or opt-out mechanism is stated.
8. **Switch & Compare**:
   - User switches data types seamlessly to see the trail dynamically reconfigure.
   - User can paste or load a completely different policy to verify that the analysis dynamically adapts and reflects the new policy claims without pre-baked scripts.

---

## Screens and Layout

DataTrail consists of a focused, single-page deep investigative console with three primary operational surfaces:

1. **The Investigation Docket (Header & Input Bar)**:
   - App title, philosophy badge ("Claims, Not Runtime Truth"), and policy source selector:
     - Curated India-relevant real policy samples (e.g. Swiggy/Zomato, Blinkit, WhatsApp/Meta, Ola/Uber).
     - Raw Text Paste tab with word counter and sample filler.
     - Document upload (`.txt` digital text).
     - Live URL input (with honest error handling and timeout fallbacks).
   - "Analyze Trail" primary action trigger.

2. **The Trail Board (Primary Investigation Surface)**:
   - **Data Type Matrix**: Interactive pill selector showing all discovered data types with status indicators (how complete their trail is: e.g. 3/4 stages stated, 1 vague).
   - **4-Stage Journey Pathway (`COLLECT → USE → SHARE → KEEP`)**:
     - Visual flow nodes connected by animated energy conduits.
     - Node cards displaying stage name, status pill (`Stated`, `Vague`, `Not Found`, `Interpreted`), summary finding, key verbatim quote preview, and vagueness alerts.
   - **Necessity & Transparency Assessment**:
     - Dedicated card detailing functional necessity interpretation vs. policy claim.
     - Clear disclaimer: *"Analysis reflects legal policy disclosures, not runtime network traffic or device telemetry."*

3. **The Evidence & Clause Inspector (Side-drawer or Modal View)**:
   - Full verified sentence quotes.
   - Section context (where in the policy this was found).
   - Ambiguity highlighter (flags phrases like *"including but not limited to"*, *"such other purposes"*, *"partners and affiliates"*).
   - Contact / Data Subject Rights section (Grievance Officer, DPO email, physical address if stated).

---

## Look and Feel

Source: `scope.md > Inspiration & Identity`.

- **Palette**: Deep investigative aesthetic. Obsidian and slate dark surfaces (`#090D16`, `#0F172A`, `#1E293B`), accented with precision cyan/emerald for stated claims (`#10B981`, `#06B6D4`), amber/yellow for vague hedges (`#F59E0B`), and muted slate/rose for missing/not-found stages (`#64748B`, `#F43F5E`).
- **Typography**: Editorial, precise, and authoritative. Inter / Geist / JetBrains Mono for data labels and raw evidence quotations.
- **Atmosphere**: Serious, calm, transparent, and surgical. Not a cartoonish privacy scanner, not a generic AI SaaS with purple neon gradients, and not a legal wall of text.
- **Motion**: Subtle SVG path flows and step transitions illustrating data movement across the four stages.

---

## Features and Behavior

### 1. Multi-Source Policy Ingestion
Source: `scope.md > The POC Boundary`.
- Provides 3 pre-loaded real-world policies (including real India-relevant tech platforms like Swiggy, Zomato, WhatsApp).
- Allows pasting custom policy text with instant word count and basic validation.
- Allows uploading plain text (`.txt`) policy documents.
- Allows URL fetching with explicit, honest error handling (explaining CORS, paywalls, or bot blocks when a remote server blocks client-side fetch, offering instant paste fallback).

### 2. Intelligent Data Type Discovery
Source: `scope.md > The Unique Kernel`.
- Scans policy text for references to standard and sensitive personal data categories:
  - Precise Geolocation & GPS
  - Device & Network Identifiers (IMEI, IP address, MAC, Advertising ID)
  - Contacts & Address Book
  - Financial, Transactional & Card Details
  - Biometric Information
  - Communications & Message Content / Metadata
  - Usage & In-App Activity Logs
- Only displays data types genuinely mentioned or inferred from the active policy.

### 3. The Four-Stage Trail (`COLLECT → USE → SHARE → KEEP`)
Source: `scope.md > The Unique Kernel` & `scope.md > The POC Boundary`.
- For each selected data type, analyzes:
  - **Collect**: Does the policy state that it collects this data? How is it gathered (direct user input, automated background collection, or third-party sources)?
  - **Use**: What specific purposes are stated (order fulfillment, security, personalization, ad targeting, algorithmic training)?
  - **Share**: Does the policy state sharing with third parties? Who (service providers, advertising partners, law enforcement, corporate affiliates)?
  - **Keep**: Does the policy state a specific retention timeline or deletion commitment, or does it say it is kept "as long as necessary"?
- Flags vagueness: If a policy says "we may share with partners for relevant offerings", it is labeled **Vague**, with the exact hedge highlighted.
- Flags absence: If retention duration is omitted, the Keep stage is honestly marked **Not Found**.

### 4. Verbatim Evidence & Verifiability
Source: `scope.md > What "Working" Looks Like`.
- Every "Stated" or "Vague" finding includes the exact quote extracted from the policy text.
- Quote Search & Context: Clicking a quote jumps to or highlights the matching clause in the full text view.
- Zero Hallucination: The system never fabricates sentences that do not exist in the policy text.

### 5. Necessity & Proportionality Analysis (Interpreted)
Source: `scope.md > The Unique Kernel`.
- Synthesizes a practical interpretation of whether the collected data is technically necessary for the app's core primary utility (e.g., location is necessary for food delivery delivery dispatch, but keeping it indefinitely or sharing with ad networks is secondary).
- Prominently marked with an **Interpretation** badge to distinguish analytical opinion from factual policy quotes.

### 6. Privacy Rights & Contact Discovery
Source: `scope.md > The POC Boundary`.
- Automatically extracts Grievance Officer details, Data Protection Officer (DPO) emails, and user deletion/opt-out instructions stated in the policy.
- Shows honest "Not Stated" if the policy fails to provide contact details.

---

## States and Boundaries

- **First Use / Idle State**: Welcome docket with sample quick-picks, clean explanation of the 4-stage trail methodology, and empty state guidance.
- **Analyzing State**: Visual scan animation with stage progress ("Parsing clauses...", "Discovering data categories...", "Mapping 4-stage trails...", "Verifying quotations...").
- **Trail Active State**: Data type pills available, primary 4-stage trail rendered, evidence inspector interactive.
- **Empty / Incomplete Input State**: If user submits empty or too-short text (<50 words), displays helpful guidance rather than breaking.
- **Fetch Error State**: If URL fetch fails (e.g. CORS restrictions), immediately explains the restriction honestly and gives a one-click button to paste text or load a sample.

---

## Product Decisions

- **No Aggregate Privacy Score**: An overall grade (e.g., "B-") obscures nuance and creates false confidence. Instead, DataTrail presents factual evidence across the 4 stages.
- **No Chatbot Interface**: Conversational interfaces require the user to ask the right questions and often hallucinate answers. The structured 4-stage trail ensures comprehensive inspection without prompt engineering.
- **Deterministic & Grounded Extraction**: Core extraction uses verified regex and clause-matching engines combined with structured reasoning, guaranteeing 100% quotation fidelity without hallucinations.
- **Clear Separation of Facts vs. Interpretations**: Directly quoted claims are styled distinctively from interpretive necessity assessments.

---

## What We're Building

- Full responsive web application built with React, TypeScript, and Tailwind CSS.
- Real India-relevant sample policies embedded in repo.
- Client-side policy analyzer engine with regex clause extraction, category detection, vagueness classification, and retention analysis.
- Interactive 4-stage visual journey component with stage nodes, animated conduits, and status chips.
- Interactive Evidence Inspector with verbatim quote attribution and policy search.
- Necessity Note module with clear interpretation disclaimers.
- Data Rights and Grievance Officer detector.
- Text paste, sample switcher, digital file upload, and URL fetcher with honest error handling.

---

## Deferred From the POC

- Multi-policy side-by-side comparative diffing matrix.
- Interactive "Ask the Policy" conversational query tool.
- User accounts and saved policy audit history.
- Optical Character Recognition (OCR) for scanned image-based PDFs.
- Multilingual translation (e.g., Hindi/regional languages).
- Play Store Data Safety claim vs. privacy policy comparison.

---

## Non-Goals

- Will NOT claim to monitor actual device network traffic or runtime sensor access.
- Will NOT calculate arbitrary numerical privacy scores or safety badges.
- Will NOT provide formal legal advice or statutory compliance certifications.
- Will NOT hallucinate quotes or claim evidence not found in the input text.
