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
