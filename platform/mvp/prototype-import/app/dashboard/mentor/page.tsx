"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { PilotCard } from "@/components/pilot-card"
import { PageAnnotation } from "@/components/ui-components"
import { getPilots, getOpportunities, updateOpportunity, deleteOpportunity } from "@/lib/mock-api"
import { useApp } from "@/lib/context"
import type { Pilot, Opportunity } from "@/lib/types"
import {
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Plus,
  Briefcase,
  Edit,
  Trash2,
  Eye,
  Send,
  MoreHorizontal,
  Users,
  Award,
  Clock,
  FileText,
  ShieldCheck,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MentorDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentRole, currentUser } = useApp()
  const [pilots, setPilots] = useState<Pilot[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "verifications")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentRole !== "mentor") {
      router.push("/")
      return
    }
    loadDashboardData()
  }, [currentRole, router])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadPilots(), loadOpportunities()])
    } finally {
      setLoading(false)
    }
  }

  const loadPilots = async () => {
    const response = await getPilots()
    setPilots(response.data)
  }

  const loadOpportunities = async () => {
    if (!currentUser) return
    const response = await getOpportunities({ mentorId: currentUser.id })
    setOpportunities(response.data)
  }

  // Verification queue - pilots with pending evidence
  const pendingVerification = pilots.filter(
    (p) => p.protectedActivityFlags.length > 0 && p.evidence.some((e) => e.verified === "pending"),
  )

  const underReview = pilots.filter((p) => p.status === "under_review")
  const approved = pilots.filter((p) => p.status === "approved")
  const myOpportunities = opportunities.filter((o) => o.mentorId === currentUser?.id)
  const activeOpportunities = myOpportunities.filter((o) => o.status === "published")

  // Mentorship stats
  const studentsmentored = new Set(pilots.map(p => p.ownerId)).size
  const verificationsThisMonth = pilots.filter(p => 
    p.evidence.some(e => {
      const verifiedDate = new Date(e.uploadedAt)
      const now = new Date()
      return e.verified === "verified" && 
        verifiedDate.getMonth() === now.getMonth() &&
        verifiedDate.getFullYear() === now.getFullYear()
    })
  ).length

  const handleViewEvidence = (pilotId: string) => {
    router.push(`/evidence/${pilotId}`)
  }

  const handleVerify = (pilotId: string) => {
    router.push(`/verify/${pilotId}`)
  }

  const handlePublishOpportunity = async (oppId: string) => {
    await updateOpportunity(oppId, { status: "published" })
    loadOpportunities()
  }

  const handleCloseOpportunity = async (oppId: string) => {
    await updateOpportunity(oppId, { status: "closed" })
    loadOpportunities()
  }

  const handleDeleteOpportunity = async (oppId: string) => {
    await deleteOpportunity(oppId)
    loadOpportunities()
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <PageAnnotation
          title="Mentor Dashboard — Enhanced"
          criteria={[
            "Verification queue with pending evidence reviews",
            "Active pilots owned by mentor",
            "Mentorship statistics (students, verifications)",
            "Quick actions for verify/approve/reject",
            "Opportunities management section",
          ]}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {currentUser?.name || "Mentor"}!</h1>
            <p className="text-muted-foreground">Guide students and verify protected activities</p>
          </div>
          <Button onClick={() => router.push("/opportunities/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Opportunity
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mentorship Stats */}
            <Card className="bg-gradient-to-br from-green-50 to-background border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Mentorship Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>Students Mentored</span>
                  </div>
                  <span className="text-2xl font-bold text-green-700">{studentsmentored}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Verifications (This Month)</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">{verificationsThisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    <span>Active Opportunities</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-700">{activeOpportunities.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Review Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span>Pending Verifications</span>
                  </div>
                  <Badge variant="destructive" className="bg-amber-100 text-amber-800">
                    {pendingVerification.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Under Review</span>
                  </div>
                  <span className="font-semibold">{underReview.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Approved</span>
                  </div>
                  <span className="font-semibold">{approved.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Verifications */}
            {pendingVerification.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      Pending Verifications ({pendingVerification.length})
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("verifications")}>
                      View All
                    </Button>
                  </div>
                  <CardDescription>Students waiting for license/certification verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingVerification.slice(0, 3).map((pilot) => (
                      <Card key={pilot.id} className="bg-background">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <p className="font-medium truncate">{pilot.title}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Student: {pilot.ownerId} • {pilot.evidence.filter(e => e.verified === "pending").length} pending evidence
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button size="sm" variant="outline" onClick={() => handleViewEvidence(pilot.id)}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" onClick={() => handleVerify(pilot.id)}>
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Verify
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Pilots */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Active Pilots</h2>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="verifications">Verifications</TabsTrigger>
                  <TabsTrigger value="review">Under Review</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                </TabsList>

                <TabsContent value="verifications" className="mt-0">
                  {pendingVerification.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                        <p className="text-muted-foreground">All caught up! No pending verifications</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {pendingVerification.map((pilot) => (
                        <PilotCard key={pilot.id} pilot={pilot} role="mentor" onViewEvidence={handleViewEvidence} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="review" className="mt-0">
                  {underReview.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No pilots under review</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {underReview.map((pilot) => (
                        <PilotCard key={pilot.id} pilot={pilot} role="mentor" onViewEvidence={handleViewEvidence} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="approved" className="mt-0">
                  {approved.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No approved pilots yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {approved.slice(0, 5).map((pilot) => (
                        <PilotCard key={pilot.id} pilot={pilot} role="mentor" onViewEvidence={handleViewEvidence} />
                      ))}
                      {approved.length > 5 && (
                        <Button variant="outline" onClick={() => router.push("/pilots")}>
                          View All Approved Pilots ({approved.length})
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* My Opportunities */}
            {myOpportunities.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">My Opportunities</h2>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/opportunities")}>
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myOpportunities.slice(0, 4).map((opp) => (
                    <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{opp.title}</CardTitle>
                          <Badge variant={opp.status === "published" ? "default" : "secondary"}>
                            {opp.status}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{opp.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {opp.currentParticipants}/{opp.maxParticipants} participants
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => router.push("/opportunities")}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
