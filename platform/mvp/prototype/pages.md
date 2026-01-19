Role selection
- Title: Velocity Quantal — Choose your role
- Elements: role buttons (Mentor / Student / Entrepreneur / Admin)
- Action: clicking role opens role-specific Dashboard
- Notes: annotate where RBAC restrictions begin

Dashboard (Mentor)
- Title: Mentor Dashboard
- Elements: pilot list, pending verifications, quick actions (review, request clarification, escalate)
- Actions: open pilot → evidence viewer; click verify → license panel
- Annotation: indicate protected-activity flag and required evidence types

Dashboard (Business Analyst)
- Title: Business Analyst (BA) Dashboard
- Elements: searchable pilot list, quick filters (status, jurisdiction, protected-activity, verification state), KPIs (pending verifications, recent exports), recent audit events, selected pilot summary panel
- Actions: open pilot → Pilot Detail / Evidence Viewer; run verification → License Verification Panel; export audit/ evidence → CSV/JSON
- Annotation: show verification provenance, evidence checksum, and link to audit timeline. Add BA-specific acceptance criteria and API hooks (see BA-UI-Requirements.md in prototype-import).

Onboarding Experience — Analyst
- Purpose: ensure the BA has required access, context, and training to perform verifications and exports in the prototype.
- Required information to onboard an analyst:
	- Account with `ba` role and least-privilege permissions (read, verify, export)
	- Access to signed download URLs and evidence metadata (issuer, registryId, issuedAt, expiresAt, checksum)
	- Short checklist: walkthrough of Mentor flows, where protected-activity flags appear, how to use the License Verification Panel, and how to run exports
	- Demo dataset link and instructions to reproduce verification checks (mock endpoints)
	- Contact/escation path for partner-licensed fallbacks
- Onboarding steps (prototype):
	1. Create `ba` user account in demo auth (or assign role in local mock)
	2. Run through Role selection → BA Dashboard → open sample pilot
	3. Verify license via License Verification Panel (observe provenance and timestamp)
	4. Inspect evidence bundle and download signed file
	5. Export audit slice as CSV and review included checksums

Quality Phase Gates (protected-activity checkpoints)
- Where applied: Pilot submission form (when `protected-activity` flag set), Pilot Detail (evidence required), Review/Approval flows
- Gate behavior: block final approval unless required evidence exists OR a partner-licensed fallback is recorded with justification
- BA responsibilities at gates: confirm evidence authenticity, run license verification, add reviewer notes, and trigger export when compliance package is ready
- Acceptance checks: evidence presence, valid verification status (`verified`), and audit entry for each verification action

Dashboard (Student)
- Title: Student Dashboard
- Elements: my pilots, submit new pilot button, messages from mentor
- Actions: start pilot submission → pilot form

Dashboard (Entrepreneur)
- Title: Entrepreneur Dashboard
- Elements: projects, KPI summary, invite mentor, submit pilot

Pilot submission
- Title: Submit Pilot
- Fields: title, description, owner, jurisdiction(s), protected-activity flags (checkbox list), expected KPIs, attachments
- Required behavior: if any protected-activity flag checked, require at least one evidence upload and jurisdiction
- Actions: save draft / submit for review

Evidence viewer
- Title: Evidence Bundle
- Elements: list of files with metadata (issuer, id, issued/expiry dates), preview pane, verified badge
- Actions: download, flag issue, add reviewer note

License verification panel
- Title: License Verification
- Elements: registry input, registryId, verify button, verification result, link to source
- Actions: manual lookup + automated check (mock)

Admin / Audit
- Title: Audit View
- Elements: timeline of actions, filters (user, date, pilot), export button
- Actions: export evidence bundle, mark compliance status

Prototype annotations
- For each protected-activity checkpoint add a visible label: "Licensed resource required — see evidence"
- Show fallback: "Partnered licensed provider used" where applicable

Export guidance for v0.dev
- Use page titles as page slugs
- Add link actions for buttons as documented
- Add Notes text on each page for acceptance criteria and compliance checkpoints
