---
title: "Icon Library Standardization — Velocity Quantal"
owner: "@mdresch"
authors: ["Menno Drescher"]
version: "1.0.0"
date: "2026-01-16"
status: "complete"
---

## Overview

This document standardizes icon usage across the Velocity Quantal platform using **lucide-react** as the primary icon library. Consistent icon usage improves user recognition, accessibility, and development efficiency.

## Icon Library: lucide-react

**Package**: `lucide-react`
**Version**: Latest (auto-updated with dependencies)
**Total Icons**: 1000+ open-source icons
**License**: ISC (permissive, commercial-friendly)
**Documentation**: https://lucide.dev/

### Why lucide-react?
- ✅ React-native components (not font-based)
- ✅ Tree-shakeable (only imports used icons)
- ✅ Consistent design language
- ✅ Highly customizable (size, color, stroke)
- ✅ Active maintenance and community

### Installation
```bash
npm install lucide-react
```

### Basic Usage
```tsx
import { FileText, User, Settings } from 'lucide-react'

<FileText className="h-4 w-4" />
<User className="h-5 w-5 text-primary" />
<Settings className="h-6 w-6" strokeWidth={1.5} />
```

---

## Icon Size Standards

### Size Scale
```tsx
// Extra Small - Inline with text, badges
h-3 w-3    // 12px - In badges, chips, tiny indicators
h-4 w-4    // 16px - Button icons, inline icons

// Standard Sizes
h-5 w-5    // 20px - Navigation, toolbar, default UI
h-6 w-6    // 24px - Card headers, feature icons

// Large Sizes
h-8 w-8    // 32px - Dashboard metrics, avatar replacements
h-10 w-10  // 40px - Hero sections, empty states
h-12 w-12  // 48px - Large empty states, onboarding
h-16 w-16  // 64px - Feature highlights, landing page
```

### Size Guidelines by Context

**Buttons**:
```tsx
// Small button
<Button size="sm">
  <Icon className="h-4 w-4 mr-2" />
  Text
</Button>

// Default button
<Button>
  <Icon className="h-4 w-4 mr-2" />
  Text
</Button>

// Icon-only button
<Button size="sm" variant="ghost">
  <Icon className="h-5 w-5" />
</Button>
```

**Navigation**:
```tsx
// Sidebar nav item
<div className="flex items-center gap-3 px-3 py-2">
  <Icon className="h-5 w-5" />
  <span>Menu Item</span>
</div>

// Top navigation
<Icon className="h-6 w-6" />
```

**Cards**:
```tsx
// Card header icon
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
  <Icon className="h-6 w-6 text-primary" />
</div>
```

**Empty States**:
```tsx
<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
  <Icon className="h-8 w-8 text-muted-foreground" />
</div>
```

---

## Standardized Icon Map

### Navigation & Actions

| Function | Icon | Usage |
|----------|------|-------|
| Home | `Home` | Dashboard, home navigation |
| Back | `ArrowLeft` | Back buttons, breadcrumbs |
| Forward | `ArrowRight` | Next, forward navigation |
| Up | `ArrowUp` | Scroll to top, priority up |
| Down | `ArrowDown` | Expand, priority down |
| Menu | `Menu` | Mobile menu toggle |
| Close/Exit | `X` | Close dialogs, remove items |
| Search | `Search` | Search inputs, buttons |
| Filter | `Filter` | Filter controls |
| Sort | `ArrowUpDown` | Sort tables, lists |
| Refresh | `RefreshCw` | Reload data |
| More Options | `MoreVertical` | Dropdown menus |
| External Link | `ExternalLink` | Open in new window |

**Examples**:
```tsx
import { Home, ArrowLeft, ArrowRight, Menu, X, Search, Filter, RefreshCw, MoreVertical, ExternalLink } from 'lucide-react'
```

---

### User & Profile

| Function | Icon | Usage |
|----------|------|-------|
| User Profile | `User` | Single user, profile icon |
| Users/Team | `Users` | Multiple users, team |
| Avatar | `UserCircle` | User avatar placeholder |
| Settings | `Settings` | User settings, configuration |
| Login | `LogIn` | Sign in actions |
| Logout | `LogOut` | Sign out actions |
| Account | `UserCog` | Account management |
| Notifications | `Bell` | Alerts, notifications |
| Notifications (with badge) | `BellRing` | Unread notifications |

