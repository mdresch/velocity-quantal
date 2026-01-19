---
title: "UI Requirements — Business Analyst (BA) — Velocity Quantal Prototype"
owner: "@mdresch"
version: "0.1"
date: "2026-01-15"
status: "draft"
---

Purpose
- Capture the UI requirements and acceptance criteria specifically for the Business Analyst (BA) persona to support the prototype-import site.

Scope
- BA-focused flows: dashboard analytics, audit & evidence inspection, license verification, exportable reports, and review workflows required for compliance assessments.

BA Persona & Goals
- Role: Reviews pilot submissions, validates credentials and evidence, produces compliance reports, and approves or routes pilots to partners.
- Primary goals: rapid assessment of evidence validity, easy filtering/search of submissions, auditable timelines, and exportable findings for stakeholders.

Primary BA Screens
- BA Dashboard — search, filters, KPIs, pending verifications, recent audit events.
- Pilot Detail / Evidence Viewer — preview files, view metadata (issuer, id, issuedAt, expiresAt), checksum, download originals.
- License Verification Panel — manual lookup, automated status, issuer details and verification provenance.
- Audit & Timeline View — chronological actions with user IDs, timestamps, and change reasons; export to CSV/JSON.

Key Interactions & Acceptance Criteria
- Quick Filters: BA can filter pilots by status, jurisdiction, protected-activity flag, verification state, and date range.
  - AC: Filter results update within 300ms in demo environment and show counts for each bucket.
- Evidence Inspection: BA can view evidence metadata and download original files.
  - AC: Evidence items show issuer, registryId, issued/expiry dates, checksum, and download link; downloads served by signed URLs.
- License Verification: BA can perform a manual lookup and see automated verification results.
  - AC: Verification shows `{status, details, source}` and a timestamp for the check.
- Audit Export: BA can export filtered audit events and evidence metadata as CSV/JSON.
  - AC: Export includes userId, action, targetId, timestamp, and evidence checksums.

Data & API Contracts (BA-focused)
- GET /api/pilots?filter... → list of pilot summaries with status, jurisdiction, createdAt, protectedActivity
- GET /api/pilots/:id → full pilot metadata
- GET /api/pilots/:id/evidence → evidence metadata list and signed download URLs
- POST /api/verify-license → { registry, registryId } → { status, details }
- GET /api/audit?filter... → chronological audit events (supports export)

Security, Compliance & Privacy
- RBAC: BA role must have read/export and verification privileges but not destructive operations unless explicitly granted.
- Audit: All BA actions (view, verify, export) must be logged with userId and timestamp.
- PII minimization: show only necessary identifiers; redact or hash sensitive fields in public or shared exports.

Non-functional Requirements
- Prototype interactions should feel responsive (<300ms local/demo where feasible).
- Basic accessibility: keyboard navigation and adequate contrast for primary BA flows.

Prototype Deliverables (for prototype-import)
- Clickable BA Dashboard, Pilot Detail/Evidence Viewer, License Verification panel, and Audit export action.
- Mock endpoints to support BA flows: pilots list, evidence list, verify-license, audit export.

Notes for Implementation
- Annotate screens with ACs and API hooks so BA reviewers can exercise verification and export flows during stakeholder demos.
- Keep evidence downloads behind signed URLs and display verification provenance next to license results.

---
