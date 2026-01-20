---
title: "Phase 2: Core Flows Design Specifications"
owner: "@mdresch"
authors: ["Menno Drescher"]
version: "1.0.0"
date: "2026-01-16"
status: "in-progress"
---

## Overview

Phase 2 focuses on detailed design specifications for core user flows across all roles. Each section includes wireframe descriptions, component breakdowns, interaction patterns, and acceptance criteria.

---

## 1. Landing Page Design ✅

**Status**: Enhanced and implemented
**File**: `platform/mvp/prototype-import/app/page.tsx`

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Header (Logo + View Demo)              │
├─────────────────────────────────────────┤
│                                         │
│  Hero Title + Description               │
│                                         │
│  6 Feature Cards Grid (2×3)             │
│  • Opportunity Matching                 │
│  • Evidence Management                  │
│  • Compliance & Protected Activities    │
│  • Pilot Tracking & KPIs                │
│  • Collaborative Workflows              │
│  • Document & Risk Management           │
│                                         │
│  "Choose your role" prompt              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  5 Role Cards Grid (2-3 columns)        │
│  • Student                              │
│  • Mentor                               │
│  • Entrepreneur                         │
│  • Admin                                │
│  • Analyst                              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  How It Works (3 Steps)                 │
│  1. Submit & Match                      │
│  2. Verify & Execute                    │
│  3. Measure & Scale                     │
│                                         │
│  Zero-CapEx Value Proposition Banner    │
│                                         │
└─────────────────────────────────────────┘
```

### Components Used
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Button` with variants (outline, default)
- `Badge` (for role indicators)
- Icons: `GraduationCap`, `Users`, `Briefcase`, `Shield`, `BookOpen`, `ArrowRight`

### Responsive Behavior
- **Mobile**: Single column, stacked cards
- **Tablet**: 2-column grid for role cards
- **Desktop**: 2-column features, 2-3 column roles, 3-column "How It Works"

### Key Features
- ✅ Clear value proposition with emoji-enhanced descriptions
- ✅ Role-based entry points with icons and colors
- ✅ 3-step process visualization
- ✅ Zero-CapEx messaging
- ✅ Link to demo script

---

## 2. Role-Specific Dashboard Mockups

### 2.1 Student Dashboard

**Purpose**: Track learning journey, view matched opportunities, manage evidence

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: Avatar | "Welcome, [Name]" | Notifications      │
├─────────┬───────────────────────────────────────────────┤
│ Sidebar │ Journey Progress Card                         │
│         │ ┌─────────────────────────────────┐           │
│ • Home  │ │ Progress: 60%                   │           │
│ • Oppor │ │ ▓▓▓▓▓▓▓▓▓▓░░░░░                │           │
│ • Evide │ │ Next: Upload certification      │           │
│ • Profi │ └─────────────────────────────────┘           │
│         │                                               │
│         │ Matched Opportunities (Grid)                  │
│         │ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│         │ │ Opp #1  │ │ Opp #2  │ │ Opp #3  │         │
│         │ │ High Fit│ │ Med Fit │ │ Low Fit │         │
│         │ └─────────┘ └─────────┘ └─────────┘         │
│         │                                               │
│         │ Recent Activity                               │
│         │ • Evidence uploaded (2 days ago)              │
│         │ • Profile updated (3 days ago)                │
└─────────┴───────────────────────────────────────────────┘
```

#### Components
- **Journey Progress**: Custom component with Progress bar, milestone badges
- **Opportunity Cards**: Card with Badge (Fit level), Button (View Details)
- **Activity Timeline**: List with icons, relative timestamps

#### Data Displayed
- Journey completion percentage
- Next suggested action
- Top 3 matched opportunities with fit scores
- Recent activity log (last 5 actions)
- Evidence status (pending, verified)

#### Acceptance Criteria
- AC1: Journey progress updates in real-time based on completed steps
- AC2: Opportunities sorted by fit score (High → Low)
- AC3: Activity timeline shows last 10 actions with icons
- AC4: "Upload Evidence" CTA visible if no evidence submitted
- AC5: Dashboard loads in < 1 second on 3G connection

---

### 2.2 Mentor Dashboard

**Purpose**: Review submissions, verify evidence, guide students

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Mentor Dashboard" | Pending Reviews (3)        │
├─────────┬───────────────────────────────────────────────┤
│ Sidebar │ Pending Verifications                         │
│         │ ┌─────────────────────────────────┐           │
│ • Home  │ │ Student: Jane Doe               │           │
│ • Verif │ │ Evidence: Law License           │           │
│ • Pilots│ │ [View] [Approve] [Reject]       │           │
│ • Analyt│ └─────────────────────────────────┘           │
│         │                                               │
│         │ Active Pilots (owned by mentor)               │
│         │ ┌─────────┐ ┌─────────┐                       │
│         │ │ Pilot A │ │ Pilot B │                       │
│         │ │ 3 tasks │ │ 5 tasks │                       │
│         │ └─────────┘ └─────────┘                       │
│         │                                               │
│         │ Mentorship Stats                              │
│         │ • 12 students mentored                        │
│         │ • 8 verifications completed this month        │
└─────────┴───────────────────────────────────────────────┘
```

