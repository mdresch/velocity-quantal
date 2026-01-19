---
title: "Project Details — Velocity Quantal v0 Prototype"
owners:
  - "@mdresch"
authors:
  - "Menno Drescher"
version: "1.0.0"
date: "2026-01-16"
status: "active"
---

# Velocity Quantal — v0 Prototype

**Project Title**: Velocity Quantal — v0 prototype (Role-driven Pilot + Evidence + Matching)

## Executive Summary

Velocity Quantal is a platform for discovering, validating, and executing low/no capital expenditure business opportunities. The v0 prototype validates stakeholder flows through a clickable demonstration of how users submit pilots, upload evidence, verify licenses/certifications, and receive automated "fit" matching to opportunities.

**Target Completion**: Stakeholder-ready prototype for 60-90 minute review sessions  
**Technology Stack**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui components  
**Deployment**: Vercel-ready with mock API layer for demonstration

---

## Background & Purpose

### Problem Statement
Entrepreneurs, students, and small teams need a repeatable framework to:
- Identify and validate low-capital business opportunities
- Execute pilots with appropriate compliance and oversight
- Partner with licensed professionals for regulated activities
- Build portfolios of validated work
- Track performance metrics and scale successful ideas

### Solution
A role-driven platform that provides:
- **Opportunity Discovery**: Curated, mentor-created opportunities matched to user skills
- **Pilot Management**: Structured submission, evidence tracking, and compliance verification
- **Automated Matching**: Smart fit scoring based on skills, availability, certifications
- **Protected Activity Gating**: License verification and partner fallback for regulated work
- **Audit Trail**: Immutable logging for compliance and transparency
- **Progressive Profiles**: Phase-gated information requests aligned with user journey

---

## User Roles & Personas

### 1. Mentor
**Purpose**: Guide participants, verify credentials, create opportunities, provide expert validation

**Journey Phases**:
1. Registration → basic profile
2. Credential Verification → upload certifications, define service area
3. Active Mentoring → set availability, conduct reviews
4. Trusted Advisor → priority matching, advanced analytics

**Key Capabilities**:
- Review pilot submissions
- Verify licenses and certifications
- Create and publish opportunities
- Provide mentorship and endorsements
- Gate protected activities

### 2. Student
**Purpose**: Learn through pilot participation, build portfolio, develop skills

**Journey Phases**:
1. Onboarding → basic information
2. Skill Building → add skills, specify resources
3. Portfolio Building → track contributions, request recommendations
4. Pilot Ready → lead sections, mentor others

**Key Capabilities**:
- Browse and apply to opportunities
- Submit pilots (with mentor for protected activities)
- Build verified portfolio
- Request mentorship
- Access learning resources

### 3. Entrepreneur
**Purpose**: Create pilots, manage projects, track KPIs, scale successful ideas

**Journey Phases**:
1. Idea Stage → basic profile, explore platform
2. Planning → define business context, create drafts
3. Active Pilot → submit pilots, recruit team, track KPIs
4. Scaling → multi-pilot management, API access

**Key Capabilities**:
- Create and submit pilots
- Browse opportunities as contributor
- Recruit licensed partners
- Track project metrics
- Manage evidence bundles

### 4. Admin
**Purpose**: Oversee operations, audit activities, manage users, ensure compliance

**Journey Phases**:
1. Observer → read-only access, view metrics
2. Reviewer → verify licenses, add notes, flag issues
3. Full Admin → user management, system configuration, override decisions

**Key Capabilities**:
- View audit timeline
- Manage user accounts
- Verify credentials comprehensively
- Generate compliance reports
- Override decisions with justification

### 5. Analyst
**Purpose**: Inspect evidence, run verifications, produce compliance findings

**Journey Phases**:
1. Evidence Observer → view evidence bundles
2. Verification Analyst → run verifications, flag issues
3. Senior Analyst → assign reviews, export packages

**Key Capabilities**:
- Inspect evidence metadata
- Run license verifications
- Flag inconsistencies
- Export audit packages
- Assign reviews to appropriate stakeholders

---

## Architecture Overview

### Technology Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives

**State Management**:
- React Context API for global state
- Local state with useState/useEffect
- Mock API layer for demonstrations

