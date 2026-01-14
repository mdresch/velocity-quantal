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
import { Plus, MessageSquare, TrendingUp, FileText } from "lucide-react"

export default function StudentDashboard() {
  const router = useRouter()
  const { currentRole, currentUser } = useApp()
  const [pilots, setPilots] = useState<Pilot[]>([])

  useEffect(() => {
    if (currentRole !== "student") {
      router.push("/")
      return
    }
    loadPilots()
  }, [currentRole, router])

  const loadPilots = async () => {
    const response = await getPilots()
    // Filter to show only student's pilots (using Carol's sample data)
    const studentPilots = response.data.filter((p) => p.ownerId === currentUser?.id)
    setPilots(studentPilots)
  }

  const handleViewEvidence = (pilotId: string) => {
    router.push(`/evidence/${pilotId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <PageAnnotation
          title="Student Dashboard"
          criteria={[
            "Show My pilots list with Submit new pilot button",
            "Display messages section",
            "Card view with status, Fit badge, jurisdiction",
            "Quick actions: Preview evidence, Download bundle",
          ]}
        />

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {currentUser?.name || "Student"}</h1>
            <p className="text-muted-foreground">Track your pilots and build your portfolio</p>
          </div>
          <Button onClick={() => router.push("/pilots/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Submit New Pilot
          </Button>
        </div>

        {/* Match Result Card */}
        {currentUser?.matchResult && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-background border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
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
                    <span className="text-blue-400">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Pilots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{pilots.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">2</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{pilots.filter((p) => p.status === "approved").length}</span>
            </CardContent>
          </Card>
        </div>

        {/* My Pilots */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pilots.map((pilot) => (
              <PilotCard key={pilot.id} pilot={pilot} role="student" onViewEvidence={handleViewEvidence} />
            ))}
          </div>
        )}

        {/* Messages Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Review Committee</p>
              <p className="text-sm text-muted-foreground">
                Your profile has been matched to 3 potential pilot opportunities. Complete your certification to unlock
                more.
              </p>
              <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">System</p>
              <p className="text-sm text-muted-foreground">
                Welcome to Velocity Quantal! Start by completing your profile to get matched to pilots.
              </p>
              <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