#### Components
- **Verification Queue**: Card with student info, evidence preview, action buttons
- **Pilot Cards**: Card with status badges, task count
- **Stats Dashboard**: Metric cards with icons (Users, CheckCircle, Award)

#### Data Displayed
- Pending evidence verifications (count + list)
- Active pilots owned by mentor
- Students currently mentored
- Verification stats (this week/month)

#### Acceptance Criteria
- AC1: Pending verifications appear at top in priority order
- AC2: One-click approve/reject with confirmation dialog
- AC3: Evidence preview opens in modal without page reload
- AC4: Notification badge shows pending count
- AC5: Filter verifications by status (pending, approved, rejected)

---

### 2.3 Entrepreneur Dashboard

**Purpose**: Manage opportunities, track KPIs, review applications

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Entrepreneur Dashboard" | [Create Opportunity] │
├─────────┬───────────────────────────────────────────────┤
│ Sidebar │ KPI Overview                                  │
│         │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ • Home  │ │Active  │ │Applicat│ │Revenue │ │ROI     │ │
│ • Oppor │ │Pilots  │ │ions    │ │        │ │        │ │
│ • Appli │ │   5    │ │  12    │ │ $2.5K  │ │  45%   │ │
│ • KPIs  │ └────────┘ └────────┘ └────────┘ └────────┘ │
│ • Teams │                                               │
│         │ My Opportunities                              │
│         │ ┌─────────────────────────────────┐           │
│         │ │ Surface Reseller Alliance       │           │
│         │ │ Status: Active | Applicants: 5  │           │
│         │ │ Protected: ⚠️ Yes                │           │
│         │ │ [View] [Edit] [Manage Team]     │           │
│         │ └─────────────────────────────────┘           │
│         │                                               │
│         │ Recent Applications                           │
│         │ • John S. - High Fit (2h ago)                 │
│         │ • Mary K. - Medium Fit (5h ago)               │
└─────────┴───────────────────────────────────────────────┘
```

#### Components
- **KPI Cards**: Metric card with icon, value, trend indicator
- **Opportunity Cards**: Expanded card with status, applicant count, actions
- **Application List**: List items with avatar, fit badge, timestamp

#### Data Displayed
- Active pilot count
- Total applications received
- Revenue generated (if applicable)
- ROI percentage
- List of owned opportunities with applicant counts
- Recent applications with fit scores

#### Acceptance Criteria
- AC1: KPIs update in real-time or on refresh
- AC2: Trend indicators show up/down compared to last period
- AC3: Click opportunity card to view details
- AC4: "Create Opportunity" button always visible in header
- AC5: Filter opportunities by status (draft, active, completed)

---

### 2.4 Analyst Dashboard

**Purpose**: Review evidence, run verifications, export audit packages

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Analyst Dashboard" | [Export Audit Package]    │
├─────────┬───────────────────────────────────────────────┤
│ Sidebar │ Verification Queue (12)                       │
│         │ ┌─────────────────────────────────┐           │
│ • Home  │ │ Evidence ID: EV-12345           │           │
│ • Queue │ │ Type: Medical License           │           │
│ • Audit │ │ Issuer: State Board             │           │
│ • Export│ │ Status: Pending                 │           │
│ • Report│ │ [Inspect] [Verify] [Flag]       │           │
│         │ └─────────────────────────────────┘           │
│         │                                               │
│         │ Compliance Findings                           │
│         │ ┌─────────────────────────────────┐           │
│         │ │ 🟢 2 Compliant                  │           │
│         │ │ 🟡 1 Needs Review               │           │
│         │ │ 🔴 0 Non-Compliant              │           │
│         │ └─────────────────────────────────┘           │
│         │                                               │
│         │ Recent Verifications                          │
│         │ • EV-12340 - Approved (10m ago)               │
│         │ • EV-12338 - Flagged (1h ago)                 │
└─────────┴───────────────────────────────────────────────┘
```

