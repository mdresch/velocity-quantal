"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation } from "@/components/ui-components"
import { useApp } from "@/lib/context"
import { getPilots, getOpportunities } from "@/lib/mock-api"
import { sampleProfiles } from "@/lib/sample-data"
import type { Pilot, Opportunity } from "@/lib/types"
import { 
  Users, 
  FileText, 
  Shield, 
  Activity,
  Settings,
  Download,
  TrendingUp,
  Clock,
  BarChart3,
  UserCog,
  AlertCircle,
  CheckCircle2
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { currentRole, currentUser } = useApp()
  const [pilots, setPilots] = useState<Pilot[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentRole !== "admin") {
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
      setPilots(pilotsResponse.data)
      setOpportunities(opportunitiesResponse.data)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const totalUsers = sampleProfiles.length
  const activePilots = pilots.filter(p => p.status !== "draft" && p.status !== "rejected").length
  const evidenceItems = pilots.reduce((sum, p) => sum + p.evidence.length, 0)
  const completedPilots = pilots.filter(p => p.status === "approved").length
  const protectedPilots = pilots.filter(p => p.protectedActivityFlags.length > 0)
  const pendingVerifications = pilots.filter(p => p.evidence.some(e => e.verified === "pending"))

  // Mock activity heatmap data (last 7 days)
  const activityHeatmap = [
    { day: "Mon", count: 15, percentage: 50 },
    { day: "Tue", count: 21, percentage: 70 },
    { day: "Wed", count: 18, percentage: 60 },
    { day: "Thu", count: 24, percentage: 80 },
    { day: "Fri", count: 12, percentage: 40 },
    { day: "Sat", count: 8, percentage: 27 },
    { day: "Sun", count: 5, percentage: 17 },
  ]

  // Mock recent admin actions
  const recentActions = [
    { id: 1, action: "User role changed: John → Mentor", time: "2h ago", type: "role" },
    { id: 2, action: "Audit export generated", time: "3h ago", type: "export" },
    { id: 3, action: "Evidence verification completed", time: "5h ago", type: "verify" },
    { id: 4, action: "New opportunity published", time: "1d ago", type: "publish" },
  ]

  const handleExportAudit = () => {
    console.log("Exporting full system audit...")
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
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Overview</h1>
            <PageAnnotation className="mt-1">
              Monitor platform health, manage users, and export audit reports
            </PageAnnotation>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/users")}>
              <UserCog className="h-4 w-4 mr-2" />
              User Management
            </Button>
            <Button variant="outline" onClick={handleExportAudit}>
              <Download className="h-4 w-4 mr-2" />
              Export Audit
            </Button>
          </div>
        </div>

        {/* System Metrics - 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12 this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pilots</CardTitle>
              <BarChart3 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activePilots}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {protectedPilots.length} require verification
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evidence Items</CardTitle>
              <FileText className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{evidenceItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingVerifications.length} pending verification
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pilots Complete</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedPilots}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((completedPilots / pilots.length) * 100 || 0).toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Heatmap & Recent Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Activity Heatmap (Last 7 Days)
              </CardTitle>
              <CardDescription>Platform usage trends over the past week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activityHeatmap.map((data) => (
                <div key={data.day} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{data.day}</span>
                  <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full flex items-center px-2 transition-all"
                      style={{ width: `${data.percentage}%` }}
                    >
                      {data.percentage > 20 && (
                        <span className="text-xs font-medium text-white">{data.count}</span>
                      )}
                    </div>
                  </div>
                  {data.percentage <= 20 && (
                    <span className="text-xs text-muted-foreground w-6">{data.count}</span>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t">
                <Button variant="link" className="h-auto p-0 text-sm" onClick={() => router.push("/admin/analytics")}>
                  View detailed analytics →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Admin Actions
              </CardTitle>
              <CardDescription>Latest system administration activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No recent actions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActions.map((action) => (
                    <div key={action.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="mt-1">
                        {action.type === "role" && <UserCog className="h-4 w-4 text-blue-500" />}
                        {action.type === "export" && <Download className="h-4 w-4 text-green-500" />}
                        {action.type === "verify" && <CheckCircle2 className="h-4 w-4 text-purple-500" />}
                        {action.type === "publish" && <FileText className="h-4 w-4 text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{action.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{action.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="link" className="h-auto p-0 text-sm" onClick={() => router.push("/admin/audit-log")}>
                    View full audit log →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => router.push("/admin/users")}
            >
              <UserCog className="h-6 w-6" />
              <span className="text-sm font-medium">Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => router.push("/dashboard/analyst")}
            >
              <Shield className="h-6 w-6" />
              <span className="text-sm font-medium">Verification Queue</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={handleExportAudit}
            >
              <Download className="h-6 w-6" />
              <span className="text-sm font-medium">Export Reports</span>
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        {(protectedPilots.length > 0 || pendingVerifications.length > 0) && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingVerifications.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-white dark:bg-background">
                    {pendingVerifications.length}
                  </Badge>
                  <span>pilot(s) with pending evidence verification</span>
                  <Button
                    variant="link"
                    className="h-auto p-0 ml-auto text-sm"
                    onClick={() => router.push("/dashboard/analyst")}
                  >
                    Review →
                  </Button>
                </div>
              )}
              {protectedPilots.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-white dark:bg-background">
                    {protectedPilots.length}
                  </Badge>
                  <span>pilot(s) involve protected activities</span>
                  <Button
                    variant="link"
                    className="h-auto p-0 ml-auto text-sm"
                    onClick={() => router.push("/opportunities?filter=protected")}
                  >
                    Review →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
