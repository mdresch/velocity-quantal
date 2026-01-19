"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation, PrivacyConsent } from "@/components/ui-components"
import { JourneyProgress } from "@/components/journey-progress"
import { useApp } from "@/lib/context"
import { mentorPhaseGates, getPhaseName, getPhaseIndex } from "@/lib/journey-phases"
import type { MentorPhase } from "@/lib/types"
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, Loader2, Unlock } from "lucide-react"

const availabilityOptions = ["30+ hrs/week", "10-20 hrs/week", "<10 hrs/week"]
const specializationOptions = [
  "Clinical Research",
  "Medical Devices",
  "Regulatory Compliance",
  "Quality Assurance",
  "Data Analysis",
  "Financial Services",
  "Legal Documentation",
  "Training & Education",
]
const jurisdictionOptions = ["United States", "Canada", "European Union", "United Kingdom", "Australia", "Singapore"]

export default function NewMentorProfilePage() {
  const router = useRouter()
  const { setCurrentUser } = useApp()

  const [currentPhase, setCurrentPhase] = useState<MentorPhase>("registration")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Phase 1: Registration
    name: "",
    email: "",
    availability: "",
    bio: "",
    consent: false,
    // Phase 2: Credential Verification
    certifications: [] as File[],
    jurisdictionsServed: [] as string[],
    specializations: [] as string[],
    linkedinUrl: "",
    mentoringSince: "",
    // Phase 3: Active Mentoring
    maxMenteesPerMonth: 5,
    hourlyRate: 0,
    portfolioUrl: "",
    timezone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentGate = mentorPhaseGates.find((g) => g.phase === currentPhase)!
  const phaseIndex = getPhaseIndex("mentor", currentPhase)
  const completedPhases = mentorPhaseGates.slice(0, phaseIndex).map((g) => g.phase as MentorPhase)

  const validateCurrentPhase = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentPhase === "registration") {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.availability) newErrors.availability = "Select your availability"
      if (!formData.consent) newErrors.consent = "You must agree to continue"
    }

    if (currentPhase === "credential_verification") {
      if (formData.jurisdictionsServed.length === 0) newErrors.jurisdictionsServed = "Select at least one jurisdiction"
      if (formData.specializations.length === 0) newErrors.specializations = "Select at least one specialization"
    }

    if (currentPhase === "active_mentoring") {
      if (formData.maxMenteesPerMonth < 1) newErrors.maxMenteesPerMonth = "Must accept at least 1 mentee"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdvancePhase = () => {
    if (!validateCurrentPhase()) return

    const nextPhase = currentGate.nextPhase as MentorPhase | undefined
    if (nextPhase) {
      setCurrentPhase(nextPhase)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/dashboard/mentor")
  }

  const handleJurisdictionToggle = (jurisdiction: string) => {
    setFormData((prev) => ({
      ...prev,
      jurisdictionsServed: prev.jurisdictionsServed.includes(jurisdiction)
        ? prev.jurisdictionsServed.filter((j) => j !== jurisdiction)
        : [...prev.jurisdictionsServed, jurisdiction],
    }))
  }

  const handleSpecializationToggle = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : prev.specializations.length < 4
          ? [...prev.specializations, spec]
          : prev.specializations,
    }))
  }

  const progress = ((phaseIndex + 1) / mentorPhaseGates.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/mentor")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mentor Portal
        </Button>

        <PageAnnotation
          title="Mentor Profile - Phase-Gated Onboarding"
          criteria={[
            `Current Phase: ${getPhaseName(currentPhase)}`,
            "Only requests information relevant to current phase",
            "Progressive disclosure - unlock features as you progress",
            "Can save and return to continue later",
          ]}
        />

        {/* Journey Progress */}
        <div className="mb-6">
          <JourneyProgress
            role="mentor"
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
                  {currentPhase === "registration" && "Basic information to get started"}
                  {currentPhase === "credential_verification" && "Verify your professional credentials"}
                  {currentPhase === "active_mentoring" && "Set your mentoring preferences"}
                  {currentPhase === "trusted_advisor" && "You have achieved trusted advisor status"}
                </CardDescription>
              </div>
              <Badge variant="outline">
                Phase {phaseIndex + 1} of {mentorPhaseGates.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Phase 1: Registration */}
            {currentPhase === "registration" && (
              <>
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

                <div className="space-y-2">
                  <Label>
                    Availability <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.availability}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, availability: value }))}
                  >
                    {availabilityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`avail-${option}`} />
                        <label htmlFor={`avail-${option}`} className="text-sm cursor-pointer">
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.availability && <p className="text-sm text-destructive">{errors.availability}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about your background and expertise..."
                    rows={3}
                  />
                </div>

                <PrivacyConsent
                  checked={formData.consent}
                  onChange={(checked) => setFormData((prev) => ({ ...prev, consent: checked }))}
                />
                {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
              </>
            )}

            {/* Phase 2: Credential Verification */}
            {currentPhase === "credential_verification" && (
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
                    Jurisdictions Served <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {jurisdictionOptions.map((jurisdiction) => (
                      <div key={jurisdiction} className="flex items-center space-x-2">
                        <Checkbox
                          id={`jurisdiction-${jurisdiction}`}
                          checked={formData.jurisdictionsServed.includes(jurisdiction)}
                          onCheckedChange={() => handleJurisdictionToggle(jurisdiction)}
                        />
                        <label htmlFor={`jurisdiction-${jurisdiction}`} className="text-sm cursor-pointer">
                          {jurisdiction}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.jurisdictionsServed && (
                    <p className="text-sm text-destructive">{errors.jurisdictionsServed}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Specializations (up to 4) <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">Selected: {formData.specializations.length}/4</p>
                  <div className="grid grid-cols-2 gap-2">
                    {specializationOptions.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={`spec-${spec}`}
                          checked={formData.specializations.includes(spec)}
                          onCheckedChange={() => handleSpecializationToggle(spec)}
                          disabled={formData.specializations.length >= 4 && !formData.specializations.includes(spec)}
                        />
                        <label
                          htmlFor={`spec-${spec}`}
                          className={`text-sm cursor-pointer ${
                            formData.specializations.length >= 4 && !formData.specializations.includes(spec)
                              ? "text-muted-foreground"
                              : ""
                          }`}
                        >
                          {spec}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.specializations && <p className="text-sm text-destructive">{errors.specializations}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Upload Certifications</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your certification files here, or click to browse
                    </p>
                    <input type="file" className="hidden" multiple accept=".pdf,.jpg,.png" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mentoringSince">Mentoring Since (Optional)</Label>
                  <Input
                    id="mentoringSince"
                    type="date"
                    value={formData.mentoringSince}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mentoringSince: e.target.value }))}
                  />
                </div>
              </>
            )}

            {/* Phase 3: Active Mentoring */}
            {currentPhase === "active_mentoring" && (
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
                  <Label htmlFor="maxMentees">
                    Maximum Mentees per Month <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="maxMentees"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.maxMenteesPerMonth}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, maxMenteesPerMonth: Number.parseInt(e.target.value) || 1 }))
                    }
                    className={errors.maxMenteesPerMonth ? "border-destructive" : ""}
                  />
                  {errors.maxMenteesPerMonth && <p className="text-sm text-destructive">{errors.maxMenteesPerMonth}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hourlyRate: Number.parseInt(e.target.value) || 0 }))
                    }
                    placeholder="0 for volunteer"
                  />
                  <p className="text-xs text-muted-foreground">Enter 0 if you are volunteering your time</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone (Optional)</Label>
                  <Input
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timezone: e.target.value }))}
                    placeholder="e.g., America/New_York, Europe/London"
                  />
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  const prevIndex = phaseIndex - 1
                  if (prevIndex >= 0) {
                    setCurrentPhase(mentorPhaseGates[prevIndex].phase as MentorPhase)
                  }
                }}
                disabled={phaseIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button onClick={handleAdvancePhase} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : currentGate.nextPhase ? (
                  <>
                    Continue to {getPhaseName(currentGate.nextPhase)}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Complete Profile
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Skip to Dashboard option */}
            {phaseIndex > 0 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm" onClick={() => router.push("/dashboard/mentor")}>
                  Save progress and continue later
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