#### Components
- **Verification Queue**: Card with evidence metadata, action buttons
- **Compliance Summary**: Metric cards with color-coded counts
- **Activity Log**: Timeline with status badges

#### Data Displayed
- Pending evidence verifications (count + queue)
- Compliance status summary
- Recent verification activity
- Export package ready status

#### Acceptance Criteria
- AC1: Queue sorted by submission date (oldest first)
- AC2: "Inspect" opens evidence viewer with full metadata
- AC3: "Verify" marks as approved, "Flag" requires reason
- AC4: Export button generates ZIP with all evidence artifacts
- AC5: Compliance summary updates after each verification

---

### 2.5 Admin Dashboard

**Purpose**: System oversight, user management, audit logs

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Admin Dashboard" | [User Management] [Audit]   │
├─────────┬───────────────────────────────────────────────┤
│ Sidebar │ System Overview                               │
│         │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ • Home  │ │Total   │ │Active  │ │Evidence│ │Pilots  │ │
│ • Users │ │Users   │ │Pilots  │ │Items   │ │Complete│ │
│ • Audit │ │  247   │ │  18    │ │  534   │ │   12   │ │
│ • Config│ └────────┘ └────────┘ └────────┘ └────────┘ │
│ • Report│                                               │
│         │ Activity Heatmap (last 7 days)                │
│         │ ┌─────────────────────────────────┐           │
│         │ │ Mon █████                       │           │
│         │ │ Tue ███████                     │           │
│         │ │ Wed ██████                      │           │
│         │ └─────────────────────────────────┘           │
│         │                                               │
│         │ Recent Admin Actions                          │
│         │ • User role changed: John → Mentor (2h ago)   │
│         │ • Audit export generated (3h ago)             │
└─────────┴───────────────────────────────────────────────┘
```

#### Components
- **Metric Cards**: Large stat cards with icons
- **Activity Heatmap**: Chart component (bar chart or custom viz)
- **Action Log**: Timeline with user avatars, action descriptions

#### Data Displayed
- Total user count (all roles)
- Active pilot count
- Evidence items in system
- Completed pilots
- Activity heatmap (actions per day)
- Recent admin actions

#### Acceptance Criteria
- AC1: All metrics refresh on dashboard load
- AC2: Heatmap shows activity trends over last 7/30 days
- AC3: Click metric card to drill down to detail view
- AC4: "User Management" opens filterable user table
- AC5: "Audit" generates full system audit report

---

## 3. Profile Onboarding Flow (3-Step Progressive)

### Flow Overview

```
Step 1: Basic Info → Step 2: Scored Fields → Step 3: Optional Details → Result
```

### Step 1: Basic Information

#### Layout
```
┌─────────────────────────────────────────┐
│ ← Back        Create Profile  Save Draft│
├─────────────────────────────────────────┤
│ Step 1 of 3 - Basic Info        [33%▓░░]│
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Basic Information               │   │
│  │                                 │   │
│  │ First Name *                    │   │
│  │ [________________]              │   │
│  │                                 │   │
│  │ Last Name *                     │   │
│  │ [________________]              │   │
│  │                                 │   │
│  │ Email *                         │   │
│  │ [________________]              │   │
│  │                                 │   │
│  │ Availability (hours/week) *     │   │
│  │ [ Select...      ▼]             │   │
│  │ Options: <10, 10-20, 20-30, 30+│   │
│  │                                 │   │
│  │ ☐ I consent to evidence         │   │
│  │   verification and partner      │   │
│  │   sharing for matching          │   │
│  │                                 │   │
│  │         [Previous] [Next →]     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

