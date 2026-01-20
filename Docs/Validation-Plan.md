---
title: "Validation Plan — Prototype Frontend Journeys"
owner: "@mdresch"
version: "0.1.0"
date: "2026-01-20"
status: "draft"
---

## Purpose

Provide testable walkthroughs, scripts, and success criteria for the top-priority journeys (Entrepreneur, Mentor, PM, Admin) so we can validate the prototype with real users and stakeholders.

## Scope

- Focus: E-01 (Curated Opportunity List), E-02 (Start Pilot), M-01 (Mentor Review), PM-01 (Cohort Dashboard), AD-01 (User Invite & Role Assignment)
- Audience: Pilot participants (Entrepreneurs), Mentors, PMs, Admins
- Environments: local dev / staging / demo

## Test data and setup

- Create sample users: entrepreneur@example.com, mentor@example.com, pm@example.com, admin@example.com
- Seed opportunity entries (>= 10) with tags, effort estimates, and template links
- Ensure template library contains at least one pilot template

## Walkthrough scripts

E-01 — Curated Opportunity List
- Steps:
  1. Sign in as `entrepreneur@example.com`.
  2. Open Opportunity List page.
  3. Apply filters (tag, effort) and sort by trend.
  4. Open an opportunity detail and bookmark it.
  5. Verify template link is accessible.
- Success criteria:
  - Page loads within 2s for seeded data.
  - Filters return expected subset (sanity check with seed tags).
  - Bookmark persists to user profile.

E-02 — Start Pilot
- Steps:
  1. From an opportunity detail, click `Start Pilot`.
  2. Fill form (pilot name, timeline, team) and submit.
  3. Verify pilot dashboard is created and owner is current user.
  4. Upload evidence item (PDF/image) to pilot.
- Success criteria:
  - Pilot created with correct metadata and default milestones.
  - Evidence upload succeeds and displays preview.
  - Notifications sent to any assigned mentors.

M-01 — Mentor Review & Annotations
- Steps:
  1. Sign in as `mentor@example.com`.
  2. Open assigned pilot review list.
  3. Add inline annotation to an evidence item and leave a rating.
  4. Sign off on a milestone.
- Success criteria:
  - Annotations are visible to pilot owner.
  - Rating stored and displayed in pilot summary.
  - Milestone sign-off recorded with timestamp and mentor id.

PM-01 — Cohort / Pilot Dashboard
- Steps:
  1. Sign in as `pm@example.com`.
  2. Open Cohort Dashboard.
  3. Filter pilots by status and drill into a pilot detail.
  4. Trigger escalation on a pilot (mark issue).
- Success criteria:
  - Dashboard shows accurate counts and health indicators.
  - Escalation creates an issue/ticket with pilot context.

AD-01 — User Invite & Role Assignment
- Steps:
  1. Sign in as `admin@example.com`.
  2. Navigate to User Invite & Roles.
  3. Invite `newuser@example.com` and assign `mentor` role.
  4. Verify invite email contains a working link (or placeholder).
  5. Confirm role assignment is applied on next login.
- Success criteria:
  - Invite recorded in audit log.
  - Role assignment effective on user profile.

## Test execution plan

- Run walkthroughs in a 90-minute session with 2 entrepreneurs and 1 mentor + PM.
- Capture video recording, console logs, and any errors.
- Log pass/fail per step and capture screenshots for failed steps.

## Success thresholds

- Functional: >= 90% of scripted steps pass across participants.
- Performance: page load <= 2s for primary pages in staging.
- UX: participants rate flows >= 4/5 for clarity in quick survey.

## Reporting

- Create a validation report summarizing findings, severity, and recommended fixes.
- Map fixes back to backlog tickets and re-run validation after fixes.
