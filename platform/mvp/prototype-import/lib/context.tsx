"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Role, UserProfile } from "./types"
import { sampleProfiles } from "./sample-data"

interface AppContextType {
  currentRole: Role | null
  setCurrentRole: (role: Role | null) => void
  currentUser: UserProfile | null
  setCurrentUser: (user: UserProfile | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  return (
    <AppContext.Provider value={{ currentRole, setCurrentRole, currentUser, setCurrentUser }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

// Helper to get sample user for a role
export function getSampleUserForRole(role: Role): UserProfile {
  switch (role) {
    case "mentor":
      return sampleProfiles.find((p) => p.role === "mentor") || sampleProfiles[1]
    case "student":
      return sampleProfiles.find((p) => p.role === "student") || sampleProfiles[2]
    case "entrepreneur":
      return sampleProfiles.find((p) => p.role === "entrepreneur") || sampleProfiles[0]
    case "admin":
      return {
        id: "admin-001",
        name: "System Admin",
        email: "admin@velocityquantal.com",
        role: "admin",
        availability: "30+ hrs/week",
        skills: ["System Administration", "Audit", "Compliance"],
        certifications: [],
        experienceYears: 10,
        deviceAccess: ["Laptop"],
        internetReliable: true,
        willingToUpskill: false,
        willingToPartnerLicensed: false,
        preferredRoles: ["Admin"],
        languagePrefs: ["English"],
        consent: true,
        createdAt: "2024-01-01T00:00:00Z",
      }
    default:
      return sampleProfiles[0]
  }
}
