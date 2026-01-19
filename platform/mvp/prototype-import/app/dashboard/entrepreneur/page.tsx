"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { PilotCard } from "@/components/pilot-card"
import { PageAnnotation, FitBadge } from "@/components/ui-components"
import { getPilots, getOpportunities } from "@/lib/mock-api"
import { useApp } from "@/lib/context"
import type { Pilot, Opportunity } from "@/lib/types"
import { Plus, UserPlus, BarChart3, Folder, TrendingUp, Briefcase, Users, DollarSign, Target, Clock, AlertCircle } from "lucide-react"

export default function EntrepreneurDashboard() {
  const router = useRouter()
  const { currentRole, currentUser } = useApp()
  const [pilots, setPilots] = useState<Pilot[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentRole !== "entrepreneur") {
      router.push("/")
      return
    }
    loadDashboardData()
  }, [currentRole, router])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [pilotsResponse, opportunitiesResponse] = await Promise.all([
        getPilots(),
        getOpportunities()
      ])
      
      // Filter to entrepreneur's data (Alice)
      const myPilots = pilotsResponse.data.filter((p) => p.ownerId === currentUser?.id)
      const myOpportunities = opportunitiesResponse.data.filter(
        (o) => o.createdBy === currentUser?.id || o.createdBy === "alice"
      )
      
      setPilots(myPilots)
      setOpportunities(myOpportunities)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewEvidence = (pilotId: string) => {
    router.push(`/evidence/${pilotId}`)
  }

  // Calculate KPIs
  const activePilots = pilots.filter((p) => p.status !== "draft" && p.status !== "rejected").length
  const activeOpportunities = opportunities.filter((o) => o.status === "active").length
  const totalApplications = opportunities.reduce((sum, opp) => {
    // Mock: estimate applications based on opportunity status
    return sum + (opp.status === "active" ? 3 : opp.status === "draft" ? 0 : 5)
  }, 0)
  
  // Mock revenue and ROI calculations
  const totalRevenue = activePilots * 500 // $500 per active pilot
  const roi = activePilots > 0 ? 45 : 0 // 45% ROI when pilots are active

  // Recent applications (mock data based on opportunities)
  const recentApplications = opportunities
    .filter((o) => o.status === "active")
    .slice(0, 3)
    .map((opp, idx) => ({
      id: `app-${idx}`,
      applicantName: idx === 0 ? "John S." : idx === 1 ? "Mary K." : "David L.",
      opportunityTitle: opp.title,
      fitLevel: idx === 0 ? "high" : idx === 1 ? "medium" : "low",
      timeAgo: idx === 0 ? "2h ago" : idx === 1 ? "5h ago" : "1d ago",
    }))

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <PageAnnotation
          title="Entrepreneur Dashboard - Phase 2 Enhanced"
          criteria={[
            "3-column responsive layout (sidebar + main content)",
            "KPI Overview: Active Pilots, Applications, Revenue, ROI with trend indicators",
            "My Opportunities section with applicant counts and status",
            "Recent Applications list with fit scores and timestamps",
            "Quick actions: Create Opportunity, Browse Opportunities, Invite Mentor",
            "Empty states for opportunities and applications",
          ]}
        />

        {/* Header with Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {currentUser?.name || "Entrepreneur"}</h1>
            <p className="text-muted-foreground">Manage opportunities, track KPIs, and review applications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/opportunities")}>
              <Briefcase className="h-4 w-4 mr-2" />
              Browse
            </Button>
            <Button onClick={() => router.push("/opportunities/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Opportunity
            </Button>
          </div>
        </div>

        {/* 3-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - KPI Overview */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* KPI Overview */}
            <Card className="bg-gradient-to-br from-blue-50 to-background border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  KPI Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Pilots</p>
                    <p className="text-2xl font-bold">{activePilots}</p>
                  </div>
                  <Folder className="h-8 w-8 text-blue-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Applications</p>
                    <p className="text-2xl font-bold">{totalApplications}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(1)}K</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold">{roi}%</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentApplications.length === 0 ? (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-sm text-primary">
                            {app.applicantName.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{app.applicantName}</p>
                            <FitBadge level={app.fitLevel as "high" | "medium" | "low"} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{app.opportunityTitle}</p>
                          <p className="text-xs text-muted-foreground mt-1">{app.timeAgo}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT - Opportunities and Pilots */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* My Opportunities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  My Opportunities
                </h2>
                <Button variant="outline" size="sm" onClick={() => router.push("/opportunities")}>
                  View All
                </Button>
              </div>
              
              {opportunities.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No opportunities yet. Create your first opportunity to start attracting applicants.
                    </p>
                    <Button onClick={() => router.push("/opportunities/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Opportunity
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {opportunities.map((opp) => {
                    // Mock applicant count
                    const applicantCount = opp.status === "active" ? 5 : opp.status === "draft" ? 0 : 3
                    
                    return (
                      <Card key={opp.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base mb-2">{opp.title}</CardTitle>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant={
                                  opp.status === "active" ? "default" :
                                  opp.status === "draft" ? "secondary" : "outline"
                                }>
                                  {opp.status}
                                </Badge>
                                {opp.requiresProtectedActivity && (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Protected Activity
                                  </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  • {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {opp.description}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => router.push(`/opportunities/${opp.id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => router.push(`/opportunities/${opp.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => router.push(`/opportunities/${opp.id}/applicants`)}
                            >
                              Manage Applications ({applicantCount})
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* My Pilots */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Folder className="h-5 w-5" />
                My Pilots
              </h2>
              
              {pilots.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No pilots yet. Start by submitting a pilot.</p>
                    <Button onClick={() => router.push("/pilots/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Pilot
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pilots.map((pilot) => (
                    <PilotCard 
                      key={pilot.id} 
                      pilot={pilot} 
                      role="entrepreneur" 
                      onViewEvidence={handleViewEvidence} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mentor Network */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Mentor Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Invite mentors to review your pilots and provide guidance on compliance requirements.
                </p>
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">BV</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Bas van der Berg</p>
                    <p className="text-sm text-muted-foreground">Medical Device Specialist - Verified License</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
