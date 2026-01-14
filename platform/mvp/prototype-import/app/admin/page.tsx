"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp, getSampleUserForRole } from "@/lib/context"
import { PageAnnotation } from "@/components/ui-components"
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  ArrowRight,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle2,
  Settings,
  History,
} from "lucide-react"

const adminCapabilities = [
  {
    icon: History,
    title: "Audit Timeline",
    description: "Complete activity history with filtering by user, date, pilot, and action type",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Manage profiles, roles, and permissions across the platform",
  },
  {
    icon: Download,
    title: "Export Reports",
    description: "Generate CSV and JSON exports for compliance and analysis",
  },
  {
    icon: Eye,
    title: "Full Visibility",
    description: "Access all pilots, evidence, and verification records system-wide",
  },
]

const systemMetrics = [
  { label: "Active Users", value: "1,247", change: "+12%", positive: true },
  { label: "Pilots Submitted", value: "89", change: "+8%", positive: true },
  { label: "Pending Reviews", value: "23", change: "-15%", positive: true },
  { label: "Compliance Rate", value: "97.3%", change: "+0.5%", positive: true },
]

const quickActions = [
  { title: "View Audit Log", description: "Access complete activity timeline", icon: History, href: "/admin/audit" },
  { title: "Manage Users", description: "Review and update user profiles", icon: Users, href: "/dashboard/admin" },
  { title: "Export Data", description: "Generate compliance reports", icon: Download, href: "/admin/audit" },
  { title: "System Settings", description: "Configure platform settings", icon: Settings, href: "/dashboard/admin" },
]

export default function AdminLandingPage() {
  const router = useRouter()
  const { setCurrentRole, setCurrentUser } = useApp()

  const handleGetStarted = () => {
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
            <Button size="sm" onClick={handleGetStarted}>
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
              "Unique onboarding journey focused on audit and oversight",
              "Clear value proposition: full visibility, audit logs, exports, user management",
              "Direct path to dashboard and audit tools",
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
              Monitor all platform activity, manage users, and maintain compliance. Access comprehensive audit logs,
              generate reports, and ensure the integrity of every pilot and verification.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Access Dashboard
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

      {/* Capabilities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Admin Capabilities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {adminCapabilities.map((capability) => (
              <Card key={capability.title} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <capability.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{capability.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Quick Actions</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Jump directly to the most common administrative tasks
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                onClick={() => {
                  setCurrentRole("admin")
                  setCurrentUser(getSampleUserForRole("admin"))
                  router.push(action.href)
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <action.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">{action.description}</CardDescription>
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
                  Real-time visibility into platform compliance status. Monitor verification rates, flag issues, and
                  ensure all protected activities have proper oversight.
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
            Access comprehensive tools for monitoring, auditing, and managing the entire Velocity Quantal platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={handleGetStarted} className="gap-2">
              Open Admin Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleViewAudit}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              View Audit Timeline
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
