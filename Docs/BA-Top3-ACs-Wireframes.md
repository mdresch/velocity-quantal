---
title: "BA Detail — Profile, Pilot Submission, Evidence Viewer (ACs & Wireframes)"
owner: "@mdresch"
version: "0.1"
date: "2026-01-14"
status: "draft"
---

This document expands the top three backlog items into detailed acceptance criteria and annotated wireframes to guide implementation and QA.

1) Profile Elicitation (Progressive)

Purpose: collect the minimum matching fields quickly with progressive disclosure, save/return, consent, and match feedback.

Detailed Acceptance Criteria
- Functional
  - FA1: The form must present a 3-step progressive flow: Basic Info → Scored Fields → Optional Details.
  - FA2: Required fields in step 1: `name`, `email`, `availability` (enum), consent checkbox (must be checked before submit).
  - FA3: Step 2 must collect top 4 skill ratings (0–5), `experienceYears` (integer >=0), certifications list (name, issuer, id, expiry optional).
  - FA4: User may `Save Draft` at any step; draft persists to localStorage and returns to same step on revisit.
  - FA5: On final submit the UI calls `POST /api/profile` and receives `{profileId}`; then calls `POST /api/match` with `{profileId}` and displays the returned `{score,fitLevel,rationale}`.

- Validation & Edge Cases
  - VA1: Inline validation messages for missing required fields and out-of-range skill values; skill input constrained to integers 0–5.
  - VA2: Email must be RFC-like; show friendly error if invalid.
  - VA3: If network error on submit, save payload to localStorage and show retry CTA.

- API & Data Contract
  - Request: `POST /api/profile` body: {name,email,availability,skills:{k:n},experienceYears,certifications:[{name,issuer,id,expiry}],willingToUpskill?,willingToPartnerLicensed?}
  - Response: { profileId: string }
  - Request: `POST /api/match` body: { profileId }
  - Response: { score:number, fitLevel:'High'|'Medium'|'Low', rationale:string[] }

- Telemetry / Audit
  - Emit `profile.submitted` with `profileId`, `fitLevel`, and `score`.
  - Emit `profile.draft.saved` with `step` and `fieldsSaved` count.

- Accessibility
  - All inputs must have associated labels; focus order linear; keyboard-operable step navigation; color contrast meets WCAG AA for badges.

Annotated Wireframe (elements & notes)
- Top: `Header` — app title, role indicator, `Save Draft` (top-right) — persists state.
- Progress bar: shows step (1/3, 2/3, 3/3) with short text for each phase.
- Step 1 (Basic Info)
  1. `Name` (text) — required
  2. `Email` (email) — required
  3. `Availability` (select) — required
  4. `Consent` (checkbox) — required to enable Next
  5. `Next` (button) — disabled until required fields valid
- Step 2 (Scored Fields)
  1. `Top 4 skills` — four labeled numeric inputs 0–5 with tooltips ('0=no experience,5=expert')
  2. `Years experience` — numeric
  3. `Upload certification` (optional) — opens Evidence upload modal
  4. `Prev` / `Next`
- Step 3 (Optional Details)
  1. `Device/internet availability` (radio/select)
  2. `Willing to upskill` (checkbox)
  3. `Preferred roles/languages` (tags)
  4. `Submit` (primary) — posts profile then runs match; show spinner and then result badge
- Result area (post-submit)
  - `Fit Badge` (High/Medium/Low) with score and an expandable `rationale` list

2) Pilot Submission + Protected-Activity Gating

Purpose: allow entrepreneurs to submit pilots, enforce compliance gating for protected activities, and collect evidence metadata.

Detailed Acceptance Criteria
- Functional
  - FA1: Form fields: `title`, `description`, `ownerId` (auto if logged), `jurisdiction`, `protectedActivity` (boolean), `metadata`.
  - FA2: When `protectedActivity==true`, the UI requires either (A) at least one evidence item containing a verified certification OR (B) a `partnerFallbackNote` explaining licensed partner fallback — otherwise block submission.
  - FA3: Evidence upload supports file selection + metadata: `{type, issuer, registryId, issuedAt, expiresAt, notes}` and displays a client-side checksum (SHA-256) before upload.
  - FA4: Submission calls `POST /api/pilots` and then uploads evidence with `POST /api/pilots/:id/evidence` (multipart + metadata). Server returns `pilotId` and evidence `id`s.

