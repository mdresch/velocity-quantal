"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation } from "@/components/ui-components"
import { ArrowRight, Play, Users, FileText, ClipboardCheck, MessageSquare, Download } from "lucide-react"

interface DemoStep {
  id: string
  title: string
  duration: string
  description: string
  actions: string[]
  completed: boolean
}

const demoFlows: { title: string; role: string; steps: DemoStep[] }[] = [
  {
    title: "Mentor Flow",
    role: "mentor",
    steps: [
      {
        id: "m1",
        title: "Access Dashboard",
        duration: "1 min",
        description: "Navigate to Mentor Dashboard and review pending verifications",
        actions: [
          "Click 'Mentor' on landing page",
          "Review stats cards showing pending verifications",
          "Note the tabs for filtering pilots",
        ],
        completed: false,
      },
      {
        id: "m2",
        title: "Review Protected Pilot",
        duration: "2 min",
        description: "Open Clinical Data Collection pilot with protected activities",
        actions: [
          "Click on 'Clinical Data Collection Pilot' card",
          "Note the yellow 'Licensed resource required' label",
          "Click 'Preview Evidence' to see attached documents",
        ],
        completed: false,
      },
      {
        id: "m3",
        title: "Verify License",
        duration: "2 min",
        description: "Use the License Verification panel",
        actions: [
          "Click 'Verify License' on a pilot card",
          "Enter registry details or use pre-filled values",
          "Click 'Verify' and review the result",
          "Try different registry IDs to see verified/expired/not_found states",
        ],
        completed: false,
      },
    ],
  },
  {
    title: "Student Flow",
    role: "student",
    steps: [
      {
        id: "s1",
        title: "Complete Profile",
        duration: "3 min",
        description: "Fill out the user elicitation form to get matched",
        actions: [
          "Click 'Complete Profile' in header",
          "Fill in name, email, availability",
          "Select skills (up to 6)",
          "Set preferences and submit",
          "Review your Fit badge and rationale",
        ],
        completed: false,
      },
      {
        id: "s2",
        title: "Submit Pilot",
        duration: "2 min",
        description: "Create a new pilot submission",
        actions: [
          "Click 'Submit New Pilot' on dashboard",
          "Fill required fields: title, description, jurisdictions",
          "Check a protected activity flag",
          "Note the requirement for evidence OR partner fallback",
          "Upload a file or add partner fallback note",
          "Submit and review match result",
        ],
        completed: false,
      },
    ],
  },
  {
    title: "Entrepreneur Flow",
    role: "entrepreneur",
    steps: [
      {
        id: "e1",
        title: "Review KPI Dashboard",
        duration: "1 min",
        description: "View project metrics and Fit profile",
        actions: [
          "Login as Entrepreneur (Alice)",
          "Review KPI summary cards",
          "Note the Fit profile with score and rationale",
        ],
        completed: false,
      },
      {
        id: "e2",
        title: "Manage Projects",
        duration: "2 min",
        description: "Review existing pilots and their status",
        actions: [
          "View pilot cards with status badges",
          "Click 'Preview Evidence' on a pilot",
          "Note partner fallback notes on protected pilots",
        ],
        completed: false,
      },
    ],
  },
  {
    title: "Admin Flow",
    role: "admin",
    steps: [
      {
        id: "a1",
        title: "Review Platform Stats",
        duration: "1 min",
        description: "Overview of all platform activity",
        actions: [
          "Login as Admin",
          "Review stats: users, pilots, protected activities",
          "Note the sample user profiles section",
        ],
        completed: false,
      },
      {
        id: "a2",
        title: "Audit Timeline",
        duration: "2 min",
        description: "Review and export audit log",
        actions: [
          "Click 'View Audit Timeline'",
          "Apply filters: by user, pilot, or date",
          "Click 'Export CSV' or 'Export JSON'",
          "Note references to evidence files in export",
        ],
        completed: false,
      },
    ],
  },
]

const reviewQuestions = [
  "Does the Fit matching logic accurately reflect the importance of availability, skills, and certifications?",
  "Is the protected-activity gating clear and appropriately strict?",
  "Do the evidence verification and license panel provide sufficient audit trail?",
  "Is the partner fallback path understandable for users without verified licenses?",
  "What additional compliance checkpoints would you recommend for production?",
]

