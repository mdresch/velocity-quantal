"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PageAnnotation } from "@/components/ui-components"
import { useApp } from "@/lib/context"
import { createOpportunity } from "@/lib/mock-api"
import {
  skillsOptions,
  jurisdictionOptions,
  protectedActivityOptions,
  compensationOptions,
  durationOptions,
} from "@/lib/sample-data"
import type { OpportunityStatus, OpportunityRisk, RiskSeverity } from "@/lib/types"
import { ArrowLeft, Save, Send, X, AlertTriangle, CheckCircle2, Lightbulb, Plus, Trash2, FileText, Briefcase } from "lucide-react"

export default function CreateOpportunityPage() {
  const router = useRouter()
  const { currentUser, currentRole } = useApp()
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<string[]>([])
  const [minExperience, setMinExperience] = useState(0)
  const [jurisdictions, setJurisdictions] = useState<string[]>([])
  const [availability, setAvailability] = useState("10-20 hrs/week")
  const [deviceAccess, setDeviceAccess] = useState<string[]>(["Laptop"])
  const [internetRequired, setInternetRequired] = useState(true)
  const [protectedFlags, setProtectedFlags] = useState<string[]>([])
  const [compensation, setCompensation] = useState("")
  const [duration, setDuration] = useState("")
  const [maxParticipants, setMaxParticipants] = useState(5)
  const [deadline, setDeadline] = useState("")
  // Analyst assessment fields
  const [expectedROI, setExpectedROI] = useState("")
  const [initialTimeToCash, setInitialTimeToCash] = useState("")
  const [successEstimate, setSuccessEstimate] = useState<number>(0)
  const [assessmentNotes, setAssessmentNotes] = useState("")
  // Risk assessment fields
  const [risks, setRisks] = useState<OpportunityRisk[]>([])
  const [newRiskDesc, setNewRiskDesc] = useState("")
  const [newRiskSeverity, setNewRiskSeverity] = useState<RiskSeverity>("medium")
  const [newRiskMitigation, setNewRiskMitigation] = useState("")
  const [newRiskLikelihood, setNewRiskLikelihood] = useState("")
  // Document fields
  const [ideationDocName, setIdeationDocName] = useState("")
  const [ideationDocContent, setIdeationDocContent] = useState("")
  const [businessCaseDocName, setBusinessCaseDocName] = useState("")
  const [businessCaseDocContent, setBusinessCaseDocContent] = useState("")


  const addRisk = () => {
    if (newRiskDesc.trim() && newRiskMitigation.trim()) {
      setRisks([
        ...risks,
        {
          id: `risk-${Date.now()}`,
          description: newRiskDesc,
          severity: newRiskSeverity,
          mitigation: newRiskMitigation,
          likelihood: newRiskLikelihood || undefined,
        },
      ])
      setNewRiskDesc("")
      setNewRiskMitigation("")
      setNewRiskLikelihood("")
      setNewRiskSeverity("medium")
    }
  }

  const removeRisk = (id: string) => {
    setRisks(risks.filter((r) => r.id !== id))
  }

  const toggleArrayItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item))
    } else {
      setArr([...arr, item])
    }
  }

  const handleSave = async (status: OpportunityStatus) => {
    if (!currentUser) return
    setSaving(true)

    try {
      const opportunityData: any = {
        title,
        description,
        mentorId: currentUser.id,
        mentorName: currentUser.name,
        status,
        requirements: {
          skills,
          certifications,
          minExperienceYears: minExperience,
          jurisdictions,
          availability,
          deviceAccess,
          internetRequired,
        },
        protectedActivityFlags: protectedFlags,
        compensation,
        duration,
        maxParticipants,
        deadline: deadline || undefined,
        expectedROI: expectedROI || undefined,
        initialTimeToCash: initialTimeToCash || undefined,
        successEstimate: successEstimate > 0 ? successEstimate : undefined,
        assessmentNotes: assessmentNotes || undefined,
        risks: risks.length > 0 ? risks : undefined,
      }

      // Add ideation document if provided
      if (ideationDocName && ideationDocContent) {
        opportunityData.ideationDocument = {
          id: `doc-ideation-${Date.now()}`,
          name: ideationDocName,
          type: "ideation" as const,
          content: ideationDocContent,
          uploadedBy: currentUser.id,
          uploadedByName: currentUser.name,
          uploadedAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: 1,
        }
      }

      // Add business case document if provided
      if (businessCaseDocName && businessCaseDocContent) {
        opportunityData.businessCaseDocument = {
          id: `doc-bizcase-${Date.now()}`,
          name: businessCaseDocName,
          type: "business_case" as const,
          content: businessCaseDocContent,
          uploadedBy: currentUser.id,
          uploadedByName: currentUser.name,
          uploadedAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: 1,
        }
      }

      await createOpportunity(opportunityData)

      router.push("/dashboard/mentor?tab=opportunities")
    } catch (error) {
      console.error("Failed to create opportunity:", error)
    } finally {
      setSaving(false)
    }
  }

  const isStep1Valid = title.trim() && description.trim()
  const isStep2Valid = skills.length > 0 && jurisdictions.length > 0
  const isStep3Valid = compensation && duration

  if (currentRole !== "mentor") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <p className="text-lg font-medium mb-2">Mentor Access Required</p>
            <p className="text-muted-foreground mb-4">Only mentors can create opportunities.</p>
            <Button onClick={() => router.push("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Create Opportunity</h1>
            <p className="text-sm text-muted-foreground">Define requirements for entrepreneurs to match against</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <PageAnnotation
          title="Mentor Opportunity Creation"
          criteria={[
            "Progressive disclosure - basic info first, then requirements",
            "Skills, certifications, experience requirements",
            "Protected activity flags with compliance notes",
            "Save as draft or publish immediately",
          ]}
        />

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : step > s
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-green-500" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Describe the opportunity for potential participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Opportunity Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Healthcare Data Analysis Assistant"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the work, responsibilities, and what participants will learn..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compensation">Compensation *</Label>
                  <Select value={compensation} onValueChange={setCompensation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {compensationOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min={1}
                    max={100}
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
              </div>

              {/* Analyst Assessment Section */}
              <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Analyst Assessment (Optional)</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Provide estimated metrics to help entrepreneurs evaluate this opportunity
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedROI">Expected ROI</Label>
                    <Input
                      id="expectedROI"
                      placeholder="e.g., 150-200%, $5K-10K"
                      value={expectedROI}
                      onChange={(e) => setExpectedROI(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Estimated return on investment</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeToCash">Initial Time to Cash</Label>
                    <Input
                      id="timeToCash"
                      placeholder="e.g., 2-4 weeks, 30-45 days"
                      value={initialTimeToCash}
                      onChange={(e) => setInitialTimeToCash(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Time until first payment/revenue</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successEstimate">Success Estimate: {successEstimate}%</Label>
                  <Input
                    id="successEstimate"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={successEstimate}
                    onChange={(e) => setSuccessEstimate(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low confidence</span>
                    <span>High confidence</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessmentNotes">Assessment Notes</Label>
                  <Textarea
                    id="assessmentNotes"
                    placeholder="Optional notes on market conditions, risks, or recommendations..."
                    value={assessmentNotes}
                    onChange={(e) => setAssessmentNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Risk Assessment Section */}
              <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-medium text-amber-900">Risk Assessment (Optional)</h3>
                </div>
                <p className="text-sm text-amber-700">
                  Identify potential risks and mitigation strategies to help entrepreneurs prepare
                </p>

                {/* Existing Risks List */}
                {risks.length > 0 && (
                  <div className="space-y-2">
                    {risks.map((risk) => (
                      <div key={risk.id} className="p-3 bg-white border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  risk.severity === "critical"
                                    ? "destructive"
                                    : risk.severity === "high"
                                      ? "destructive"
                                      : risk.severity === "medium"
                                        ? "default"
                                        : "secondary"
                                }
                                className="text-xs"
                              >
                                {risk.severity}
                              </Badge>
                              {risk.likelihood && (
                                <span className="text-xs text-muted-foreground">{risk.likelihood}</span>
                              )}
                            </div>
                            <p className="text-sm font-medium">{risk.description}</p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Mitigation:</strong> {risk.mitigation}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeRisk(risk.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Risk Form */}
                <div className="space-y-3 p-3 bg-white border border-amber-300 rounded-lg">
                  <p className="text-sm font-medium text-amber-900">Add Risk</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="riskDesc">Risk Description</Label>
                    <Textarea
                      id="riskDesc"
                      placeholder="e.g., Market saturation in local area"
                      value={newRiskDesc}
                      onChange={(e) => setNewRiskDesc(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="riskSeverity">Severity</Label>
                      <Select value={newRiskSeverity} onValueChange={(v) => setNewRiskSeverity(v as RiskSeverity)}>
                        <SelectTrigger id="riskSeverity">
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

                    <div className="space-y-2">
                      <Label htmlFor="riskLikelihood">Likelihood (Optional)</Label>
                      <Input
                        id="riskLikelihood"
                        placeholder="e.g., unlikely, possible, likely"
                        value={newRiskLikelihood}
                        onChange={(e) => setNewRiskLikelihood(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskMitigation">Mitigation Strategy</Label>
                    <Textarea
                      id="riskMitigation"
                      placeholder="e.g., Focus on underserved niches, build portfolio before scaling"
                      value={newRiskMitigation}
                      onChange={(e) => setNewRiskMitigation(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={addRisk}
                    disabled={!newRiskDesc.trim() || !newRiskMitigation.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Risk
                  </Button>
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium text-purple-900">Opportunity Documents (Optional)</h3>
                </div>
                <p className="text-sm text-purple-700">
                  Provide ideation and business case documents to help participants understand the opportunity
                </p>

                {/* Ideation Document */}
                <div className="space-y-2 p-3 bg-white border border-purple-300 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-900">Ideation Document</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ideationDocName">Document Name</Label>
                    <Input
                      id="ideationDocName"
                      placeholder="e.g., Healthcare Analytics - Ideation"
                      value={ideationDocName}
                      onChange={(e) => setIdeationDocName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ideationDocContent">Content</Label>
                    <Textarea
                      id="ideationDocContent"
                      placeholder="Describe the problem, solution overview, target market, unique value proposition, initial services, and success metrics..."
                      value={ideationDocContent}
                      onChange={(e) => setIdeationDocContent(e.target.value)}
                      rows={8}
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Use markdown formatting (# headers, bullet points, etc.)
                    </p>
                  </div>
                </div>

                {/* Business Case Document */}
                <div className="space-y-2 p-3 bg-white border border-indigo-300 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-medium text-indigo-900">Business Case Document</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessCaseDocName">Document Name</Label>
                    <Input
                      id="businessCaseDocName"
                      placeholder="e.g., Healthcare Analytics - Business Case"
                      value={businessCaseDocName}
                      onChange={(e) => setBusinessCaseDocName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessCaseDocContent">Content</Label>
                    <Textarea
                      id="businessCaseDocContent"
                      placeholder="Include executive summary, market analysis, financial projections, risk assessment, resource requirements, go-to-market strategy, and success criteria..."
                      value={businessCaseDocContent}
                      onChange={(e) => setBusinessCaseDocContent(e.target.value)}
                      rows={8}
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Include financial projections, market sizing, and competitive analysis
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} disabled={!isStep1Valid}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Define skills, experience, and qualifications needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Required Skills *</Label>
                <p className="text-sm text-muted-foreground">Select skills that participants should have</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillsOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(skills, setSkills, skill)}
                    >
                      {skill}
                      {skills.includes(skill) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Certifications</Label>
                <p className="text-sm text-muted-foreground">Leave empty if no certifications required</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    "Medical Device Calibration Specialist",
                    "Clinical Research Coordinator",
                    "Data Privacy Certification",
                    "HIPAA Compliance",
                  ].map((cert) => (
                    <Badge
                      key={cert}
                      variant={certifications.includes(cert) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(certifications, setCertifications, cert)}
                    >
                      {cert}
                      {certifications.includes(cert) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minExp">Minimum Experience (years)</Label>
                  <Input
                    id="minExp"
                    type="number"
                    min={0}
                    max={20}
                    value={minExperience}
                    onChange={(e) => setMinExperience(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Availability Required</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<10 hrs/week">{"<10 hrs/week"}</SelectItem>
                      <SelectItem value="10-20 hrs/week">10-20 hrs/week</SelectItem>
                      <SelectItem value="30+ hrs/week">30+ hrs/week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Jurisdictions *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {jurisdictionOptions.map((j) => (
                    <Badge
                      key={j}
                      variant={jurisdictions.includes(j) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(jurisdictions, setJurisdictions, j)}
                    >
                      {j}
                      {jurisdictions.includes(j) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Device Access Required</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Laptop", "Tablet", "Smartphone"].map((device) => (
                    <Badge
                      key={device}
                      variant={deviceAccess.includes(device) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(deviceAccess, setDeviceAccess, device)}
                    >
                      {device}
                      {deviceAccess.includes(device) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="internet"
                  checked={internetRequired}
                  onCheckedChange={(v) => setInternetRequired(v === true)}
                />
                <Label htmlFor="internet" className="font-normal">
                  Reliable internet connection required
                </Label>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!isStep2Valid}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Compliance & Review */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Review</CardTitle>
              <CardDescription>Flag protected activities and review before saving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Protected Activity Flags</Label>
                <p className="text-sm text-muted-foreground">
                  Select if this opportunity involves regulated or protected activities
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {protectedActivityOptions.map((flag) => (
                    <Badge
                      key={flag}
                      variant={protectedFlags.includes(flag) ? "destructive" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(protectedFlags, setProtectedFlags, flag)}
                    >
                      {flag}
                      {protectedFlags.includes(flag) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              {protectedFlags.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Protected Activity Notice</p>
                      <p className="text-sm text-amber-700 mt-1">
                        This opportunity involves protected activities. Participants without required certifications
                        will need to partner with licensed professionals or provide evidence of qualification.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <h4 className="font-medium">Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Title:</span>
                  <span>{title}</span>
                  <span className="text-muted-foreground">Compensation:</span>
                  <span>{compensation}</span>
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{duration}</span>
                  <span className="text-muted-foreground">Max Participants:</span>
                  <span>{maxParticipants}</span>
                  <span className="text-muted-foreground">Skills Required:</span>
                  <span>{skills.length}</span>
                  <span className="text-muted-foreground">Certifications:</span>
                  <span>{certifications.length > 0 ? certifications.length : "None"}</span>
                  <span className="text-muted-foreground">Min Experience:</span>
                  <span>{minExperience} years</span>
                  <span className="text-muted-foreground">Protected Activities:</span>
                  <span>{protectedFlags.length > 0 ? protectedFlags.length : "None"}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button onClick={() => handleSave("published")} disabled={saving || !isStep3Valid}>
                    <Send className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