- Validation & Edge Cases
  - VA1: Prevent duplicate pilot titles for same owner (warning, allow submit with confirmation).
  - VA2: Reject uploads > 10MB (v0 constraint) and disallow executable file types; show detailed error.
  - VA3: If evidence upload fails, show per-file retry; do not lose previously entered form data.

- API & Data Contract
  - `POST /api/pilots` body: { title, ownerId, description, jurisdiction, protectedActivity, partnerFallbackNote? }
  - Response: { pilotId }
  - `POST /api/pilots/:id/evidence` multipart: file + fields {type,issuer,registryId,issuedAt,expiresAt,notes}
  - Response: { evidenceId, checksum }

- Telemetry / Audit
  - Emit `pilot.created` with `pilotId`, `ownerId`, `protectedActivity` flag.
  - Emit `evidence.uploaded` per file with `evidenceId`, `pilotId`, `uploaderId`, checksum.

- Accessibility
  - Provide descriptive alt text for upload icons; progress indicators accessible to screen readers.

Annotated Wireframe (elements & notes)
- Header: `Back to Dashboard` + `Save Draft`
- Form area
  1. `Title` (input) — required
  2. `Description` (textarea) — required
  3. `Jurisdiction` (input/select) — required for compliance routing
  4. `Protected activity` (checkbox) — toggles gating UI
  5. `Evidence Upload` component — drag/drop + file list with metadata fields per item and computed checksum
  6. `Partner fallback note` (textarea) — shown when `protectedActivity` and no verified evidence
  7. `Submit` (primary) — disabled until gating satisfied
- Evidence list (after upload)
  - Each row: filename, type, issuer, registryId, issuedAt, expiry, checksum, verification status, retry/delete actions

3) Evidence Viewer & Verification Panel

Purpose: allow reviewers and admins to view, verify and export evidence bundles; surface verification state and provenance.

Detailed Acceptance Criteria
- Functional
  - FA1: Given a `pilotId`, UI lists all evidence items with metadata, computed checksum, verification status and download link.
  - FA2: Reviewer can click `Verify` on an evidence item which calls `POST /api/verify-cert` or `POST /api/verify-license` depending on evidence type; response updates verification status inline.
  - FA3: Admin can `Export Bundle` which packages metadata + signed download URLs and audit log into a downloadable JSON/ZIP.

- Validation & Edge Cases
  - VA1: Show offline/failed verification reasons with timestamps; allow manual override with required `reviewerNote` (audit entry created).
  - VA2: If file removed from storage, show `missing` state and an audit entry; allow re-upload with preserved metadata.

- API & Data Contract
  - `GET /api/pilots/:id/evidence` → [{ evidenceId, filename, type, issuer, registryId, issuedAt, expiresAt, checksum, verification:{status,checkedAt,source}}]
  - `POST /api/verify-cert` body: { evidenceId, issuer, registryId } → { status:'verified'|'expired'|'not_found', details }
  - `GET /api/audit?pilotId=` → timeline entries

- Telemetry / Audit
  - Emit `evidence.verified` with `evidenceId`, `verifierId`, `status`, and `source`.
  - All manual overrides emit `audit.entry` with `actorId`, `action`, `reason`.

- Accessibility
  - Verification status uses both color and iconography + `aria-live` region for status updates.

Annotated Wireframe (elements & notes)
- Top: `Pilot title` + `Export Bundle` (admin only)
- Evidence list table
  Columns: Checkbox (select), Filename (link), Type, Issuer, RegistryId, IssuedAt, ExpiresAt, Checksum, Verification (icon + text), Actions (Verify, Download, Replace)
- Verification panel (drawer/modal)
  - Shows registry lookup details, source URL, timestamps, and confidence; `Confirm` and `Reject` actions with comment box (required when rejecting).

Test Scenarios (high priority)
- T1: Submit minimal profile, get match result displayed and telemetry emitted.
- T2: Submit protected pilot without evidence — UI blocks submit and shows gating message.
- T3: Upload certificate with ID containing `VER` → mock verify returns `verified` and pilot submission proceeds.
- T4: Reviewer verifies evidence, status updates, and `evidence.verified` audit is created; export bundle contains signed URLs and checksums.

Deliverables
- This file + annotated wireframe definitions (above) are ready for conversion into UI mockups or Zeplin/Figma assets.

Next actions
- Convert wireframe annotations into visual mockups (Figma/PNG) and attach to tickets.
- I can convert each AC box into GitHub Issues with the acceptance checklist if you want — proceed? 
