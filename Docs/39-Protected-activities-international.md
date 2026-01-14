---
title: "Protected Activities & Licensed Resources — International Guidance"
owner: "@mdresch"
authors: ["Menno Drescher"]
version: "0.1"
date: "2026-01-14"
status: "draft"
---

Purpose
- Practical, jurisdiction-agnostic guidance to help operators and startups identify operational activities that commonly require licensed, certified or otherwise qualified resources across countries.

Scope
- Focuses on the common denominators (risks, regulatory triggers, evidence types, verification steps) rather than exhaustive country-specific rules.
- Helps build a compliance-first checklist for pilots and partner submissions.

Common denominators that indicate an activity is "protected" or regulated
- Direct impact on health or bodily safety (clinical procedures, diagnostics, therapeutic interventions).
- Material risk to financial consumers or markets (investment advice, custody, payment processing).
- Use, handling or distribution of controlled substances, hazardous materials, or regulated goods (pharmaceuticals, pesticides, industrial chemicals, firearms).
- Legal authority or acts that require sworn/commissioned status (notarial acts, court representation, process serving).
- Public safety or security functions (armed/private security, alarm monitoring with enforcement, explosives handling).
- Services that materially affect children, vulnerable persons, or controlled environments (childcare, eldercare, certain social services).
- Environmental risk or large-scale waste/transport operations (hazardous waste handling, storage of polluting substances).
- Critical infrastructure operations and safety-critical engineering (gas/electrical installations, heavy civil works).

Typical evidence and qualifications regulators expect
- Professional registration numbers (national/state registers, e.g., medical, legal, engineering boards).
- Site or corporate licences and permits (environmental permits, operating licences, pharmacy wholesale licences).
- Personnel certifications and verifiable training records (certificates, accredited course IDs, expiry dates).
- Insurance and indemnity evidence (professional liability, statutory insurances where mandated).
- Operational attestations and technical test reports (safety certificates, calibration logs, inspection reports).
- Organizational governance evidence (policies, SOPs, quality management systems, responsible officer assignment).

Practical, jurisdiction-agnostic verification steps
1. Define the operational scope precisely (what will be done, where, and who will perform it).  Map activities to risk categories above.
2. Search global and regional authoritative sources for keywords (examples: "medical practice registration", "engineer licence", "controlled goods import license", "childcare licensing").
3. Check business registry and classification codes (e.g., national company registers, SIC/SBI/NAICS equivalents) for required permits linked to the activity.
4. Contact local regulator(s) early — many licensing programs have consultation or pre-application guidance for new service models.
5. Verify personnel credentials via the issuing authority's public register where available (cross-check registration numbers and status).
6. Capture documentary evidence in a standard `evidence` dossier: copies of licences, registration screenshots, signed attestations, test/inspection reports, insurance certificates.
7. Build contingency controls: scoped disclaimers, referral or escalation paths to licensed providers, and clear RBAC/segregation so unlicensed staff cannot perform licensed acts.

How to design pilots and submissions to satisfy partners/regulators
- Evidence-first: prepare a compact evidence bundle containing key licences, personnel registrations, insurance and a short runbook describing how licensed activities will be managed.
- Minimize scope: where possible, scope pilots to non-protected activities or build integrations with verified, licensed third-party providers for the protected components.
- Use technical and organizational controls: API gating, role-based access controls, approval workflows, and audit logging to prove segregation and oversight.
- Time-box license acquisition: if licences are required, map expected lead times into the project plan and include interim mitigations (e.g., supervised operations under a licensed partner).

Practical tips for international projects
- Assume variance: regulatory triggers differ by country and often by sub-national jurisdiction (state/province/municipality). Plan per-jurisdiction checks for deployment targets.
- Prefer authoritative sources: national regulator websites, professional board registries, official gazettes, and trade/industry associations.
- Leverage partners: use licensed local partners or professional services firms to cover high-risk activities when quick market access is needed.
- Standardize evidence: store licences and credential metadata (issuer, ID, issue/expiry date, scope/limitations) in a machine-readable format for audits and RAG-style retrieval.
- Track renewals: capture expiry information and issuance scope in your compliance dashboard to avoid lapses during pilots.

References & research starting points (examples by domain)
- Healthcare: national medical and nurse registration boards, WHO country pages.
- Finance: national financial regulators, AML/CTF rules, central bank guidance.
- Food & goods: national food safety agencies and customs authorities.
- Environment & transport: environmental agencies, ADR/IMDG regulations for hazardous goods transport.
- Construction & utilities: national building authorities, electrical/gas safety regulators.

Limitations & legal note
- This document provides practical, non-exhaustive guidance. Licensing requirements are jurisdiction-specific and sometimes fact-dependent. For definitive advice engage local counsel or specialized compliance consultants.

Next actions (recommended)
- Create a machine-readable `Docs/evidence-template.md` and link protected-activity types to required evidence fields.
- Seed three pilot case studies with evidence bundles showing «licensed component» vs «partnered/outsourced» approach.

---

For legal certainty: have an attorney or local compliance expert validate obligations for each target jurisdiction before operations begin.