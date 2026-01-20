---
title: "Backlog — Prioritized Stories (Prototype)"
owner: "@mdresch"
version: "0.1.0"
date: "2026-01-20"
status: "draft"
---

This file seeds the sprint backlog with prioritized stories derived from `Docs/RBAC-User-Stories-Per-Role.md`.

Top priority (Sprint 1)

1. E-01 — Curated Opportunity List (5 pts)
   - As an Entrepreneur, I want a curated list of opportunities so I can pick one to validate quickly.
   - Acceptance: list shows tags, effort estimate, template link and owner; bookmark works; mobile + desktop layouts.

2. E-02 — Start Pilot (5 pts)
   - As an Entrepreneur, I want to start a pilot from an opportunity so I can capture progress and evidence.
   - Acceptance: create pilot flow, owner set to current user, pilot status lifecycle, evidence upload.

3. M-01 — Mentor Review & Annotations (3 pts)
   - As a Mentor, I want to review and annotate opportunities so I can guide entrepreneurs.
   - Acceptance: comment, rating, and recommendation flags; notifications to pilot owners.

4. PM-01 — Cohort / Pilot Dashboard (8 pts)
   - As a PM, I want a dashboard to track pilot health and escalate issues.
   - Acceptance: pilot count, status distribution, top metrics, drill-down to pilot details.

5. AD-01 — User Invite & Role Assignment (5 pts)
   - As an Admin, I want to invite users and assign roles so I can set up cohorts.
   - Acceptance: invite flow, role dropdown, immediate effect; audit log entry.

6. PO-01 — Pilot Owner Management (5 pts)
   - As a Pilot Owner, I want to assign teammates and set milestones so I can manage execution.
   - Acceptance: team management UI, milestone CRUD, notifications.

7. A-01 — Market Analyst Filters & Export (3 pts)
   - As a Market Analyst, I want filters and exports so I can prioritize opportunities.
   - Acceptance: filters (tags, trend, effort), CSV export for selected rows.

8. AD-02 — Template Management (3 pts)
   - As an Admin, I want to manage templates so I can support pilots with repeatable assets.
   - Acceptance: CRUD templates, publish/unpublish, template assignment when creating pilots.

Notes
- Break each story into tasks: UI, API, DB schema, tests, accessibility checks.
- Attach relevant docs and wireframes to each ticket.