**Examples**:
```tsx
import { User, Users, UserCircle, Settings, LogIn, LogOut, UserCog, Bell, BellRing } from 'lucide-react'
```

---

### Roles (Velocity Quantal Specific)

| Role | Icon | Color Theme | Usage |
|------|------|-------------|-------|
| Student | `GraduationCap` | Blue | Student profiles, dashboard |
| Mentor | `Users` | Green | Mentor profiles, guidance |
| Entrepreneur | `Briefcase` | Purple | Business owner, opportunities |
| Admin | `Shield` | Gray | System admin, oversight |
| Analyst | `BookOpen` | Orange | Evidence review, audit |

**Examples**:
```tsx
import { GraduationCap, Users, Briefcase, Shield, BookOpen } from 'lucide-react'

// Role icon with color
<div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
  <GraduationCap className="h-6 w-6 text-blue-600" />
</div>
```

---

### Content & Documents

| Function | Icon | Usage |
|----------|------|-------|
| Document | `FileText` | Generic document, text file |
| Folder | `Folder` | Directories, collections |
| Upload | `Upload` | File upload actions |
| Download | `Download` | Download files |
| Edit | `Edit` | Edit content |
| Save | `Save` | Save changes |
| Copy | `Copy` | Copy to clipboard |
| Trash/Delete | `Trash2` | Delete items |
| Archive | `Archive` | Archive items |
| Attachment | `Paperclip` | File attachments |
| Image | `Image` | Image files |
| PDF | `FileText` | PDF documents |
| Spreadsheet | `Sheet` | Excel/CSV files |

**Examples**:
```tsx
import { FileText, Folder, Upload, Download, Edit, Save, Copy, Trash2, Archive, Paperclip, Image, Sheet } from 'lucide-react'
```

---

### Status & Indicators

| Status | Icon | Color | Usage |
|--------|------|-------|-------|
| Success/Verified | `CheckCircle` | Green | Completed, verified |
| Error/Failed | `XCircle` | Red | Errors, failures |
| Warning/Protected | `AlertTriangle` | Amber/Yellow | Warnings, protected activities |
| Info | `Info` | Blue | Information, help |
| Pending | `Clock` | Blue | In progress, waiting |
| Help/Question | `HelpCircle` | Gray | Help tooltips |
| Check/Done | `Check` | Green | Checkboxes, completion |
| Badge/Award | `Award` | Gold | Achievements, certifications |
| Star/Favorite | `Star` | Yellow | Favorites, ratings |
| Bookmark | `Bookmark` | Gray | Saved items |
| Flag | `Flag` | Red | Flagged, important |

**Examples**:
```tsx
import { CheckCircle, XCircle, AlertTriangle, Info, Clock, HelpCircle, Check, Award, Star, Bookmark, Flag } from 'lucide-react'

// Status badge with icon
<Badge variant="outline" className="bg-green-50">
  <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
  Verified
</Badge>
```

---

### Data & Analytics

| Function | Icon | Usage |
|----------|------|-------|
| Chart/Analytics | `BarChart3` | Analytics, statistics |
| Trend Up | `TrendingUp` | Positive metrics |
| Trend Down | `TrendingDown` | Negative metrics |
| Pie Chart | `PieChart` | Distribution charts |
| Dashboard | `LayoutDashboard` | Dashboard views |
| Calendar | `Calendar` | Dates, scheduling |
| Clock/Time | `Clock` | Timestamps, duration |
| Target/Goal | `Target` | KPIs, objectives |
| Activity | `Activity` | Activity logs |

**Examples**:
```tsx
import { BarChart3, TrendingUp, TrendingDown, PieChart, LayoutDashboard, Calendar, Clock, Target, Activity } from 'lucide-react'
```

---

### Actions & Operations

