import type { Role, PhaseGate, JourneyPhase, ProfileCompletion, UserProfile } from "./types"

// Mentor journey phases and gates
export const mentorPhaseGates: PhaseGate[] = [
  {
    phase: "registration",
    requiredFields: ["name", "email", "availability", "consent"],
    optionalFields: ["bio"],
    unlocks: ["View pilot listings", "Browse mentor resources"],
    nextPhase: "credential_verification",
    completionCriteria: ["Complete basic profile information", "Accept terms and conditions"],
  },
  {
    phase: "credential_verification",
    requiredFields: ["certifications", "jurisdictionsServed", "specializations"],
    optionalFields: ["linkedinUrl", "mentoringSince"],
    unlocks: ["Apply to mentor pilots", "Access verification tools", "View pending reviews"],
    nextPhase: "active_mentoring",
    completionCriteria: ["Upload at least one certification", "Pass license verification", "Define service area"],
  },
  {
    phase: "active_mentoring",
    requiredFields: ["maxMenteesPerMonth", "hourlyRate"],
    optionalFields: ["portfolioUrl", "timezone"],
    unlocks: ["Accept mentee requests", "Conduct reviews", "Earn reputation points"],
    nextPhase: "trusted_advisor",
    completionCriteria: ["Complete 5+ mentoring sessions", "Maintain 4.5+ rating", "No compliance violations"],
  },
  {
    phase: "trusted_advisor",
    requiredFields: [],
    optionalFields: [],
    unlocks: ["Priority matching", "Featured mentor badge", "Advanced analytics", "Mentor other mentors"],
    completionCriteria: ["Complete 25+ mentoring sessions", "Maintain 4.8+ rating", "Active for 6+ months"],
  },
]

// Student journey phases and gates
export const studentPhaseGates: PhaseGate[] = [
  {
    phase: "onboarding",
    requiredFields: ["name", "email", "availability", "consent"],
    optionalFields: ["bio"],
    unlocks: ["Browse pilot opportunities", "Access learning resources"],
    nextPhase: "skill_building",
    completionCriteria: ["Complete basic profile", "Accept terms and conditions"],
  },
  {
    phase: "skill_building",
    requiredFields: ["skills", "experienceYears", "deviceAccess", "internetReliable"],
    optionalFields: ["languagePrefs", "preferredRoles"],
    unlocks: ["Get matched to pilots", "Request mentor pairing", "Join learning groups"],
    nextPhase: "portfolio_building",
    completionCriteria: ["Add at least 3 skills", "Specify device access", "Confirm internet reliability"],
  },
  {
    phase: "portfolio_building",
    requiredFields: ["willingToUpskill", "willingToPartnerLicensed"],
    optionalFields: ["portfolioUrl", "linkedinUrl", "timezone"],
    unlocks: ["Apply to protected pilots (with mentor)", "Track portfolio progress", "Request recommendations"],
    nextPhase: "pilot_ready",
    completionCriteria: ["Complete 3+ pilot contributions", "Receive mentor feedback", "Build verified portfolio"],
  },
  {
    phase: "pilot_ready",
    requiredFields: [],
    optionalFields: ["certifications"],
    unlocks: ["Lead pilot sections", "Mentor newer students", "Priority matching", "Certification fast-track"],
    completionCriteria: ["Complete 10+ pilot contributions", "Average 4.5+ rating", "Optional: obtain certification"],
  },
]

// Entrepreneur journey phases and gates
export const entrepreneurPhaseGates: PhaseGate[] = [
  {
    phase: "idea_stage",
    requiredFields: ["name", "email", "consent"],
    optionalFields: ["bio", "businessName"],
    unlocks: ["Browse platform capabilities", "Access entrepreneur resources", "View sample pilots"],
    nextPhase: "planning",
    completionCriteria: ["Complete basic profile", "Accept terms and conditions"],
  },
  {
    phase: "planning",
    requiredFields: ["availability", "businessName", "businessDescription", "targetMarket"],
    optionalFields: ["linkedinUrl", "fundingStage", "teamSize"],
    unlocks: ["Create draft pilots", "Use pilot planning tools", "Invite collaborators"],
    nextPhase: "active_pilot",
    completionCriteria: ["Define business context", "Create first pilot draft", "Identify compliance requirements"],
  },
  {
    phase: "active_pilot",
    requiredFields: ["skills", "jurisdictionsServed"],
    optionalFields: ["hourlyRate", "timezone", "portfolioUrl"],
    unlocks: ["Submit pilots for review", "Recruit team members", "Track KPIs", "Access audit tools"],
    nextPhase: "scaling",
    completionCriteria: ["Have 1+ approved pilot", "Build pilot team", "Demonstrate KPI tracking"],
  },
  {
    phase: "scaling",
    requiredFields: [],
    optionalFields: [],
    unlocks: ["Multi-pilot management", "Advanced analytics", "API access", "Priority support"],
    completionCriteria: ["Complete 3+ successful pilots", "Maintain compliance record", "Demonstrate scaling metrics"],
  },
]

