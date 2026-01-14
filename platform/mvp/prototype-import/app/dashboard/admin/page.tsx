"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation } from "@/components/ui-components"
import { useApp } from "@/lib/context"
import { samplePilots, sampleProfiles } from "@/lib/sample-data"
import { Users, FileText, Shield, Activity } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { currentRole, currentUser } = useApp()

  useEffect(() => {
    if (currentRole !== "admin") {
      router.push("/")
    }
  }, [currentRole, router])

  const protectedPilots = samplePilots.filter((p) => p.protectedActivityFlags.length > 0)
  const pendingVerifications = samplePilots.filter((p) => p.evidence.some((e) => e.verified === "pending"))

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <PageAnnotation
          title="Admin Dashboard"
          criteria={[
            "Overview of platform activity",
            "Quick access to Audit Timeline",
            "Export capabilities for all data",
            "Protected activity monitoring",
          ]}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and audit controls</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{sampleProfiles.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pilots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{samplePilots.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Protected Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold">{protectedPilots.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                <span className="text-2xl font-bold">{pendingVerifications.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audit & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => router.push("/admin/audit")}
              >
                <Activity className="h-4 w-4 mr-2" />
                View Audit Timeline
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Review Protected Activities
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Compliance Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => router.push("/profile/new")}
              >
                <Users className="h-4 w-4 mr-2" />
                Add New User
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export User Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sample Users Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Sample User Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleProfiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{profile.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {profile.role} • {profile.availability}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Fit: {profile.matchResult?.fitLevel} ({profile.matchResult?.score}%)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile.certifications.length > 0 ? "Has verified license" : "No license"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
