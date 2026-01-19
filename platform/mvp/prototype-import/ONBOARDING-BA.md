---
title: "BA Onboarding Guide — Velocity Quantal Prototype"
owner: "@mdresch"
date: "2026-01-15"
status: "draft"
---

Purpose
- A short, scripted demo checklist to onboard a Business Analyst (BA) into the `prototype-import` prototype for stakeholder review sessions.

Prerequisites
- Local dev: have the prototype running locally (see `platform/mvp/prototype-import/README.md`).
- Ensure mock APIs available: `/api/pilots`, `/api/pilots/:id/evidence`, `/api/verify-license`, `/api/audit` (these are mocked in the prototype). 
- Files to review: `BA-UI-Requirements.md` (this folder) for acceptance criteria and API hooks.

Quick checklist (before demo)
- Create or assign a `ba` demo account with read/verify/export permissions.
- Open the demo dataset (sample pilots) in the prototype.
- Confirm signed download URLs for evidence items are present in the evidence metadata.

Scripted Demo Steps
1. Role selection: Select the `Business Analyst` role from the role selection screen to open the BA Dashboard.
2. Dashboard overview: Show KPIs (pending verifications, recent exports) and use Quick Filters to target a pilot by jurisdiction and `protected-activity` flag.
   - Expected: filters update quickly and display counts per bucket.
3. Open a pilot: Click a sample pilot to open `Pilot Detail` and `Evidence Viewer`.
   - Inspect metadata: `issuer`, `registryId`, `issuedAt`, `expiresAt`, `checksum` should be visible for each evidence item.
4. Verify license: In the `License Verification` panel, run a manual lookup for a listed `registryId`.
   - Expected: verification returns `{status, details, source}` and a timestamp; verification action logged to audit.
5. Download evidence: Click the signed download URL and confirm the file is retrievable (for demo: mock signed URL works).
6. Add reviewer note / flag: Demonstrate adding a reviewer note or flagging an issue on evidence.
7. Export audit slice: Filter audit events for the pilot and export as CSV/JSON. Open the export and confirm it includes `userId`, `action`, `targetId`, `timestamp`, and `evidence checksum`.

Onboarding checklist for the BA (post-demo)
- Can filter and find pilot subsets by `protected-activity` and jurisdiction.
- Can run and interpret license verification and see provenance.
- Can download signed evidence and verify checksums offline if needed.
- Can export an audit slice suitable for stakeholder reporting.

Notes for demo hosts
- Point attendees to `BA-UI-Requirements.md` for ACs and to `platform/mvp/prototype/pages.md` for annotated screens.
- If a verification returns `not_found` or `expired`, demonstrate partner-licensed fallback notes and where the BA can record justification.
- For long demos, use the mock API endpoints to simulate `verified` and `not_found` states.

Troubleshooting
- If evidence downloads fail locally, confirm the mock signer is running or open the signed URL to inspect the mock response.
- If filters are slow in your environment, reduce dataset size or run a dev server mode optimized for local demos.

Next steps
- Add this guide link to `prototype-import/README.md` and surface a small demo dataset named `ba-demo.json` under `platform/mvp/prototype-import/public/demo/` for repeatable sessions.
