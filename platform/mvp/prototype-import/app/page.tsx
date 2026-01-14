"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageAnnotation } from "@/components/ui-components"
import type { Role } from "@/lib/types"
import { GraduationCap, Users, Briefcase, Shield, ArrowRight } from "lucide-react"

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
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">Velocity Quantal — Choose your role</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Select your role to begin your personalized onboarding journey. Each role has tailored features for
            submitting, reviewing, and managing low/no CapEx pilot opportunities.
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
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <h2 className="text-xl font-semibold mb-4">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground mb-1">Evidence Upload</p>
              <p>Submit and verify licenses and certifications</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground mb-1">Fit Matching</p>
              <p>Automated matching to pilot opportunities</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground mb-1">Protected Activities</p>
              <p>Compliant handling of regulated tasks</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
