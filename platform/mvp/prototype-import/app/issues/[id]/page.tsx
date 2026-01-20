"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation } from "@/components/page-annotation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Plus, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  CheckSquare,
  Shield
} from "lucide-react"
import { getIssue, updateIssue, updateIssueStatus, addIssueTask, updateTaskStatus, addIssueActivity } from "@/lib/mock-api"
import type { Issue, IssueStatus, IssuePriority, TaskStatus } from "@/lib/types"

export default function IssuePage() {
  const params = useParams()
  const router = useRouter()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [newTask, setNewTask] = useState("")
  const [newActivity, setNewActivity] = useState("")
  const [editingDescription, setEditingDescription] = useState(false)
  const [editingRootCause, setEditingRootCause] = useState(false)
  const [editedDescription, setEditedDescription] = useState("")
  const [editedRootCause, setEditedRootCause] = useState("")

  useEffect(() => {
    if (params.id) {
      const issueData = getIssue(params.id as string)
      if (issueData) {
        setIssue(issueData)
        setEditedDescription(issueData.description)
        setEditedRootCause(issueData.rootCause || "")
      }
    }
  }, [params.id])

  const handleStatusChange = (newStatus: IssueStatus) => {
    if (!issue) return
    
    const updated = updateIssueStatus(issue.id, newStatus, "user-1")
    if (updated) {
      setIssue(updated)
    }
  }

  const handlePriorityChange = (newPriority: IssuePriority) => {
    if (!issue) return
    
    const updated = updateIssue(issue.id, { priority: newPriority })
    if (updated) {
      setIssue(updated)
      addIssueActivity(issue.id, "user-1", "User", `Changed priority to ${newPriority}`)
    }
  }

  const handleAddTask = () => {
    if (!issue || !newTask.trim()) return
    
    const updated = addIssueTask(issue.id, newTask.trim())
    if (updated) {
      setIssue(updated)
      setNewTask("")
    }
  }

  const handleToggleTask = (taskId: string, currentStatus: TaskStatus) => {
    if (!issue) return
    
    const newStatus: TaskStatus = currentStatus === "completed" ? "pending" : "completed"
    const updated = updateTaskStatus(issue.id, taskId, newStatus)
    if (updated) {
      setIssue(updated)
    }
  }

  const handleAddActivity = () => {
    if (!issue || !newActivity.trim()) return
    
    addIssueActivity(issue.id, "user-1", "User", newActivity.trim())
    setNewActivity("")
    
    // Refresh issue to get updated activity
    const refreshed = getIssue(issue.id)
    if (refreshed) {
      setIssue(refreshed)
    }
  }

  const handleSaveDescription = () => {
    if (!issue) return
    
    const updated = updateIssue(issue.id, { description: editedDescription })
    if (updated) {
      setIssue(updated)
      setEditingDescription(false)
      addIssueActivity(issue.id, "user-1", "User", "Updated issue description")
    }
  }

  const handleSaveRootCause = () => {
    if (!issue) return
    
    const updated = updateIssue(issue.id, { rootCause: editedRootCause })
    if (updated) {
      setIssue(updated)
      setEditingRootCause(false)
      addIssueActivity(issue.id, "user-1", "User", "Updated root cause analysis")
    }
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading issue...</p>
          </div>
        </main>
      </div>
    )
  }

  const statusColors = {
    open: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
    monitoring: "bg-purple-100 text-purple-800 border-purple-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200"
  }

  const priorityColors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  }

  const completedTasks = issue.tasks.filter(t => t.status === "completed").length
  const totalTasks = issue.tasks.length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <PageAnnotation
        title="Issue Management"
        description="Manage escalated issues with comprehensive task tracking, root cause analysis, and prevention measures"
        keywords="issue tracking, task management, risk mitigation, root cause analysis, prevention planning"
      />
      
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/issues")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Issue Register
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{issue.title}</h1>
                <Badge className={statusColors[issue.status]}>
                  {issue.status.replace("_", " ")}
                </Badge>
                <Badge className={priorityColors[issue.priority]}>
                  {issue.priority}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Escalated from: {issue.escalatedFrom.type}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created: {new Date(issue.createdAt).toLocaleDateString()}
                </div>
                {issue.resolvedAt && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Resolved: {new Date(issue.resolvedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={issue.status} onValueChange={(value) => handleStatusChange(value as IssueStatus)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={issue.priority} onValueChange={(value) => handlePriorityChange(value as IssuePriority)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Change priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description
                  </CardTitle>
                  {!editingDescription && (
                    <Button variant="ghost" size="sm" onClick={() => setEditingDescription(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingDescription ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveDescription}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingDescription(false)
                        setEditedDescription(issue.description)
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Root Cause Analysis */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Root Cause Analysis
                  </CardTitle>
                  {!editingRootCause && (
                    <Button variant="ghost" size="sm" onClick={() => setEditingRootCause(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingRootCause ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedRootCause}
                      onChange={(e) => setEditedRootCause(e.target.value)}
                      rows={4}
                      placeholder="Analyze the root cause of this issue..."
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveRootCause}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingRootCause(false)
                        setEditedRootCause(issue.rootCause || "")
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {issue.rootCause || "No root cause analysis yet."}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Prevention Measures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Prevention Measures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {issue.preventionMeasures.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No prevention measures defined.</p>
                  ) : (
                    <ul className="space-y-2">
                      {issue.preventionMeasures.map((measure, index) => (
                        <li key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                          <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm text-blue-900">{measure}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Tasks ({completedTasks}/{totalTasks})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a new task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddTask()
                        }
                      }}
                    />
                    <Button onClick={handleAddTask}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {issue.tasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No tasks yet.</p>
                    ) : (
                      issue.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <button
                            onClick={() => handleToggleTask(task.id, task.status)}
                            className="mt-0.5"
                          >
                            {task.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={`text-sm ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Added {new Date(task.createdAt).toLocaleDateString()}
                              {task.completedAt && ` • Completed ${new Date(task.completedAt).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Escalation Source */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Escalation Source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium capitalize">{issue.escalatedFrom.type}</p>
                </div>
                {issue.escalatedFrom.riskId && (
                  <div>
                    <p className="text-xs text-muted-foreground">Risk ID</p>
                    <p className="text-sm font-mono">{issue.escalatedFrom.riskId}</p>
                  </div>
                )}
                {issue.escalatedFrom.opportunityId && (
                  <div>
                    <p className="text-xs text-muted-foreground">Opportunity</p>
                    <p className="text-sm">{issue.escalatedFrom.opportunityTitle}</p>
                  </div>
                )}
                {issue.escalatedFrom.severity && (
                  <div>
                    <p className="text-xs text-muted-foreground">Original Severity</p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {issue.escalatedFrom.severity}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add activity note..."
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddActivity()
                        }
                      }}
                    />
                    <Button size="sm" onClick={handleAddActivity}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {issue.activities.map((activity) => (
                      <div key={activity.id} className="border-l-2 border-muted pl-3 pb-2">
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                        <p className="text-sm font-medium">{activity.userName}</p>
                        <p className="text-sm text-muted-foreground">{activity.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="capitalize">{issue.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created By</p>
                  <p>{issue.createdBy.name}</p>
                </div>
                {issue.assignedTo && (
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                    <p>{issue.assignedTo.name}</p>
                  </div>
                )}
                {issue.playbookId && (
                  <div>
                    <p className="text-xs text-muted-foreground">Playbook</p>
                    <p className="font-mono text-xs">{issue.playbookId}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
