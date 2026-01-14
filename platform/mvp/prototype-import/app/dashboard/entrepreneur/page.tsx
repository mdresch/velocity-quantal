"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { PilotCard } from "@/components/pilot-card"
import { PageAnnotation, FitBadge } from "@/components/ui-components"
import { getPilots } from "@/lib/mock-api"
import { useApp } from "@/lib/context"
import type { Pilot } from "@/lib/types"
import { Plus, UserPlus, BarChart3, Folder, TrendingUp } from "lucide-react"

export default function EntrepreneurDashboard() {
  const router = useRouter()
  const { currentRole, currentUser } = useApp()
  const [pilots, setPilots] = useState<Pilot[]>([])

  useEffect(() => {
    if (currentRole !== "entrepreneur") {
      router.push("/")
      return
    }
    loadPilots()
  }, [currentRole, router])

  const loadPilots = async () => {
    const response = await getPilots()
    // Filter to entrepreneur's pilots (Alice)
    const myPilots = response.data.filter((p) => p.ownerId === currentUser?.id)
    setPilots(myPilots)
  }

  const handleViewEvidence = (pilotId: string) => {
    router.push(`/evidence/${pilotId}`)
  }

  // Mock KPIs
  const kpiData = {
    totalPilots: pilots.length,
    activePilots: pilots.filter((p) => p.status !== "draft" && p.status !== "rejected").length,
    completionRate: "85%",
    avgScore: currentUser?.matchResult?.score || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <PageAnnotation
          title="Entrepreneur Dashboard"
          criteria={[
            "Show Projects list with KPI summary",
            "Actions: Invite mentor, Submit pilot",
            "Card view with status, Fit badge, protected-activity flag, jurisdiction",
            "Quick actions: Preview evidence, Download bundle",
          ]}
        />

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {currentUser?.name || "Entrepreneur"}</h1>
            <p className="text-muted-foreground">Manage projects and track pilot performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Mentor
            </Button>
            <Button onClick={() => router.push("/pilots/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Submit Pilot
            </Button>
          </div>
        </div>

        {/* Match Result Card */}
        {currentUser?.matchResult && (
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-background border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Your Fit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-3">
                <FitBadge level={currentUser.matchResult.fitLevel} showScore score={currentUser.matchResult.score} />
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {currentUser.matchResult.rationale.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{kpiData.totalPilots}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Pilots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{kpiData.activePilots}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{kpiData.completionRate}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{kpiData.avgScore}%</span>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <h2 className="text-lg font-semibold mb-4">My Projects</h2>
        {pilots.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No projects yet. Start by submitting a pilot.</p>
              <Button onClick={() => router.push("/pilots/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Pilot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pilots.map((pilot) => (
              <PilotCard key={pilot.id} pilot={pilot} role="entrepreneur" onViewEvidence={handleViewEvidence} />
            ))}
          </div>
        )}

        {/* Mentor Invitations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Mentor Network</CardTitle>
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
                <p className="text-sm text-muted-foreground">Medical Device Specialist • Verified License</p>
              </div>
              <Button size="sm" variant="outline">
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
