"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PageAnnotation } from "@/components/ui-components"
import { DashboardHeader } from "@/components/dashboard-header"
import { JourneyProgress } from "@/components/journey-progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/lib/context"
import { ArrowLeft, ArrowRight, Save, Loader2, HelpCircle, Upload, X, FileText, Unlock, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { StudentPhase } from "@/lib/types"

const availabilityOptions = [
  { value: "less-10", label: "<10 hrs/week" },
  { value: "10-20", label: "10-20 hrs/week" },
  { value: "20-30", label: "20-30 hrs/week" },
  { value: "30-plus", label: "30+ hrs/week" }
]

const skillsOptions = [
  "Web Development", "Mobile Development", "Data Engineering", "ML/AI",
  "Database Admin", "DevOps", "Sales", "Marketing", "Operations",
  "Accounting", "Project Management", "Legal/Compliance", "Customer Service",
  "Content Writing", "Graphic Design", "Data Entry"
]

const deviceOptions = ["Laptop", "Desktop", "Tablet", "Smartphone"]

const roleOptions = [
  "Project Lead", "Technical Contributor", "Mentor", "Reviewer",
  "Compliance Advisor", "Learner", "Support Assistant"
]

// Student phase gates
const studentPhaseGates = [
  {
    phase: "onboarding" as StudentPhase,
    requiredFields: ["firstName", "lastName", "email", "availability"],
    unlocks: ["Access to learning resources", "Basic pilot matching", "Mentor connections"]
  },
  {
    phase: "skill_building" as StudentPhase,
    requiredFields: ["skills", "deviceAccess"],
    unlocks: ["Intermediate pilots", "Skill assessments", "Portfolio creation"]
  },
  {
    phase: "portfolio_building" as StudentPhase,
    requiredFields: ["experienceYears", "preferredRoles"],
    unlocks: ["Advanced pilots", "Team projects", "Leadership opportunities"]
  },
  {
    phase: "pilot_ready" as StudentPhase,
    requiredFields: [],
    unlocks: ["Full pilot access", "Certification paths", "Revenue opportunities"]
  }
]

const getPhaseName = (phase: StudentPhase): string => {
  const names = {
    onboarding: "Onboarding",
    skill_building: "Skill Building",
    portfolio_building: "Portfolio Building",
    pilot_ready: "Pilot Ready"
  }
  return names[phase] || "Unknown Phase"
}

interface Certification {
  id: string
  name: string
  issuer: string
  registryId?: string
  issueDate?: string
  expiryDate?: string
  file?: File
}

export default function NewStudentProfilePage() {
  const router = useRouter()
  const { setCurrentUser, currentUser } = useApp()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCertModal, setShowCertModal] = useState(false)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [newCert, setNewCert] = useState<Partial<Certification>>({})
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: "",
    lastName: "",
    email: "",
    name: "",
    bio: "",
    availability: "",
    consent: false,
    
    // Step 2: Skills & Experience
    skills: [] as string[],
    skill1: 0,
    skill2: 0,
    skill3: 0,
    skill4: 0,
    experienceYears: 0,
    
    // Step 3: Optional Details
    deviceType: "",
    deviceAccess: [] as string[],
    internetConnection: "",
    internetReliable: false,
    willingToUpskill: false,
    willingToPartnerLicensed: false,
    preferredRoles: [] as string[],
    languages: [] as string[],
    portfolioUrl: "",
    linkedinUrl: "",
    timezone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('studentProfileDraft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        setFormData(parsed.formData || formData)
        setCurrentStep(parsed.currentStep || 1)
        setCertifications(parsed.certifications || [])
      } catch (e) {
        console.error('Failed to load draft:', e)
      }
    }
  }, [])

  // Save draft to localStorage
  const saveDraft = () => {
    const draft = {
      formData,
      currentStep,
      certifications,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('studentProfileDraft', JSON.stringify(draft))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.availability) newErrors.availability = "Please select your availability"
      if (!formData.consent) newErrors.consent = "You must consent to continue"
    }

    if (step === 2) {
      const skills = [formData.skill1, formData.skill2, formData.skill3, formData.skill4]
      if (skills.some(s => s < 0 || s > 5)) newErrors.skills = "Skills must be rated 0-5"
      if (formData.experienceYears < 0) newErrors.experienceYears = "Experience years must be 0 or greater"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      saveDraft()
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleAddCertification = () => {
    if (newCert.name && newCert.issuer) {
      const cert: Certification = {
        id: Date.now().toString(),
        name: newCert.name,
        issuer: newCert.issuer,
        registryId: newCert.registryId,
        issueDate: newCert.issueDate,
        expiryDate: newCert.expiryDate,
        file: newCert.file
      }
      setCertifications(prev => [...prev, cert])
      setNewCert({})
      setShowCertModal(false)
    }
  }

  const handleRemoveCertification = (id: string) => {
    setCertifications(prev => prev.filter(c => c.id !== id))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear draft
      localStorage.removeItem('studentProfileDraft')
      
      // Navigate to results page or dashboard
      router.push("/dashboard/student")
    } catch (error) {
      console.error('Failed to submit profile:', error)
    } finally {
      setIsSubmitting(false)
    }
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

  // Determine current phase based on step (simplified mapping)
  const currentPhase: StudentPhase = currentStep === 1 ? "onboarding" :
                                     currentStep === 2 ? "skill_building" :
                                     currentStep === 3 ? "portfolio_building" : "pilot_ready"
  
  const phaseIndex = studentPhaseGates.findIndex(g => g.phase === currentPhase)
  const currentGate = studentPhaseGates[phaseIndex]
  const completedPhases = studentPhaseGates.slice(0, phaseIndex).map(g => g.phase)
  const progress = ((phaseIndex + 1) / studentPhaseGates.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/student")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Student Portal
        </Button>

        <PageAnnotation
          title="Student Profile - Phase-Gated Onboarding"
          criteria={[
            `Current Phase: ${getPhaseName(currentPhase)}`,
            "Progressive disclosure based on learning journey",
            "Skills and device info only requested in Skill Building phase",
            "Portfolio preferences only in Portfolio Building phase",
          ]}
        />

        {/* Journey Progress */}
        <div className="mb-6">
          <JourneyProgress
            role="student"
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
                  {currentPhase === "onboarding" && "Basic information to get started"}
                  {currentPhase === "skill_building" && "Tell us about your skills and setup"}
                  {currentPhase === "portfolio_building" && "Set your growth preferences"}
                  {currentPhase === "pilot_ready" && "You are ready for advanced pilots"}
                </CardDescription>
              </div>
              <Badge variant="outline">
                Phase {phaseIndex + 1} of {studentPhaseGates.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Phase 1: Onboarding */}
            {currentPhase === "onboarding" && (
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
                    onValueChange={(value: string) => setFormData((prev) => ({ ...prev, availability: value }))}
                  >
                    {availabilityOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`avail-${option.value}`} />
                        <label htmlFor={`avail-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
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
                    placeholder="Tell us about yourself and your learning goals..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked: boolean) => setFormData((prev) => ({ ...prev, consent: checked }))}
                  />
                  <label htmlFor="consent" className="text-sm cursor-pointer">
                    I consent to evidence verification and partner sharing for matching purposes
                  </label>
                </div>
                {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
              </>
            )}

            {/* Phase 2: Skill Building */}
            {currentPhase === "skill_building" && (
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
                    Skills (select 3-6) <span className="text-destructive">*</span>
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

                <div className="space-y-2">
                  <Label>
                    Device Access <span className="text-destructive">*</span>
                  </Label>
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
                  {errors.deviceAccess && <p className="text-sm text-destructive">{errors.deviceAccess}</p>}
                </div>

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

                <div className="space-y-2">
                  <Label>Preferred Roles (Optional)</Label>
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
              </>
            )}

            {/* Phase 3: Portfolio Building */}
            {currentPhase === "portfolio_building" && (
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

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="upskill"
                      checked={formData.willingToUpskill}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, willingToUpskill: checked as boolean }))
                      }
                    />
                    <label htmlFor="upskill" className="text-sm cursor-pointer">
                      I am willing to learn new skills for pilot opportunities
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
                      I am willing to partner with licensed professionals for protected activities
                    </label>
                  </div>
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
                  <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
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
              </>
            )}

            {/* Phase 4: Pilot Ready (celebration/summary) */}
            {currentPhase === "pilot_ready" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">You are Pilot Ready!</h3>
                <p className="text-muted-foreground mb-6">
                  You have completed all required phases and can now access all student features.
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
                onClick={handlePrevious}
                disabled={phaseIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete & Go to Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="text-center pt-2">
              <Button variant="link" size="sm" onClick={() => router.push("/dashboard/student")}>
                Save progress and continue later
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
