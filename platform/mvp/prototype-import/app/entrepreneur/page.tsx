"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp, getSampleUserForRole } from "@/lib/context"
import { PageAnnotation } from "@/components/ui-components"
import {
  Briefcase,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  Target,
  Shield,
  Clock,
  TrendingUp,
  Layers,
  DollarSign,
} from "lucide-react"

const entrepreneurBenefits = [
  {
    icon: Layers,
    title: "Manage Projects",
    description: "Organize multiple pilots with clear status tracking and milestone management",
  },
  {
    icon: BarChart3,
    title: "Track KPIs",
    description: "Monitor key performance indicators and measure pilot success metrics",
  },
  {
    icon: Users,
    title: "Build Your Team",
    description: "Invite mentors and collaborators with the right certifications for your needs",
  },
  {
    icon: DollarSign,
    title: "Low/No CapEx",
    description: "Launch pilots with minimal capital expenditure through our partner network",
  },
]

const platformAdvantages = [
  {
    title: "Compliance Built-In",
    description: "Protected activities are automatically flagged with verification requirements",
    icon: Shield,
  },
  {
    title: "Fast Matching",
    description: "Find licensed partners and skilled participants within days, not months",
    icon: Zap,
  },
  {
    title: "Audit Trail",
    description: "Complete documentation for regulatory review and investor due diligence",
    icon: Target,
  },
]

const onboardingSteps = [
  { step: 1, title: "Define Scope", description: "Outline your pilot objectives and requirements" },
  { step: 2, title: "Identify Needs", description: "Flag protected activities and license requirements" },
  { step: 3, title: "Build Team", description: "Get matched with mentors and participants" },
  { step: 4, title: "Launch Pilot", description: "Execute with full compliance and tracking" },
]

export default function EntrepreneurLandingPage() {
  const router = useRouter()
  const { setCurrentRole, setCurrentUser } = useApp()

  const handleGetStarted = () => {
    setCurrentRole("entrepreneur")
    setCurrentUser(getSampleUserForRole("entrepreneur"))
    router.push("/profile/new")
  }

  const handleGoToDashboard = () => {
    setCurrentRole("entrepreneur")
    setCurrentUser(getSampleUserForRole("entrepreneur"))
    router.push("/dashboard/entrepreneur")
  }

  const handleCreatePilot = () => {
    setCurrentRole("entrepreneur")
    setCurrentUser(getSampleUserForRole("entrepreneur"))
    router.push("/pilots/new")
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
            title="Entrepreneur Landing Page"
            criteria={[
              "Role-specific entry point for entrepreneurs",
              "Unique onboarding journey focused on project management and KPIs",
              "Clear value proposition: manage pilots, track metrics, build teams",
              "Direct path to profile completion, dashboard, and pilot creation",
            ]}
          />

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Briefcase className="h-4 w-4" />
              Entrepreneur Portal
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
              Launch Pilots Fast, Stay Compliant
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Bring your business ideas to life with minimal capital expenditure. Build teams of licensed mentors and
              skilled participants, track KPIs, and maintain full compliance for investor-ready documentation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleCreatePilot} className="gap-2">
                Create a Pilot
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleGetStarted}>
                Complete Profile First
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Everything You Need to Launch</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {entrepreneurBenefits.map((benefit) => (
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

      {/* Platform Advantages */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Why Velocity Quantal?</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Built for entrepreneurs who need to move fast without compromising on compliance
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {platformAdvantages.map((advantage) => (
              <Card key={advantage.title} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
                <CardHeader>
                  <advantage.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{advantage.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">From Idea to Pilot in Days</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Our streamlined process gets your pilot off the ground quickly and compliantly
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

      {/* KPI Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Track What Matters</h2>
                <p className="text-muted-foreground mb-6">
                  Define custom KPIs for each pilot and monitor progress in real-time. Generate investor-ready reports
                  with full audit trails.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Real-time progress tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span>Custom KPI definitions per pilot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>Timeline and milestone management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Compliance status dashboard</span>
                  </li>
                </ul>
              </div>
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Sample Pilot Dashboard</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pilot Completion</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: "68%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Team Assembly</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Compliance Verified</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: "85%" }} />
                    </div>
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
          <h2 className="text-2xl font-bold mb-4">Ready to Launch Your Pilot?</h2>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Get started today with zero upfront costs. Build your team, track progress, and stay compliant from day one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={handleCreatePilot} className="gap-2">
              Create Your First Pilot
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleGoToDashboard}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Explore Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
