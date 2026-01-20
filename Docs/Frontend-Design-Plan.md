---
title: "Frontend Design Plan — Velocity Quantal Platform"
owner: "@mdresch"
authors: ["Menno Drescher"]
version: "0.1.0"
date: "2026-01-16"
status: "draft"
---

## Overview

This document outlines the frontend design strategy, component architecture, design system, and implementation roadmap for the Velocity Quantal platform—a low/no-CapEx pilot validation system with role-based workflows, evidence management, and compliance tracking.

## Design Goals

1. **Role-Clarity**: Each user role (Student, Mentor, Entrepreneur, Analyst, Admin) should have immediately recognizable interfaces
2. **Compliance-First**: Protected activities and verification requirements must be visually prominent
3. **Zero-Friction Onboarding**: Progressive disclosure, clear CTAs, and minimal cognitive load
4. **Evidence Transparency**: All uploads, verifications, and audit trails visible and traceable
5. **Mobile-Responsive**: Core workflows accessible on tablets and mobile devices
6. **Accessibility**: WCAG 2.1 AA compliance for all primary flows

## Design System Foundation

### Component Library: shadcn/ui
**Current Implementation**: Next.js 16 + React 19 + Tailwind CSS + shadcn/ui

**Available Components** (58 total):
- **Layout**: Card, Dialog, Sheet, Drawer, Tabs, Accordion, Collapsible, Separator
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch, Calendar, Slider
- **Navigation**: Breadcrumb, Navigation Menu, Menubar, Sidebar, Pagination
- **Feedback**: Alert, Toast, Progress, Spinner, Skeleton, Badge
- **Data Display**: Table, Avatar, Hover Card, Tooltip, Empty State
- **Interactive**: Button, Button Group, Dropdown Menu, Context Menu, Popover, Command
- **Advanced**: Carousel, Chart, Resizable, Scroll Area

### Color System & Theming

**Primary Palette** (mapped to Tailwind):
- **Primary**: Brand identity, CTAs, active states
- **Secondary**: Supporting actions, backgrounds
- **Muted**: Low-emphasis content, disabled states
- **Accent**: Highlights, notifications, status indicators
- **Destructive**: Errors, warnings, risk escalations

**Role-Based Color Coding**:
- Student: Blue tones (learning, growth)
- Mentor: Green tones (guidance, approval)
- Entrepreneur: Purple tones (innovation, business)
- Analyst: Orange tones (inspection, verification)
- Admin: Gray tones (authority, oversight)

**Status Colors**:
- Protected Activity: Amber/Yellow (⚠️ caution)
- Verified: Green (✅ success)
- Pending Verification: Blue (🔄 in progress)
- Risk/Escalated: Red (🚨 alert)
- Draft/Incomplete: Gray (📝 neutral)

### Typography

**Scale**:
- Display (h1): 2.5rem (40px) - Page headers
- Heading 1 (h2): 2rem (32px) - Section titles
- Heading 2 (h3): 1.5rem (24px) - Card headers
- Heading 3 (h4): 1.25rem (20px) - Subsections
- Body: 1rem (16px) - Default text
- Small: 0.875rem (14px) - Metadata, captions
- Tiny: 0.75rem (12px) - Timestamps, footnotes

**Font Families**:
- Sans-serif: System font stack (Inter/SF Pro/Segoe UI)
- Monospace: For code, IDs, checksums (Consolas/Monaco/Source Code Pro)

### Spacing & Layout

**Grid System**: 
- 12-column responsive grid
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

**Container Widths**:
- Full: `max-w-7xl` (1280px) - Dashboards, tables
- Standard: `max-w-4xl` (896px) - Forms, content pages
- Wide Dialog: `max-w-[90vw]` - Document viewer, evidence review
- Narrow: `max-w-2xl` (672px) - Focused forms, onboarding

**Padding Scale**:
- Page: `px-4 py-12` (mobile), `px-8 py-16` (desktop)
- Card: `p-6` 
- Dialog: `p-6` (content), `p-4` (header/footer)
- Inline spacing: `gap-2`, `gap-4`, `gap-6`, `gap-8`

## Key Screen Categories

