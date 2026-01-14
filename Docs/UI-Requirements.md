---
title: "UI Requirements — Velocity Quantal MVP (v0)"
owner: "@mdresch"
authors: ["Menno Drescher"]
version: "0.1"
date: "2026-01-14"
status: "draft"
---

Purpose
- Capture UI/UX requirements, acceptance criteria and data/API contracts to support a v0 prototype for stakeholder review.

Scope
- Role-focused flows: Mentor, Student, Entrepreneur, Admin/Audit.
- Key features: Pilot submission & evidence upload, license/credential verification, RBAC, audit logging, basic analytics, notification & review workflow.

Personas
- Mentor: reviews pilot submissions, provides approval/feedback, routes protected-activity components to licensed partners.
- Student: submits onboarding info, applies for mentorship and pilot tasks, uploads evidence artifacts.
- Entrepreneur: creates pilot projects, tracks KPIs, invites participants, provides business-level attestations.
- Admin/Auditor: views evidence bundles, verifies credentials, runs compliance reports.

Primary Screens (v0)
- Landing / Role selection
- Dashboard (role-specific) — lists active pilots, tasks, outstanding verifications
- Pilot submission form — metadata, scope, protected-activity flags, evidence upload
- Evidence viewer — preview docs, certificates, test reports, registration screenshots
- License verification panel — manual lookup & automated status indicator
- Admin audit view — timeline, change history, exportable evidence bundle

Core User Stories & Acceptance Criteria
- As a user I can submit a pilot with evidence attached so reviewers can verify compliance.
  - AC: Submission requires metadata (owner, scope, jurisdiction) and at least one evidence item when protected-activity flag set.
- As a reviewer I can see license status and validate credential details.
  - AC: Reviewer can view issuer, id, issue/expiry, and download source document.
- As an admin I can audit all actions with timestamps and user IDs.
  - AC: Every evidence upload, approval, and license check is logged and exportable as CSV/JSON.

Data & API Contracts (v0 minimal)
- POST /api/pilots
  - body: { title, ownerId, scope, jurisdictions[], protectedActivityFlags[], metadata }
- POST /api/pilots/:id/evidence
  - multipart/form-data: file, type, issuer, registryId, issuedAt, expiresAt, notes
- GET /api/pilots/:id/evidence
  - returns list of evidence metadata and signed download URLs
- POST /api/verify-license
  - body: { registry, registryId } → returns { status: "verified"|"not_found"|"expired", details }

Security & Compliance
- RBAC: roles = [student, mentor, entrepreneur, admin]. Default least-privilege.
- All uploads are scanned and stored in immutable object store with versioning and retention policy.
- Audit trail with cryptographic checksums for uploaded evidence.
- PII minimization: only store necessary identifiers; redact sensitive fields in public views.

Non-functional (v0)
- Prototype must be deployable via static hosting + simple serverless APIs (Azure Functions / AWS Lambda / GCP Cloud Functions).
- Latency: UI interactions < 300ms for local/demo environment.
- Accessibility: basic WCAG contrast and keyboard navigation for major flows.

Prototype scope for v0.dev session
- Implement 4 clickable screens: Role selection → Dashboard → Pilot submission → Evidence viewer.
- Annotate each screen with acceptance criteria and highlight compliance checkpoints (where licensed resources are required).
- Exportable guidance for v0.dev: wireframe images, page copy and button actions (provided in `platform/mvp/prototype/pages.md`).

User Elicitation & Matching Integration
- Purpose: capture the minimum set of user data needed for matching people to low/no CapEx opportunities and show fit in the UI.
- Key fields exposed in v0 UI: availability (hours/week), top 4 skill ratings, certifications (name + issuer + ID), years experience, device/internet availability, willingness to upskill/partner, preferred roles and language.
- Form behaviour:
  - Progressive disclosure: show required scored fields up front; defer optional profile fields to a follow-up screen.
  - Inline validation: skill ratings 0–5, availability enumeration, consent checkbox required to submit.
  - Evidence upload: allow attaching certification files and add metadata fields (issuer, id, expiry).
- Acceptance criteria:
  - AC1: User can complete the elicitation form in <10 minutes and submit with consent.
  - AC2: Submitted profile returns a matching score from `/api/match` (mock) and displays `Fit` badge (High/Medium/Low) with rationale.
  - AC3: If `protected-activity` flag is set on a pilot, the submission UI requires at least one verified certification or a partner-licensed fallback note.
  - AC4: All uploads are listed in Evidence viewer with metadata and checksum; reviewer can download originals.
- API hooks (v0 mocks):
  - `POST /api/profile` — accepts form payload and returns profile id
  - `POST /api/match` — accepts profile id and returns `{score, fitLevel, rationale}` (mocked in prototype)
  - `POST /api/verify-cert` — accepts `{issuer, id}` and returns `{status}` (mocked automated lookup)
- Privacy & consent:
  - Show explicit consent text in the form footer documenting evidence verification and partner sharing.
  - Store only metadata and hashed identifiers in the demo evidence store; original files are available to reviewers only.

Deliverables
- `platform/mvp/prototype/` assets (pages + README) to import into v0.dev or similar prototyping tools.
- Implement basic endpoints as mocks under `platform/mvp/src/api-mocks` for demo.
- `Docs/UI-Requirements.md` (this file) — acceptance criteria and API contracts.

Next steps
- Build clickable v0 prototype from `platform/mvp/prototype` assets and run a 1-hour stakeholder review session.  Collect feedback and convert to detailed tickets.

---

