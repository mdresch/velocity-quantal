"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp, getSampleUserForRole } from "@/lib/context"
import { PageAnnotation } from "@/components/ui-components"
import { entrepreneurPhaseGates, getPhaseName } from "@/lib/journey-phases"
import { Briefcase, BarChart3, ArrowRight, Shield, Clock, TrendingUp, CheckCircle2, Lock } from "lucide-react"

export default function EntrepreneurLandingPage() {
  const router = useRouter()
  const { setCurrentRole, setCurrentUser } = useApp()

  const handleGetStarted = () => {
    setCurrentRole("entrepreneur")
    setCurrentUser(getSampleUserForRole("entrepreneur"))
    router.push("/profile/entrepreneur/new")
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
              "Progressive profile completion from idea to scaling",
              "Phase-gated pilot creation and team building",
              "Only requests business info when relevant",
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
              From idea to scaled operation. Progress through phases that unlock pilot creation, team building, and
              advanced analytics.
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
          <h2 className="text-2xl font-bold text-center mb-4">Your Entrepreneur Journey</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Move fast without sacrificing compliance. Each phase unlocks new capabilities as your pilot matures.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {entrepreneurPhaseGates.map((gate, index) => (
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

      {/* KPI Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Track What Matters</h2>
                <p className="text-muted-foreground mb-6">
                  KPI tracking and analytics unlock at the Active Pilot phase. Focus on building first, then measure
                  success.
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
                <Badge variant="outline" className="mt-4">
                  Available after: Active Pilot Phase
                </Badge>
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
            Start with just your name and email. Add business details when you are ready to create your first pilot
            draft.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={handleGetStarted} className="gap-2">
              Begin Idea Stage
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
