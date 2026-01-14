---
title: "Stakeholder Portals — Roles, Access, and Flows"
owners:
  - "@mdresch"
authors:
  - "Menno Drescher"
version: "0.1.0"
date: "2026-01-14"
status: "draft"
---

Purpose
-------
Ensure every stakeholder group has a dedicated portal into the Velocity Quantal platform with appropriate UX, data access, and auditability so pilots and partner submissions are efficient and auditable.

Stakeholder Personas & Portal Goals
----------------------------------
- Platform Admin (Owner): full management — workspaces, billing, partners, secrets.
- Pilot Owner / Startup Operator: upload evidence, view pilot KPIs, request partner submissions, export artifacts.
- Partner Reviewer (MS/AWS/Google/Surface/etc): review submitted evidence, provide feedback, and record acceptance status.
- Auditor / Compliance Officer: read-only access to evidence, provenance, and audit logs.
- Developer / Integrator: access to API keys, webhook setup, and integration documentation.

Portal Pages & Features
-----------------------
- Shared: sign-in page, workspace switcher, global search, notifications center, and account settings.

- Admin Portal:
  - Workspace management (create/close/assign owners)
  - Partner programs dashboard (applications, statuses)
  - Billing & quota view
  - Secrets & provider key rotation
  - Audit log viewer and export

- Pilot Owner Portal:
  - Evidence upload (pre-signed URLs), ingestion status
  - Pilot dashboard: KPIs, recent queries, evidence list
  - Submit to partner flow: fill submission form, attach evidence packages, request review
  - Export evidence bundle (zip) and submission receipt

- Partner Reviewer Portal:
  - Assigned reviews queue
  - Per-submission view: evidence viewer (PDF/images/text), provenance links, RAG excerpts
  - Accept / Request Clarification / Reject actions with comment and reason
  - Record acceptance metadata (date, reviewer id, partner program id)

- Auditor Portal:
  - Searchable access to evidence items with filters (date range, workspace, pilot)
  - Immutable export of audit trail for a submission

- Developer Portal:
  - API keys (scoped, rotate), webhook endpoints, API docs, sandbox credentials
  - Test data sandbox and request quotas

Authentication & Authorization
------------------------------
- Authentication: OIDC / SSO (Azure AD, Google Workspace, GitHub) with optional email+magic-link for small pilots.
- Authorization: RBAC with role templates (Admin, PilotOwner, PartnerReviewer, Auditor, Developer).
- Tenant isolation: data access controlled by `workspaceId` and enforced server-side; Partner reviewers get scoped access only to submissions they are assigned to or to partner-linked workspaces.

API Endpoints (Portal-related)
------------------------------
- GET /api/portal/dashboard
- GET /api/portal/workspaces
- POST /api/portal/workspaces/{id}/members (invite)
- POST /api/portal/evidence/upload-url
- POST /api/portal/submissions → creates a partner submission record
- GET /api/portal/submissions/{id}
- POST /api/portal/submissions/{id}/review → {action: accept|clarify|reject, comment}
- GET /api/portal/audit/logs?workspaceId=…&since=…

Security & Compliance
---------------------
- Per-role least-privilege policies in Secrets Manager and DB.
- All reviewer actions and submission state changes are immutably logged with request IDs and timestamps.
- Evidence storage access uses pre-signed URLs, short TTLs, and event-driven revocation on submission retraction.
- PII tagging on ingest and automatic redaction workflows for sensitive content if required by pilot profiles.

UX & Accessibility
------------------
- Responsive SPA with clear CTAs: "Upload Evidence", "Submit to Partner", "Download Bundle".
- Inline reviewer annotations on evidence items.
- Keyboard shortcuts for navigation and accessibility compliance (WCAG AA minimum).

Notifications & Workflows
-------------------------
- Email + in-app notifications for: evidence ingestion complete, submission created, review requested, review completed.
- Webhooks for partner systems (optional) when a submission is accepted.

Audit & Reporting
-----------------
- Submission lifecycle report: createdAt, submittedAt, reviewedAt, reviewerId, decision, notes.
- Evidence provenance: fileId, chunkOffsets used in RAG, embedding scores, modelUsed, modelRequestId.

Acceptance Criteria
-------------------
- Each role can sign in and see only role-appropriate functions and data.
- Pilot Owners can upload evidence and create a partner submission bundle.
- Partner Reviewers can accept/clarify/reject submissions and record structured feedback.
- Auditors can export immutable audit trails for selected submissions.
- All portal actions produce entries in the audit log with request IDs.

Implementation Notes
--------------------
- Reuse existing platform components: frontend (React+Vite), serverless API, object storage, and RBAC service.
- Implement incremental roll-out: start Pilot Owner + Partner Reviewer flows, then add Admin, Auditor, Developer portals.
- Provide a developer sandbox workspace for partner integrations and testing.

Next steps
----------
1. Wireframe key pages (Pilot dashboard, Submission form, Reviewer view).
2. Implement RBAC and scoped API endpoints in `platform/mvp` skeleton.
3. Seed sample partner reviewers and run an end-to-end pilot submission flow.

---
Updated 2026-01-14: stakeholder portals specification.
