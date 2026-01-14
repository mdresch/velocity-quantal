// Types for Velocity Quantal prototype

export type Role = "mentor" | "student" | "entrepreneur" | "admin"

export type FitLevel = "High" | "Medium" | "Low"

export type VerificationStatus = "verified" | "not_found" | "expired" | "pending"

export type PilotStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected"

export interface UserProfile {
  id: string
  name: string
  email: string
  role: Role
  availability: string // e.g., "30+ hrs/week", "10-20 hrs/week", "<10 hrs/week"
  skills: string[]
  certifications: Certification[]
  experienceYears: number
  deviceAccess: string[]
  internetReliable: boolean
  willingToUpskill: boolean
  willingToPartnerLicensed: boolean
  preferredRoles: string[]
  languagePrefs: string[]
  consent: boolean
  createdAt: string
  matchResult?: MatchResult
}

export interface Certification {
  id: string
  name: string
  issuer: string
  registryId: string
  issuedAt: string
  expiresAt?: string
  verified: boolean
  fileUrl?: string
}

export interface MatchResult {
  score: number
  fitLevel: FitLevel
  rationale: string[]
}

export interface Pilot {
  id: string
  title: string
  description: string
  ownerId: string
  ownerName: string
  jurisdictions: string[]
  protectedActivityFlags: string[]
  expectedKPIs: string
  status: PilotStatus
  fitBadge?: FitLevel
  createdAt: string
  updatedAt: string
  evidence: Evidence[]
  partnerFallbackNote?: string
}

export interface Evidence {
  id: string
  pilotId: string
  filename: string
  issuer: string
  registryId: string
  issuedAt: string
  expiresAt?: string
  checksum: string
  verified: VerificationStatus
  fileUrl: string
  mimeType: string
  uploadedAt: string
  reviewerNotes?: string[]
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resourceType: "pilot" | "evidence" | "profile" | "verification"
  resourceId: string
  details: string
  pilotId?: string
}

export interface ApiResponse<T> {
  data: T
  requestId: string
  timestamp: string
}
