"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { escalateRiskToIssue, addIssueTask } from "@/lib/mock-api"
import type { OpportunityRisk, Issue, IssueTask } from "@/lib/types"
import { AlertTriangle, Plus, Trash2, CheckCircle2 } from "lucide-react"

interface EscalateRiskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  risk: OpportunityRisk | null
  opportunityId: string
  opportunityTitle: string
  userId: string
  userName: string
}

export function EscalateRiskDialog({
  open,
  onOpenChange,
  risk,
  opportunityId,
  opportunityTitle,
  userId,
  userName,
}: EscalateRiskDialogProps) {
  const router = useRouter()
  const [escalating, setEscalating] = useState(false)
  
  // Issue details
  const [issueTitle, setIssueTitle] = useState("")
  const [issueDescription, setIssueDescription] = useState("")
  const [category, setCategory] = useState("operational")
  const [priority, setPriority] = useState<Issue["priority"]>("medium")
  const [rootCause, setRootCause] = useState("")
  
  // Prevention measures
  const [preventionMeasures, setPreventionMeasures] = useState<string[]>([])
  const [newMeasure, setNewMeasure] = useState("")
  
  // Tasks
  const [tasks, setTasks] = useState<Omit<IssueTask, "id">[]>([
    {
      description: "Assess immediate impact and scope",
      status: "pending",
    },
    {
      description: "Implement mitigation strategy",
      status: "pending",
    },
    {
      description: "Monitor effectiveness of measures",
      status: "pending",
    },
  ])
  const [newTaskDesc, setNewTaskDesc] = useState("")

  // Initialize form when risk changes
  useEffect(() => {
    if (risk) {
      setIssueTitle(`Issue: ${risk.description.substring(0, 60)}...`)
      setIssueDescription(
        `The risk "${risk.description}" has materialized and requires active management.`
      )
      setPriority(
        risk.severity === "critical" || risk.severity === "high" ? "high" : "medium"
      )
      setPreventionMeasures([risk.mitigation])
    }
  }, [risk])

  const addMeasure = () => {
    if (newMeasure.trim()) {
      setPreventionMeasures([...preventionMeasures, newMeasure.trim()])
      setNewMeasure("")
    }
  }

  const removeMeasure = (index: number) => {
    setPreventionMeasures(preventionMeasures.filter((_, i) => i !== index))
  }

  const addTask = () => {
    if (newTaskDesc.trim()) {
      setTasks([
        ...tasks,
        {
          description: newTaskDesc.trim(),
          status: "pending",
        },
      ])
      setNewTaskDesc("")
    }
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const handleEscalate = async () => {
    if (!issueTitle.trim() || !issueDescription.trim()) {
      return
    }

    setEscalating(true)
    try {
      const response = await escalateRiskToIssue({
        risk,
        opportunityId,
        opportunityTitle,
        userId,
        userName,
        issueTitle: issueTitle.trim(),
        issueDescription: issueDescription.trim(),
        category,
        priority,
        rootCause: rootCause.trim() || undefined,
        preventionMeasures: preventionMeasures.length > 0 ? preventionMeasures : undefined,
        initialTasks: tasks,
      })

      // Navigate to the new issue
      router.push(`/issues/${response.data.issueId}`)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to escalate risk:", error)
    } finally {
      setEscalating(false)
    }
  }

  // Don't render if no risk is selected
  if (!risk) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Escalate Risk to Issue
          </DialogTitle>
          <DialogDescription>
            Convert this risk into an active issue with tasks and prevention measures
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Original Risk */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-900 mb-1">Original Risk</p>
            <p className="text-sm text-amber-800">{risk.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={risk.severity === "high" || risk.severity === "critical" ? "destructive" : "default"}>
                {risk.severity}
              </Badge>
              {risk.likelihood && <span className="text-xs text-amber-700">{risk.likelihood}</span>}
            </div>
          </div>

          {/* Issue Details */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="issueTitle">Issue Title *</Label>
              <Input
                id="issueTitle"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="Brief, action-oriented title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDescription">Issue Description *</Label>
              <Textarea
                id="issueDescription"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe what happened and the current situation..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="reputation">Reputation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Issue["priority"])}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rootCause">Root Cause Analysis (Optional)</Label>
              <Textarea
                id="rootCause"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="Why did this risk materialize? What were the underlying causes?"
                rows={2}
              />
            </div>
          </div>

          {/* Prevention Measures */}
          <div className="space-y-2">
            <Label>Prevention Measures</Label>
            <p className="text-xs text-muted-foreground">
              Actions to prevent future escalation or recurrence
            </p>
            
            <div className="space-y-2">
              {preventionMeasures.map((measure, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                  <p className="flex-1 text-sm">{measure}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeMeasure(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add prevention measure..."
                value={newMeasure}
                onChange={(e) => setNewMeasure(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addMeasure()}
              />
              <Button onClick={addMeasure} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            <Label>Action Tasks</Label>
            <p className="text-xs text-muted-foreground">
              Specific tasks to address this issue
            </p>
            
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex-1 text-sm">{task.description}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeTask(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add task..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />
              <Button onClick={addTask} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={escalating}>
              Cancel
            </Button>
            <Button onClick={handleEscalate} disabled={escalating || !issueTitle.trim() || !issueDescription.trim()}>
              {escalating ? "Escalating..." : "Create Issue"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
