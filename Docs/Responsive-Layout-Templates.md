---
title: "Responsive Layout Templates — Velocity Quantal"
owner: "@mdresch"
authors: ["Menno Drescher"]
version: "1.0.0"
date: "2026-01-16"
status: "complete"
---

## Overview

This document defines reusable responsive layout templates for the Velocity Quantal platform. Each template is designed mobile-first with clear breakpoint behaviors and can be implemented using Tailwind CSS classes.

## Layout Categories

### 1. Dashboard Layout
**Use Cases**: Student Dashboard, Mentor Dashboard, Entrepreneur Dashboard, Admin Dashboard

**Structure**:
```
┌─────────────────────────────────────┐
│ Header (fixed)                      │
├─────────┬───────────────────────────┤
│ Sidebar │ Main Content              │
│ (fixed) │ (scrollable)              │
│         │                           │
│         │                           │
└─────────┴───────────────────────────┘
```

**Responsive Behavior**:
- **Mobile (< 768px)**: Sidebar hidden, toggle button in header, full-width main content
- **Tablet (768px - 1024px)**: Collapsible sidebar (icons only), main content adjusts
- **Desktop (> 1024px)**: Full sidebar with labels, optimal content width

**Implementation**:
```tsx
<div className="min-h-screen bg-background">
  {/* Header */}
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
    <div className="container flex h-16 items-center px-4">
      {/* Mobile menu toggle */}
      <Button variant="ghost" size="sm" className="md:hidden mr-2">
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">VQ</span>
        </div>
        <span className="hidden sm:inline font-semibold">Velocity Quantal</span>
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* User menu */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  </header>
  
  <div className="flex">
    {/* Sidebar */}
    <aside className="hidden md:flex w-64 lg:w-72 border-r bg-card h-[calc(100vh-4rem)] sticky top-16 flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {/* Navigation items */}
      </nav>
    </aside>
    
    {/* Main Content */}
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="container max-w-7xl mx-auto">
        {/* Dashboard content */}
      </div>
    </main>
  </div>
</div>
```

---

### 2. Form Layout (Progressive)
**Use Cases**: Profile Creation, Pilot Submission, Document Creation

**Structure**:
```
┌─────────────────────────────────────┐
│ Progress Bar                        │
├─────────────────────────────────────┤
│                                     │
│         Form Content                │
│         (centered)                  │
│                                     │
├─────────────────────────────────────┤
│ Actions (Save Draft / Next)         │
└─────────────────────────────────────┘
```

**Responsive Behavior**:
- **Mobile (< 640px)**: Full-width fields, stacked labels
- **Tablet (640px - 1024px)**: Centered form with max-width
- **Desktop (> 1024px)**: Two-column layout for related fields

**Implementation**:
```tsx
<div className="min-h-screen bg-background">
  {/* Header with back button */}
  <header className="border-b bg-card">
    <div className="container mx-auto px-4 py-4 flex items-center gap-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <h1 className="text-lg font-semibold">Create Profile</h1>
      <div className="flex-1" />
      <Button variant="outline" size="sm">
        Save Draft
      </Button>
    </div>
  </header>
  
  {/* Progress Indicator */}
  <div className="border-b bg-muted/30">
    <div className="container mx-auto px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Step 1 of 3</span>
          <span className="text-muted-foreground">Basic Info</span>
        </div>
        <Progress value={33} />
      </div>
    </div>
  </div>
  
  {/* Form Content */}
  <main className="container mx-auto px-4 py-8">
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Tell us about yourself to get matched with opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Single column on mobile, two columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" required />
            </div>
          </div>
          
          {/* Full width fields */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled>Previous</Button>
          <Button>Next</Button>
        </CardFooter>
      </Card>
    </div>
  </main>
</div>
```

---

### 3. Browse/List Layout
**Use Cases**: Opportunities Browse, Evidence List, Pilot List

**Structure**:
```
┌─────────────────────────────────────┐
│ Header + Search                     │
├─────────┬───────────────────────────┤
│ Filters │ Grid/List Results         │
│ (side)  │ (scrollable)              │
│         │                           │
└─────────┴───────────────────────────┘
```

