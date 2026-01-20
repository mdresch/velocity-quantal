---
title: "BA Prioritized Backlog — UI Stories (v0)"
owner: "@mdresch"
version: "0.1"
date: "2026-01-14"
status: "draft"
---

This backlog captures Business-Analyst–prioritised UI stories for the v0 prototype, with acceptance criteria, minimal API hooks and suggested owners/estimates.

1) Profile Elicitation (Progressive) — Priority: P0
- Story: Guided, progressive profile elicitation that collects the minimum matching fields and allows save/return.
- ACs:
  - AC1: User completes required scored fields in <10 minutes.
  - AC2: Consent checkbox is required to submit.
  - AC3: `/api/profile` returns `profileId` and `/api/match` returns `{score,fitLevel,rationale}` displayed as a badge.
- API (mocks): `POST /api/profile` body: {name,email,availability,skills,experienceYears,certifications?,willingToUpskill?,willingToPartnerLicensed?}
  - sample response: {profileId: "p123"}
  - `POST /api/match` body: {profileId} → {score,fitLevel,rationale}
- Owner: BA/UX; Dev estimate: 2–3 days

2) Pilot Submission + Protected-Activity Gating — Priority: P0
- Story: Entrepreneurs submit pilots; when `protectedActivity` true require either a verified certification or a partner-licensed fallback note.
- ACs:
  - AC1: Pilot submission requires owner, title, scope, jurisdiction.
  - AC2: If `protectedActivity==true` UI prevents submit unless evidence with verified cert OR a partner fallback note is provided.
  - AC3: Evidence upload metadata (issuer,id,issuedAt,expiresAt,notes) stored and viewable.
- API (mocks): `POST /api/pilots` ; `POST /api/pilots/:id/evidence` (multipart + metadata)
- Owner: Product; Dev estimate: 2–3 days

3) Evidence Viewer & Verification Panel — Priority: P0
- Story: Reviewers can see all evidence items with metadata, download originals, view verification status and checksum.
- ACs:
  - AC1: Each evidence row shows issuer, id, issuedAt, expiry, verification status and checksum.
  - AC2: Click → download original (signed URL) and open verification details.
  - AC3: Manual verify action calls `/api/verify-cert` and stores audit event.
- API (mocks): `GET /api/pilots/:id/evidence` ; `POST /api/verify-cert` body:{issuer,id} → {status,details}
- Owner: QA/Dev; Dev estimate: 2 days

4) Mentor Opportunities & Profile→Opportunity Matching — Priority: P1
- Story: Mentors create opportunities with required skills/certs; entrepreneurs compare profiles to opportunities (fit badge + rationale).
- ACs:
  - AC1: Mentor can create `Opportunity` with title, requiredSkills, preferredAvailability, requiredCerts, requiresLicensedPartner.
  - AC2: Entrepreneur can select profileId and run match → `matchProfileToOpportunity` result shown with rationale.
- API (mocks): `POST /api/opportunities`, `GET /api/opportunities`, `POST /api/match/opportunity` (or `POST /api/matchProfileToOpportunity`)
- Owner: Mentor PM; Dev estimate: 1–2 days

5) Role Dashboards + RBAC — Priority: P1
- Story: Role-specific dashboards (Mentor, Student, Entrepreneur, Admin) listing pilots, opportunities, pending verifications and quick actions.
- ACs:
  - AC1: Dashboard filters by role and shows actionable items with counts (e.g., 3 pending verifications).
  - AC2: RBAC: only `admin` sees audit exports; mentor sees create opportunity; student sees onboarding tasks.
- API (mocks): `GET /api/dashboard?role=mentor` (aggregate mock)
- Owner: PM; Dev estimate: 2–3 days

6) License Verification Integration (Mock) — Priority: P2
- Story: Provide a verification lookup UI that calls mocked registry and surfaces statuses (verified, expired, not_found).
- ACs: `POST /api/verify-license` returns {status,sourceUrl,notes}; UI shows green/yellow/red badges.
- Owner: Compliance; Dev estimate: 1 day

7) Admin Audit View & Export — Priority: P2
- Story: Admin can view an immutable audit timeline of actions and export CSV/JSON of evidence bundles.
- ACs: Audit shows timestamp, userId, action, targetId; export includes signed URLs and checksums.
- API (mocks): `GET /api/audit?pilotId=...` ; `GET /api/audit/export?format=csv|json`
- Owner: Admin; Dev estimate: 2 days

8) Demo Script & Seed Data — Priority: P2
- Story: Provide an automated seed routine and step-by-step demo script for stakeholder session (profiles, pilots, opportunities pre-seeded).
- ACs: Running `seed/dev` populates sample profiles/pilots/opps; demo doc lists 6 scripted flows.
- Owner: BA/Dev; Dev estimate: 0.5–1 day

Notes / Next BA tasks
- Convert these backlog items into GitHub Issues with labels `P0/P1/P2`, estimates, and acceptance criteria.
- Produce annotated wireframes (screens: Profile Elicitation, Pilot Submit, Evidence Viewer, Mentor Opportunity, Dashboards) marking compliance gates.
- Prepare a 1-hour stakeholder demo checklist (start state, flows, expected verification outcomes).

References
- `Docs/UI-Requirements.md` — source acceptance criteria and API hooks.
- `Docs/Opportunities 2026 - No Working Capital.txt` — program-level requirements, personas and process constraints.
