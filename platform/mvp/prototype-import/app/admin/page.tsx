"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp, getSampleUserForRole } from "@/lib/context"
import { PageAnnotation } from "@/components/ui-components"
import { adminPhaseGates, getPhaseName } from "@/lib/journey-phases"
import { Shield, FileText, BarChart3, ArrowRight, AlertTriangle, CheckCircle2, Lock } from "lucide-react"

const systemMetrics = [
  { label: "Active Users", value: "1,247", change: "+12%", positive: true },
  { label: "Pilots Submitted", value: "89", change: "+8%", positive: true },
  { label: "Pending Reviews", value: "23", change: "-15%", positive: true },
  { label: "Compliance Rate", value: "97.3%", change: "+0.5%", positive: true },
]

export default function AdminLandingPage() {
  const router = useRouter()
  const { setCurrentRole, setCurrentUser } = useApp()

  const handleGetStarted = () => {
    setCurrentRole("admin")
    setCurrentUser(getSampleUserForRole("admin"))
    router.push("/profile/admin/new")
  }

  const handleGoToDashboard = () => {
    setCurrentRole("admin")
    setCurrentUser(getSampleUserForRole("admin"))
    router.push("/dashboard/admin")
  }

  const handleViewAudit = () => {
    setCurrentRole("admin")
    setCurrentUser(getSampleUserForRole("admin"))
    router.push("/admin/audit")
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
            title="Admin Landing Page"
            criteria={[
              "Role-specific entry point for administrators",
              "Progressive access levels: Observer, Reviewer, Full Admin",
              "Phase-gated administrative capabilities",
              "Security-conscious permission escalation",
            ]}
          />

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Admin Portal
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
              Complete Platform Oversight
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Progress through access levels as you complete training and demonstrate competence. From observer to full
              admin.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Begin Admin Onboarding
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleViewAudit}>
                View Audit Log
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* System Metrics */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {systemMetrics.map((metric) => (
              <Card key={metric.label} className="text-center p-4">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className={`text-xs font-medium mt-1 ${metric.positive ? "text-green-600" : "text-red-600"}`}>
                  {metric.change} this month
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Admin Access Levels</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Administrative access is granted progressively. Complete training and demonstrate competence to unlock
            higher access levels.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {adminPhaseGates.map((gate, index) => (
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
                    {index === 0 && <Badge className="bg-primary/10 text-primary border-0">Initial Access</Badge>}
                    {index === adminPhaseGates.length - 1 && (
                      <Badge variant="outline" className="border-amber-500 text-amber-600">
                        By Appointment
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Requirements
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {gate.requiredFields.length > 0 ? (
                          gate.requiredFields.map((field) => (
                            <Badge key={field} variant="outline" className="text-xs font-normal capitalize">
                              {field.replace(/([A-Z])/g, " $1").trim()}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {index === adminPhaseGates.length - 1
                              ? "Appointed by platform owner"
                              : "Complete previous level requirements"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Capabilities
                      </p>
                      <div className="space-y-1">
                        {gate.unlocks.slice(0, 3).map((unlock, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>{unlock}</span>
                          </div>
                        ))}
                        {gate.unlocks.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{gate.unlocks.length - 3} more capabilities
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

      {/* Compliance Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Compliance at a Glance</h2>
                <p className="text-muted-foreground mb-6">
                  Real-time visibility into platform compliance status. Full visibility available at Observer level,
                  action capabilities at Reviewer level.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Automated compliance checks on all submissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Real-time alerts for verification failures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>One-click compliance report generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span>Trend analysis and anomaly detection</span>
                  </li>
                </ul>
              </div>
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Compliance Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Verified Licenses</span>
                    </div>
                    <span className="font-bold text-green-700">142</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Pending Review</span>
                    </div>
                    <span className="font-bold text-amber-700">23</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Expired/Failed</span>
                    </div>
                    <span className="font-bold text-red-700">5</span>
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
          <h2 className="text-2xl font-bold mb-4">Full Platform Control</h2>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Start as an Observer with read-only access. Progress to Reviewer and Full Admin as you complete training.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={handleGetStarted} className="gap-2">
              Start as Observer
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleGoToDashboard}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              View Dashboard Preview
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
