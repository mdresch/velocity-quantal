"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation, FitBadge, PrivacyConsent } from "@/components/ui-components"
import { createProfile, computeMatch } from "@/lib/mock-api"
import { skillsOptions } from "@/lib/sample-data"
import { useApp } from "@/lib/context"
import type { MatchResult, Role, Certification } from "@/lib/types"
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, Loader2, Users, Handshake, BookOpen } from "lucide-react"

interface FormData {
  name: string
  email: string
  availability: string
  skills: string[]
  certifications: Certification[]
  experienceYears: number
  deviceAccess: string[]
  internetReliable: boolean
  willingToUpskill: boolean
  willingToPartnerLicensed: boolean
  preferredRoles: string[]
  languagePrefs: string[]
  consent: boolean
}

interface FormErrors {
  name?: string
  email?: string
  availability?: string
  skills?: string
  consent?: string
}

const availabilityOptions = ["30+ hrs/week", "10-20 hrs/week", "<10 hrs/week"]
const deviceOptions = ["Laptop", "Desktop", "Tablet", "Smartphone"]
const roleOptions = [
  "Project Lead",
  "Technical Contributor",
  "Mentor",
  "Reviewer",
  "Compliance Advisor",
  "Learner",
  "Support Assistant",
]
const languageOptions = ["English", "Spanish", "French", "German", "Dutch", "Mandarin", "Japanese", "Portuguese"]