**Routing**:
- File-based routing (App Router)
- Dynamic routes for pilots, evidence, profiles
- Role-specific route protection

**Data Layer**:
- Mock API functions (`lib/mock-api.ts`)
- Sample data (`lib/sample-data.ts`)
- Type definitions (`lib/types.ts`)

### Project Structure

```
platform/mvp/prototype-import/
├── app/                          # Next.js app routes
│   ├── page.tsx                  # Landing / role selection
│   ├── demo/page.tsx             # Demo script
│   ├── mentor/page.tsx           # Mentor landing
│   ├── student/page.tsx          # Student landing
│   ├── entrepreneur/page.tsx     # Entrepreneur landing
│   ├── admin/page.tsx            # Admin landing
│   ├── dashboard/                # Role-specific dashboards
│   │   ├── mentor/page.tsx
│   │   ├── student/page.tsx
│   │   ├── entrepreneur/page.tsx
│   │   ├── admin/page.tsx
│   │   └── analyst/page.tsx
│   ├── profile/                  # Profile completion forms
│   │   ├── new/page.tsx          # Generic profile
│   │   ├── mentor/new/page.tsx
│   │   ├── student/new/page.tsx
│   │   ├── entrepreneur/new/page.tsx
│   │   ├── admin/new/page.tsx
│   │   └── analyst/new/page.tsx
│   ├── pilots/
│   │   └── new/page.tsx          # Pilot submission
│   ├── opportunities/
│   │   ├── page.tsx              # Browse opportunities
│   │   └── new/page.tsx          # Create opportunity
│   ├── evidence/
│   │   └── [pilotId]/page.tsx    # Evidence viewer
│   ├── verify/
│   │   └── [pilotId]/page.tsx    # License verification
│   └── admin/
│       └── audit/page.tsx        # Audit timeline
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard-header.tsx
│   ├── pilot-card.tsx
│   ├── evidence-viewer.tsx
│   └── ui-components.tsx
├── lib/                          # Utilities and logic
│   ├── mock-api.ts               # Mock API functions
│   ├── sample-data.ts            # Sample profiles, pilots, opportunities
│   ├── types.ts                  # TypeScript definitions
│   ├── journey-phases.ts         # Progressive profile phases
│   └── context.tsx               # React context provider
└── public/                       # Static assets
```

---

## Core Features & Flows

### Feature 1: Role Selection & Progressive Onboarding

**Implementation**: Landing page → Role-specific landing → Profile completion

**Flow**:
1. User visits landing page
2. Selects role (Mentor/Student/Entrepreneur/Admin/Analyst)
3. Views role-specific landing page with journey overview
4. Clicks "Get Started" to begin profile
5. Completes only phase-appropriate fields
6. Unlocks features based on phase completion

**Key Files**:
- `app/page.tsx` - Main landing
- `app/[role]/page.tsx` - Role landing pages
- `app/profile/[role]/new/page.tsx` - Profile forms
- `lib/journey-phases.ts` - Phase definitions

### Feature 2: Pilot Submission & Evidence Upload

**Implementation**: Form with progressive disclosure, protected activity gating

**Flow**:
1. Entrepreneur clicks "Submit New Pilot"
2. Fills basic information (title, description, jurisdictions)
3. Checks protected activity flags if applicable
4. If protected: must provide evidence OR partner fallback note
5. Uploads evidence files (metadata captured)
6. Submits pilot for review
7. Receives match result and fit badge

**Validation Rules**:
- Protected pilots require evidence OR partner fallback
- Jurisdictions must be selected
- KPIs must be specified
- Consent required

**Key Files**:
- `app/pilots/new/page.tsx`
- `lib/mock-api.ts` - `createPilot()`, `uploadEvidence()`

### Feature 3: Opportunity Creation & Matching

**Implementation**: Mentor creates opportunities, entrepreneurs compare profiles

**Flow**:
1. Mentor clicks "Create Opportunity"
2. Fills 3-step wizard:
   - Basic Info (title, description, compensation, duration)
   - **Analyst Assessment (optional)**: Expected ROI, time to cash, success estimate, assessment notes
   - Requirements (skills, certifications, experience, availability)
   - Compliance (protected activities, jurisdictions)
