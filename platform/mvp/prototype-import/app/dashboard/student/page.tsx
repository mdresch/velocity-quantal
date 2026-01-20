"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { PilotCard } from "@/components/pilot-card"
import { PageAnnotation, FitBadge } from "@/components/ui-components"
import { JourneyProgress } from "@/components/journey-progress"
import { getPilots, getOpportunities, matchAllOpportunities } from "@/lib/mock-api"
import { useApp } from "@/lib/context"
import type { Pilot, Opportunity, OpportunityMatch } from "@/lib/types"
import { Plus, MessageSquare, TrendingUp, FileText, Upload, Eye, Clock, CheckCircle2, Briefcase } from "lucide-react"

export default function StudentDashboard() {
  const router = useRouter()
  const { currentRole, currentUser } = useApp()
  const [pilots, setPilots] = useState<Pilot[]>([])
  const [matchedOpportunities, setMatchedOpportunities] = useState<Opportunity[]>([])
  const [recentActivity, setRecentActivity] = useState<Array<{id: string, type: string, description: string, timestamp: string}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentRole !== "student") {
      router.push("/")
      return
    }
    loadDashboardData()
  }, [currentRole, router])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load pilots
      const pilotsResponse = await getPilots()
      const studentPilots = pilotsResponse.data.filter((p) => p.ownerId === currentUser?.id)
      setPilots(studentPilots)

      // Load matched opportunities
      if (currentUser?.id) {
        const opportunitiesResponse = await getOpportunities()
        
        // Get matches using matchAllOpportunities
        const matchesResponse = await matchAllOpportunities(currentUser)
        
        // Get top 3 matches
        const topMatches = matchesResponse.data.slice(0, 3)
        const matchedOpps = topMatches
          .map((match: OpportunityMatch) => {
            const opp = opportunitiesResponse.data.find(o => o.id === match.opportunityId)
            return opp ? { ...opp, fitScore: match.score, fitLevel: match.fitLevel } : null
          })
          .filter(Boolean) as Opportunity[]
        
        setMatchedOpportunities(matchedOpps)
      }

      // Mock recent activity
      setRecentActivity([
        { id: '1', type: 'evidence', description: 'Evidence uploaded', timestamp: '2 days ago' },
        { id: '2', type: 'profile', description: 'Profile updated', timestamp: '3 days ago' },
        { id: '3', type: 'match', description: 'New opportunity match', timestamp: '5 days ago' },
      ])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewEvidence = (pilotId: string) => {
    router.push(`/evidence/${pilotId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <PageAnnotation
          title="Student Dashboard — Enhanced"
          criteria={[
            "Journey progress tracker with milestones",
            "Top 3 matched opportunities with fit scores",
            "Recent activity timeline",
            "Quick action buttons for next steps",
            "My pilots overview with stats",
          ]}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name || "Student"}!</h1>
            <p className="text-muted-foreground">Track your learning journey and grow your portfolio</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/opportunities")}>
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Opportunities
            </Button>
            <Button onClick={() => router.push("/pilots/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Submit Pilot
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Journey Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Journey Progress Card */}
            <JourneyProgress
              role="student"
              currentPhase="onboarding"
              completedPhases={[]}
              completionPercentage={60}
              onStartPhase={() => router.push("/profile/student/new")}
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>My Pilots</span>
                  </div>
                  <span className="font-semibold">{pilots.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>Matched Opportunities</span>
                  </div>
                  <span className="font-semibold">{matchedOpportunities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Completed</span>
                  </div>
                  <span className="font-semibold">{pilots.filter(p => p.status === "approved").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>In Progress</span>
                  </div>
                  <span className="font-semibold">{pilots.filter(p => p.status === "under_review").length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {activity.type === 'evidence' && <Upload className="h-4 w-4 text-blue-500" />}
                          {activity.type === 'profile' && <FileText className="h-4 w-4 text-green-500" />}
                          {activity.type === 'match' && <TrendingUp className="h-4 w-4 text-purple-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Profile Card */}
            {currentUser?.matchResult && (
              <Card className="bg-gradient-to-r from-blue-50 to-background border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Your Match Profile
                  </CardTitle>
                  <CardDescription>Based on your skills, experience, and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-3">
                    <FitBadge level={currentUser.matchResult.fitLevel} showScore score={currentUser.matchResult.score} />
                    <Button variant="outline" size="sm" onClick={() => router.push("/opportunities")}>
                      View All Matches
                    </Button>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {currentUser.matchResult.rationale.slice(0, 3).map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Matched Opportunities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Top Matched Opportunities</h2>
                <Button variant="ghost" size="sm" onClick={() => router.push("/opportunities")}>
                  View All
                </Button>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-20 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : matchedOpportunities.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No matched opportunities yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Complete your profile to get personalized matches</p>
                    <Button variant="outline" onClick={() => router.push("/profile/student/new")}>
                      Complete Profile
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedOpportunities.map((opportunity: any) => (
                    <Card key={opportunity.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/opportunities")}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{opportunity.title}</CardTitle>
                          <FitBadge level={opportunity.fitLevel} showScore score={opportunity.fitScore} />
                        </div>
                        <CardDescription className="line-clamp-2">{opportunity.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.protectedActivity && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                              ⚠️ Protected
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted">
                            {opportunity.jurisdiction}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3" onClick={(e) => {
                          e.stopPropagation()
                          router.push("/opportunities")
                        }}>
                          <Eye className="h-3 w-3 mr-2" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* My Pilots */}
            <div>
              <h2 className="text-lg font-semibold mb-4">My Pilots</h2>
              {pilots.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't submitted any pilots yet</p>
                    <Button onClick={() => router.push("/pilots/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Pilot
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pilots.slice(0, 3).map((pilot) => (
                    <PilotCard key={pilot.id} pilot={pilot} role="student" onViewEvidence={handleViewEvidence} />
                  ))}
                  {pilots.length > 3 && (
                    <Button variant="outline" onClick={() => router.push("/pilots")}>
                      View All Pilots ({pilots.length})
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
