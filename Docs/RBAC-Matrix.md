---
title: "RBAC Matrix — Prototype Frontend"
owner: "@mdresch"
version: "0.1.0"
date: "2026-01-20"
status: "draft"
---

## Purpose

This document defines the initial role-based access control (RBAC) matrix for the prototype frontend. It maps identified roles to the minimum permission sets required to support journeys described in project docs.

## Roles (discovered)

- Entrepreneur
- Mentor / Advisor
- Market Analyst
- Admin
- Analyst
- Student
- Project Manager (PM)
- Sponsor / Executive Sponsor
- Pilot Owner / Core Team
- Finance
- Support / Helpdesk
- Observer / Auditor
- Content / Marketing

## Permission categories

- View Opportunities
- Create Opportunity
- Edit Opportunity
- Annotate / Comment
- Start / Manage Pilot
- Assign Mentor / Reviewer
- Invite / Manage Users
- Manage Roles & Permissions
- View Metrics & Exports
- Manage Billing / Subscriptions
- Publish Content / Templates
- Access Admin Console

## Matrix (overview)

- Entrepreneur: View, Create, Edit own, Annotate, Start Pilot (own), View Metrics (own), Use Templates
- Mentor: View, Annotate, Review, Approve/Recommend, View Pilot Evidence, Comment
- Market Analyst: View, Filter, Tag, Export, Curate Opportunities, Recommend Priority
- Admin: All view/edit, Invite/Manage Users, Manage Roles, Access Admin Console
- Analyst: View, Export, Dashboard access, Annotate
- Student: View, Enroll in Pilots, Submit Evidence, Comment
- PM: View, Assign Pilot Owners, Track Progress, Escalate, View Metrics across pilots
- Sponsor: View Summaries, Approve Pilot Funding/Support, High-level Metrics
- Pilot Owner / Core Team: Create/Edit Pilot, Manage Team, Submit Evidence, Transition Pilot Status
- Finance: View budgets, Export financials, Approve expenditures, Billing access
- Support: View user issues, Assist onboarding, Manage help articles
- Observer/Auditor: Read-only access to pilots, evidence, and audit logs
- Content/Marketing: Create/Publish Templates, Manage Templates Library, Create Announcements

## Notes and next steps

- This matrix is intentionally minimal; permission granularity (resource-level vs. global) should be refined during implementation.
- Next: convert this matrix into a machine-readable policy (JSON/YAML) and wire up sample UI toggles for admin role management.
