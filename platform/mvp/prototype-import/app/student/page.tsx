"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp, getSampleUserForRole } from "@/lib/context"
import { PageAnnotation } from "@/components/ui-components"
import { studentPhaseGates, getPhaseName } from "@/lib/journey-phases"
import { GraduationCap, Rocket, ArrowRight, CheckCircle2, Lock } from "lucide-react"

export default function StudentLandingPage() {
  const router = useRouter()
  const { setCurrentRole, setCurrentUser } = useApp()

  const handleGetStarted = () => {
    setCurrentRole("student")
    setCurrentUser(getSampleUserForRole("student"))
    router.push("/profile/student/new")
  }

  const handleGoToDashboard = () => {
    setCurrentRole("student")
    setCurrentUser(getSampleUserForRole("student"))
    router.push("/dashboard/student")
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
            title="Student Landing Page"
            criteria={[
              "Role-specific entry point for students",
              "Progressive profile completion with phase gates",
              "Clear journey from onboarding to pilot-ready",
              "Only requests information relevant to current phase",
            ]}
          />

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              Student Portal
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
              Launch Your Ideas with Expert Guidance
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Turn your innovative ideas into reality. Progress through learning phases, build your portfolio, and work
              alongside licensed mentors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Start Onboarding
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
          <h2 className="text-2xl font-bold text-center mb-4">Your Learning Journey</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Progress at your own pace. Each phase unlocks new opportunities and only asks for relevant information.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {studentPhaseGates.map((gate, index) => (
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
                    {index === 0 && <Badge className="bg-primary/10 text-primary border-0">Start Here</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Matching Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Smart Matching Algorithm</h2>
                <p className="text-muted-foreground mb-6">
                  Once you reach the Skill Building phase, our matching system considers your skills, availability, and
                  interests to recommend pilots.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>
                      <strong>Skills (30%)</strong> — Match your expertise to pilot requirements
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>
                      <strong>Certifications (25%)</strong> — Leverage your credentials
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>
                      <strong>Availability (20%)</strong> — Fit your schedule
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>
                      <strong>Experience (15%)</strong> — Consider your background
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                    <span>
                      <strong>Upskill Willingness (10%)</strong> — Growth opportunities
                    </span>
                  </li>
                </ul>
                <Badge variant="outline" className="mt-4">
                  Available after: Skill Building Phase
                </Badge>
              </div>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">High Fit Match</p>
                    <p className="text-sm text-muted-foreground">Sample pilot opportunity</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Match Score</span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills Match</span>
                    <span>4 of 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Commitment</span>
                    <span>10-20 hrs/week</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Begin with just your name, email, and availability. We will guide you through each phase as you grow.
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} className="gap-2">
            Begin Onboarding
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
