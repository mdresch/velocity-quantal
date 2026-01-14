---
title: "Platform Blueprint — Enabling Low / No Working Capital Opportunities"
owner: "@mdresch"
authors:
  - "Menno Drescher"
version: "0.1.0"
date: "2026-01-14"
status: "draft"
---

## Objective

Design a lightweight, low-cost platform that enables individuals and small teams to discover, validate, run, and scale low/no working capital business opportunities. The platform's primary goal is to minimize upfront monetary requirements while providing tooling, workflow templates, evidence capture, and reporting needed for partner-program submissions and rapid pilots.

## Core principles
- Minimal friction: low onboarding effort, templates, one-click evidence capture.
- Reuse & productization: build repeatable templates and micro-products (templates, funnels, prompt packs).
- Evidence-first: every pilot produces verifiable artifacts (screenshots, deployment IDs, invoices, attestations).
- Lean automation: use serverless/no-code for low hosting cost and rapid iteration.
- Privacy & security: store only required metadata and user-approved evidence; follow best practices.

## Target users & roles
- Entrepreneur / Solopreneur: discovers opportunities, runs pilots, collects evidence, sells offers.
- Pilot Owner / Operator: configures a pilot, invites customers, tracks metrics.
- Mentor / Reviewer: provides validation, signs attestations, and rates pilot success.
- Program Manager: aggregates pilots, reports program-level KPIs, and prepares submissions.

## MVP feature set (must-haves)
1. Opportunity Directory: curated, taggable list of opportunities with templates and estimated effort.
2. Pilot Wizard: guided flow to configure a pilot (scope, target metrics, start/end dates, expected outcomes).
3. Evidence Capture Kit: standardized forms to attach deployment screenshots, invoices, customer attestations, tenant IDs, and certs.
4. Case-Study Generator: one-page case study template pre-filled from pilot metadata and evidence.
5. Reporting Dashboard: per-pilot and aggregate metrics (revenue, hours, MAU, deployments) exportable as PDF.
6. Templates Marketplace: host/sell micro-products (notion templates, prompt packs, Power BI packs).
7. Integrations: email templates, payment link (Stripe/Gumroad), GitHub/GitLab for code artifacts, and partner portals for evidence submission.

## Recommended tech stack (low-cost, serverless-first)
- Web frontend: React + Vite (existing repo) + Tailwind CSS.
- Backend: serverless functions (Azure Functions / AWS Lambda / Google Cloud Functions) for light compute.
- Database: managed serverless DB (Cosmos DB / DynamoDB / Firestore) for metadata; use small provisioning.
- Storage: object storage (Azure Blob / S3 / GCS) for evidence files with lifecycle rules.
- Authentication: OAuth + provider logins (GitHub, Google, Microsoft) and optional SSO for organizations.
- Payment: Stripe / Gumroad for micro-product sales and pilot fees.
- CI/CD: GitHub Actions for deployments and markdown checks.

## Data model (high level)
- Opportunity: id, title, category, tags, estimated effort, templateRef.
- Pilot: id, opportunityId, ownerId, customers[], status, startDate, endDate, metrics.
- Evidence: id, pilotId, type (screenshot, invoice, tenantId, cert), url, uploadedBy, timestamp.
- CaseStudy: id, pilotId, narrative, metricsSummary, customerConsentFlag.

## Minimal workflows
- Create Pilot → Invite customer → Run pilot → Capture evidence → Generate case study → Publish/Submit to partner portal.
- Publish Template → Set price/free → Add to Marketplace → Promote via landing page and funnels.

## KPIs and success criteria for pilots
- Initial capital generated (EUR/USD)
- Deployment count (tenant IDs or provisioning identifiers)
- Active users / MAU growth during pilot
- Time-to-first-evidence (hours)
- Conversion (pilot → paid offering)

## Security & compliance notes
- Redact or encrypt sensitive evidence (PII, payment details). Store only necessary metadata for partner submissions.
- Provide explicit customer consent flows for case studies and attestations.

## Roadmap (short term)
1. Week 1–2: Spec the MVP, wireframes, API surface, and evidence schema.
2. Week 3–4: Implement frontend pilot wizard, evidence forms, and minimal backend storage.
3. Week 5–6: Add case-study generator, dashboard, and PDF export.
4. Week 7–8: Integrate payments and marketplace listing flow; run 3 internal pilots.

## Next steps (actionable)
- Assign an owner for the platform (Pilot Program Manager).
- Create the MVP repo (branch `platform/mvp`) and scaffold with README, issues, and initial wireframes.
- Seed the Opportunity Directory with the top 20 validated ideas from `Docs/03-Opportunities.md`.
- Draft the evidence submission template and three pilot case-study drafts.

---
Owner: `@mdresch` — use this blueprint to scaffold the MVP and track progress in the project board.
