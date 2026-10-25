---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Project scaffold and policy input bar with real samples**
  Becomes usable: A running Vite + React + Tailwind CSS app showing the DataTrail header and policy input bar with selectable real India-relevant samples (Swiggy, Zomato, WhatsApp), custom text paste with live word count, and file upload.
  Why now: Proves the whole foundation and data ingestion pipeline end to end so all subsequent trail slices have real policy text to work with.
  PRD ref: `prd.md > The Core Journey` (step 1), `prd.md > Screens and Layout`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Components (1. Header, 2. Policy Input Bar)`
  Build: Initialize package.json with React 19, Vite, Tailwind CSS, Lucide React; configure TypeScript and Tailwind; implement real policy samples data, Header, and PolicyInputBar components.
  Verify (mechanical): Run dev build and confirm clean compilation and rendering of sample policies and text input.
  Learner check: Open the app, switch between sample policies, and confirm the text updates with full policy clauses.
  Commit: `Scaffold project and implement policy input bar with real samples`

- [x] **2. Deterministic policy analyzer engine with category discovery and quote verifier**
  Becomes usable: The semantic policy analyzer parses any input text, extracts clauses, discovers personal data categories (Geolocation, Device IDs, Contacts, etc.), classifies Collect/Use/Share/Keep stages with honesty badges (stated, vague, not found), and validates quote substrings against source text.
  Why now: Delivers the core intelligence kernel that prevents quote hallucination and powers the entire visual trail.
  PRD ref: `prd.md > Features and Behavior (2. Intelligent Data Type Discovery, 3. The Four-Stage Trail, 4. Verbatim Evidence)`
  Spec ref: `spec.md > Components (3. Data Type Selector)`, `spec.md > Data Model`, `spec.md > Engine Architecture`
  Build: Implement `patterns.ts`, `quoteVerifier.ts`, `rightsExtractor.ts`, and `analyzer.ts`; wire into `usePolicyAnalysis` hook and `DataTypeSelector` component.
  Verify (mechanical): Run verification test confirming accurate clause extraction, honesty status labeling, and quote substring verification on sample policies.
  Learner check: Click "Investigate Policy" on a sample, see discovered data type pills, and observe how each type lists its stage completion.
  Commit: `Add deterministic policy analyzer engine and data type discovery`

- [x] **3. Interactive 4-Stage Trail board with animated conduits and honesty badges**
  Becomes usable: The central interactive visualization of Collect → Use → Share → Keep for the selected data type, complete with honesty badges (Stated, Vague, Not Found), findings, verbatim quote previews, and animated trail connectors.
  Why now: Implements the central unique kernel of DataTrail that transforms static text into an interactive, followable personal data journey.
  PRD ref: `prd.md > Features and Behavior (3. The Four-Stage Trail)`, `prd.md > The Core Journey` (steps 3-4)
  Spec ref: `spec.md > Components (4. Trail Board, TrailNodeCard)`, `spec.md > Look and Feel`
  Build: Implement `TrailBoard.tsx` and `TrailNodeCard.tsx` with color-coded honesty states, animated SVG conduits, responsive layout, and stage findings.
  Verify (mechanical): Render Swiggy sample, select Geolocation, verify Collect, Use, Share, and Keep cards display correct honesty states and exact quotes.
  Learner check: Select different data types (Location vs. Contacts) and observe how the trail dynamically adapts its stages and quotes.
  Commit: `Implement interactive 4-stage trail board with honesty badges`

- [x] **4. Evidence drawer with quote context, necessity interpretation, rights panel, and full text inspector**
  Becomes usable: Deep inspection experience: slide-out Evidence Drawer with verbatim quotes and highlighted hedge words, Necessity & Proportionality card with explicit interpretation badge, Grievance Officer & DPO rights panel, and Full Policy Text Inspector modal with search.
  Why now: Completes the full end-to-end investigative loop, ensuring transparency about uncertainty and enabling thorough evidence verification.
  PRD ref: `prd.md > Features and Behavior (4. Verbatim Evidence, 5. Necessity Analysis, 6. Privacy Rights)`
  Spec ref: `spec.md > Components (5. Evidence Drawer, 6. Necessity Card, 7. Rights Panel, 8. Policy Text Inspector)`
  Build: Implement `EvidenceDrawer.tsx`, `NecessityCard.tsx`, `RightsPanel.tsx`, and `PolicyTextInspector.tsx`; integrate into `App.tsx` with keyboard navigation and URL fetch fallback handling.
  Verify (mechanical): Run full build, click evidence drawer, verify exact quote highlighting, test necessity note display, and test custom policy paste changing all findings.
  Learner check: Open the evidence drawer on a stage, read the verbatim policy quote, check the Grievance Officer details, and paste custom text to see the entire app adapt.
  Commit: `Add evidence drawer, necessity analysis, rights panel, and full text inspector`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 2 (Category discovery & verified quote extraction)
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: End-to-end verified build across 4 cohesive slices; 100% passing tests for category discovery, quote substring validation, and grievance redressal extraction; full production Vite build.
Route and stops: src/engine/analyzer.ts (tokenizer & stage classifier) → src/engine/quoteVerifier.ts (verbatim quote verification) → src/components/TrailBoard.tsx (4-stage visual trail) → src/components/EvidenceDrawer.tsx (deep clause inspector) → src/components/NecessityCard.tsx (analytical interpretation & runtime transparency).
Edit outcome: Clean production build with Vite 6 + React 19 + TypeScript + Tailwind CSS; verified responsive layout.
Reflection: Focused on verifiable evidence over generative summaries; zero hallucinations guaranteed by design.
Activity mode: live app and editor with full unit tests and static asset bundle. 

## Revisions