#### Components
- Progress bar with step indicator
- Input fields with labels
- Select dropdown for availability
- Checkbox with consent text
- Navigation buttons (Previous disabled on step 1)

#### Validation
- First/Last Name: Required, min 2 characters
- Email: Required, valid email format (RFC)
- Availability: Required selection
- Consent: Must be checked to proceed

#### Acceptance Criteria
- AC1: "Next" button disabled until all required fields valid
- AC2: Inline validation shows errors on blur
- AC3: "Save Draft" stores to localStorage with timestamp
- AC4: Progress bar shows 33% fill
- AC5: Returning user auto-fills from draft

---

### Step 2: Scored Fields & Certifications

#### Layout
```
┌─────────────────────────────────────────┐
│ ← Back        Create Profile  Save Draft│
├─────────────────────────────────────────┤
│ Step 2 of 3 - Skills & Experience [66%▓▓]│
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Skills & Experience             │   │
│  │                                 │   │
│  │ Top 4 Skills (rate 0-5) *       │   │
│  │ Skill 1: [__] ⓘ 0=none, 5=expert│   │
│  │ Skill 2: [__]                   │   │
│  │ Skill 3: [__]                   │   │
│  │ Skill 4: [__]                   │   │
│  │                                 │   │
│  │ Years of Experience *           │   │
│  │ [__] (must be ≥ 0)              │   │
│  │                                 │   │
│  │ Certifications (optional)       │   │
│  │ ┌─────────────────────────┐     │   │
│  │ │ + Add Certification     │     │   │
│  │ └─────────────────────────┘     │   │
│  │                                 │   │
│  │ Uploaded:                       │   │
│  │ • Bar Admission - NL (exp 2028) │   │
│  │   [View] [Remove]               │   │
│  │                                 │   │
│  │     [← Previous] [Next →]       │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

#### Components
- Numeric inputs with range constraint (0-5)
- Tooltip for skill rating explanation
- Years input (integer, ≥0)
- "+ Add Certification" button opens modal
- Certification list with view/remove actions

#### Certification Upload Modal
```
┌─────────────────────────────────────────┐
│ Upload Certification            [X]     │
├─────────────────────────────────────────┤
│ Certificate Name *                      │
│ [________________________]              │
│                                         │
│ Issuer *                                │
│ [________________________]              │
│                                         │
│ Registration ID                         │
│ [________________________]              │
│                                         │
│ Issue Date                              │
│ [📅 Select date]                        │
│                                         │
│ Expiry Date (optional)                  │
│ [📅 Select date]                        │
│                                         │
│ Upload File (PDF, JPG, PNG)             │
│ ┌─────────────────────────┐             │
│ │  📎 Drag file here      │             │
│ │  or click to browse     │             │
│ └─────────────────────────┘             │
│                                         │
│           [Cancel] [Upload]             │
└─────────────────────────────────────────┘
```

#### Validation
- Skills: All 4 required, integer 0-5
- Years Experience: Required, integer ≥0
- Certification: Name + Issuer required, file optional
- File: Max 10MB, allowed types: PDF, JPG, PNG

#### Acceptance Criteria
- AC1: Skill inputs constrained to 0-5 range
- AC2: Tooltip explains rating scale on hover
- AC3: "Add Certification" opens modal, closes on upload
- AC4: Uploaded certs appear in list with metadata
- AC5: "Remove" cert shows confirmation dialog
- AC6: Progress bar shows 66% fill

---

### Step 3: Optional Details

#### Layout
```
┌─────────────────────────────────────────┐
│ ← Back        Create Profile  Save Draft│
├─────────────────────────────────────────┤
│ Step 3 of 3 - Additional Details [100%▓▓]│
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Additional Details (Optional)   │   │
│  │                                 │   │
│  │ Device Availability             │   │
│  │ ○ Laptop/Desktop                │   │
│  │ ○ Tablet                        │   │
│  │ ○ Smartphone only               │   │
│  │                                 │   │
│  │ Internet Connection             │   │
│  │ ○ High-speed broadband          │   │
│  │ ○ Standard connection           │   │
│  │ ○ Mobile data                   │   │
│  │                                 │   │
│  │ ☐ Willing to upskill/train     │   │
│  │ ☐ Willing to partner with      │   │
│  │   licensed professionals        │   │
│  │                                 │   │
│  │ Preferred Roles (select all)    │   │
│  │ ☐ Technical  ☐ Business         │   │
│  │ ☐ Creative   ☐ Support          │   │
│  │                                 │   │
│  │ Languages                       │   │
│  │ [Dutch, English       ] + Add   │   │
│  │                                 │   │
│  │   [← Previous] [Submit Profile] │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

