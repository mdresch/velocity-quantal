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
import { skillsOptions, jurisdictionOptions } from "@/lib/sample-data"
import { entrepreneurPhaseGates, getPhaseName, getPhaseIndex } from "@/lib/journey-phases"
import type { EntrepreneurPhase } from "@/lib/types"
import { ArrowLeft, ArrowRight, Loader2, Unlock, Rocket } from "lucide-react"

const availabilityOptions = ["30+ hrs/week", "10-20 hrs/week", "<10 hrs/week"]
const fundingStageOptions = ["Pre-seed", "Seed", "Series A", "Series B+", "Bootstrapped", "Not seeking funding"]
const targetMarketOptions = ["B2B", "B2C", "B2B2C", "Government", "Non-profit", "Mixed"]

export default function NewEntrepreneurProfilePage() {
  const router = useRouter()
  const { setCurrentUser } = useApp()

  const [currentPhase, setCurrentPhase] = useState<EntrepreneurPhase>("idea_stage")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Phase 1: Idea Stage
    name: "",
    email: "",
    bio: "",
    businessName: "",
    consent: false,
    // Phase 2: Planning
    availability: "",
    businessDescription: "",
    targetMarket: "",
    linkedinUrl: "",
    fundingStage: "",
    teamSize: 1,
    // Phase 3: Active Pilot
    skills: [] as string[],
    jurisdictionsServed: [] as string[],
    hourlyRate: 0,
    timezone: "",
    portfolioUrl: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentGate = entrepreneurPhaseGates.find((g) => g.phase === currentPhase)!
  const phaseIndex = getPhaseIndex("entrepreneur", currentPhase)
  const completedPhases = entrepreneurPhaseGates.slice(0, phaseIndex).map((g) => g.phase as EntrepreneurPhase)

  const validateCurrentPhase = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentPhase === "idea_stage") {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.consent) newErrors.consent = "You must agree to continue"
    }

    if (currentPhase === "planning") {
      if (!formData.availability) newErrors.availability = "Select your availability"
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
      if (!formData.businessDescription.trim()) newErrors.businessDescription = "Business description is required"
      if (!formData.targetMarket) newErrors.targetMarket = "Select target market"
    }

    if (currentPhase === "active_pilot") {
      if (formData.skills.length < 1) newErrors.skills = "Select at least one skill"
      if (formData.jurisdictionsServed.length === 0) newErrors.jurisdictionsServed = "Select at least one jurisdiction"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdvancePhase = () => {
    if (!validateCurrentPhase()) return

    const nextPhase = currentGate.nextPhase as EntrepreneurPhase | undefined
    if (nextPhase) {
      setCurrentPhase(nextPhase)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/dashboard/entrepreneur")
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : prev.skills.length < 6
          ? [...prev.skills, skill]
          : prev.skills,
    }))
  }

  const handleJurisdictionToggle = (jurisdiction: string) => {
    setFormData((prev) => ({
      ...prev,
      jurisdictionsServed: prev.jurisdictionsServed.includes(jurisdiction)
        ? prev.jurisdictionsServed.filter((j) => j !== jurisdiction)
        : [...prev.jurisdictionsServed, jurisdiction],
    }))
  }

  const progress = ((phaseIndex + 1) / entrepreneurPhaseGates.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/entrepreneur")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Entrepreneur Portal
        </Button>

        <PageAnnotation
          title="Entrepreneur Profile - Phase-Gated Onboarding"
          criteria={[
            `Current Phase: ${getPhaseName(currentPhase)}`,
            "Idea Stage: minimal info to browse platform",
            "Planning: business context for pilot drafts",
            "Active Pilot: skills and jurisdictions for team building",
          ]}
        />

        {/* Journey Progress */}
        <div className="mb-6">
          <JourneyProgress
            role="entrepreneur"
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
                  {currentPhase === "idea_stage" && "Basic information to explore the platform"}
                  {currentPhase === "planning" && "Define your business and pilot context"}
                  {currentPhase === "active_pilot" && "Set up for team building and pilot submission"}
                  {currentPhase === "scaling" && "You are ready to scale your operations"}
                </CardDescription>
              </div>
              <Badge variant="outline">
                Phase {phaseIndex + 1} of {entrepreneurPhaseGates.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Phase 1: Idea Stage */}
            {currentPhase === "idea_stage" && (
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
                  <Label htmlFor="businessName">Business Name (Optional)</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your company or project name"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can add this later when you are ready to create pilots
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself and your entrepreneurial journey..."
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

            {/* Phase 2: Planning */}
            {currentPhase === "planning" && (
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
                  <Label htmlFor="businessName2">
                    Business Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="businessName2"
                    value={formData.businessName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your company or project name"
                    className={errors.businessName ? "border-destructive" : ""}
                  />
                  {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">
                    Business Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, businessDescription: e.target.value }))}
                    placeholder="Describe your business, product, or service..."
                    rows={3}
                    className={errors.businessDescription ? "border-destructive" : ""}
                  />
                  {errors.businessDescription && (
                    <p className="text-sm text-destructive">{errors.businessDescription}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Target Market <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.targetMarket}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, targetMarket: value }))}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {targetMarketOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`market-${option}`} />
                          <label htmlFor={`market-${option}`} className="text-sm cursor-pointer">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  {errors.targetMarket && <p className="text-sm text-destructive">{errors.targetMarket}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundingStage">Funding Stage (Optional)</Label>
                  <RadioGroup
                    value={formData.fundingStage}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, fundingStage: value }))}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {fundingStageOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`funding-${option}`} />
                          <label htmlFor={`funding-${option}`} className="text-sm cursor-pointer">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size (Optional)</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min="1"
                    value={formData.teamSize}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, teamSize: Number.parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
              </>
            )}

            {/* Phase 3: Active Pilot */}
            {currentPhase === "active_pilot" && (
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
                    Your Skills (select up to 6) <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">Selected: {formData.skills.length}/6</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                    {skillsOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                          disabled={formData.skills.length >= 6 && !formData.skills.includes(skill)}
                        />
                        <label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer truncate">
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
                </div>

                <div className="space-y-2">
                  <Label>
                    Operating Jurisdictions <span className="text-destructive">*</span>
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
                  <Label htmlFor="timezone">Timezone (Optional)</Label>
                  <Input
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timezone: e.target.value }))}
                    placeholder="e.g., America/New_York"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Website/Portfolio (Optional)</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </>
            )}

            {/* Phase 4: Scaling */}
            {currentPhase === "scaling" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Scale!</h3>
                <p className="text-muted-foreground mb-6">
                  You have completed all phases and can now access advanced features for scaling.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentGate.unlocks.map((unlock) => (
                    <Badge key={unlock} className="bg-green-100 text-green-800 border-green-200">
                      {unlock}
                    </Badge>
                  ))}
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
                    setCurrentPhase(entrepreneurPhaseGates[prevIndex].phase as EntrepreneurPhase)
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
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {phaseIndex > 0 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm" onClick={() => router.push("/dashboard/entrepreneur")}>
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