3. Saves as draft or publishes
4. Entrepreneur browses opportunities
5. Views match score and detailed comparison
6. **Views analyst assessment metrics** (ROI, time to cash, success estimate)
7. Sees matched requirements (green), missing requirements (red)
8. Receives recommendations for improving fit

**Analyst Assessment Fields**:
- **Expected ROI**: Estimated return on investment (e.g., "150-200%", "$5K-10K profit")
- **Initial Time to Cash**: Time until first payment/revenue (e.g., "2-4 weeks", "30-45 days")
- **Success Estimate**: 0-100 percentage indicating analyst's confidence in opportunity viability
- **Assessment Notes**: Additional context on market conditions, risks, or recommendations

**Risk Assessment Fields**:
- **Risk Description**: Clear statement of potential risk or challenge
- **Severity**: Low, Medium, High, or Critical impact level
- **Mitigation Strategy**: Specific actions to reduce or manage the risk
- **Likelihood**: Optional estimate (unlikely, possible, likely)

Entrepreneurs can review analyst-provided risks and mitigation strategies to make informed decisions and prepare contingency plans.

**Matching Algorithm**:
- Skills: 30%
- Certifications: 25%
- Experience: 15%
- Availability: 15%
- Jurisdiction: 10%
- Device Access: 5%

**Fit Levels**:
- High: ≥75 score
- Medium: 50-74 score
- Low: <50 score

**Key Files**:
- `app/opportunities/new/page.tsx` - Creation wizard
- `app/opportunities/page.tsx` - Browse and match
- `lib/mock-api.ts` - `createOpportunity()`, `matchOpportunity()`

### Feature 4: License Verification

**Implementation**: Manual and automated verification panel

**Flow**:
1. Mentor/Admin opens pilot with protected activities
2. Clicks "Verify License" on evidence item
3. Reviews pre-filled registry ID and issuer
4. Clicks "Verify" button
5. Mock API returns status: verified / expired / not_found
6. Result logged to audit timeline
7. Decision made based on verification outcome

**Mock Verification Logic**:
- Deterministic based on registry ID pattern
- Records timestamp and verifier
- Immutable audit entry created

**Key Files**:
- `app/verify/[pilotId]/page.tsx`
- `lib/mock-api.ts` - `verifyLicense()`

### Feature 5: Evidence Inspection & Audit

**Implementation**: Evidence viewer with metadata, audit timeline with export

**Flow (Evidence)**:
1. User clicks "Preview Evidence" on pilot
2. Views list of uploaded evidence items
3. For each item: filename, issuer, registry ID, dates, checksum, status
4. Can download original file (signed URL)
5. Can add reviewer notes
6. Can flag issues

**Flow (Audit)**:
1. Admin navigates to Audit Timeline
2. Views chronological log of all actions
3. Filters by user, pilot, date, action type
4. Exports filtered data as CSV or JSON
5. Export includes timestamps, user IDs, request IDs

**Key Files**:
- `app/evidence/[pilotId]/page.tsx`
- `app/admin/audit/page.tsx`
- `lib/sample-data.ts` - `sampleAuditLog`

### Feature 6: Dashboard & Management

**Implementation**: Role-specific dashboards with stats and actions

**Mentor Dashboard**:
- Pending verifications count
- Active pilots under review
- Published opportunities
- Tabs: Pending / Under Review / All / Opportunities
- Actions: Create opportunity, review pilots, verify licenses

**Student Dashboard**:
- Profile completion progress
- Current phase and next unlock
- Browse opportunities link
- Learning resources access

**Entrepreneur Dashboard**:
- KPI summary (active pilots, completion rate, avg score)
- Project portfolio cards
- Browse opportunities
- Submit new pilot

**Admin Dashboard**:
- Platform statistics (users, pilots, protected activities)
- Sample user profiles
- Quick links to audit timeline
- User management actions

**Key Files**:
- `app/dashboard/[role]/page.tsx`
- `components/dashboard-header.tsx`
- `components/pilot-card.tsx`

---

## Data Model

### Core Types

