"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp, getSampleUserForRole } from "@/lib/context"
import { PageAnnotation } from "@/components/ui-components"
import { GraduationCap, Rocket, Target, TrendingUp, ArrowRight, FileText, Users, Award, Lightbulb } from "lucide-react"

const studentBenefits = [
  {
    icon: FileText,
    title: "Submit Pilots",
    description: "Propose your innovative ideas and get them reviewed by licensed professionals",
  },
  {
    icon: Target,
    title: "Get Matched",
    description: "Our algorithm matches you with pilots that fit your skills and availability",
  },
  {
    icon: Users,
    title: "Partner with Mentors",
    description: "Work alongside licensed professionals when handling protected activities",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your pilot submissions, approvals, and build your verified portfolio",
  },
]

const learningPaths = [
  { title: "Skill Development", description: "Gain hands-on experience with real pilot projects", icon: Lightbulb },
  {
    title: "Certification Prep",
    description: "Work toward professional certifications with mentor guidance",
    icon: Award,
  },
  { title: "Portfolio Building", description: "Document your contributions to approved pilots", icon: FileText },
]

const onboardingSteps = [
  { step: 1, title: "Create Profile", description: "Share your skills, availability, and interests" },
  { step: 2, title: "Get Matched", description: "Receive pilot recommendations based on your profile" },
  { step: 3, title: "Submit or Join", description: "Propose your own pilot or join existing ones" },
  { step: 4, title: "Learn & Grow", description: "Work with mentors and track your progress" },
]

export default function StudentLandingPage() {
  const router = useRouter()
  const { setCurrentRole, setCurrentUser } = useApp()

  const handleGetStarted = () => {
    setCurrentRole("student")
    setCurrentUser(getSampleUserForRole("student"))
    router.push("/profile/new")
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
              "Unique onboarding journey focused on learning and growth",
              "Clear value proposition: submit pilots, get matched, partner with mentors",
              "Direct path to profile completion and dashboard",
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
              Turn your innovative ideas into reality. Submit pilot proposals, get matched with opportunities that fit
              your skills, and work alongside licensed mentors to bring protected activities to life.
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

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">What You Can Do</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {studentBenefits.map((benefit) => (
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

      {/* Learning Paths */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Your Learning Path</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Whether you are building skills or working toward certification, we support your growth
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {learningPaths.map((path) => (
              <Card key={path.title} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
                <CardHeader>
                  <path.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{path.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            From profile to pilot — your journey in four simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {onboardingSteps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matching Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Smart Matching Algorithm</h2>
                <p className="text-muted-foreground mb-6">
                  Our matching system considers your skills, availability, and interests to recommend pilots where you
                  can make the biggest impact.
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
            Complete your profile in minutes and get matched with pilot opportunities tailored to your skills and goals.
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} className="gap-2">
            Create Your Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