| Function | Icon | Usage |
|----------|------|-------|
| Add/Create | `Plus` | Add new items |
| Add Circle | `PlusCircle` | Create with emphasis |
| Remove | `Minus` | Remove, decrease |
| Play | `Play` | Start process |
| Pause | `Pause` | Pause process |
| Stop | `Square` | Stop process |
| Send | `Send` | Submit, send messages |
| Share | `Share2` | Share content |
| Link | `Link` | URLs, connections |
| Unlink | `Unlink` | Disconnect |
| Lock | `Lock` | Secure, locked |
| Unlock | `Unlock` | Unlocked, open |
| Eye | `Eye` | View, preview |
| Eye Off | `EyeOff` | Hidden, private |

**Examples**:
```tsx
import { Plus, PlusCircle, Minus, Play, Pause, Square, Send, Share2, Link, Unlink, Lock, Unlock, Eye, EyeOff } from 'lucide-react'
```

---

### Communication

| Function | Icon | Usage |
|----------|------|-------|
| Message | `MessageSquare` | Messages, comments |
| Chat | `MessageCircle` | Chat, conversations |
| Mail | `Mail` | Email, messages |
| Phone | `Phone` | Phone contact |
| Video | `Video` | Video calls |
| Mic | `Mic` | Audio, recording |
| At Symbol | `AtSign` | Mentions, email |

**Examples**:
```tsx
import { MessageSquare, MessageCircle, Mail, Phone, Video, Mic, AtSign } from 'lucide-react'
```

---

### Protected Activities & Compliance

| Function | Icon | Usage |
|----------|------|-------|
| Protected Activity | `AlertTriangle` | Protected activity warnings |
| Shield/Security | `Shield` | Security, admin |
| Shield Check | `ShieldCheck` | Verified security |
| Badge | `BadgeCheck` | Verified credentials |
| License | `Award` | Certifications, licenses |
| Audit | `FileSearch` | Audit trails |
| Compliance | `ClipboardCheck` | Compliance checks |
| Risk | `AlertCircle` | Risk indicators |
| Escalate | `TrendingUp` | Risk escalation |

**Examples**:
```tsx
import { AlertTriangle, Shield, ShieldCheck, BadgeCheck, Award, FileSearch, ClipboardCheck, AlertCircle, TrendingUp } from 'lucide-react'

// Protected activity badge
<Badge variant="destructive" className="bg-amber-100 text-amber-800 border-amber-300">
  <AlertTriangle className="h-3 w-3 mr-1" />
  Protected Activity
</Badge>
```

---

### Pilots & Opportunities

| Function | Icon | Usage |
|----------|------|-------|
| Opportunity | `Briefcase` | Business opportunity |
| Pilot/Project | `Rocket` | Pilot projects |
| Task | `CheckSquare` | Tasks, to-dos |
| Milestone | `Flag` | Project milestones |
| Team | `Users` | Team members |
| Building | `Building` | Organizations |
| Globe | `Globe` | Jurisdiction, global |
| Map Pin | `MapPin` | Location, region |

**Examples**:
```tsx
import { Briefcase, Rocket, CheckSquare, Flag, Users, Building, Globe, MapPin } from 'lucide-react'
```

---

## Icon Color Conventions

### Semantic Colors

```tsx
// Success (Green)
<CheckCircle className="h-5 w-5 text-green-600" />
<Badge className="bg-green-50 text-green-700 border-green-200">
  <CheckCircle className="h-3 w-3 mr-1" /> Verified
</Badge>

// Error (Red)
<XCircle className="h-5 w-5 text-red-600" />
<Alert variant="destructive">
  <XCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
</Alert>

// Warning (Amber/Yellow)
<AlertTriangle className="h-5 w-5 text-amber-600" />
<Badge className="bg-amber-50 text-amber-700 border-amber-200">
  <AlertTriangle className="h-3 w-3 mr-1" /> Protected
</Badge>

// Info (Blue)
<Info className="h-5 w-5 text-blue-600" />

// Neutral (Gray)
<Clock className="h-5 w-5 text-muted-foreground" />

// Primary (Brand)
<Star className="h-5 w-5 text-primary" />
```

### Context-Based Colors

```tsx
// Navigation (inherit or muted)
<Icon className="h-5 w-5" />
<Icon className="h-5 w-5 text-muted-foreground" />

// Active state
<Icon className="h-5 w-5 text-primary" />

// Disabled state
<Icon className="h-5 w-5 text-muted-foreground opacity-50" />

// Hover state (using group)
<div className="group">
  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
</div>
```