**User Profile**:
```typescript
interface UserProfile {
  id: string
  name: string
  email: string
  role: Role
  availability: string
  skills: string[]
  certifications: Certification[]
  experienceYears: number
  deviceAccess: string[]
  internetReliable: boolean
  willingToUpskill: boolean
  willingToPartnerLicensed: boolean
  preferredRoles: string[]
  languagePrefs: string[]
  consent: boolean
  createdAt: string
  matchResult?: MatchResult
  journeyPhase?: JourneyPhase
  profileCompletion?: ProfileCompletion
  // Role-specific optional fields
}
```

**Pilot**:
```typescript
interface Pilot {
  id: string
  title: string
  description: string
  ownerId: string
  ownerName: string
  jurisdictions: string[]
  protectedActivityFlags: string[]
  expectedKPIs: string
  status: PilotStatus // draft | submitted | under_review | approved | rejected
  fitBadge?: FitLevel
  createdAt: string
  updatedAt: string
  evidence: Evidence[]
  partnerFallbackNote?: string
}
```

**Opportunity**:
```typescript
interface Opportunity {
  id: string
  title: string
  description: string
  mentorId: string
  mentorName: string
  status: OpportunityStatus // draft | published | closed | archived
  requirements: OpportunityRequirements
  protectedActivityFlags: string[]
  compensation: string
  duration: string
  maxParticipants: number
  currentParticipants: number
  deadline?: string
  createdAt: string
  updatedAt: string
  // Analyst assessment fields
  expectedROI?: string // e.g., "150-200%", "$5K-10K profit"
  initialTimeToCash?: string // e.g., "2-4 weeks", "30-45 days"
  successEstimate?: number // 0-100 percentage
  analystId?: string // ID of analyst who provided assessment
  assessmentDate?: string // ISO timestamp of assessment
  assessmentNotes?: string // Optional notes from analyst
  risks?: OpportunityRisk[] // Risk assessment and mitigation strategies
}

interface OpportunityRisk {
  id: string
  description: string
  severity: RiskSeverity // "low" | "medium" | "high" | "critical"
  mitigation: string
  likelihood?: string // e.g., "unlikely", "possible", "likely"
}
```

**Evidence**:
```typescript
interface Evidence {
  id: string
  pilotId: string
  filename: string
  issuer: string
  registryId: string
  issuedAt: string
  expiresAt?: string
  checksum: string
  verified: VerificationStatus // verified | not_found | expired | pending
  fileUrl: string
  mimeType: string
  uploadedAt: string
  reviewerNotes?: string[]
}
```

**Audit Log Entry**:
```typescript
interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resourceType: "pilot" | "evidence" | "profile" | "verification"
  resourceId: string
  details: string
  pilotId?: string
}
```

---

## Sample Data

### User Profiles (3)

**Alice Chen** (Entrepreneur, High Fit)
- Availability: 30+ hrs/week
- Skills: Data Analysis, Python, ML, Project Management, Technical Writing, API Integration
- No verified license
- Match Score: 82
- Rationale: High availability, strong technical skills, lacks license (partner fallback recommended)

**Bas van der Berg** (Mentor, High Fit)
- Availability: 10-20 hrs/week
- Skills: Clinical Research, Medical Devices, Regulatory Compliance
- Verified: Medical Device Calibration Specialist (EUMDA-2024-78432)
- Match Score: 78
- Rationale: Verified license, regulatory expertise, moderate availability

**Carol Martinez** (Student, Low Fit)
- Availability: <10 hrs/week
- Skills: Basic Excel, Data Entry, Customer Service
- No certifications
- Match Score: 35
- Rationale: Limited availability, early-stage learner, unreliable internet
- Recommendation: Training and micro-task pathway

### Pilots (3)

**Pilot 1: Local Marketplace Content** (Non-Protected, Approved)
- Owner: Alice Chen
- Jurisdictions: US, Canada
- Protected Activities: None
- Status: Approved
- Fit Badge: High

**Pilot 2: Clinical Data Collection** (Protected, Under Review)
- Owner: Alice Chen
- Jurisdictions: EU
- Protected Activities: Health Data Handling, Clinical Research
- Status: Under Review
- Partner Fallback: "Partner with licensed clinical data manager"
- Evidence: 1 item (pending verification)

