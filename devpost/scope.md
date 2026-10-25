---
doc: scope
status: approved
---

# DataTrail

An interactive privacy-intelligence product that turns a real privacy policy into a followable data journey—collect, use, share, keep—with evidence, not a summary or a score.

## The Unique Kernel
Follow one kind of personal data through the policy as an interactive trail. Every step shows the policy’s own sentences, labels **stated / interpreted / vague / not found**, and makes gaps visible on the trail itself. If you removed the trail and the honesty labels, it would be another summarizer.

## Who It's For
Someone about to trust an app (or a judge acting like that person) who skips the policy today because it is long and legal. They want to see how location, contacts, or similar data are claimed to move—without being told the app is “safe” or “unsafe.”

## The Core Loop
Open DataTrail → start a real sample or provide a policy → wait through real analysis → pick a data type → walk collect → use → share → keep → open evidence → notice a foggy or missing step and a necessity note → try another type or another policy.

## Inspiration & Identity
Investigation, evidence, connections, transparency, uncertainty. Premium privacy intelligence—not a chatbot, not a SaaS dashboard, not a glowing generic AI kit. Calm dark surface, precise type, a trail that feels like a map of claims. Motion only to show flow. India-relevant sample (a policy people actually meet), English product.

## Why This Matters to the Learner
They want a professional, memorable hackathon product that actually works end to end, not a tutorial site. They are new to full apps and agents; the docs carry the plan so the build can stay aligned.

## What "Working" Looks Like
A judge opens DataTrail, runs a **real** in-repo sample through the **same** analyzer, follows e.g. location with **real quotes**, sees a vague or not-found stage treated honestly, reads an **interpreted** necessity note, then pastes another policy and the trail **changes**. No hardcoded findings. No privacy score.

## The POC Boundary
Policy analyzer (claims, not runtime). Sample + paste guaranteed; URL and digital `.txt`/`.pdf` included with honest failure. Types discovered from the text. Four-stage trail. Quote checks. Vagueness on the trail. Necessity as interpretation. Next steps only when the policy states a contact or control. Polished landing, loading, trail, evidence, empty, and errors.

## Later
Compare two policies; ask-the-policy chat; accounts; OCR; Word; Wayback history; Play/Exodus claim-vs-reality; Hindi UI; cross-app footprint; generated legal letters as a product.

## Explicitly Cut
- Privacy **score** as the main UI — it hides evidence.
- **Chatbot** as the main UI — it is a summarizer in a bubble.
- Hardcoded sample-only trails — kills the kernel.
- Runtime “we watched the app” detective (traffic, sensors) — not accessible.
- Play Data Safety / Exodus as v1 core — brittle, mismatched to pasted policies, still not runtime truth.
- “Any URL always works,” scanned-PDF OCR, legal advice, DPDP compliance checker.
