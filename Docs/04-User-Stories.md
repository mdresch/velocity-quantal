---
title: "User Stories — Opportunities with No Working Capital"
owner: "@mdresch"
authors: ["mdresch"]
version: 0.1.0
date: 2026-01-13
status: draft
---


## Core User Roles / Personas

- Individual Entrepreneur: discovers and executes low-capital opportunities.
- Market Analyst: curates and vets opportunities by market signals.
- Mentor/Advisor: validates ideas and supports execution.
- Program Manager: tracks portfolio progress and reporting.

## User Stories (selected)

- US-01: Curated List of No-Capital Business Opportunities
	- As an Individual Entrepreneur, I want a curated list of vetted no-capital opportunities so I can quickly identify ideas to test.
	- Acceptance criteria: list contains >=10 opportunities with short feasibility notes and source links; each entry has a primary owner.

- US-02: Filter Opportunities by Market Trends
	- As a Market Analyst, I want to filter opportunities by market signals so I can prioritize high-potential ideas.
	- Acceptance criteria: filters include industry, trend score, urgency, and expected effort.

- US-03: Review and Annotate Opportunities
	- As a Mentor, I want to add reviews and annotations to opportunities so others can learn from expert feedback.
	- Acceptance criteria: annotations persist with author and timestamp; comments can be resolved.

- US-04: Track Progress on Opportunity Execution
	- As a Program Manager, I want to track pilot execution status so I can report progress and results.
	- Acceptance criteria: each pilot has status (planned/active/completed), metrics (revenue, hours, lessons), and owner.

- US-05: Simulate Financial Outcomes
	- As an Entrepreneur, I want to model simple financial outcomes to estimate potential returns and decide which pilots to run.
	- Acceptance criteria: basic inputs (time, price, conversion) produce an estimated revenue and simple ROI.

- US-06: Dashboard for Program Progress
	- As a Sponsor, I want a dashboard summarizing pilots, capital generated, and key KPIs so I can assess program value.
	- Acceptance criteria: dashboard shows aggregate capital, number of pilots, success rate, and top-performing opportunities.

## Prioritization

Prioritize pilots using a simple scoring model: Expected Value (revenue proxy) × Feasibility (time/skill) − Risk. Run highest-scoring pilots as early experiments.

