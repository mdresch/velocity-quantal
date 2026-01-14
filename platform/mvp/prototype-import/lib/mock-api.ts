import type { UserProfile, Pilot, Evidence, MatchResult, VerificationStatus, ApiResponse, AuditLogEntry } from "./types"
import { sampleProfiles, samplePilots, sampleAuditLog } from "./sample-data"

// Generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
const generateRequestId = () => `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// In-memory storage (simulating database)
const profiles = [...sampleProfiles]
const pilots = [...samplePilots]
const auditLog = [...sampleAuditLog]

// Helper to wrap responses
function wrapResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    requestId: generateRequestId(),
    timestamp: new Date().toISOString(),
  }
}

// POST /api/profile
export async function createProfile(
  profile: Omit<UserProfile, "id" | "createdAt" | "matchResult">,
): Promise<ApiResponse<{ profileId: string }>> {
  const newProfile: UserProfile = {
    ...profile,
    id: generateId("user"),
    createdAt: new Date().toISOString(),
  }

  // Auto-calculate match
  const matchResult = await computeMatch(newProfile)
  newProfile.matchResult = matchResult.data

  profiles.push(newProfile)

  auditLog.push({
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    userId: newProfile.id,
    userName: newProfile.name,
    action: "create_profile",
    resourceType: "profile",
    resourceId: newProfile.id,
    details: `Profile created for ${newProfile.name}`,
  })

  return wrapResponse({ profileId: newProfile.id })
}

// GET /api/profile/:id
export async function getProfile(profileId: string): Promise<ApiResponse<UserProfile | null>> {
  const profile = profiles.find((p) => p.id === profileId)
  return wrapResponse(profile || null)
}

// GET /api/profiles
export async function getProfiles(): Promise<ApiResponse<UserProfile[]>> {
  return wrapResponse(profiles)
}

// POST /api/match - Compute matching score
export async function computeMatch(profile: Partial<UserProfile>): Promise<ApiResponse<MatchResult>> {
  // Weights as per spec
  const weights = {
    availability: 0.2,
    skills: 0.3,
    certifications: 0.25,
    experience: 0.15,
    upskillWillingness: 0.1,
  }

  let score = 0
  const rationale: string[] = []

  // Availability scoring (20%)
  const availabilityMap: Record<string, number> = {
    "30+ hrs/week": 100,
    "10-20 hrs/week": 70,
    "<10 hrs/week": 30,
  }
  const availScore = availabilityMap[profile.availability || ""] || 50
  score += availScore * weights.availability

  if (availScore >= 70) {
    rationale.push(`High availability (${profile.availability}) matches pilot demands`)
  } else {
    rationale.push(`Limited availability (${profile.availability})`)
  }

  // Skills scoring (30%)
  const skillCount = profile.skills?.length || 0
  const skillScore = Math.min(100, skillCount * 16.67) // 6 skills = 100
  score += skillScore * weights.skills

  if (skillCount >= 4) {
    rationale.push(`Strong technical skills (${skillCount} areas of expertise)`)
  } else {
    rationale.push(`Early-stage learner with basic skills`)
  }

  // Certifications scoring (25%) - only verified count
  const verifiedCerts = profile.certifications?.filter((c) => c.verified) || []
  const certScore = verifiedCerts.length > 0 ? 100 : 0
  score += certScore * weights.certifications

  if (verifiedCerts.length > 0) {
    rationale.push(`Verified license: ${verifiedCerts[0].name}`)
  } else {
    rationale.push("Lacks verified license for regulated tasks — partner fallback recommended")
  }

  // Experience scoring (15%)
  const expYears = profile.experienceYears || 0
  const expScore = Math.min(100, expYears * 10) // 10+ years = 100
  score += expScore * weights.experience

  if (expYears >= 5) {
    rationale.push(`Extensive experience (${expYears} years)`)
  }

  // Upskill willingness (10%)
  const upskillScore = profile.willingToUpskill ? 100 : 0
  score += upskillScore * weights.upskillWillingness

  if (profile.willingToPartnerLicensed) {
    rationale.push("Willing to partner with licensed professionals")
  }

  // Internet reliability consideration
  if (profile.internetReliable === false) {
    rationale.push("Unreliable internet may impact remote work")
  }

  // Determine fit level
  const finalScore = Math.round(score)
  let fitLevel: "High" | "Medium" | "Low"

  if (finalScore >= 75) {
    fitLevel = "High"
  } else if (finalScore >= 50) {
    fitLevel = "Medium"
  } else {
    fitLevel = "Low"
    rationale.push("Recommended pathway: Training and micro-task opportunities")
  }

  return wrapResponse({ score: finalScore, fitLevel, rationale })
}

// POST /api/pilots
export async function createPilot(
  pilot: Omit<Pilot, "id" | "createdAt" | "updatedAt" | "status" | "evidence">,
): Promise<ApiResponse<{ pilotId: string }>> {
  const newPilot: Pilot = {
    ...pilot,
    id: generateId("pilot"),
    status: "submitted",
    evidence: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  pilots.push(newPilot)

  auditLog.push({
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    userId: pilot.ownerId,
    userName: pilot.ownerName,
    action: "create_pilot",
    resourceType: "pilot",
    resourceId: newPilot.id,
    details: `Created pilot: ${newPilot.title}`,
    pilotId: newPilot.id,
  })

  return wrapResponse({ pilotId: newPilot.id })
}

// GET /api/pilots
export async function getPilots(): Promise<ApiResponse<Pilot[]>> {
  return wrapResponse(pilots)
}

// GET /api/pilots/:id
export async function getPilot(pilotId: string): Promise<ApiResponse<Pilot | null>> {
  const pilot = pilots.find((p) => p.id === pilotId)
  return wrapResponse(pilot || null)
}

// GET /api/pilots/:id/evidence
export async function getPilotEvidence(pilotId: string): Promise<ApiResponse<Evidence[]>> {
  const pilot = pilots.find((p) => p.id === pilotId)
  return wrapResponse(pilot?.evidence || [])
}

// POST /api/pilots/:id/evidence
export async function uploadEvidence(
  pilotId: string,
  evidence: Omit<Evidence, "id" | "pilotId" | "uploadedAt" | "verified">,
): Promise<ApiResponse<{ evidenceId: string; signedUrl: string }>> {
  const pilot = pilots.find((p) => p.id === pilotId)
  if (!pilot) {
    throw new Error("Pilot not found")
  }

  const newEvidence: Evidence = {
    ...evidence,
    id: generateId("evidence"),
    pilotId,
    verified: "pending",
    uploadedAt: new Date().toISOString(),
  }

  pilot.evidence.push(newEvidence)
  pilot.updatedAt = new Date().toISOString()

  auditLog.push({
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    userId: pilot.ownerId,
    userName: pilot.ownerName,
    action: "upload_evidence",
    resourceType: "evidence",
    resourceId: newEvidence.id,
    details: `Uploaded ${newEvidence.filename}`,
    pilotId,
  })

  return wrapResponse({
    evidenceId: newEvidence.id,
    signedUrl: `/mock/signed/${newEvidence.id}`,
  })
}

// POST /api/verify-cert
export async function verifyCertificate(
  issuer: string,
  registryId: string,
): Promise<ApiResponse<{ status: VerificationStatus; sourceUrl: string; verifiedAt: string }>> {
  // Mock deterministic verification based on sample data
  let status: VerificationStatus = "not_found"

  // Check if this matches Bas's verified certificate
  if (registryId === "EUMDA-2024-78432") {
    status = "verified"
  } else if (registryId.includes("EXPIRED")) {
    status = "expired"
  } else if (registryId.includes("PENDING")) {
    status = "pending"
  }

  auditLog.push({
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    userId: "system",
    userName: "Verification System",
    action: "verify_certificate",
    resourceType: "verification",
    resourceId: registryId,
    details: `Certificate verification: ${issuer} / ${registryId} - Status: ${status}`,
  })

  return wrapResponse({
    status,
    sourceUrl: `https://registry.mock/${issuer}/${registryId}`,
    verifiedAt: new Date().toISOString(),
  })
}

