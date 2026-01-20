"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageAnnotation } from "@/components/ui-components"
import type { Role } from "@/lib/types"
import { GraduationCap, Users, Briefcase, Shield, ArrowRight, BookOpen } from "lucide-react"

const roles: { role: Role; label: string; description: string; icon: React.ElementType; href: string }[] = [
  {
    role: "mentor",
    label: "Mentor",
    description: "Review pilots, verify licenses, and guide participants through protected activities",
    icon: Users,
    href: "/mentor",
  },
  {
    role: "student",
    label: "Student",
    description: "Submit pilots, get matched with opportunities, and build your portfolio",
    icon: GraduationCap,
    href: "/student",
  },
  {
    role: "entrepreneur",
    label: "Entrepreneur",
    description: "Launch pilots, track KPIs, and build teams with licensed professionals",
    icon: Briefcase,
    href: "/entrepreneur",
  },
  {
    role: "admin",
    label: "Admin",
    description: "Audit activities, manage users, generate reports, and ensure compliance",
    icon: Shield,
    href: "/admin",
  },
  {
    role: "analyst",
    label: "Analyst",
    description: "Inspect evidence, run verifications, export audit packages and produce compliance findings",
    icon: BookOpen,
    href: "/profile/analyst/new",
  },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VQ</span>
            </div>
            <span className="font-semibold text-lg">Velocity Quantal — v0</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/demo")}>
            View Demo Script
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <PageAnnotation
          title="Landing / Role Selection"
          criteria={[
            "RBAC start: Role selection routes to role-specific landing pages",
            "Each role has dedicated onboarding experience",
            "Role cards link to unique entry points with tailored content",
          ]}
        />

        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">Velocity Quantal Platform</h1>
          <p className="text-lg text-muted-foreground text-pretty mb-6">
            A low/no-CapEx platform for validating and scaling business opportunities through structured pilots, 
            evidence-based verification, and role-based collaboration. Run pilots, verify compliance, and measure ROI 
            with zero upfront investment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm mb-8">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-semibold text-primary mb-1">🎯 Opportunity Matching</p>
              <p className="text-muted-foreground">AI-powered matching connects students and entrepreneurs with pilots based on skills, licenses, and business needs</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-semibold text-primary mb-1">📋 Evidence Management</p>
              <p className="text-muted-foreground">Upload, verify, and track professional licenses, certifications, and compliance documentation</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-semibold text-primary mb-1">✅ Compliance & Protected Activities</p>
              <p className="text-muted-foreground">Automated verification ensures only licensed professionals perform regulated tasks (legal, medical, financial)</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-semibold text-primary mb-1">📊 Pilot Tracking & KPIs</p>
              <p className="text-muted-foreground">Monitor progress, measure outcomes, and generate audit-ready reports for stakeholders and investors</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-semibold text-primary mb-1">🤝 Collaborative Workflows</p>
              <p className="text-muted-foreground">Mentors guide, analysts verify, students build portfolios, and entrepreneurs scale validated pilots</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-semibold text-primary mb-1">💡 Document & Risk Management</p>
              <p className="text-muted-foreground">Create ideation docs, business cases, track risks, and escalate issues with full version control</p>
            </div>
          </div>
          <p className="text-base text-muted-foreground font-medium">
            Choose your role below to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {roles.map(({ role, label, description, icon: Icon, href }) => (
            <Card
              key={role}
              className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group"
              onClick={() => router.push(href)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{label}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4">{description}</CardDescription>
                <Button className="w-full gap-2 bg-transparent" variant="outline">
                  Enter as {label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-card border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Submit & Match</h3>
              <p className="text-sm text-muted-foreground">
                Students submit evidence and get matched to opportunities. Entrepreneurs post pilots with specific requirements.
              </p>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Verify & Execute</h3>
              <p className="text-sm text-muted-foreground">
                Mentors and analysts verify credentials. Licensed professionals execute protected activities compliantly.
              </p>
            </div>
            <div className="p-6 bg-card border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Measure & Scale</h3>
              <p className="text-sm text-muted-foreground">
                Track KPIs, measure ROI, and reinvest proceeds into the most promising pilots. Generate audit reports.
              </p>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-3">Built for Zero-CapEx Validation</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Velocity Quantal enables rapid pilot execution without upfront investment. Leverage serverless infrastructure, 
              collaborative workflows, and evidence-based verification to validate opportunities, measure outcomes, 
              and scale what works—all while maintaining compliance and minimizing risk.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
