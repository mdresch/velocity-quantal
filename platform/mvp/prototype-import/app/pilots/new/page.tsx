"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation, PrivacyConsent, FitBadge, ProtectedLabel } from "@/components/ui-components"
import { createPilot, uploadEvidence, computeMatch } from "@/lib/mock-api"
import { protectedActivityOptions, jurisdictionOptions } from "@/lib/sample-data"
import { useApp } from "@/lib/context"
import type { MatchResult } from "@/lib/types"
import { Upload, AlertTriangle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react"

interface FormData {
  title: string
  description: string
  jurisdictions: string[]
  protectedActivityFlags: string[]
  expectedKPIs: string
  attachments: File[]
  partnerFallbackNote: string
  consent: boolean
}

interface FormErrors {
  title?: string
  description?: string
  jurisdictions?: string
  protectedActivityFlags?: string
  consent?: string
  evidence?: string
}

export default function NewPilotPage() {
  const router = useRouter()
  const { currentUser } = useApp()

  const [step, setStep] = useState<"form" | "optional" | "result">("form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [createdPilotId, setCreatedPilotId] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    jurisdictions: [],
    protectedActivityFlags: [],
    expectedKPIs: "",
    attachments: [],
    partnerFallbackNote: "",
    consent: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const isProtected = formData.protectedActivityFlags.length > 0
  const hasEvidence = formData.attachments.length > 0
  const hasPartnerFallback = formData.partnerFallbackNote.trim().length > 0

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.jurisdictions.length === 0) {
      newErrors.jurisdictions = "Select at least one jurisdiction"
    }

    if (!formData.consent) {
      newErrors.consent = "You must agree to the terms"
    }

    // Protected activity validation - require evidence OR partner fallback
    if (isProtected && !hasEvidence && !hasPartnerFallback) {
      newErrors.evidence = "Protected activities require evidence upload OR a partner-licensed fallback note"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleJurisdictionToggle = (jurisdiction: string) => {
    setFormData((prev) => ({
      ...prev,
      jurisdictions: prev.jurisdictions.includes(jurisdiction)
        ? prev.jurisdictions.filter((j) => j !== jurisdiction)
        : [...prev.jurisdictions, jurisdiction],
    }))
  }

  const handleProtectedActivityToggle = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      protectedActivityFlags: prev.protectedActivityFlags.includes(activity)
        ? prev.protectedActivityFlags.filter((a) => a !== activity)
        : [...prev.protectedActivityFlags, activity],
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)],
      }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Create pilot
      const pilotResponse = await createPilot({
        title: formData.title,
        description: formData.description,
        ownerId: currentUser?.id || "anonymous",
        ownerName: currentUser?.name || "Anonymous User",
        jurisdictions: formData.jurisdictions,
        protectedActivityFlags: formData.protectedActivityFlags,
        expectedKPIs: formData.expectedKPIs,
        fitBadge: currentUser?.matchResult?.fitLevel,
        partnerFallbackNote: hasPartnerFallback ? formData.partnerFallbackNote : undefined,
      })

      setCreatedPilotId(pilotResponse.data.pilotId)

      // Upload evidence files
      for (const file of formData.attachments) {
        await uploadEvidence(pilotResponse.data.pilotId, {
          filename: file.name,
          issuer: "Pending Verification",
          registryId: `PENDING-${Date.now()}`,
          issuedAt: new Date().toISOString(),
          checksum: `sha256:${Math.random().toString(36).substr(2, 16)}`,
          fileUrl: `/mock/uploads/${file.name}`,
          mimeType: file.type,
        })
      }

      // Compute match
      if (currentUser) {
        const match = await computeMatch(currentUser)
        setMatchResult(match.data)
      }

      setStep("result")
    } catch (error) {
      console.error("Error submitting pilot:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === "result") {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 max-w-2xl">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-900">Pilot Submitted Successfully</CardTitle>
              <CardDescription className="text-green-700">
                Your pilot "{formData.title}" has been submitted for review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {matchResult && (
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    Match Result
                    <FitBadge level={matchResult.fitLevel} showScore score={matchResult.score} />
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {matchResult.rationale.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isProtected && hasPartnerFallback && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This pilot includes protected activities. A partner fallback has been noted for compliance review.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => router.push(`/evidence/${createdPilotId}`)}>
                  View Evidence
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <PageAnnotation
          title="Pilot Submission Form"
          criteria={[
            "Fields: title, description, ownerId, jurisdictions[], protectedActivityFlags[], expected KPIs, attachments",
            "Progressive disclosure: require only scored fields up front; optional profile fields later",
            "If protectedActivityFlags checked, require evidence upload OR partner-licensed fallback note",
            "Inline validation; consent checkbox required",
            "On submit: POST /api/pilots → POST /api/pilots/:id/evidence → POST /api/match",
            "AC: Cannot submit protected pilot without evidence or partner-fallback note",
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Submit New Pilot</CardTitle>
            <CardDescription>
              {step === "form"
                ? "Provide required information about your pilot opportunity"
                : "Add optional details and attachments"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "form" && (
              <>
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Pilot Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Clinical Data Collection Pilot"
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the pilot objectives, tasks, and requirements..."
                    rows={4}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                {/* Jurisdictions */}
                <div className="space-y-2">
                  <Label>
                    Jurisdictions <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {jurisdictionOptions.map((j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <Checkbox
                          id={`jurisdiction-${j}`}
                          checked={formData.jurisdictions.includes(j)}
                          onCheckedChange={() => handleJurisdictionToggle(j)}
                        />
                        <label htmlFor={`jurisdiction-${j}`} className="text-sm cursor-pointer">
                          {j}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.jurisdictions && <p className="text-sm text-destructive">{errors.jurisdictions}</p>}
                </div>

                {/* Expected KPIs */}
                <div className="space-y-2">
                  <Label htmlFor="kpis">Expected KPIs</Label>
                  <Input
                    id="kpis"
                    value={formData.expectedKPIs}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expectedKPIs: e.target.value }))}
                    placeholder="e.g., 500 records/month, 99% accuracy"
                  />
                </div>

                <Button onClick={() => setStep("optional")} className="w-full">
                  Continue to Optional Details
                </Button>
              </>
            )}

            {step === "optional" && (
              <>
                {/* Protected Activity Flags */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Protected Activity Flags
                    <span className="text-xs text-muted-foreground">(check if applicable)</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    {protectedActivityOptions.map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`activity-${activity}`}
                          checked={formData.protectedActivityFlags.includes(activity)}
                          onCheckedChange={() => handleProtectedActivityToggle(activity)}
                        />
                        <label htmlFor={`activity-${activity}`} className="text-sm cursor-pointer">
                          {activity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Protected Activity Warning */}
                {isProtected && (
                  <div className="space-y-4">
                    <ProtectedLabel />

                    <Alert variant="destructive" className="bg-amber-50 border-amber-300 text-amber-900">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Protected activities require at least one of:
                        <br />• Evidence upload (license, certification)
                        <br />• Partner-licensed fallback note
                      </AlertDescription>
                    </Alert>

                    {/* Evidence Upload */}
                    <div className="space-y-2">
                      <Label>Upload Evidence</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload licenses, certifications, or other supporting documents
                        </p>
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="max-w-xs mx-auto"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                      </div>
                      {formData.attachments.length > 0 && (
                        <ul className="text-sm space-y-1">
                          {formData.attachments.map((file, i) => (
                            <li key={i} className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      <PrivacyConsent />
                    </div>

                    {/* Partner Fallback Note */}
                    <div className="space-y-2">
                      <Label htmlFor="fallback">Partner-Licensed Fallback Note</Label>
                      <Textarea
                        id="fallback"
                        value={formData.partnerFallbackNote}
                        onChange={(e) => setFormData((prev) => ({ ...prev, partnerFallbackNote: e.target.value }))}
                        placeholder="Describe how a licensed partner will handle protected activities..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Required if no evidence is uploaded for protected activities
                      </p>
                    </div>

                    {errors.evidence && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{errors.evidence}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Non-protected: Optional evidence */}
                {!isProtected && (
                  <div className="space-y-2">
                    <Label>Attachments (Optional)</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload supporting documents</p>
                      <Input type="file" multiple onChange={handleFileChange} className="max-w-xs mx-auto" />
                    </div>
                    {formData.attachments.length > 0 && (
                      <ul className="text-sm space-y-1">
                        {formData.attachments.map((file, i) => (
                          <li key={i} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <PrivacyConsent />
                  </div>
                )}

                {/* Consent */}
                <div className="flex items-start space-x-2 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, consent: checked as boolean }))}
                  />
                  <label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed">
                    I confirm the information provided is accurate and I consent to verification and sharing with
                    partners for pilot matching purposes.
                  </label>
                </div>
                {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Pilot"
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
