// Types for Velocity Quantal prototype

export type Role = "mentor" | "student" | "entrepreneur" | "admin" | "analyst"

export type FitLevel = "High" | "Medium" | "Low"

export type VerificationStatus = "verified" | "not_found" | "expired" | "pending"

export type PilotStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected"

export type OpportunityStatus = "draft" | "published" | "closed" | "archived"

export type RiskSeverity = "low" | "medium" | "high" | "critical"

export type IssueStatus = "open" | "in_progress" | "monitoring" | "resolved" | "closed"

export type IssuePriority = "low" | "medium" | "high" | "critical"

export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked"

export interface IssueTask {
  id: string
  description: string
  status: TaskStatus
  assignedTo?: string
  assignedToName?: string
  dueDate?: string
  completedAt?: string
  notes?: string
}

export interface IssueActivity {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string // e.g., "created", "updated", "task_completed", "status_changed"
  details: string
}

export interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  category: string // e.g., "compliance", "technical", "operational", "financial"
  
  // Risk escalation tracking
  escalatedFromRisk?: {
    riskId: string
    opportunityId: string
    opportunityTitle: string
    originalRiskDescription: string
    originalSeverity: RiskSeverity
    escalatedAt: string
    escalatedBy: string
    escalatedByName: string
  }
  
  // Issue management
  ownerId: string
  ownerName: string
  assignedTo?: string
  assignedToName?: string
  
  // Prevention and resolution
  tasks: IssueTask[]
  rootCause?: string
  preventionMeasures?: string[]
  playbook?: string // Reference to playbook ID or name
  
  // Tracking
  impactedOpportunities?: string[] // Array of opportunity IDs
  relatedIssues?: string[] // Array of related issue IDs
  activity: IssueActivity[]
  
  // Metadata
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  closedAt?: string
}

export interface OpportunityDocument {
  id: string
  name: string
  type: "ideation" | "business_case" | "other"
  url?: string // URL for uploaded documents
  content?: string // Rich text content for inline documents
  uploadedBy: string
  uploadedByName: string
  uploadedAt: string
  lastModified: string
  lastModifiedBy?: string // User ID of last editor
  lastModifiedByName?: string // Name of last editor
  version?: number
}

export interface OpportunityRisk {
  id: string
  description: string
  severity: RiskSeverity
  mitigation: string
  likelihood?: string // e.g., "unlikely", "possible", "likely"
}

export interface OpportunityRequirements {
  skills: string[]
  certifications: string[]
  minExperienceYears: number
  jurisdictions: string[]
  availability: string
  deviceAccess: string[]
  internetRequired: boolean
}

export interface Opportunity {
  id: string
  title: string
  description: string
  mentorId: string
  mentorName: string
  status: OpportunityStatus
  requirements: OpportunityRequirements
  protectedActivityFlags: string[]
  compensation: string
  duration: string
  maxParticipants: number
  currentParticipants: number
  deadline?: string
  createdAt: string
  updatedAt: string
  // Analyst assessment fields
  expectedROI?: string // e.g., "150-200%", "$5K-10K profit"
  initialTimeToCash?: string // e.g., "2-4 weeks", "30-45 days"
  successEstimate?: number // 0-100 percentage
  analystId?: string // ID of analyst who provided assessment
  assessmentDate?: string // ISO timestamp of assessment
  assessmentNotes?: string // Optional notes from analyst
  risks?: OpportunityRisk[] // Risk assessment and mitigation strategies
  ideationDocument?: OpportunityDocument // Ideation phase document
  businessCaseDocument?: OpportunityDocument // Business case document
  documents?: OpportunityDocument[] // Additional supporting documents
}

export interface OpportunityMatch {
  opportunityId: string
  score: number
  fitLevel: FitLevel
  matchedRequirements: string[]
  missingRequirements: string[]
  recommendations: string[]
}
// End Opportunity types

export type MentorPhase = "registration" | "credential_verification" | "active_mentoring" | "trusted_advisor"
export type StudentPhase = "onboarding" | "skill_building" | "portfolio_building" | "pilot_ready"
export type EntrepreneurPhase = "idea_stage" | "planning" | "active_pilot" | "scaling"
export type AdminPhase = "observer" | "reviewer" | "full_admin"

export type JourneyPhase = MentorPhase | StudentPhase | EntrepreneurPhase | AdminPhase

export interface PhaseGate {
  phase: JourneyPhase
  requiredFields: string[]
  optionalFields: string[]
  unlocks: string[] // Features/capabilities unlocked at this phase
  nextPhase?: JourneyPhase
  completionCriteria: string[]
}

export interface ProfileCompletion {
  currentPhase: JourneyPhase
  completedPhases: JourneyPhase[]
  completionPercentage: number
  fieldsCompleted: string[]
  fieldsPending: string[]
  nextUnlock: string
}

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
  journeyPhase?: JourneyPhase
  profileCompletion?: ProfileCompletion
  bio?: string
  portfolioUrl?: string
  linkedinUrl?: string
  timezone?: string
  mentoringSince?: string
  specializations?: string[]
  jurisdictionsServed?: string[]
  maxMenteesPerMonth?: number
  hourlyRate?: number
  businessName?: string
  businessDescription?: string
  targetMarket?: string
  fundingStage?: string
  teamSize?: number
  pilotsCompleted?: number
  reviewsGiven?: number
  averageRating?: number
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