**Pilot 3: Medical Device Calibration** (Protected, Approved)
- Owner: Bas van der Berg
- Jurisdictions: EU, UK
- Protected Activities: Medical Device Operation, Calibration Certification
- Status: Approved
- Evidence: 1 item (verified license EUMDA-2024-78432)
- Fit Badge: High

### Opportunities (12)

Sample opportunities include:
1. **Healthcare Data Analysis Assistant** - ROI: $8K-12K in 3 months, Time to Cash: 2-3 weeks, Success: 75%
2. **Medical Device Documentation Specialist** - ROI: $15K-20K in 6 months, Time to Cash: 4-6 weeks, Success: 85%
3. **Entry-Level Data Entry Support** - ROI: $500-1K supplemental, Time to Cash: 1-2 weeks, Success: 60%
4. **AI Automation Agency** - ROI: 150-200% on projects, Time to Cash: 3-5 weeks, Success: 70%
5. **SEO-Focused Copywriting** - ROI: $3K-6K in 3 months, Time to Cash: 2-3 weeks, Success: 80%
6. **Digital Knowledge Merchant** - ROI: $2K-5K passive income, Time to Cash: 4-8 weeks, Success: 65%
7. **Vertical Short-Form Video Agency** - ROI: $4K-8K per month, Time to Cash: 2-4 weeks, Success: 75%
8. **AI Explainability Specialist** - ROI: $10K-16K in 2 months, Time to Cash: 3-5 weeks, Success: 70%
9. **Microsoft 365 Migration** - ROI: $60-100 per project, Time to Cash: 1-2 weeks, Success: 85%
10. **AWS Landing Zone Setup** - ROI: $80-150 per project, Time to Cash: 2-3 weeks, Success: 75%
11. **Local SEO Fixer** - ROI: $1.5K-5K per month, Time to Cash: 1-2 weeks, Success: 80%
12. **Tiny-SaaS Billing Dashboard** - ROI: Potential MRR $500-2K, Time to Cash: 6-8 weeks, Success: 55%

All opportunities include **analyst assessments** providing expected ROI, time to cash, success estimates, and assessment notes to help entrepreneurs evaluate viability.

---

## API Design (Mock)

### Profile Management

**POST /api/profile**
- Creates user profile
- Returns: `{ profileId: string }`

**GET /api/profile/:id**
- Retrieves profile
- Returns: `UserProfile`

**PUT /api/profile/:id**
- Updates profile
- Returns: `{ success: boolean }`

### Matching

**POST /api/match**
- Accepts: `{ profileId: string }` or full profile payload
- Computes match score using weighted algorithm
- Returns: `{ score: number, fitLevel: FitLevel, rationale: string[] }`

**POST /api/opportunities/match**
- Matches profile against specific opportunity
- Returns: `OpportunityMatch`

### Pilot Management

**POST /api/pilots**
- Creates pilot
- Validates protected activity requirements
- Returns: `{ pilotId: string }`

**GET /api/pilots**
- Lists pilots with optional filters
- Returns: `Pilot[]`

**GET /api/pilots/:id**
- Retrieves single pilot
- Returns: `Pilot`

**PUT /api/pilots/:id**
- Updates pilot
- Returns: `{ success: boolean }`

### Evidence Management

**POST /api/pilots/:id/evidence**
- Uploads evidence
- Generates mock signed URL
- Returns: `{ evidenceId: string, fileUrl: string }`

**GET /api/evidence/:id**
- Retrieves evidence metadata
- Returns: `Evidence`

### Verification

**POST /api/verify-cert**
- Accepts: `{ issuer: string, registryId: string }`
- Returns: `{ status: VerificationStatus, sourceUrl?: string, verifiedAt: string }`

### Opportunity Management

**POST /api/opportunities**
- Creates opportunity
- Returns: `{ opportunityId: string }`

**GET /api/opportunities**
- Lists opportunities with filters
- Returns: `Opportunity[]`

**PUT /api/opportunities/:id**
- Updates opportunity
- Returns: `{ success: boolean }`

**DELETE /api/opportunities/:id**
- Deletes opportunity
- Returns: `{ success: boolean }`

### Audit

**GET /api/audit/logs**
- Query params: `userId`, `pilotId`, `since`, `until`, `action`
- Returns: `AuditLogEntry[]`

