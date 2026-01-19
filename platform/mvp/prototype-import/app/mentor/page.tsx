"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp, getSampleUserForRole } from "@/lib/context"
import { PageAnnotation } from "@/components/ui-components"
import { mentorPhaseGates, getPhaseName } from "@/lib/journey-phases"
import {
  Users,
  FileCheck,
  Shield,
  ArrowRight,
  BookOpen,
  Award,
  Eye,
  MessageSquare,
  CheckCircle2,
  Lock,
} from "lucide-react"

const mentorBenefits = [
  {
    icon: FileCheck,
    title: "Review & Verify",
    description: "Evaluate pilot submissions and verify professional licenses through our secure evidence portal",
  },
  {
    icon: Users,
    title: "Guide Participants",
    description: "Support students and entrepreneurs with your expertise as they navigate protected activities",
  },
  {
    icon: Shield,
    title: "Ensure Compliance",
    description: "Your licensed supervision enables compliant execution of regulated pilot activities",
  },
  {
    icon: Award,
    title: "Build Reputation",
    description: "Track your mentoring impact and build a verified portfolio of successful pilot guidance",
  },
]

const onboardingSteps = [
  { step: 1, title: "Verify Credentials", description: "Submit your professional licenses for verification" },
  { step: 2, title: "Set Availability", description: "Define your hours and jurisdiction coverage" },
  { step: 3, title: "Browse Pilots", description: "Discover opportunities matched to your expertise" },
  { step: 4, title: "Start Mentoring", description: "Accept assignments and guide participants" },
]

export default function MentorLandingPage() {
  const router = useRouter()
  const { setCurrentRole, setCurrentUser } = useApp()

  const handleGetStarted = () => {
    setCurrentRole("mentor")
    setCurrentUser(getSampleUserForRole("mentor"))
    router.push("/profile/mentor/new")
  }

  const handleGoToDashboard = () => {
    setCurrentRole("mentor")
    setCurrentUser(getSampleUserForRole("mentor"))
    router.push("/dashboard/mentor")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VQ</span>
            </div>
            <span className="font-semibold text-lg">Velocity Quantal</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              All Roles
            </Button>
            <Button size="sm" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-card to-background border-b">
        <div className="container mx-auto px-4 py-16">
          <PageAnnotation
            title="Mentor Landing Page"
            criteria={[
              "Role-specific entry point for mentors",
              "Progressive profile completion with phase gates",
              "Clear journey visualization with unlockable features",
              "Phase-specific information requests",
            ]}
          />

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Mentor Portal
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
              Guide the Next Generation of Innovators
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              As a licensed professional, your expertise enables compliant pilot execution. Progress through your mentor
              journey to unlock advanced features and build your reputation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleGoToDashboard}>
                Explore Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Your Mentor Journey</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Complete each phase to unlock new capabilities. We only ask for information when you need it.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {mentorPhaseGates.map((gate, index) => (
              <Card
                key={gate.phase}
                className={`transition-all ${index === 0 ? "border-primary shadow-md" : "opacity-80"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                      `}
                      >
                        {index === 0 ? <span className="font-bold">{index + 1}</span> : <Lock className="h-4 w-4" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{getPhaseName(gate.phase)}</CardTitle>
                        <CardDescription className="text-sm">{gate.completionCriteria[0]}</CardDescription>
                      </div>
                    </div>
                    {index === 0 && <Badge className="bg-primary/10 text-primary border-0">Current Phase</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Required Fields */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Information Needed
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {gate.requiredFields.length > 0 ? (
                          gate.requiredFields.map((field) => (
                            <Badge key={field} variant="outline" className="text-xs font-normal capitalize">
                              {field.replace(/([A-Z])/g, " $1").trim()}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No additional information required</span>
                        )}
                      </div>
                    </div>

                    {/* Unlocks */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Unlocks</p>
                      <div className="space-y-1">
                        {gate.unlocks.slice(0, 3).map((unlock, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>{unlock}</span>
                          </div>
                        ))}
                        {gate.unlocks.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{gate.unlocks.length - 3} more features
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Your Role as a Mentor</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {mentorBenefits.map((benefit) => (
              <Card key={benefit.title} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">Mentor Tools & Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Evidence Viewer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Review uploaded documents, verify checksums, and add reviewer notes for compliance records.
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Unlocks at: Credential Verification
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">License Verification</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cross-check licenses against official registries with timestamped verification results.
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Unlocks at: Credential Verification
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Pilot Review Queue</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Prioritized list of pilots awaiting your review, filtered by your jurisdiction and expertise.
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Unlocks at: Active Mentoring
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Feedback System</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Provide structured feedback on submissions with approval, revision requests, or rejection.
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Unlocks at: Active Mentoring
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Start with just your basic information. We will guide you through each phase, only asking for what you need
            at each step.
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} className="gap-2">
            Begin Registration Phase
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