#### Components
- Radio groups for device and internet
- Checkboxes for willingness flags
- Multi-select checkboxes for roles
- Tag input for languages

#### Validation
- All fields optional
- No validation errors

#### Acceptance Criteria
- AC1: All fields optional, can skip to submit
- AC2: "Submit Profile" enabled even if no optional fields filled
- AC3: Progress bar shows 100% fill
- AC4: Form data preserved if user navigates back

---

### Step 4: Match Result Display

#### Layout
```
┌─────────────────────────────────────────┐
│           Profile Created! ✓            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Your Match Analysis             │   │
│  │                                 │   │
│  │ ┌─────────────────────────┐     │   │
│  │ │   🎯 HIGH FIT - 85%     │     │   │
│  │ └─────────────────────────┘     │   │
│  │                                 │   │
│  │ Match Rationale:                │   │
│  │ ✓ Strong skill alignment        │   │
│  │ ✓ Verified legal certification  │   │
│  │ ✓ High availability (30+ hrs)   │   │
│  │ ⚠ Limited experience (2 years)  │   │
│  │                                 │   │
│  │ Top Matched Opportunities:      │   │
│  │ ┌─────────────────────────┐     │   │
│  │ │ Surface Reseller        │     │   │
│  │ │ High Fit (87%)          │     │   │
│  │ │ [View Opportunity]      │     │   │
│  │ └─────────────────────────┘     │   │
│  │                                 │   │
│  │ ┌─────────────────────────┐     │   │
│  │ │ Legal Advisory Pilot    │     │   │
│  │ │ High Fit (83%)          │     │   │
│  │ │ [View Opportunity]      │     │   │
│  │ └─────────────────────────┘     │   │
│  │                                 │   │
│  │    [Go to Dashboard]            │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

#### Components
- Large fit badge (High/Medium/Low) with percentage
- Rationale list with checkmarks and warnings
- Opportunity cards with fit scores
- CTA button to dashboard

#### Data Flow
1. User clicks "Submit Profile" on Step 3
2. Form posts to `POST /api/profile` → returns `{profileId}`
3. App calls `POST /api/match` with `{profileId}` → returns `{score, fitLevel, rationale, opportunities}`
4. Result screen displays with animation

#### Acceptance Criteria
- AC1: Fit badge color-coded (green=High, yellow=Medium, gray=Low)
- AC2: Rationale shows top 3-5 match factors
- AC3: Top 3 matched opportunities displayed with scores
- AC4: "View Opportunity" navigates to opportunity detail
- AC5: "Go to Dashboard" navigates to role-specific dashboard
- AC6: Profile saved to database before showing results

---

## 4. Opportunity Browse and Detail Screens

### 4.1 Opportunity Browse

**Status**: Implemented
**File**: `platform/mvp/prototype-import/app/opportunities/page.tsx`

#### Current Features
- ✅ Filter sidebar (jurisdiction, protected activity)
- ✅ Opportunity cards with fit badges
- ✅ Protected activity warnings (⚠️ badges)
- ✅ Document creation (ideation, business case)
- ✅ Risk tracking
- ✅ Match rationale display

#### Enhancement Opportunities
- Add search bar for text filtering
- Sort options (newest, best fit, ending soon)
- Pagination or infinite scroll
- Save/bookmark opportunities
- Quick apply from card

#### Design Pattern
```
┌─────────────────────────────────────────────────────────┐
│ Browse Opportunities          [🔍 Search...] [+ Create] │
├─────────┬───────────────────────────────────────────────┤
│ Filters │ Showing 12 opportunities    [Sort: Relevance▼]│
│         │                                               │
│ Jurisdic│ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│ □ NL    │ │Opp #1   │ │Opp #2   │ │Opp #3   │         │
│ □ US    │ │High Fit │ │Med Fit  │ │Low Fit  │         │
│ □ UK    │ │⚠️ Protec│ │Active   │ │Active   │         │
│         │ │[View]   │ │[View]   │ │[View]   │         │
│ Status  │ └─────────┘ └─────────┘ └─────────┘         │
│ □ Active│                                               │
│ □ Draft │ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│         │ │Opp #4   │ │Opp #5   │ │Opp #6   │         │
│ Protectd│ │...      │ │...      │ │...      │         │
│ □ Only  │ └─────────┘ └─────────┘ └─────────┘         │
└─────────┴───────────────────────────────────────────────┘
```

---

### 4.2 Opportunity Detail

**Purpose**: Full opportunity information, apply/manage actions

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Home > Opportunities > Surface Reseller Alliance        │
├─────────────────────────────────────────────────────────┤
│ Surface Reseller Alliance                               │
│ [High Fit 87%] [⚠️ Protected] [Active]                  │
│                          [💾 Save] [Apply Now]          │
├────────────────────┬────────────────────────────────────┤
│ Description        │ Details                            │
│                    │ Owner: John Entrepreneur           │
│ Full opportunity   │ Jurisdiction: Netherlands          │
│ description with   │ Created: Jan 10, 2026              │
│ markdown support   │ Applications: 12                   │
│ including:         │                                    │
│ • Goals            │ Match Analysis                     │
│ • Requirements     │ Skills Match: 85%                  │
│ • Timeline         │ [▓▓▓▓▓▓▓▓░░] 85%                   │
│                    │                                    │
│ Requirements       │ License Match: 100%                │
│ • Legal license    │ [▓▓▓▓▓▓▓▓▓▓] 100%                  │
│ • 5+ years exp     │                                    │
│ • Dutch fluency    │ Availability: Met                  │
│                    │                                    │
│ Protected Activity │ Documents                          │
│ ⚠️ This opportunity│ • Ideation Doc [View]              │
│ involves regulated │ • Business Case [View]             │
│ legal work.        │ • Risk Register [View]             │
│                    │                                    │
│ Documents (3)      │ Team (2)                           │
│ • Ideation         │ • John E. (Owner)                  │
│ • Business Case    │ • Sarah M. (Mentor)                │
│ • Risk Register    │                                    │
└────────────────────┴────────────────────────────────────┘
```