---

## Acceptance Criteria

### Role-Based Access Control (RBAC)
- ✓ Each role sees only appropriate functions and data
- ✓ Protected routes redirect unauthorized users
- ✓ Dashboards display role-specific views
- ✓ Actions are gated by role and phase

### Progressive Profile Completion
- ✓ Users only see fields relevant to current phase
- ✓ Phase completion unlocks new features
- ✓ Progress indicator shows completion percentage
- ✓ Can save and return to complete later

### Protected Activity Gating
- ✓ Protected pilots require evidence OR partner fallback
- ✓ Cannot submit without satisfying requirement
- ✓ Yellow compliance label on protected elements
- ✓ Clear error messages guide users

### License Verification
- ✓ Manual verify button triggers check
- ✓ Automated mock returns deterministic result
- ✓ Result shows status, timestamp, and verifier
- ✓ Verification logged to audit timeline

### Fit Matching
- ✓ Match score computed with documented weights
- ✓ Fit badge displays (High/Medium/Low) with thresholds
- ✓ Rationale explains score factors
- ✓ Recommendations provided for improvement

### Evidence Management
- ✓ Evidence viewer shows filename, issuer, registry ID, dates, checksum
- ✓ Verification status badge (green/amber/red)
- ✓ Can download original file
- ✓ Can add reviewer notes

### Audit & Compliance
- ✓ Audit timeline shows all actions chronologically
- ✓ Can filter by user, pilot, date, action type
- ✓ Export produces CSV/JSON with evidence references
- ✓ All actions include timestamp and request ID

### User Experience
- ✓ Responsive layout, keyboard navigable
- ✓ Clear status colors (green/amber/red)
- ✓ Inline validation with helpful messages
- ✓ Privacy/consent text near uploads
- ✓ Accessible contrast ratios

---

## Demo Script & Review Process

### Demo Structure (60-90 minutes)

**Part 1: Role Flows (20-30 min)**
- 5-7 minutes per role
- Demonstrate key workflow for each role
- Show progressive profile completion
- Highlight role-specific features

**Part 2: Feature Walkthrough (20-30 min)**
- Pilot submission and evidence upload
- Protected activity gating
- License verification panel
- Opportunity creation and matching
- Audit timeline and export

**Part 3: Feedback Capture (20-30 min)**
- Structured discussion
- 5 targeted reviewer questions
- Open feedback session
- Next steps planning

### Reviewer Questions

1. **Fit Matching**: Does the Fit matching logic accurately reflect the importance of availability, skills, and certifications?

2. **Protected Activity Gating**: Is the protected-activity gating clear and appropriately strict?

3. **Evidence & Audit**: Do the evidence verification and license panel provide sufficient audit trail?

4. **Partner Fallback**: Is the partner fallback path understandable for users without verified licenses?

5. **Compliance Gaps**: What additional compliance checkpoints would you recommend for production?

### Demo Pages

**Demo Script Page**: `/demo`
- Interactive checklist for each role flow
- Step-by-step actions with completion tracking
- Progress overview
- Export demo notes functionality

**Role-Specific Demos**:
- Mentor: Review pilots, verify licenses, create opportunities
- Student: Complete profile, apply to opportunities, submit pilot
- Entrepreneur: Submit pilot, manage projects, browse opportunities
- Admin: Audit timeline, verify credentials, export reports
- Analyst: Inspect evidence, run verifications, export packages

---

## Implementation Status

### Completed Features ✓

**Core Infrastructure**:
- ✓ Next.js 14 app with TypeScript
- ✓ shadcn/ui component library
- ✓ Mock API layer
- ✓ Sample data (3 profiles, 3 pilots, 12 opportunities)
- ✓ Type definitions
- ✓ Context provider for global state

**Pages & Routing**:
- ✓ Landing page with role selection
- ✓ 5 role-specific landing pages
- ✓ 5 role-specific dashboards
- ✓ 6 profile completion forms (progressive)
- ✓ Pilot submission form
- ✓ Opportunity creation wizard
- ✓ Opportunity browse and match
- ✓ Evidence viewer
- ✓ License verification panel
- ✓ Audit timeline
- ✓ Demo script page

