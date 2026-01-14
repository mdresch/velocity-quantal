---
title: "User Elicitation Questionnaire — Skills, Preferences & Availability"
owner: "@mdresch"
authors: ["Menno Drescher"]
version: "0.1"
date: "2026-01-14"
status: "draft"
---

Purpose
- Capture concise, structured data to match participants to low/no CapEx opportunities.
- Designed for quick completion (5–10 minutes) and machine-readability for automated matching.

Instructions for interviewer / self-complete
- Ask the user to answer honestly; where possible provide concrete examples (certificates, links).
- If deploying in the prototype, require only the scored fields; optional free-text fields can be collected later.

Core questionnaire (sections and fields)

1) Identity & contact
- Full name
- Preferred display name
- Email
- Primary time zone / Country (select)

2) Availability & commitment
- Weekly availability (hours/week): [0-5, 6-10, 11-20, 21-40, 40+]
- Preferred engagement length: [one-off task, 1–3 months, 3–6 months, long-term]
- Earliest start date

3) Skills & competencies (self-rated)
- Technical (scale 0–5): web dev, mobile dev, devops, data engineering, ML/AI, database administration, automation/scripting
- Business (scale 0–5): sales, marketing, operations, accounting, project management, legal/compliance
- Domain (scale 0–5): healthcare, fintech, agriculture, education, retail, logistics, environment, security
- Soft skills (scale 0–5): communication, teamwork, mentoring, problem solving

4) Certifications & licensures
- List any professional registrations, licences or certifications (type, issuer, ID, expiry date)
- Upload field for verification (file or screenshot)

5) Experience & examples
- Years of relevant experience (numeric)
- Short list of 1–3 prior projects or roles (title + brief description + link)
- Prior entrepreneurship experience? [Yes/No] — if yes, provide brief outcome

6) Resource & capital constraints
- Access to device(s): [desktop/laptop, tablet, smartphone]
- Reliable internet? [Yes/No]
- Willing to invest personal funds? [No, <$500, $500–2k, >2k]

7) Risk tolerance & regulated activities
- Comfortable performing regulated activities under supervision? [Yes/No]
- Comfortable coordinating with licensed partners (referral model)? [Yes/No]
- Willing to undergo background checks or verification? [Yes/No]

8) Learning willingness & training
- Willing to take short courses (1–4 weeks) to upskill? [Yes/No]
- Preferred learning format: [self-paced, live workshops, mentorship]

9) Preferences & constraints
- Preferred work type: [remote, hybrid, on-site]
- Preferred roles: [implementer, coordinator, tester, fundraiser, mentor]
- Language(s) of preference

10) Goals & motivation
- Primary motivation (one-line): [earn income, learn new skills, start a business, contribute to community]
- Target weekly earnings (optional)

11) Consent & data usage
- Short consent statement for storing verifiable documents and sharing with partner organizations for pilot matching. Checkbox required.

Scoring hints (for matching engine)
- Normalize scales to 0–100 for automated scoring.
- Key fields for weighting: availability (20%), technical/business skills match (30%), certifications/licences (25%), experience (15%), willingness to upskill/partner (10%).

Form length & UX
- Default prototype should show: availability, top 6 skill ratings, certifications upload, experience summary, preferred roles, language and consent.
- Defer optional fields to a follow-up if score is borderline.

Storage & privacy
- Store only hashed identifiers and metadata for uploaded documents in the pilot evidence bucket; store PII in compliance with privacy policy.

End of questionnaire
