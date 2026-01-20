"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation, PrivacyConsent } from "@/components/ui-components"
import { JourneyProgress } from "@/components/journey-progress"
import { useApp } from "@/lib/context"
import { adminPhaseGates, getPhaseName, getPhaseIndex } from "@/lib/journey-phases"
import type { AdminPhase } from "@/lib/types"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Unlock, Shield, AlertTriangle } from "lucide-react"

const specializationOptions = [
  "Compliance Review",
  "License Verification",
  "User Management",
  "Data Analysis",
  "Security Audit",
  "Technical Support",
]

export default function NewAdminProfilePage() {
  const router = useRouter()
  const { setCurrentUser } = useApp()

  const [currentPhase, setCurrentPhase] = useState<AdminPhase>("observer")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Phase 1: Observer
    name: "",
    email: "",
    consent: false,
    // Phase 2: Reviewer
    specializations: [] as string[],
    timezone: "",
    bio: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentGate = adminPhaseGates.find((g) => g.phase === currentPhase)!
  const phaseIndex = getPhaseIndex("admin", currentPhase)
  const completedPhases = adminPhaseGates.slice(0, phaseIndex).map((g) => g.phase as AdminPhase)

  const validateCurrentPhase = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentPhase === "observer") {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.consent) newErrors.consent = "You must agree to continue"
    }

    if (currentPhase === "reviewer") {
      if (formData.specializations.length === 0) newErrors.specializations = "Select at least one specialization"
      if (!formData.timezone.trim()) newErrors.timezone = "Timezone is required for scheduling"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdvancePhase = () => {
    if (!validateCurrentPhase()) return

    const nextPhase = currentGate.nextPhase as AdminPhase | undefined
    if (nextPhase) {
      setCurrentPhase(nextPhase)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/dashboard/admin")
  }

  const handleSpecializationToggle = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }))
  }

  const progress = ((phaseIndex + 1) / adminPhaseGates.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/admin")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Portal
        </Button>

        <PageAnnotation
          title="Admin Profile - Progressive Access Levels"
          criteria={[
            `Current Access Level: ${getPhaseName(currentPhase)}`,
            "Observer: read-only access to start",
            "Reviewer: requires specializations and timezone",
            "Full Admin: by appointment only",
          ]}
        />

        {/* Journey Progress */}
        <div className="mb-6">
          <JourneyProgress
            role="admin"
            currentPhase={currentPhase}
            completedPhases={completedPhases}
            completionPercentage={Math.round(progress)}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{getPhaseName(currentPhase)}</CardTitle>
                <CardDescription>
                  {currentPhase === "observer" && "Basic information for read-only access"}
                  {currentPhase === "reviewer" && "Additional details for review capabilities"}
                  {currentPhase === "full_admin" && "Full administrative access granted"}
                </CardDescription>
              </div>
              <Badge variant="outline">
                Level {phaseIndex + 1} of {adminPhaseGates.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Phase 1: Observer */}
            {currentPhase === "observer" && (
              <>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Security Notice</p>
                      <p className="text-sm text-blue-700">
                        Admin access is granted progressively. You will start with Observer access (read-only) and can
                        request higher access levels after demonstrating competence.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <PrivacyConsent
                  checked={formData.consent}
                  onChange={(checked) => setFormData((prev) => ({ ...prev, consent: checked }))}
                />
                {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
              </>
            )}

            {/* Phase 2: Reviewer */}
            {currentPhase === "reviewer" && (
              <>
                <div className="p-4 bg-muted/50 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Unlock className="h-4 w-4 text-green-500" />
                    Completing this phase unlocks:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentGate.unlocks.map((unlock) => (
                      <Badge key={unlock} variant="outline" className="text-xs">
                        {unlock}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Review Specializations <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {specializationOptions.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={`spec-${spec}`}
                          checked={formData.specializations.includes(spec)}
                          onCheckedChange={() => handleSpecializationToggle(spec)}
                        />
                        <label htmlFor={`spec-${spec}`} className="text-sm cursor-pointer">
                          {spec}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.specializations && <p className="text-sm text-destructive">{errors.specializations}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">
                    Timezone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timezone: e.target.value }))}
                    placeholder="e.g., America/New_York, Europe/London"
                    className={errors.timezone ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Required for review assignment scheduling</p>
                  {errors.timezone && <p className="text-sm text-destructive">{errors.timezone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe your background and admin experience..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Phase 3: Full Admin */}
            {currentPhase === "full_admin" && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">Appointment Required</p>
                      <p className="text-sm text-amber-700">
                        Full Admin access is granted by appointment from the platform owner. This access level cannot be
                        self-requested through the profile form.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Full Admin Access</h3>
                  <p className="text-muted-foreground mb-6">
                    If you have been appointed as a Full Admin, your access will be configured by the platform owner.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentGate.unlocks.map((unlock) => (
                      <Badge key={unlock} variant="outline">
                        {unlock}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  const prevIndex = phaseIndex - 1
                  if (prevIndex >= 0) {
                    setCurrentPhase(adminPhaseGates[prevIndex].phase as AdminPhase)
                  }
                }}
                disabled={phaseIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentPhase !== "full_admin" && (
                <Button onClick={handleAdvancePhase} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : currentGate.nextPhase && currentGate.nextPhase !== "full_admin" ? (
                    <>
                      Continue to {getPhaseName(currentGate.nextPhase)}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete & Access Dashboard
                      <CheckCircle2 className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}

              {currentPhase === "full_admin" && (
                <Button onClick={() => router.push("/dashboard/admin")}>
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