**Responsive Behavior**:
- **Mobile (< 768px)**: Filters in bottom sheet/drawer, 1-column grid
- **Tablet (768px - 1024px)**: Filters in sidebar, 2-column grid
- **Desktop (> 1024px)**: Filters in sidebar, 3-column grid

**Implementation**:
```tsx
<div className="min-h-screen bg-background">
  {/* Header */}
  <header className="border-b bg-card sticky top-0 z-40">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Browse Opportunities</h1>
        <div className="flex-1" />
        
        {/* Search */}
        <div className="hidden md:block w-64">
          <Input placeholder="Search..." className="w-full" />
        </div>
        
        {/* Mobile filter toggle */}
        <Button variant="outline" size="sm" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden mt-3">
        <Input placeholder="Search..." className="w-full" />
      </div>
    </div>
  </header>
  
  <div className="container mx-auto px-4 py-6 flex gap-6">
    {/* Filters Sidebar (desktop) */}
    <aside className="hidden md:block w-64 lg:w-72">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter controls */}
          <div className="space-y-2">
            <Label>Jurisdiction</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center">
              <Checkbox className="mr-2" />
              Protected Activities Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </aside>
    
    {/* Results Grid */}
    <main className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 24 opportunities
        </p>
        <Select defaultValue="relevance">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most Relevant</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Opportunity cards */}
      </div>
    </main>
  </div>
</div>
```

---

### 4. Detail View Layout
**Use Cases**: Opportunity Detail, Pilot Detail, Evidence Detail

**Structure**:
```
┌─────────────────────────────────────┐
│ Breadcrumb Navigation               │
├─────────────────────────────────────┤
│ Title + Actions                     │
├────────────────────┬────────────────┤
│ Main Content       │ Sidebar        │
│ (2/3 width)        │ (1/3 width)    │
│                    │                │
└────────────────────┴────────────────┘
```

**Responsive Behavior**:
- **Mobile (< 768px)**: Stacked layout, sidebar below content
- **Tablet (768px - 1024px)**: Side-by-side with adjusted proportions
- **Desktop (> 1024px)**: Optimal 2/3 + 1/3 split

**Implementation**:
```tsx
<div className="min-h-screen bg-background">
  {/* Breadcrumb */}
  <div className="border-b bg-card">
    <div className="container mx-auto px-4 py-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/opportunities">Opportunities</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Opportunity #123</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </div>
  
  {/* Title + Actions */}
  <div className="border-b bg-muted/30">
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Surface Reseller Alliance</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">High Fit</Badge>
            <Badge variant="destructive">⚠️ Protected</Badge>
            <Badge>Active</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button>
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  </div>
  
  {/* Content Grid */}
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Detailed description content...
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Requirement 1</li>
              <li>Requirement 2</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Sidebar (1/3) */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Opportunity Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Owner</p>
              <p className="font-medium">John Entrepreneur</p>
            </div>
            <div>
              <p className="text-muted-foreground">Jurisdiction</p>
              <p className="font-medium">Netherlands</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">Jan 10, 2026</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Match Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Skills Match</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</div>
```

---

### 5. Modal/Dialog Layout
**Use Cases**: Document Viewer, Evidence Upload, Risk Escalation

**Size Guidelines**:
- **Small**: `max-w-md` (448px) - Confirmations, simple forms
- **Medium**: `max-w-2xl` (672px) - Standard forms
- **Large**: `max-w-4xl` (896px) - Content-heavy dialogs
- **Extra Large**: `max-w-[90vw]` - Document viewer, full-screen experiences

**Responsive Behavior**:
- **Mobile (< 640px)**: Full-screen drawer from bottom
- **Tablet/Desktop (> 640px)**: Centered modal with max-width