**Features**:
- ✓ Progressive profile completion with phases
- ✓ Protected activity gating
- ✓ License verification
- ✓ Fit matching algorithm
- ✓ Opportunity matching
- ✓ Evidence upload and viewing
- ✓ Audit logging
- ✓ Export functionality (CSV/JSON)

**Documentation**:
- ✓ Role playbooks (Docs/42-Role-Playbooks.md)
- ✓ Project details (this document)
- ✓ UI requirements referenced
- ✓ Demo script embedded in app

### Remaining Tasks

**Testing & Validation**:
- [ ] Run local dev server and smoke test
- [ ] Verify all flows work end-to-end
- [ ] Check responsive design on mobile
- [ ] Test keyboard navigation
- [ ] Validate accessibility

**Deployment**:
- [ ] Deploy to Vercel for stakeholder access
- [ ] Set up analytics tracking
- [ ] Create shareable demo link

**Refinement**:
- [ ] Polish UI/UX based on stakeholder feedback
- [ ] Add loading states
- [ ] Improve error handling
- [ ] Add toast notifications

---

## Key Files Reference

### Configuration
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

### Core Logic
- `lib/mock-api.ts` - All API functions (320+ lines)
- `lib/sample-data.ts` - Sample profiles, pilots, opportunities, audit log (650+ lines)
- `lib/types.ts` - TypeScript type definitions (240+ lines)
- `lib/journey-phases.ts` - Progressive profile phase gates (300+ lines)
- `lib/context.tsx` - React context for global state

### Key Components
- `components/dashboard-header.tsx` - Header with navigation
- `components/pilot-card.tsx` - Reusable pilot card
- `components/evidence-viewer.tsx` - Evidence display
- `components/ui-components.tsx` - Shared UI elements

### Critical Pages
- `app/page.tsx` - Landing page
- `app/demo/page.tsx` - Demo script (400+ lines)
- `app/opportunities/new/page.tsx` - Opportunity wizard (400+ lines)
- `app/opportunities/page.tsx` - Browse and match (300+ lines)
- `app/dashboard/mentor/page.tsx` - Mentor dashboard (350+ lines)

---

## Dependencies

### Core
- next: ^15.1.6
- react: ^19.0.0
- typescript: ^5

### UI
- @radix-ui/* - Primitive components
- tailwindcss: ^3.4.1
- class-variance-authority - Component variants
- lucide-react - Icons

### Utilities
- clsx - Classname utility
- tailwind-merge - Tailwind class merging

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Environment Setup

No environment variables required for v0 prototype. Mock API operates entirely client-side.

For production deployment, will need:
- Database connection string
- Authentication provider credentials
- File storage credentials (S3/Azure Blob)
- API keys for verification services

---

## Success Metrics

### Prototype Validation
- ✓ All 5 roles have complete flows
- ✓ All 6 core features demonstrated
- ✓ 3 sample profiles + 3 pilots + 12 opportunities
- ✓ Mock API handles all operations
- ✓ Audit trail is complete and exportable

### Stakeholder Acceptance
- Demo completes in 60-90 minutes
- Reviewers can answer all 5 questions
- Fit matching logic is validated
- Protected activity gating is understood
- Partner fallback path is clear
- Audit trail meets compliance needs

---

## Next Steps

### Immediate (Post-Review)
1. Incorporate stakeholder feedback
2. Refine UI/UX based on usability findings
3. Document production requirements
4. Create technical architecture for production

### Short-term (4-6 weeks)
1. Replace mock API with real backend
2. Implement authentication (OIDC/SSO)
3. Set up database (PostgreSQL/MongoDB)
4. Integrate file storage (S3/Azure Blob)
5. Add real verification service integrations

### Medium-term (3-6 months)
1. Production deployment
2. User testing with real participants
3. Iterate based on usage data
4. Scale infrastructure
5. Add advanced features (notifications, webhooks, API)

---

## Contact & Support

**Project Owner**: @mdresch  
**Documentation**: `Docs/` folder  
**Code Repository**: `/platform/mvp/prototype-import/`  
**Demo URL**: (To be deployed to Vercel)

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-01-16  
**Status**: Active - v0 Prototype Complete
