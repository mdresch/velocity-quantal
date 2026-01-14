"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { PilotCard } from "@/components/pilot-card"
import { PageAnnotation } from "@/components/ui-components"
import { getPilots } from "@/lib/mock-api"
import { useApp } from "@/lib/context"
import type { Pilot } from "@/lib/types"
import { ClipboardCheck, AlertCircle, CheckCircle2 } from "lucide-react"

export default function MentorDashboard() {
  const router = useRouter()
  const { currentRole, currentUser } = useApp()
  const [pilots, setPilots] = useState<Pilot[]>([])

  useEffect(() => {
    if (currentRole !== "mentor") {
      router.push("/")
      return
    }
    loadPilots()
  }, [currentRole, router])

  const loadPilots = async () => {
    const response = await getPilots()
    setPilots(response.data)
  }

  const pendingVerification = pilots.filter(
    (p) => p.protectedActivityFlags.length > 0 && p.evidence.some((e) => e.verified === "pending"),
  )

  const underReview = pilots.filter((p) => p.status === "under_review")
  const approved = pilots.filter((p) => p.status === "approved")

  const handleViewEvidence = (pilotId: string) => {
    router.push(`/evidence/${pilotId}`)
  }

  const handleVerify = (pilotId: string) => {
    router.push(`/verify/${pilotId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <PageAnnotation
          title="Mentor Dashboard"
          criteria={[
            "Show list of pilots in card view with status, protected-activity flag, Fit badge, jurisdiction",
            "Pending verifications section with review actions",
            "Actions: Open → Evidence viewer, Verify → License panel, Request clarification",
            "Card quick actions: Preview evidence, Download bundle",
          ]}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome, {currentUser?.name || "Mentor"}</h1>
          <p className="text-muted-foreground">Review pilots, verify licenses, and provide guidance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold">{pendingVerification.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{underReview.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{approved.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pilots Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Verification ({pendingVerification.length})</TabsTrigger>
            <TabsTrigger value="review">Under Review ({underReview.length})</TabsTrigger>
            <TabsTrigger value="all">All Pilots ({pilots.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingVerification.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pilots pending verification
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingVerification.map((pilot) => (
                  <PilotCard
                    key={pilot.id}
                    pilot={pilot}
                    role="mentor"
                    onViewEvidence={handleViewEvidence}
                    onVerify={handleVerify}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            {underReview.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">No pilots under review</CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {underReview.map((pilot) => (
                  <PilotCard
                    key={pilot.id}
                    pilot={pilot}
                    role="mentor"
                    onViewEvidence={handleViewEvidence}
                    onVerify={handleVerify}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pilots.map((pilot) => (
                <PilotCard
                  key={pilot.id}
                  pilot={pilot}
                  role="mentor"
                  onViewEvidence={handleViewEvidence}
                  onVerify={handleVerify}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Review Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Review Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline">Request Clarification</Button>
            <Button variant="outline">Bulk Approve Non-Protected</Button>
            <Button variant="outline">Export Review Summary</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