export default function NewProfilePage() {
  const router = useRouter()
  const { setCurrentUser } = useApp()

  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [showPartnerFallback, setShowPartnerFallback] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    availability: "",
    skills: [],
    certifications: [],
    experienceYears: 0,
    deviceAccess: [],
    internetReliable: true,
    willingToUpskill: true,
    willingToPartnerLicensed: false,
    preferredRoles: [],
    languagePrefs: ["English"],
    consent: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [certFile, setCertFile] = useState<File | null>(null)

  const progress = (step / totalSteps) * 100

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {}

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.availability) newErrors.availability = "Select your availability"
    }

    if (currentStep === 2) {
      if (formData.skills.length < 1) newErrors.skills = "Select at least one skill"
    }

    if (currentStep === 4) {
      if (!formData.consent) newErrors.consent = "You must agree to continue"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
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

  const handleDeviceToggle = (device: string) => {
    setFormData((prev) => ({
      ...prev,
      deviceAccess: prev.deviceAccess.includes(device)
        ? prev.deviceAccess.filter((d) => d !== device)
        : [...prev.deviceAccess, device],
    }))
  }

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredRoles: prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter((r) => r !== role)
        : [...prev.preferredRoles, role],
    }))
  }

  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languagePrefs: prev.languagePrefs.includes(lang)
        ? prev.languagePrefs.filter((l) => l !== lang)
        : [...prev.languagePrefs, lang],
    }))
  }

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCertFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)

    try {
      // Create certifications from uploaded file
      const certifications: Certification[] = certFile
        ? [
            {
              id: `cert-${Date.now()}`,
              name: certFile.name.replace(/\.[^/.]+$/, ""),
              issuer: "Pending Verification",
              registryId: `PENDING-${Date.now()}`,
              issuedAt: new Date().toISOString(),
              verified: false,
            },
          ]
        : []

      // Create profile
      const response = await createProfile({
        ...formData,
        role: formData.preferredRoles.includes("Mentor")
          ? "mentor"
          : formData.preferredRoles.includes("Learner")
            ? "student"
            : ("entrepreneur" as Role),
        certifications,
      })

      // Compute match
      const match = await computeMatch({
        ...formData,
        certifications,
      })

      setMatchResult(match.data)

      // Show partner fallback if no verified cert and willing to partner
      if (certifications.length === 0 && formData.willingToPartnerLicensed) {
        setShowPartnerFallback(true)
      }

      setStep(5) // Result step
    } catch (error) {
      console.error("Error creating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Result Step
  if (step === 5 && matchResult) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Profile Created Successfully</CardTitle>
              <CardDescription>Your profile has been matched to pilot opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Match Result */}
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your Fit Score</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-4xl font-bold">{matchResult.score}%</span>
                  <FitBadge level={matchResult.fitLevel} />
                </div>
              </div>

              {/* Rationale */}
              <div>
                <h4 className="font-semibold mb-2">Match Rationale</h4>
                <ul className="space-y-2 text-sm">
                  {matchResult.rationale.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Partner Fallback Path */}
              {showPartnerFallback && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-amber-900">
                      <Handshake className="h-5 w-5" />
                      Recommended Partner Fallback Path
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-amber-800">
                    <p className="mb-3">
                      Since you don't have a verified certification but indicated willingness to partner with licensed
                      professionals, here are your options:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 mt-0.5" />
                        Connect with verified mentors for supervised work on protected activities
                      </li>
                      <li className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 mt-0.5" />
                        Explore non-protected pilot opportunities while pursuing certification
                      </li>
                      <li className="flex items-start gap-2">
                        <Handshake className="h-4 w-4 mt-0.5" />
                        Join a partner organization with existing licensed resources
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => router.push("/")}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                  Edit Profile
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
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <PageAnnotation
          title="User Elicitation Form"
          criteria={[
            "Required fields: name, email, availability, skills (top 6), experienceYears, deviceAccess, internetReliable, willingToUpskill, willingToPartnerLicensed, preferredRoles, languagePrefs, consent",
            "Optional: certifications upload",
            "Inline validation, progress bar",
            "On submit: POST /api/profile → POST /api/match",
            "Display Fit badge (High ≥75, Medium 50-74, Low <50) plus rationale",
            "If lacking verified cert + willing to partner: show recommended partner fallback path",
          ]}
        />

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "Skills & Experience"}
              {step === 3 && "Preferences & Access"}
              {step === 4 && "Certifications & Consent"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Select your top skills (up to 6)"}
              {step === 3 && "Your work preferences and device access"}
              {step === 4 && "Upload certifications and confirm your consent"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
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
              </>
            )}

            {/* Step 2: Skills & Experience */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>
                    Skills (select up to 6) <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">Selected: {formData.skills.length}/6</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                    {skillsOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                          disabled={formData.skills.length >= 6 && !formData.skills.includes(skill)}
                        />
                        <label
                          htmlFor={`skill-${skill}`}
                          className={`text-sm cursor-pointer ${
                            formData.skills.length >= 6 && !formData.skills.includes(skill)
                              ? "text-muted-foreground"
                              : ""
                          }`}
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, experienceYears: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </>
            )}

            {/* Step 3: Preferences & Access */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Preferred Roles</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={formData.preferredRoles.includes(role)}
                          onCheckedChange={() => handleRoleToggle(role)}
                        />
                        <label htmlFor={`role-${role}`} className="text-sm cursor-pointer">
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Device Access</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {deviceOptions.map((device) => (
                      <div key={device} className="flex items-center space-x-2">
                        <Checkbox
                          id={`device-${device}`}
                          checked={formData.deviceAccess.includes(device)}
                          onCheckedChange={() => handleDeviceToggle(device)}
                        />
                        <label htmlFor={`device-${device}`} className="text-sm cursor-pointer">
                          {device}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Language Preferences</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {languageOptions.map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={formData.languagePrefs.includes(lang)}
                          onCheckedChange={() => handleLanguageToggle(lang)}
                        />
                        <label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">
                          {lang}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="internet"
                      checked={formData.internetReliable}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, internetReliable: checked as boolean }))
                      }
                    />
                    <label htmlFor="internet" className="text-sm cursor-pointer">
                      I have reliable internet access
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="upskill"
                      checked={formData.willingToUpskill}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, willingToUpskill: checked as boolean }))
                      }
                    />
                    <label htmlFor="upskill" className="text-sm cursor-pointer">
                      I'm willing to learn new skills
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="partner"
                      checked={formData.willingToPartnerLicensed}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, willingToPartnerLicensed: checked as boolean }))
                      }
                    />
                    <label htmlFor="partner" className="text-sm cursor-pointer">
                      I'm willing to work with licensed partners for protected activities
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Certifications & Consent */}
            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label>Certifications (Optional)</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload licenses or certifications for verification
                    </p>
                    <Input
                      type="file"
                      onChange={handleCertUpload}
                      className="max-w-xs mx-auto"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                  {certFile && (
                    <p className="text-sm flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {certFile.name}
                    </p>
                  )}
                  <PrivacyConsent />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start space-x-2 p-4 bg-muted/50 rounded-lg">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, consent: checked as boolean }))}
                    />
                    <label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed">
                      I confirm the information provided is accurate. I consent to verification of my credentials and
                      sharing my profile with partners for pilot matching purposes. I understand that protected
                      activities may require additional licensing or partnering with licensed professionals.
                    </label>
                  </div>
                  {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex gap-2 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button onClick={handleNext} className="flex-1">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Submit & Get Match"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
