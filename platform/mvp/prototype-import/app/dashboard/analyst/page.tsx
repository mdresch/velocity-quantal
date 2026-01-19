"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation } from "@/components/ui-components"
import { getPilots } from "@/lib/mock-api"
import { useApp } from "@/lib/context"
import type { Pilot } from "@/lib/types"
import { 
  Search, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  Flag, 
  Download, 
  Eye,
  Clock,
  FileText,
  TrendingUp
} from "lucide-react"

export default function AnalystDashboard() {
  const router = useRouter()
  const { currentRole, currentUser } = useApp()
  const [pilots, setPilots] = useState<Pilot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentRole !== "analyst") {
      router.push("/")
      return
    }
    loadDashboardData()
  }, [currentRole, router])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const response = await getPilots()
      setPilots(response.data)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate verification queue - pilots with pending evidence
  const verificationQueue = pilots.filter(p => 
    p.evidence.some(e => e.verified === "pending")
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const recentVerifications = pilots
    .filter(p => p.evidence.some(e => e.verified === "verified" || e.verified === "rejected"))
    .slice(0, 5)

  // Compliance findings
  const compliantCount = pilots.filter(p => 
    p.evidence.length > 0 && p.evidence.every(e => e.verified === "verified")
  ).length
  
  const needsReviewCount = pilots.filter(p => 
    p.evidence.some(e => e.verified === "pending")
  ).length
  
  const nonCompliantCount = pilots.filter(p => 
    p.evidence.some(e => e.verified === "rejected")
  ).length

  const handleInspect = (pilotId: string) => {
    router.push(`/evidence/${pilotId}`)
  }

  const handleVerify = (pilotId: string) => {
    router.push(`/verify/${pilotId}`)
  }

  const handleFlag = (pilotId: string) => {
    // Mock flag action
    console.log("Flagging pilot:", pilotId)
  }

  const handleExportAudit = () => {
    // Mock export action
    console.log("Exporting audit package...")
  }

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

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <PageAnnotation
          title="Analyst Dashboard - Phase 2 Enhanced"
          criteria={[
            "Verification queue sorted by submission date (oldest first)",
            "Compliance findings with color-coded status counts",
            "Recent verification activity timeline",
            "Evidence inspection and verification workflow",
            "Export audit package functionality",
          ]}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {currentUser?.name || "Analyst"}!</h1>
            <p className="text-muted-foreground">Review evidence and ensure compliance</p>
          </div>
          <Button onClick={handleExportAudit}>
            <Download className="h-4 w-4 mr-2" />
            Export Audit Package
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Compliance Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Compliance Findings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Compliance Findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Compliant</span>
                  </div>
                  <span className="text-2xl font-bold text-green-700">{compliantCount}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="text-sm font-medium">Needs Review</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-700">{needsReviewCount}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">Non-Compliant</span>
                  </div>
                  <span className="text-2xl font-bold text-red-700">{nonCompliantCount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Verifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recent Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentVerifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent verifications
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentVerifications.map((pilot) => {
                      const verifiedEvidence = pilot.evidence.find(e => e.verified !== "pending")
                      const timeAgo = verifiedEvidence ? new Date(verifiedEvidence.uploadedAt).toLocaleDateString() : "Unknown"
                      
                      return (
                        <div key={pilot.id} className="flex items-start gap-3 text-sm">
                          <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                            verifiedEvidence?.verified === "verified" ? "bg-green-500" : "bg-red-500"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{pilot.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {verifiedEvidence?.verified === "verified" ? "Approved" : "Flagged"} • {timeAgo}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Verification Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification Queue ({verificationQueue.length})
                </h2>
              </div>

              {verificationQueue.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">All caught up! No pending verifications</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {verificationQueue.map((pilot) => {
                    const pendingEvidence = pilot.evidence.filter(e => e.verified === "pending")
                    
                    return (
                      <Card key={pilot.id} className="border-amber-200 bg-amber-50/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-base mb-1">{pilot.title}</CardTitle>
                              <CardDescription className="text-xs">
                                Owner: {pilot.ownerId} • Submitted: {new Date(pilot.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              {pendingEvidence.length} pending
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Evidence Items */}
                          <div className="space-y-2">
                            {pendingEvidence.slice(0, 2).map((evidence, idx) => (
                              <div key={idx} className="p-3 bg-background rounded-lg border">
                                <div className="flex items-start gap-3">
                                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Evidence ID: {evidence.id}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Type: {evidence.type} • Issuer: {evidence.issuer || "N/A"}
                                    </p>
                                    {evidence.registryId && (
                                      <p className="text-xs text-muted-foreground">
                                        Registry ID: {evidence.registryId}
                                      </p>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {evidence.verified}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                            {pendingEvidence.length > 2 && (
                              <p className="text-xs text-muted-foreground text-center">
                                +{pendingEvidence.length - 2} more evidence items
                              </p>
                            )}
                          </div>

                          {/* Protected Activities */}
                          {pilot.protectedActivityFlags.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-amber-700">
                              <AlertCircle className="h-3 w-3" />
                              <span>Protected Activities: {pilot.protectedActivityFlags.join(", ")}</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" onClick={() => handleInspect(pilot.id)}>
                              <Eye className="h-3 w-3 mr-1" />
                              Inspect
                            </Button>
                            <Button size="sm" onClick={() => handleVerify(pilot.id)}>
                              <Shield className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleFlag(pilot.id)}>
                              <Flag className="h-3 w-3 mr-1" />
                              Flag
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push("/pilots")}>
                  <Search className="h-3 w-3 mr-1" />
                  Browse All Pilots
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                  <FileText className="h-3 w-3 mr-1" />
                  Audit View
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportAudit}>
                  <Download className="h-3 w-3 mr-1" />
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
