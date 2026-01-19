---
title: "RBAC User Stories — Per Role"
owner: "@mdresch"
version: "0.1.0"
date: "2026-01-20"
status: "draft"
---

## Summary

User stories and acceptance criteria mapped to each role to guide sprint planning and validation for the prototype frontend.

## Entrepreneur

- Story E-01: As an Entrepreneur, I want a curated list of opportunities so I can pick one to validate quickly.
  - Acceptance: list shows tags, effort estimate, template link and owner; I can bookmark an opportunity.
- Story E-02: As an Entrepreneur, I want to start a pilot from an opportunity so I can capture progress and evidence.
  - Acceptance: pilot created with owner set, status changes, and ability to upload evidence.

## Mentor / Advisor

- Story M-01: As a Mentor, I want to review and annotate opportunities so I can guide entrepreneurs.
  - Acceptance: I can add comments, rate feasibility, and mark recommended/flagged.
- Story M-02: As a Mentor, I want to sign off on pilot milestones so validation is recorded.
  - Acceptance: milestone review UI with accept/reject and commentary; timestamped audit.

## Market Analyst

- Story A-01: As a Market Analyst, I want filters and exports so I can prioritize opportunities by signal.
  - Acceptance: filter UI with tags/trend/effort and CSV export of selected rows.

## Admin

- Story AD-01: As an Admin, I want to invite users and assign roles so I can set up cohorts.
  - Acceptance: invite flow, role assignment, and email invite link; role changes take effect immediately.
- Story AD-02: As an Admin, I want to manage templates and platform content so I can support pilots.
  - Acceptance: CRUD on templates and publish/unpublish controls.

## PM (Project Manager)

- Story PM-01: As a PM, I want a cohort dashboard so I can track pilot health and escalate issues.
  - Acceptance: dashboard shows pilot count, status distribution, mentor engagement hours, and key metrics.

## Sponsor / Executive Sponsor

- Story S-01: As a Sponsor, I want executive summaries so I can approve high-level direction.
  - Acceptance: one-click generate summary PDF and view top KPIs.

## Pilot Owner / Core Team

- Story PO-01: As a Pilot Owner, I want to assign teammates and set milestones so I can manage execution.
  - Acceptance: team invite, milestone CRUD, and status updates with notifications.

## Finance

- Story F-01: As Finance, I want to view pilot budgets and approve spends so I can control costs.
  - Acceptance: budget view per pilot, approval flow, and exportable ledger.

## Support / Helpdesk

- Story SU-01: As Support, I want to view onboarding issues and assist users so I can reduce friction.
  - Acceptance: issue queue with user context and ability to comment/resolve.

## Observer / Auditor

- Story O-01: As an Auditor, I want read-only access to pilots and evidence so I can verify compliance.
  - Acceptance: audit view shows timeline, evidence, and user actions; exportable audit trail.

## Content / Marketing

- Story CM-01: As Content, I want to publish announcement banners and templates so I can support go-to-market.
  - Acceptance: UI to schedule announcements and manage template metadata.

## Next steps

- Convert these stories into backlog tickets with story points and acceptance test scripts.  
- Create journey maps and minimal wireframes for Entrepreneur, Mentor, PM, and Admin flows.