// Admin journey phases and gates
export const adminPhaseGates: PhaseGate[] = [
  {
    phase: "observer",
    requiredFields: ["name", "email", "consent"],
    optionalFields: [],
    unlocks: ["View system metrics", "Read-only audit access", "Browse all profiles"],
    nextPhase: "reviewer",
    completionCriteria: ["Complete admin onboarding", "Pass security training"],
  },
  {
    phase: "reviewer",
    requiredFields: ["specializations", "timezone"],
    optionalFields: ["bio"],
    unlocks: ["Review pilot submissions", "Verify licenses", "Add reviewer notes", "Flag issues"],
    nextPhase: "full_admin",
    completionCriteria: ["Complete 20+ reviews", "No escalated complaints", "Pass advanced compliance training"],
  },
  {
    phase: "full_admin",
    requiredFields: [],
    optionalFields: [],
    unlocks: [
      "User management",
      "System configuration",
      "Export all data",
      "Override decisions",
      "Manage other admins",
    ],
    completionCriteria: ["Appointed by platform owner", "Complete all certifications"],
  },
]

// Get phase gates for a role
export function getPhaseGatesForRole(role: Role): PhaseGate[] {
  switch (role) {
    case "mentor":
      return mentorPhaseGates
    case "student":
      return studentPhaseGates
    case "entrepreneur":
      return entrepreneurPhaseGates
    case "admin":
      return adminPhaseGates
    default:
      return []
  }
}

// Get current phase gate
export function getCurrentPhaseGate(role: Role, phase: JourneyPhase): PhaseGate | undefined {
  const gates = getPhaseGatesForRole(role)
  return gates.find((g) => g.phase === phase)
}

// Get initial phase for a role
export function getInitialPhase(role: Role): JourneyPhase {
  switch (role) {
    case "mentor":
      return "registration"
    case "student":
      return "onboarding"
    case "entrepreneur":
      return "idea_stage"
    case "admin":
      return "observer"
    default:
      return "onboarding"
  }
}

// Calculate profile completion for a user
export function calculateProfileCompletion(profile: Partial<UserProfile>, role: Role): ProfileCompletion {
  const gates = getPhaseGatesForRole(role)
  const currentPhase = profile.journeyPhase || getInitialPhase(role)

  const completedPhases: JourneyPhase[] = []
  const fieldsCompleted: string[] = []
  const fieldsPending: string[] = []

  let totalRequired = 0
  let totalCompleted = 0

  for (const gate of gates) {
    let phaseComplete = true

    for (const field of gate.requiredFields) {
      totalRequired++
      const value = (profile as Record<string, unknown>)[field]

      if (value !== undefined && value !== null && value !== "" && (!Array.isArray(value) || value.length > 0)) {
        fieldsCompleted.push(field)
        totalCompleted++
      } else {
        fieldsPending.push(field)
        if (gate.phase === currentPhase || completedPhases.includes(gate.phase as JourneyPhase)) {
          phaseComplete = false
        }
      }
    }

    if (phaseComplete && gate.phase !== currentPhase) {
      completedPhases.push(gate.phase as JourneyPhase)
    }

    // Stop processing after current phase
    if (gate.phase === currentPhase) break
  }

  const currentGate = getCurrentPhaseGate(role, currentPhase)
  const nextUnlock = currentGate?.unlocks[0] || "All features unlocked"

  return {
    currentPhase,
    completedPhases,
    completionPercentage: totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0,
    fieldsCompleted,
    fieldsPending,
    nextUnlock,
  }
}

// Check if user can advance to next phase
export function canAdvancePhase(profile: Partial<UserProfile>, role: Role): boolean {
  const currentPhase = profile.journeyPhase || getInitialPhase(role)
  const gate = getCurrentPhaseGate(role, currentPhase)

  if (!gate) return false

  for (const field of gate.requiredFields) {
    const value = (profile as Record<string, unknown>)[field]
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
      return false
    }
  }

  return true
}

// Get fields needed for current phase
export function getFieldsForCurrentPhase(
  role: Role,
  phase: JourneyPhase,
): {
  required: string[]
  optional: string[]
} {
  const gate = getCurrentPhaseGate(role, phase)
  if (!gate) return { required: [], optional: [] }

  return {
    required: gate.requiredFields,
    optional: gate.optionalFields,
  }
}

// Get human-readable phase name
export function getPhaseName(phase: JourneyPhase): string {
  const names: Record<JourneyPhase, string> = {
    // Mentor phases
    registration: "Registration",
    credential_verification: "Credential Verification",
    active_mentoring: "Active Mentoring",
    trusted_advisor: "Trusted Advisor",
    // Student phases
    onboarding: "Onboarding",
    skill_building: "Skill Building",
    portfolio_building: "Portfolio Building",
    pilot_ready: "Pilot Ready",
    // Entrepreneur phases
    idea_stage: "Idea Stage",
    planning: "Planning",
    active_pilot: "Active Pilot",
    scaling: "Scaling",
    // Admin phases
    observer: "Observer",
    reviewer: "Reviewer",
    full_admin: "Full Admin",
  }
  return names[phase] || phase
}

// Get phase index for progress calculation
export function getPhaseIndex(role: Role, phase: JourneyPhase): number {
  const gates = getPhaseGatesForRole(role)
  return gates.findIndex((g) => g.phase === phase)
}

// Get total phases for a role
export function getTotalPhases(role: Role): number {
  return getPhaseGatesForRole(role).length
}