### 1. Landing & Authentication
**Screens**: Homepage, Role Selection, Login
**Design Focus**: 
- Clear value proposition with 6 feature cards
- Emoji-enhanced feature descriptions
- 3-step "How It Works" flow
- Role cards with icons and descriptions
- Prominent CTAs for each role

**Components**: Card, Button, Badge, Icons (lucide-react)

### 2. Dashboards (Role-Specific)
**Screens**: Student Dashboard, Mentor Dashboard, Entrepreneur Dashboard, Analyst Dashboard, Admin Dashboard

**Common Patterns**:
- Header with user avatar, role indicator, notifications
- Journey progress tracker (Student)
- Active pilots/opportunities grid (Card layout)
- Pending actions/tasks sidebar
- KPI metrics (Entrepreneur/Admin)
- Quick actions toolbar

**Components**: Card, Badge, Progress, Table, Button, Avatar, Alert

### 3. Profile & Onboarding
**Screens**: Profile Creation (Student/Mentor/Entrepreneur/Analyst), Profile Edit

**Design Principles**:
- Progressive 3-step forms (Basic → Scored → Optional)
- Inline validation with friendly error messages
- Save Draft functionality (localStorage)
- Upload certification modal
- Fit matching result display with rationale
- Evidence metadata capture

**Components**: Input, Textarea, Select, Checkbox, Radio Group, Label, Button, Progress, Badge, Dialog

### 4. Opportunities & Matching
**Screens**: Browse Opportunities, Opportunity Detail, Create Opportunity

**Design Features**:
- Filter sidebar (jurisdiction, protected activity, skills)
- Opportunity cards with Fit badges (High/Medium/Low)
- Protected activity warnings (⚠️ amber badges)
- Document creation (ideation, business case)
- Risk tracking and escalation
- Match rationale tooltips

**Components**: Card, Badge, Button, Select, Checkbox, Dialog, ScrollArea, Textarea, Alert

### 5. Evidence & Verification
**Screens**: Evidence Upload, Evidence Viewer, Verification Queue (Mentor/Analyst)

**Design Requirements**:
- Drag-and-drop upload zones
- File type icons and size indicators
- Metadata form fields (issuer, ID, expiry)
- SHA-256 checksum display
- Preview modal for documents/images
- Verification status timeline
- Manual verification panel with approval/rejection
- Audit log viewer

**Components**: Input, Button, Card, Badge, Dialog, ScrollArea, Table, Alert, Progress

### 6. Pilot Management
**Screens**: Create Pilot, Pilot Detail, Edit Pilot

**Compliance Features**:
- Protected activity checkbox with gating UI
- Evidence requirement enforcement
- Partner fallback note (if no verified license)
- KPI tracking forms
- Team member assignment
- Timeline visualization

**Components**: Input, Textarea, Checkbox, Select, Card, Badge, Button, Alert, Progress, Calendar

### 7. Document Management
**Screens**: Document Viewer Dialog, Document Editor

**Current Implementation** (document-viewer-dialog.tsx):
- Wide dialog (`max-w-[90vw]`)
- Markdown rendering with formatting
- Edit/view mode toggle
- Version tracking with badges
- Collaborative editing (lastModifiedBy)
- ScrollArea for long content
- Auto-close on save (prevents stale data)

**Enhancement Opportunities**:
- Rich text editor (Tiptap/Lexical)
- Comment threads
- Change tracking/diff view
- Export to PDF
- Document templates library

**Components**: Dialog, ScrollArea, Textarea, Input, Label, Button, Badge

### 8. Risk & Issue Management
**Screens**: Risk Register, Issue Detail, Escalate Risk Dialog

**Design Features**:
- Risk severity badges (Low/Medium/High/Critical)
- Escalation workflow with approver selection
- Impact assessment forms
- Mitigation tracking
- Timeline of risk events

**Components**: Dialog, Input, Textarea, Select, Badge, Card, Alert, Button

### 9. Admin & Audit
**Screens**: Admin Dashboard, Audit Log, Export Bundle, User Management

**Data-Dense Displays**:
- Filterable data tables with sorting
- Timeline views
- Export controls (CSV/JSON/PDF)
- User role assignment
- Activity heatmaps
- Compliance report generation

