---
title: "Matching Criteria & Scoring Rubric"
owner: "@mdresch"
authors: ["Menno Drescher"]
version: "0.1"
date: "2026-01-14"
status: "draft"
---

Purpose
- Provide a transparent rubric to map questionnaire responses to candidate low/no CapEx opportunities.

Overview
- Matching is a weighted score of normalized attributes producing a ranked list of suitable opportunities.
- We use configurable weights so stakeholders can tune for business priorities (speed-to-revenue vs skill development vs regulation risk).

Weights (suggested defaults)
- Availability (hours + commitment): 20%
- Skills match (technical + business + domain): 30%
- Certifications & licences (validated): 25%
- Experience (years, relevant projects): 15%
- Willingness to upskill or partner: 10%

Normalization rules
- Convert all categorical and ordinal answers to a 0–100 scale.
  - Example: availability: 0–5hrs=0, 6–10=25, 11–20=50, 21–40=75, 40+=100.
  - Skill ratings (0–5) map as rating*20.
- Certification presence: binary 0/100; validated certifications receive full score; unverifiable receive 50.
- Experience: years mapped with diminishing returns (0→0, 1→20, 2→35, 5→70, 10+→100).

Opportunity type mapping (examples)
- Micro-task / gig (low skills barrier): requires >10hrs/week OR specific micro-skill; low regulatory risk.
- Service coordination / referral: requires high communication/ops skills; regulatory tasks are outsourced to licensed partners.
- Digital product / content creation: benefits from technical or marketing skills; low regulatory risk.
- Technical implementation (dev/infra): requires high technical scores and device access.
- Regulated-adjacent roles: requires verified certification/licence + willingness to partner; otherwise refer to licensed partner.

Thresholds & actions
- Score >= 75: Recommend opportunity for direct placement (high fit)
- Score 50–74: Recommend light training + supervised pilot (medium fit)
- Score 30–49: Recommend short course or micro-task pathway (low fit)
- Score < 30: Recommend introductory learning pathway and community mentorship

Example matching flow
1. Collect questionnaire and evidence.
2. Pre-validate certifications (automated registry lookup where possible).
3. Compute normalized scores per dimension.
4. Apply weights → total score.
5. Show top 3 opportunity matches and recommended next action (direct, supervised pilot, training).

Explainability
- Provide a short rationale per match: e.g., "Matched because: 80 availability, 90 technical, lacks verified license (0) — recommend supervised pilot + partner-licensed provider for regulated steps." 

Integration points for product
- Show badge/status in UI: `Fit: High | Medium | Low` and `Regulatory requirement: None | Partner required | License required`.
- Allow manual override by mentors/admins with reason logged in audit trail.

Data retention & audit
- Keep matched decisions and supporting evidence for audit (retention period configurable per pilot and partner requirements).

Tuning & iterations
- Re-evaluate weights after first 50 pilots; tune for conversion and retention metrics.

End of rubric