---

## Icon Customization

### Stroke Width
```tsx
// Default stroke
<Icon className="h-5 w-5" />

// Thin stroke (delicate)
<Icon className="h-5 w-5" strokeWidth={1} />

// Medium stroke
<Icon className="h-5 w-5" strokeWidth={1.5} />

// Bold stroke (emphasis)
<Icon className="h-5 w-5" strokeWidth={2.5} />
```

### Fill vs Stroke
```tsx
// Default (stroke only)
<Heart className="h-5 w-5" />

// Filled variant (use specific filled icons)
<HeartFilled className="h-5 w-5 fill-red-500" />

// Custom fill
<Star className="h-5 w-5 fill-yellow-400 text-yellow-600" />
```

---

## Animation Patterns

### Spin (Loading)
```tsx
import { Loader2 } from 'lucide-react'

<Loader2 className="h-5 w-5 animate-spin" />

// In button
<Button disabled>
  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  Loading...
</Button>
```

### Pulse (Notification)
```tsx
<BellRing className="h-5 w-5 text-red-500 animate-pulse" />
```

### Bounce (Attention)
```tsx
<ArrowDown className="h-5 w-5 animate-bounce" />
```

---

## Accessibility Guidelines

### Icon-Only Buttons
Always provide accessible labels for icon-only buttons:

```tsx
// Screen reader label
<Button variant="ghost" size="sm" aria-label="Close dialog">
  <X className="h-5 w-5" />
</Button>

// With Tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm">
        <Settings className="h-5 w-5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Settings</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Decorative Icons
Mark purely decorative icons as aria-hidden:

```tsx
<div className="flex items-center gap-2">
  <Star className="h-4 w-4 text-yellow-500" aria-hidden="true" />
  <span>Featured</span>
</div>
```

---

## Quick Reference Cheatsheet

### Most Common Icons

```tsx
// Import all common icons at once
import {
  // Navigation
  Home, Menu, X, ArrowLeft, ArrowRight, Search, Filter,
  
  // Users & Roles
  User, Users, GraduationCap, Briefcase, Shield, BookOpen,
  
  // Actions
  Plus, Edit, Save, Trash2, Upload, Download,
  
  // Status
  CheckCircle, XCircle, AlertTriangle, Info, Clock,
  
  // Documents
  FileText, Folder, Paperclip,
  
  // Communication
  Bell, MessageSquare, Mail,
  
  // UI
  Settings, MoreVertical, Eye, EyeOff,
} from 'lucide-react'
```

---

## Implementation Checklist

### For Each New Feature
- [ ] Choose icons from standardized map
- [ ] Use consistent size for context (buttons: h-4, nav: h-5, etc.)
- [ ] Apply semantic colors (green=success, red=error, etc.)
- [ ] Add aria-label for icon-only buttons
- [ ] Mark decorative icons as aria-hidden
- [ ] Consider hover/active states
- [ ] Test with screen reader

### Code Review Checklist
- [ ] Icons imported from `lucide-react` (not custom SVGs)
- [ ] Size classes follow standards (h-3 to h-16)
- [ ] Colors follow semantic conventions
- [ ] Accessibility labels present where needed
- [ ] No inline SVG code (use icon components)

---

## Common Patterns Library

### Button with Icon
```tsx
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>
```

### Card Header Icon
```tsx
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
  <Briefcase className="h-6 w-6 text-primary" />
</div>
```

### Status Badge
```tsx
<Badge variant="outline" className="bg-green-50">
  <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
  Verified
</Badge>
```

### Navigation Item
```tsx
<div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent">
  <LayoutDashboard className="h-5 w-5" />
  <span>Dashboard</span>
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-16">
  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
    <FileText className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-xl font-semibold mb-2">No Documents</h3>
  <p className="text-muted-foreground mb-6">Get started by creating your first document</p>
  <Button>
    <Plus className="h-4 w-4 mr-2" />
    Create Document
  </Button>
</div>
```

---

**Status**: ✅ Complete
**Icon Library**: lucide-react
**Total Standardized Icons**: 100+
**Last Updated**: 2026-01-16
**Next Review**: When adding new features requiring new icon categories