// Update evidence verification status
export async function updateEvidenceVerification(
  pilotId: string,
  evidenceId: string,
  status: VerificationStatus,
): Promise<ApiResponse<{ success: boolean }>> {
  const pilot = pilots.find((p) => p.id === pilotId)
  if (!pilot) {
    throw new Error("Pilot not found")
  }

  const evidence = pilot.evidence.find((e) => e.id === evidenceId)
  if (!evidence) {
    throw new Error("Evidence not found")
  }

  evidence.verified = status

  auditLog.push({
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    userId: "admin-001",
    userName: "System Admin",
    action: "update_verification",
    resourceType: "evidence",
    resourceId: evidenceId,
    details: `Updated verification status to: ${status}`,
    pilotId,
  })

  return wrapResponse({ success: true })
}

// GET /api/audit
export async function getAuditLog(filters?: {
  userId?: string
  pilotId?: string
  startDate?: string
  endDate?: string
}): Promise<ApiResponse<AuditLogEntry[]>> {
  let filtered = [...auditLog]

  if (filters?.userId) {
    filtered = filtered.filter((e) => e.userId === filters.userId)
  }
  if (filters?.pilotId) {
    filtered = filtered.filter((e) => e.pilotId === filters.pilotId)
  }
  if (filters?.startDate) {
    filtered = filtered.filter((e) => e.timestamp >= filters.startDate!)
  }
  if (filters?.endDate) {
    filtered = filtered.filter((e) => e.timestamp <= filters.endDate!)
  }

  return wrapResponse(filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
}

// Export audit log as CSV
export function exportAuditLogCSV(entries: AuditLogEntry[]): string {
  const headers = ["Timestamp", "User", "Action", "Resource Type", "Resource ID", "Details", "Pilot ID"]
  const rows = entries.map((e) => [
    e.timestamp,
    e.userName,
    e.action,
    e.resourceType,
    e.resourceId,
    `"${e.details.replace(/"/g, '""')}"`,
    e.pilotId || "",
  ])

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
}

// Export audit log as JSON
export function exportAuditLogJSON(entries: AuditLogEntry[]): string {
  return JSON.stringify(entries, null, 2)
}