#### Components
- Breadcrumb navigation
- Title with badges (fit, protected, status)
- Action buttons (Save, Apply)
- 2-column layout (main content + sidebar)
- Progress bars for match metrics
- Document list with view buttons
- Team member avatars

#### Acceptance Criteria
- AC1: Breadcrumb shows navigation path
- AC2: Fit badge color matches browse page
- AC3: Protected activity warning prominent if applicable
- AC4: "Apply Now" opens application modal (if not applied)
- AC5: "Save" bookmarks opportunity (toggle state)
- AC6: Match analysis shows breakdown of fit score
- AC7: Documents open in viewer dialog
- AC8: Team members clickable to view profiles

---

## 5. Evidence Upload and Viewer Screens

### 5.1 Evidence Upload Form

**Purpose**: Upload and annotate evidence files (licenses, certs, docs)

#### Layout
```
┌─────────────────────────────────────────┐
│ Upload Evidence              [X Close]  │
├─────────────────────────────────────────┤
│ Evidence Type *                         │
│ [ Select type...           ▼]           │
│ Options: License, Certification,        │
│          Registration, Other            │
│                                         │
│ File Upload *                           │
│ ┌─────────────────────────────────┐     │
│ │ 📎 Drag files here              │     │
│ │ or click to browse              │     │
│ │                                 │     │
│ │ Accepted: PDF, JPG, PNG         │     │
│ │ Max size: 10MB                  │     │
│ └─────────────────────────────────┘     │
│                                         │
│ Issuer *                                │
│ [_________________________]             │
│                                         │
│ Registration/License ID                 │
│ [_________________________]             │
│                                         │
│ Issue Date                              │
│ [📅 Select date]                        │
│                                         │
│ Expiry Date                             │
│ [📅 Select date]                        │
│                                         │
│ Notes                                   │
│ [_________________________]             │
│ [_________________________]             │
│                                         │
│ Checksum (calculated on upload)         │
│ SHA-256: [will appear after selection]  │
│                                         │
│         [Cancel] [Upload Evidence]      │
└─────────────────────────────────────────┘
```