export default function DemoPage() {
  const router = useRouter()
  const [flows, setFlows] = useState(demoFlows)
  const [activeFlowIndex, setActiveFlowIndex] = useState(0)

  const toggleStep = (flowIndex: number, stepId: string) => {
    setFlows((prev) =>
      prev.map((flow, fi) =>
        fi === flowIndex
          ? {
              ...flow,
              steps: flow.steps.map((step) => (step.id === stepId ? { ...step, completed: !step.completed } : step)),
            }
          : flow,
      ),
    )
  }

  const totalSteps = flows.reduce((acc, flow) => acc + flow.steps.length, 0)
  const completedSteps = flows.reduce((acc, flow) => acc + flow.steps.filter((s) => s.completed).length, 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <PageAnnotation
          title="Demo Script"
          criteria={[
            "5-10 min role flows for each role",
            "20-30 min walkthrough covering all features",
            "20-30 min feedback capture session",
            "5 targeted questions for reviewers",
          ]}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Velocity Quantal — Demo Script</h1>
          <p className="text-muted-foreground">60-90 minute stakeholder review session</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Demo Progress</p>
                <p className="text-sm text-muted-foreground">
                  {completedSteps} of {totalSteps} steps completed
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => router.push("/")}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Demo
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Notes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Role Flows
              </CardTitle>
              <CardDescription>5-10 min each</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800">
                Quick walkthrough of each role's primary actions and dashboard views
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-green-600" />
                Feature Walkthrough
              </CardTitle>
              <CardDescription>20-30 min</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-800">
                Deep dive into pilot submission, evidence, verification, and matching
              </p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-600" />
                Feedback Capture
              </CardTitle>
              <CardDescription>20-30 min</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-800">Structured discussion with targeted questions for reviewers</p>
            </CardContent>
          </Card>
        </div>

        {/* Role Flow Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {flows.map((flow, index) => (
            <Button
              key={flow.role}
              variant={activeFlowIndex === index ? "default" : "outline"}
              onClick={() => setActiveFlowIndex(index)}
              className={activeFlowIndex !== index ? "bg-transparent" : ""}
            >
              {flow.title}
            </Button>
          ))}
        </div>

        {/* Active Flow Steps */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{flows[activeFlowIndex].title}</CardTitle>
                <CardDescription>
                  {flows[activeFlowIndex].steps.filter((s) => s.completed).length} of{" "}
                  {flows[activeFlowIndex].steps.length} steps completed
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => router.push(`/dashboard/${flows[activeFlowIndex].role}`)}>
                <Play className="h-4 w-4 mr-2" />
                Open Dashboard
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {flows[activeFlowIndex].steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border ${step.completed ? "bg-green-50 border-green-200" : "bg-muted/50"}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={step.completed} onCheckedChange={() => toggleStep(activeFlowIndex, step.id)} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">
                        {index + 1}. {step.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">{step.duration}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <ul className="text-sm space-y-1">
                      {step.actions.map((action, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Review Questions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviewer Questions
            </CardTitle>
            <CardDescription>5 targeted questions for feedback capture</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {reviewQuestions.map((question, index) => (
                <li key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-sm">{question}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Sample Data Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sample Data Reference
            </CardTitle>
            <CardDescription>Three user profiles and three pilots for demonstration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">User Profiles</h4>
                <ul className="space-y-2 text-sm">
                  <li className="p-2 bg-green-50 rounded">
                    <strong>Alice Chen</strong> (High Fit) — Technical entrepreneur, 30+ hrs/week, no license
                  </li>
                  <li className="p-2 bg-green-50 rounded">
                    <strong>Bas van der Berg</strong> (High Fit) — Mentor with verified medical device license
                  </li>
                  <li className="p-2 bg-red-50 rounded">
                    <strong>Carol Martinez</strong> (Low Fit) — Student, limited availability, early learner
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Pilots</h4>
                <ul className="space-y-2 text-sm">
                  <li className="p-2 bg-muted rounded">
                    <strong>Local Marketplace Content</strong> — Non-protected, approved
                  </li>
                  <li className="p-2 bg-amber-50 rounded">
                    <strong>Clinical Data Collection</strong> — Protected + partner fallback, under review
                  </li>
                  <li className="p-2 bg-green-50 rounded">
                    <strong>Medical Device Calibration</strong> — Protected + verified license, approved
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
