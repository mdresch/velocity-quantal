"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FitLevel, VerificationStatus, PilotStatus } from "@/lib/types"
import { CheckCircle2, Clock, AlertCircle, XCircle, Shield } from "lucide-react"

// Fit Badge Component
export function FitBadge({ level, showScore, score }: { level: FitLevel; showScore?: boolean; score?: number }) {
  const variants = {
    High: "bg-green-100 text-green-800 border-green-300",
    Medium: "bg-amber-100 text-amber-800 border-amber-300",
    Low: "bg-red-100 text-red-800 border-red-300",
  }

  return (
    <Badge className={cn("font-medium border", variants[level])}>
      {showScore && score !== undefined ? `${level} (${score}%)` : level} Fit
    </Badge>
  )
}

// Verification Status Badge
export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const config = {
    verified: { icon: CheckCircle2, className: "bg-green-100 text-green-800", label: "Verified" },
    pending: { icon: Clock, className: "bg-amber-100 text-amber-800", label: "Pending" },
    expired: { icon: AlertCircle, className: "bg-red-100 text-red-800", label: "Expired" },
    not_found: { icon: XCircle, className: "bg-red-100 text-red-800", label: "Not Found" },
  }

  const { icon: Icon, className, label } = config[status]

  return (
    <Badge className={cn("font-medium flex items-center gap-1", className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

// Pilot Status Badge
export function PilotStatusBadge({ status }: { status: PilotStatus }) {
  const config = {
    draft: { className: "bg-gray-100 text-gray-800", label: "Draft" },
    submitted: { className: "bg-blue-100 text-blue-800", label: "Submitted" },
    under_review: { className: "bg-amber-100 text-amber-800", label: "Under Review" },
    approved: { className: "bg-green-100 text-green-800", label: "Approved" },
    rejected: { className: "bg-red-100 text-red-800", label: "Rejected" },
  }

  const { className, label } = config[status]

  return <Badge className={cn("font-medium", className)}>{label}</Badge>
}

// Protected Activity Label
export function ProtectedLabel() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-xs font-medium">
      <Shield className="h-3 w-3" />
      Licensed resource required — see evidence
    </div>
  )
}

// Page Annotation Component
export function PageAnnotation({
  title,
  criteria,
}: {
  title: string
  criteria: string[]
}) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
        <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded">AC</span>
        {title}
      </h3>
      <ul className="text-sm text-blue-800 space-y-1">
        {criteria.map((c, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Privacy Consent Text
export function PrivacyConsent() {
  return (
    <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border">
      By uploading you consent to verification and sharing with partners for pilot matching.
    </p>
  )
}