#### Components
- Select dropdown for evidence type
- File upload zone (drag-and-drop)
- Input fields with validation
- Calendar date pickers
- Textarea for notes
- Read-only checksum display
- Action buttons

#### File Upload Behavior
1. User drags file or clicks to browse
2. File selected → client calculates SHA-256 checksum
3. Checksum displayed before upload
4. File size and type validated
5. Preview thumbnail shown (for images/PDFs)
6. Upload button enabled when form valid

#### Validation
- Evidence Type: Required
- File: Required, max 10MB, allowed types
- Issuer: Required, min 2 characters
- Registration ID: Optional
- Dates: Optional, Issue Date < Expiry Date
- Notes: Optional, max 500 characters

#### Acceptance Criteria
- AC1: Drag-and-drop works and shows file name
- AC2: Checksum calculated client-side (SHA-256)
- AC3: File preview shown for images/PDFs
- AC4: Upload progress bar displayed during upload
- AC5: Success message shown after upload
- AC6: Form cleared after successful upload
- AC7: Error message if upload fails (with retry option)

---

### 5.2 Evidence Viewer

**Purpose**: View uploaded evidence with metadata and verification status

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│ Evidence Viewer                              [X Close]  │
├─────────────────────────────────────────────────────────┤
│ Bar Admission - Netherlands                 [✓ Verified]│
│ Uploaded by: Jane Doe | Jan 14, 2026                    │
│ Verified by: Sarah Mentor | Jan 15, 2026                │
├────────────────────┬────────────────────────────────────┤
│ File Preview       │ Metadata                           │
│                    │                                    │
│ ┌────────────────┐ │ Evidence Type: License             │
│ │                │ │ Issuer: Dutch Bar Association      │
│ │  [PDF Preview] │ │ Registration ID: NL-BAR-12345      │
│ │                │ │ Issue Date: Jan 1, 2020            │
│ │                │ │ Expiry Date: Dec 31, 2028          │
│ │  Document      │ │                                    │
│ │  content       │ │ Verification                       │
│ │  rendered      │ │ Status: ✅ Verified                │
│ │                │ │ Verified By: Sarah Mentor          │
│ │  [Scroll to    │ │ Verified On: Jan 15, 2026          │
│ │   view more]   │ │ Notes: Valid, confirmed with       │
│ │                │ │        issuing body                │
│ └────────────────┘ │                                    │
│                    │ File Information                   │
│ [Download PDF]     │ Filename: bar-admission.pdf        │
│ [View Full Screen] │ Size: 2.3 MB                       │
│                    │ Checksum:                          │
│                    │ a3f5d8...                          │
│                    │                                    │
│                    │ Audit Trail                        │
│                    │ • Uploaded (Jan 14, 10:30 AM)      │
│                    │ • Submitted for review (Jan 14)    │
│                    │ • Verified (Jan 15, 2:15 PM)       │
│                    │                                    │
│                    │ Actions (Analyst/Mentor only)      │
│                    │ [Verify] [Flag] [Request Update]   │
└────────────────────┴────────────────────────────────────┘
```

#### Components
- Dialog header with title, verification badge
- File preview pane (PDF renderer, image viewer)
- Metadata panel (2-column layout)
- Verification status section
- File info with checksum
- Audit trail timeline
- Action buttons (role-based)

#### File Preview Support
- **PDF**: Embedded PDF viewer (pdf.js or similar)
- **Images**: Full image display with zoom
- **Other**: Download button, no preview

#### Role-Based Actions
- **Student (owner)**: View only, download
- **Mentor**: View, download, verify, flag
- **Analyst**: View, download, verify, flag, request update
- **Admin**: All actions + delete

#### Acceptance Criteria
- AC1: Preview renders for PDF and images
- AC2: All metadata displayed accurately
- AC3: Verification status badge color-coded (green=verified, yellow=pending, red=flagged)
- AC4: Audit trail shows all actions chronologically
- AC5: Action buttons visible only to authorized roles
- AC6: "Verify" button opens confirmation dialog
- AC7: "Flag" button requires reason input
- AC8: Download button generates file with original name

---

## Implementation Priority

### Week 3: High Priority
1. ✅ Landing Page (already enhanced)
2. 🔄 Student Dashboard
3. 🔄 Profile Onboarding (Steps 1-3)
4. 🔄 Opportunity Browse (enhancement)

### Week 4: Medium Priority
5. ⏳ Mentor Dashboard
6. ⏳ Entrepreneur Dashboard
7. ⏳ Evidence Upload Form
8. ⏳ Evidence Viewer

### Post-Phase 2: Lower Priority
9. ⏳ Analyst Dashboard
10. ⏳ Admin Dashboard
11. ⏳ Opportunity Detail (enhancements)

---

## Design Review Checklist

### For Each Screen
- [ ] Wireframe documented with layout
- [ ] Components identified from design system
- [ ] Responsive behavior specified (mobile/tablet/desktop)
- [ ] Acceptance criteria defined (minimum 5 per screen)
- [ ] Data requirements listed
- [ ] API endpoints identified
- [ ] Role-based permissions specified
- [ ] Error states designed
- [ ] Loading states designed
- [ ] Empty states designed
- [ ] Accessibility considerations noted

---

## Next Steps

1. **Begin Implementation**: Start with Student Dashboard
2. **Create Component Variants**: Build reusable dashboard widgets
3. **Develop Profile Flow**: Implement 3-step progressive form
4. **User Testing**: Test onboarding flow with sample users
5. **Iterate**: Refine based on feedback

---

**Status**: 🔄 In Progress (60% complete)
**Phase 2 Target**: Week 4 completion
**Last Updated**: 2026-01-16