**Implementation**:
```tsx
{/* Small Confirmation Dialog */}
<Dialog>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to proceed?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* Large Document Viewer */}
<Dialog>
  <DialogContent className="max-w-[90vw] w-full max-h-[85vh]">
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        <span>Document Title</span>
        <div className="flex gap-2">
          <Badge>v3</Badge>
          <Button size="sm" variant="outline">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </DialogTitle>
      <DialogDescription>
        Last updated Jan 16, 2026 by John Doe
      </DialogDescription>
    </DialogHeader>
    
    <ScrollArea className="h-[calc(85vh-180px)]">
      <div className="prose prose-sm max-w-none pr-4">
        {/* Document content */}
      </div>
    </ScrollArea>
    
    <DialogFooter>
      <Button variant="outline">Close</Button>
      <Button>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 6. Empty State Layout
**Use Cases**: No Results, New User, Awaiting Data

**Implementation**:
```tsx
<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
    <FileText className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-xl font-semibold mb-2">No Opportunities Yet</h3>
  <p className="text-muted-foreground max-w-md mb-6">
    You haven't created any opportunities. Get started by creating your first pilot.
  </p>
  <Button>
    <Plus className="h-4 w-4 mr-2" />
    Create Opportunity
  </Button>
</div>
```

---

### 7. Error/Loading State Patterns

**Loading Skeleton**:
```tsx
<div className="space-y-4">
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </CardContent>
  </Card>
</div>
```

**Error State**:
```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error Loading Data</AlertTitle>
  <AlertDescription>
    We couldn't load the opportunities. Please try again.
    <Button variant="outline" size="sm" className="mt-2">
      Retry
    </Button>
  </AlertDescription>
</Alert>
```

---

## Responsive Grid System

### Breakpoint Reference
```tsx
// Tailwind breakpoints
sm: '640px'   // Small tablets
md: '768px'   // Tablets  
lg: '1024px'  // Small laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Large screens
```

### Common Grid Patterns

**Auto-fit Cards**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Cards automatically flow and wrap */}
</div>
```

**Dashboard Metrics**:
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* 2 columns on mobile, 4 on desktop */}
</div>
```

**Form Two-Column**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Stacked on mobile, side-by-side on desktop */}
</div>
```

---

## Container Sizing Strategy

### Page Containers
```tsx
{/* Full width background */}
<div className="min-h-screen bg-background">
  {/* Constrained content */}
  <div className="container mx-auto px-4">
    {/* Content */}
  </div>
</div>
```

### Content Width Limits
- **Dashboard**: `max-w-7xl` (1280px)
- **Forms**: `max-w-2xl` (672px)
- **Articles/Docs**: `max-w-4xl` (896px)
- **Tables**: `max-w-full` (use full container)

---

## Touch Target Sizing

### Mobile-Friendly Sizes
- **Minimum touch target**: 44x44px (iOS guideline)
- **Button height**: `h-10` (40px) default, `h-12` (48px) for primary CTAs
- **Input height**: `h-10` (40px) minimum
- **Icon buttons**: `h-10 w-10` or larger

```tsx
{/* Mobile-optimized button */}
<Button className="h-12 w-full sm:w-auto">
  Large CTA
</Button>
```

---

## Spacing Scale Reference

```tsx
// Tailwind spacing scale (commonly used)
gap-1   // 0.25rem (4px)
gap-2   // 0.5rem (8px)
gap-3   // 0.75rem (12px)
gap-4   // 1rem (16px)
gap-6   // 1.5rem (24px)
gap-8   // 2rem (32px)
gap-12  // 3rem (48px)

// Page-level spacing
py-4    // Mobile vertical padding
py-8    // Desktop vertical padding
px-4    // Horizontal padding (all screens)
```

---

## Implementation Checklist

### For Each New Screen
- [ ] Choose appropriate layout template
- [ ] Apply responsive grid/flex patterns
- [ ] Ensure mobile menu/navigation works
- [ ] Test at all breakpoints (sm, md, lg, xl)
- [ ] Verify touch targets (min 44x44px)
- [ ] Add loading and error states
- [ ] Include empty state if applicable
- [ ] Check container max-widths
- [ ] Validate keyboard navigation flow
- [ ] Test with reduced motion preference

---

**Status**: ✅ Complete
**Last Updated**: 2026-01-16
**Next Review**: Phase 3 (Advanced Features)
