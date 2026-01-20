"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation } from "@/components/ui-components"
import { useApp } from "@/lib/context"
import { getIssues } from "@/lib/mock-api"
import type { Issue, IssueStatus } from "@/lib/types"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Filter,
  TrendingUp,
} from "lucide-react"

export default function IssuesPage() {
  const router = useRouter()
  const { currentUser, currentRole } = useApp()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<"all" | IssueStatus>("all")

  useEffect(() => {
    loadIssues()
  }, [])

  const loadIssues = async () => {
    setLoading(true)
    try {
      const response = await getIssues()
      setIssues(response.data)
    } catch (error) {
      console.error("Failed to load issues:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIssues =
    selectedTab === "all" ? issues : issues.filter((issue) => issue.status === selectedTab)

  const getStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "monitoring":
        return <Eye className="h-4 w-4" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "monitoring":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
    }
  }

  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === "open").length,
    inProgress: issues.filter((i) => i.status === "in_progress").length,
    monitoring: issues.filter((i) => i.status === "monitoring").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    critical: issues.filter((i) => i.priority === "critical").length,
    high: issues.filter((i) => i.priority === "high").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <PageAnnotation
          title="Issue Register"
          criteria={[
            "Track escalated risks that require active management",
            "Monitor issue status and priority levels",
            "Manage tasks and prevention measures",
            "View activity timeline and root cause analysis",
          ]}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Issue Register</h1>
          <p className="text-muted-foreground">
            Track and manage escalated risks with tasks and prevention playbooks
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Open</p>
                  <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Monitoring</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.monitoring}</p>
                </div>
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Critical/High</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical + stats.high}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issues List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Issues</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}>
              <TabsList>
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring ({stats.monitoring})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-4 space-y-3">
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Loading issues...</p>
                ) : filteredIssues.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No issues found</p>
                ) : (
                  filteredIssues.map((issue) => (
                    <Card
                      key={issue.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/issues/${issue.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={getPriorityColor(issue.priority)} className="text-xs">
                                {issue.priority}
                              </Badge>
                              <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                                <span className="mr-1">{getStatusIcon(issue.status)}</span>
                                {issue.status.replace("_", " ")}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {issue.category}
                              </Badge>
                            </div>

                            <h3 className="font-semibold">{issue.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>

                            {issue.escalatedFromRisk && (
                              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                                <p className="text-amber-800">
                                  <strong>Escalated from risk:</strong> {issue.escalatedFromRisk.originalRiskDescription}
                                </p>
                                <p className="text-amber-700 mt-1">
                                  Opportunity: {issue.escalatedFromRisk.opportunityTitle}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Owner: {issue.ownerName}</span>
                              {issue.assignedToName && <span>Assigned: {issue.assignedToName}</span>}
                              <span>
                                Tasks: {issue.tasks.filter((t) => t.status === "completed").length}/{issue.tasks.length}
                              </span>
                              <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