**Components**: Table, Select, Input, Button, Badge, Calendar, Chart, Alert

## Component Patterns & Conventions

### Navigation Patterns

**Breadcrumbs**: `Home > Opportunities > Opportunity #123 > Documents`
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/opportunities">Opportunities</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Opportunity #123</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

**Sidebar Navigation**:
- Collapsible sidebar for app navigation
- Role-specific menu items
- Active state indicators
- Icon + label for clarity

### Form Patterns

**Progressive Disclosure**:
1. Show required fields first
2. Group related fields
3. Use accordions for optional sections
4. Display step progress (1/3, 2/3, 3/3)

**Validation**:
- Inline error messages below fields
- Error state styling (red border + icon)
- Success state for verified fields (green checkmark)
- Prevent submission until required fields valid

**File Upload**:
```tsx
<div className="border-2 border-dashed rounded-lg p-8 text-center">
  <Input type="file" className="hidden" id="file-upload" />
  <Label htmlFor="file-upload" className="cursor-pointer">
    <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
    <p>Drag files here or click to upload</p>
    <p className="text-xs text-muted-foreground">Max 10MB per file</p>
  </Label>
</div>
```

### Status Indicators

**Badge Usage**:
- **Fit Level**: `<Badge variant="outline" className="bg-green-50">High Fit</Badge>`
- **Protected Activity**: `<Badge variant="destructive">⚠️ Protected</Badge>`
- **Verification Status**: `<Badge variant="default">✅ Verified</Badge>`
- **Pilot Status**: `<Badge variant="secondary">📝 Draft</Badge>`
- **Version**: `<Badge variant="outline">v3</Badge>`

**Progress Indicators**:
- Linear progress bars for multi-step processes
- Skeleton loaders for data fetching
- Spinners for in-progress actions

### Modal/Dialog Patterns

**Dialog Sizes**:
- Small (confirmation): `max-w-md` (448px)
- Medium (forms): `max-w-2xl` (672px)
- Large (content): `max-w-4xl` (896px)
- Extra Large (documents): `max-w-[90vw]`

**Dialog Structure**:
```tsx
<Dialog>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Title with Icon</DialogTitle>
      <DialogDescription>Contextual description</DialogDescription>
    </DialogHeader>
    
    <ScrollArea className="h-[calc(85vh-180px)]">
      {/* Content */}
    </ScrollArea>
    
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Data Display Patterns

**Card Grids**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  ))}
</div>
```

**Tables** (for data-heavy views):
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.data1}</TableCell>
        <TableCell>{row.data2}</TableCell>
        <TableCell className="text-right">
          <Button size="sm" variant="ghost">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Responsive Design Strategy

### Mobile-First Breakpoints

**Layout Adjustments**:
- `sm` (640px): 1-column grids become 2-column
- `md` (768px): Sidebar navigation appears, 3-column grids
- `lg` (1024px): Full desktop layout, 4-column grids
- `xl` (1280px): Maximum content width, enhanced spacing

**Mobile Optimizations**:
- Bottom sheet navigation instead of sidebar
- Stacked form fields (full width)
- Touch-friendly button sizes (min 44x44px)
- Simplified data tables (hide non-critical columns)
- Collapsible sections for long content

### Tablet Considerations
- Portrait: Similar to mobile with larger text
- Landscape: Desktop-like layout with condensed spacing

## Accessibility Guidelines

### Keyboard Navigation
- Tab order follows visual hierarchy
- All interactive elements keyboard accessible
- Escape key closes dialogs/modals
- Arrow keys navigate lists and tables
- Enter/Space activate buttons

### Screen Reader Support
- Semantic HTML elements (`<nav>`, `<main>`, `<article>`)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Descriptive link text (avoid "click here")
- Alt text for all images and icons

### Color Contrast
- Minimum 4.5:1 for body text
- Minimum 3:1 for large text (18px+)
- Status not conveyed by color alone (use icons + text)

### Focus States
- Visible focus indicators (outline or ring)
- High contrast focus styles
- Skip navigation links

## Animation & Interaction

