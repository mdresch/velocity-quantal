import type {
  UserProfile,
  Pilot,
  Evidence,
  MatchResult,
  VerificationStatus,
  ApiResponse,
  AuditLogEntry,
  Opportunity,
  OpportunityMatch,
  FitLevel,
  Issue,
  IssueTask,
  IssueActivity,
  IssueStatus,
  OpportunityRisk,
} from "./types"
import { sampleProfiles, samplePilots, sampleAuditLog, sampleOpportunities } from "./sample-data"

// Generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
const generateRequestId = () => `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// In-memory storage (simulating database)
const profiles = [...sampleProfiles]
const pilots = [...samplePilots]
const auditLog = [...sampleAuditLog]
const opportunities = [...sampleOpportunities]
const issues: Issue[] = []

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

// POST /api/opportunities
export async function createOpportunity(
  opportunity: Omit<Opportunity, "id" | "createdAt" | "updatedAt" | "currentParticipants">,
): Promise<ApiResponse<{ opportunityId: string }>> {
  const newOpportunity: Opportunity = {
    ...opportunity,
    id: generateId("opp"),
    currentParticipants: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  opportunities.push(newOpportunity)

  auditLog.push({
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    userId: opportunity.mentorId,
    userName: opportunity.mentorName,
    action: "create_opportunity",
    resourceType: "pilot",
    resourceId: newOpportunity.id,
    details: `Created opportunity: ${newOpportunity.title} (${newOpportunity.status})`,
  })

  return wrapResponse({ opportunityId: newOpportunity.id })
}

// PUT /api/opportunities/:id
export async function updateOpportunity(
  opportunityId: string,
  updates: Partial<Opportunity>,
): Promise<ApiResponse<{ success: boolean }>> {
  const index = opportunities.findIndex((o) => o.id === opportunityId)
  if (index === -1) {
    throw new Error("Opportunity not found")
  }

  opportunities[index] = {
    ...opportunities[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  auditLog.push({
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    userId: opportunities[index].mentorId,
    userName: opportunities[index].mentorName,
    action: "update_opportunity",
    resourceType: "pilot",
    resourceId: opportunityId,
    details: `Updated opportunity: ${opportunities[index].title}`,
  })

  return wrapResponse({ success: true })
}

// GET /api/opportunities
export async function getOpportunities(filters?: {
  mentorId?: string
  status?: string
}): Promise<ApiResponse<Opportunity[]>> {
  let filtered = [...opportunities]

  if (filters?.mentorId) {
    filtered = filtered.filter((o) => o.mentorId === filters.mentorId)
  }
  if (filters?.status) {
    filtered = filtered.filter((o) => o.status === filters.status)
  }

  return wrapResponse(filtered)
}

// GET /api/opportunities/:id
export async function getOpportunity(opportunityId: string): Promise<ApiResponse<Opportunity | null>> {
  const opportunity = opportunities.find((o) => o.id === opportunityId)
  return wrapResponse(opportunity || null)
}

// DELETE /api/opportunities/:id
export async function deleteOpportunity(opportunityId: string): Promise<ApiResponse<{ success: boolean }>> {
  const index = opportunities.findIndex((o) => o.id === opportunityId)
  if (index === -1) {
    throw new Error("Opportunity not found")
  }

  const removed = opportunities.splice(index, 1)[0]

  auditLog.push({
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    userId: removed.mentorId,
    userName: removed.mentorName,
    action: "delete_opportunity",
    resourceType: "pilot",
    resourceId: opportunityId,
    details: `Deleted opportunity: ${removed.title}`,
  })

  return wrapResponse({ success: true })
}

// PUT /api/opportunities/:id/document - Update opportunity document (collaborative editing)
export async function updateOpportunityDocument(
  opportunityId: string,
  documentType: "ideation" | "businessCase",
  updates: { name?: string; content?: string },
  userId: string,
  userName: string,
): Promise<ApiResponse<{ success: boolean; version: number }>> {
  const opportunity = opportunities.find((o) => o.id === opportunityId)
  if (!opportunity) {
    throw new Error("Opportunity not found")
  }

  const now = new Date().toISOString()
  const docField = documentType === "ideation" ? "ideationDocument" : "businessCaseDocument"
  const existingDoc = opportunity[docField]

  if (!existingDoc) {
    // Create new document if it doesn't exist
    const newDoc = {
      id: generateId("doc"),
      name: updates.name || `${documentType === "ideation" ? "Ideation" : "Business Case"} Document`,
      type: documentType === "ideation" ? "ideation" as const : "business_case" as const,
      content: updates.content || "",
      uploadedBy: userId,
      uploadedByName: userName,
      uploadedAt: now,
      lastModified: now,
      lastModifiedBy: userId,
      lastModifiedByName: userName,
      version: 1,
    }
    opportunity[docField] = newDoc
  } else {
    // Update existing document
    if (updates.name !== undefined) {
      existingDoc.name = updates.name
    }
    if (updates.content !== undefined) {
      existingDoc.content = updates.content
    }
    existingDoc.lastModified = now
    existingDoc.lastModifiedBy = userId
    existingDoc.lastModifiedByName = userName
    existingDoc.version = (existingDoc.version || 1) + 1
  }

  opportunity.updatedAt = now

  auditLog.push({
    id: generateId("audit"),
    timestamp: now,
    userId,
    userName,
    action: "update_document",
    resourceType: "pilot",
    resourceId: opportunityId,
    details: `Updated ${documentType} document (v${opportunity[docField]?.version}) for opportunity: ${opportunity.title}`,
  })

  return wrapResponse({ success: true, version: opportunity[docField]?.version || 1 })
}

// POST /api/opportunities/match - Match entrepreneur profile against opportunity
export async function matchOpportunity(
  profile: UserProfile,
  opportunity: Opportunity,
): Promise<ApiResponse<OpportunityMatch>> {
  const matchedRequirements: string[] = []
  const missingRequirements: string[] = []
  const recommendations: string[] = []
  let score = 0
  const maxScore = 100

  const req = opportunity.requirements

  // Skills match (30 points)
  const matchedSkills = profile.skills.filter((s) => req.skills.includes(s))
  const skillScore = req.skills.length > 0 ? (matchedSkills.length / req.skills.length) * 30 : 30
  score += skillScore
  if (matchedSkills.length > 0) {
    matchedRequirements.push(`Skills: ${matchedSkills.join(", ")}`)
  }
  const missingSkills = req.skills.filter((s) => !profile.skills.includes(s))
  if (missingSkills.length > 0) {
    missingRequirements.push(`Missing skills: ${missingSkills.join(", ")}`)
    recommendations.push(`Consider upskilling in: ${missingSkills.join(", ")}`)
  }

  // Certification match (25 points)
  if (req.certifications.length === 0) {
    score += 25
    matchedRequirements.push("No certifications required")
  } else {
    const profileCertNames = profile.certifications.filter((c) => c.verified).map((c) => c.name)
    const matchedCerts = req.certifications.filter((c) => profileCertNames.includes(c))
    const certScore = (matchedCerts.length / req.certifications.length) * 25
    score += certScore
    if (matchedCerts.length > 0) {
      matchedRequirements.push(`Certifications: ${matchedCerts.join(", ")}`)
    }
    const missingCerts = req.certifications.filter((c) => !profileCertNames.includes(c))
    if (missingCerts.length > 0) {
      missingRequirements.push(`Missing certifications: ${missingCerts.join(", ")}`)
      if (profile.willingToPartnerLicensed) {
        recommendations.push("Partner with licensed professional for certification requirements")
      } else {
        recommendations.push(`Obtain certification: ${missingCerts.join(", ")}`)
      }
    }
  }

  // Experience match (15 points)
  if (profile.experienceYears >= req.minExperienceYears) {
    score += 15
    matchedRequirements.push(`Experience: ${profile.experienceYears} years (${req.minExperienceYears}+ required)`)
  } else {
    const expGap = req.minExperienceYears - profile.experienceYears
    score += Math.max(0, 15 - expGap * 3)
    missingRequirements.push(`Experience gap: ${expGap} years below requirement`)
    recommendations.push("Gain experience through smaller pilot projects first")
  }

  // Availability match (15 points)
  const availabilityMap: Record<string, number> = {
    "30+ hrs/week": 3,
    "10-20 hrs/week": 2,
    "<10 hrs/week": 1,
  }
  const profileAvail = availabilityMap[profile.availability] || 0
  const reqAvail = availabilityMap[req.availability] || 0
  if (profileAvail >= reqAvail) {
    score += 15
    matchedRequirements.push(`Availability: ${profile.availability}`)
  } else {
    score += 5
    missingRequirements.push(`Availability: ${profile.availability} (${req.availability} preferred)`)
    recommendations.push("Consider increasing availability for better fit")
  }

  // Jurisdiction match (10 points)
  const matchedJurisdictions = req.jurisdictions.filter(
    (j) => profile.jurisdictionsServed?.includes(j) || req.jurisdictions.includes("United States"), // Default
  )
  if (matchedJurisdictions.length > 0 || req.jurisdictions.length === 0) {
    score += 10
    matchedRequirements.push(`Jurisdiction: ${req.jurisdictions.join(", ")}`)
  } else {
    missingRequirements.push(`Not in required jurisdiction: ${req.jurisdictions.join(", ")}`)
  }

  // Device access (5 points)
  const matchedDevices = profile.deviceAccess.filter((d) => req.deviceAccess.includes(d))
  if (matchedDevices.length >= req.deviceAccess.length || req.deviceAccess.length === 0) {
    score += 5
    matchedRequirements.push(`Device access: ${profile.deviceAccess.join(", ")}`)
  } else {
    const missingDevices = req.deviceAccess.filter((d) => !profile.deviceAccess.includes(d))
    missingRequirements.push(`Missing device: ${missingDevices.join(", ")}`)
  }

  // Internet reliability
  if (req.internetRequired && !profile.internetReliable) {
    score -= 5
    missingRequirements.push("Unreliable internet connection")
    recommendations.push("Improve internet reliability for remote work")
  }

  // Protected activity consideration
  if (opportunity.protectedActivityFlags.length > 0) {
    const hasRequiredCerts = req.certifications.every((c) =>
      profile.certifications.some((pc) => pc.name === c && pc.verified),
    )
    if (!hasRequiredCerts && profile.willingToPartnerLicensed) {
      recommendations.push("Partner fallback available for protected activities")
    } else if (!hasRequiredCerts) {
      recommendations.push("Protected activity requires certification or licensed partner")
    }
  }

  const finalScore = Math.round(Math.max(0, Math.min(100, score)))
  let fitLevel: FitLevel
  if (finalScore >= 75) {
    fitLevel = "High"
  } else if (finalScore >= 50) {
    fitLevel = "Medium"
  } else {
    fitLevel = "Low"
  }

  return wrapResponse({
    opportunityId: opportunity.id,
    score: finalScore,
    fitLevel,
    matchedRequirements,
    missingRequirements,
    recommendations,
  })
}

// Batch match all opportunities for a profile
export async function matchAllOpportunities(profile: UserProfile): Promise<ApiResponse<OpportunityMatch[]>> {
  const publishedOpportunities = opportunities.filter((o) => o.status === "published")
  const matches: OpportunityMatch[] = []

  for (const opp of publishedOpportunities) {
    const match = await matchOpportunity(profile, opp)
    matches.push(match.data)
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score)

  return wrapResponse(matches)
}

// ==================== Issue Management API ====================

// POST /api/issues/escalate - Escalate a risk to an issue
export async function escalateRiskToIssue(params: {
  risk: OpportunityRisk
  opportunityId: string
  opportunityTitle: string
  userId: string
  userName: string
  issueTitle: string
  issueDescription: string
  category: string
  priority: Issue["priority"]
  rootCause?: string
  preventionMeasures?: string[]
  initialTasks?: Omit<IssueTask, "id">[]
}): Promise<ApiResponse<{ issueId: string }>> {
  const issueId = generateId("issue")
  const now = new Date().toISOString()

  const initialActivity: IssueActivity = {
    id: generateId("activity"),
    timestamp: now,
    userId: params.userId,
    userName: params.userName,
    action: "created",
    details: `Issue escalated from risk: "${params.risk.description}"`,
  }

  const tasks: IssueTask[] = (params.initialTasks || []).map((task) => ({
    ...task,
    id: generateId("task"),
  }))

  const newIssue: Issue = {
    id: issueId,
    title: params.issueTitle,
    description: params.issueDescription,
    status: "open",
    priority: params.priority,
    category: params.category,
    escalatedFromRisk: {
      riskId: params.risk.id,
      opportunityId: params.opportunityId,
      opportunityTitle: params.opportunityTitle,
      originalRiskDescription: params.risk.description,
      originalSeverity: params.risk.severity,
      escalatedAt: now,
      escalatedBy: params.userId,
      escalatedByName: params.userName,
    },
    ownerId: params.userId,
    ownerName: params.userName,
    tasks,
    rootCause: params.rootCause,
    preventionMeasures: params.preventionMeasures,
    impactedOpportunities: [params.opportunityId],
    activity: [initialActivity],
    createdAt: now,
    updatedAt: now,
  }

  issues.push(newIssue)

  auditLog.push({
    id: generateId("audit"),
    timestamp: now,
    userId: params.userId,
    userName: params.userName,
    action: "escalate_risk_to_issue",
    resourceType: "issue",
    resourceId: issueId,
    details: `Risk escalated to issue: ${params.issueTitle}`,
  })

  return wrapResponse({ issueId })
}

// GET /api/issues - Get all issues with optional filters
export async function getIssues(filters?: {
  status?: IssueStatus
  priority?: Issue["priority"]
  category?: string
  ownerId?: string
  assignedTo?: string
}): Promise<ApiResponse<Issue[]>> {
  let filteredIssues = [...issues]

  if (filters) {
    if (filters.status) {
      filteredIssues = filteredIssues.filter((i) => i.status === filters.status)
    }
    if (filters.priority) {
      filteredIssues = filteredIssues.filter((i) => i.priority === filters.priority)
    }
    if (filters.category) {
      filteredIssues = filteredIssues.filter((i) => i.category === filters.category)
    }
    if (filters.ownerId) {
      filteredIssues = filteredIssues.filter((i) => i.ownerId === filters.ownerId)
    }
    if (filters.assignedTo) {
      filteredIssues = filteredIssues.filter((i) => i.assignedTo === filters.assignedTo)
    }
  }

  // Sort by priority (critical, high, medium, low) then by created date
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  filteredIssues.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return wrapResponse(filteredIssues)
}

// GET /api/issues/:id - Get single issue
export async function getIssue(issueId: string): Promise<ApiResponse<Issue | null>> {
  const issue = issues.find((i) => i.id === issueId)
  return wrapResponse(issue || null)
}

// PUT /api/issues/:id/status - Update issue status
export async function updateIssueStatus(
  issueId: string,
  status: IssueStatus,
  userId: string,
  userName: string,
  notes?: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const issue = issues.find((i) => i.id === issueId)
  if (!issue) {
    return wrapResponse({ success: false })
  }

  const oldStatus = issue.status
  issue.status = status
  issue.updatedAt = new Date().toISOString()

  if (status === "resolved") {
    issue.resolvedAt = issue.updatedAt
  }
  if (status === "closed") {
    issue.closedAt = issue.updatedAt
  }

  const activity: IssueActivity = {
    id: generateId("activity"),
    timestamp: issue.updatedAt,
    userId,
    userName,
    action: "status_changed",
    details: `Status changed from "${oldStatus}" to "${status}"${notes ? `: ${notes}` : ""}`,
  }
  issue.activity.push(activity)

  return wrapResponse({ success: true })
}

// POST /api/issues/:id/tasks - Add task to issue
export async function addIssueTask(
  issueId: string,
  task: Omit<IssueTask, "id">,
  userId: string,
  userName: string,
): Promise<ApiResponse<{ taskId: string }>> {
  const issue = issues.find((i) => i.id === issueId)
  if (!issue) {
    return wrapResponse({ taskId: "" })
  }

  const taskId = generateId("task")
  const newTask: IssueTask = {
    ...task,
    id: taskId,
  }

  issue.tasks.push(newTask)
  issue.updatedAt = new Date().toISOString()

  const activity: IssueActivity = {
    id: generateId("activity"),
    timestamp: issue.updatedAt,
    userId,
    userName,
    action: "task_added",
    details: `Task added: ${task.description}`,
  }
  issue.activity.push(activity)

  return wrapResponse({ taskId })
}

// PUT /api/issues/:id/tasks/:taskId - Update task status
export async function updateTaskStatus(
  issueId: string,
  taskId: string,
  status: IssueTask["status"],
  userId: string,
  userName: string,
  notes?: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const issue = issues.find((i) => i.id === issueId)
  if (!issue) {
    return wrapResponse({ success: false })
  }

  const task = issue.tasks.find((t) => t.id === taskId)
  if (!task) {
    return wrapResponse({ success: false })
  }

  const oldStatus = task.status
  task.status = status
  if (notes) {
    task.notes = notes
  }
  if (status === "completed") {
    task.completedAt = new Date().toISOString()
  }

  issue.updatedAt = new Date().toISOString()

  const activity: IssueActivity = {
    id: generateId("activity"),
    timestamp: issue.updatedAt,
    userId,
    userName,
    action: "task_updated",
    details: `Task "${task.description}" status changed from "${oldStatus}" to "${status}"`,
  }
  issue.activity.push(activity)

  return wrapResponse({ success: true })
}

// POST /api/issues/:id/activity - Add activity entry
export async function addIssueActivity(
  issueId: string,
  action: string,
  details: string,
  userId: string,
  userName: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const issue = issues.find((i) => i.id === issueId)
  if (!issue) {
    return wrapResponse({ success: false })
  }

  const activity: IssueActivity = {
    id: generateId("activity"),
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action,
    details,
  }

  issue.activity.push(activity)
  issue.updatedAt = new Date().toISOString()

  return wrapResponse({ success: true })
}

// PUT /api/issues/:id - Update issue details
export async function updateIssue(
  issueId: string,
  updates: Partial<Pick<Issue, "title" | "description" | "priority" | "category" | "assignedTo" | "assignedToName" | "rootCause" | "preventionMeasures" | "playbook">>,
  userId: string,
  userName: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const issue = issues.find((i) => i.id === issueId)
  if (!issue) {
    return wrapResponse({ success: false })
  }

  Object.assign(issue, updates)
  issue.updatedAt = new Date().toISOString()

  const activity: IssueActivity = {
    id: generateId("activity"),
    timestamp: issue.updatedAt,
    userId,
    userName,
    action: "updated",
    details: `Issue details updated`,
  }
  issue.activity.push(activity)

  return wrapResponse({ success: true })
}