### Micro-interactions
- Button hover states (scale, shadow)
- Card hover effects (lift, border glow)
- Loading spinners (smooth rotation)
- Toast notifications (slide-in from top-right)
- Drawer/Sheet transitions (slide from edge)

### Transitions
- Standard duration: 150-300ms
- Easing: `ease-in-out` for most interactions
- Page transitions: Fade or slide (avoid jarring movements)

### Performance Considerations
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Respect `prefers-reduced-motion` user preference

## Design Deliverables Roadmap

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE
- ✅ Design system documentation (this document)
- ✅ Component inventory and audit
- ✅ Color palette and typography finalized
- ✅ Responsive layout templates ([Responsive-Layout-Templates.md](./Responsive-Layout-Templates.md))
- ✅ Icon library standardization ([Icon-Library-Standards.md](./Icon-Library-Standards.md))

### Phase 2: Core Flows (Week 3-4) 🔄 IN PROGRESS
- ✅ Landing page redesign (enhanced with features, how-it-works, value prop)
- 🔄 Role-specific dashboard mockups ([Phase2-Core-Flows-Design.md](./Phase2-Core-Flows-Design.md#2-role-specific-dashboard-mockups))
- 🔄 Profile onboarding flow (3-step progressive) ([Phase2-Core-Flows-Design.md](./Phase2-Core-Flows-Design.md#3-profile-onboarding-flow-3-step-progressive))
- ✅ Opportunity browse and detail screens (implemented, documented in Phase 2)
- 🔄 Evidence upload and viewer screens ([Phase2-Core-Flows-Design.md](./Phase2-Core-Flows-Design.md#5-evidence-upload-and-viewer-screens))

### Phase 3: Advanced Features (Week 5-6)
- ⏳ Document editor enhancements (rich text)
- ⏳ Risk escalation workflow screens
- ⏳ Admin audit and reporting interfaces
- ⏳ Notification center design
- ⏳ Mobile responsive refinements

### Phase 4: Polish & Testing (Week 7-8)
- ⏳ Accessibility audit and fixes
- ⏳ User testing and iteration
- ⏳ Animation and interaction polish
- ⏳ Performance optimization
- ⏳ Design QA and handoff documentation

## Tools & Workflow

### Design Tools
- **Wireframing**: Markdown-based wireframes (current approach)
- **Prototyping**: v0.dev or similar AI-powered tools
- **UI Components**: shadcn/ui documentation and examples
- **Icons**: lucide-react icon library
- **Screenshots/Assets**: To be captured from prototype

### Development Workflow
1. Review wireframe markdown and acceptance criteria
2. Implement with shadcn/ui components and Tailwind CSS
3. Test responsive behavior at all breakpoints
4. Validate accessibility with keyboard and screen reader
5. Iterate based on user feedback

### Documentation
- **Component Patterns**: Maintain a living style guide in `/Docs`
- **Acceptance Criteria**: Link designs to BA requirements
- **Change Log**: Track design decisions and rationale

## Next Steps

### Immediate Actions
1. **Complete responsive templates** for dashboards and forms
2. **Create Figma/Sketch templates** (optional, if visual mockups needed beyond code)
3. **Build component playground** to demonstrate all patterns
4. **Conduct stakeholder review** of design direction
5. **Prioritize high-impact screens** for next sprint

### Open Questions
- Should we introduce a design token system (CSS variables)?
- Do we need dark mode support?
- What level of customization should roles have (themes, layouts)?
- Should we invest in a dedicated design system site (Storybook)?

### Success Metrics
- Time to complete primary user flows (< 2 minutes per flow)
- Accessibility score (Lighthouse: 95+ on accessibility)
- Mobile usability score (Google Mobile-Friendly Test)
- User satisfaction ratings from prototype testing
- Component reuse percentage (target: 80%+ of UI from design system)

---

**Version History**:
- v0.1.0 (2026-01-16): Initial design plan created with component audit, patterns, and roadmap

**References**:
- [UI Requirements](./UI-Requirements.md)
- [BA Top 3 ACs & Wireframes](./BA-Top3-ACs-Wireframes.md)
- [Technical Specs](./36-Technical-Specs-Velocity-Quantal.md)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
