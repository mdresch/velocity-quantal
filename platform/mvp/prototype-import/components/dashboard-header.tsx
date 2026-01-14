"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/context"
import type { Role } from "@/lib/types"
import { Home, UserCircle, LogOut } from "lucide-react"

const roleLabels: Record<Role, string> = {
  mentor: "Mentor",
  student: "Student",
  entrepreneur: "Entrepreneur",
  admin: "Admin",
}

export function DashboardHeader() {
  const router = useRouter()
  const { currentRole, currentUser, setCurrentRole, setCurrentUser } = useApp()

  const handleLogout = () => {
    setCurrentRole(null)
    setCurrentUser(null)
    router.push("/")
  }

  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VQ</span>
            </div>
            <span className="font-semibold">Velocity Quantal — v0</span>
          </div>
          {currentRole && (
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              {roleLabels[currentRole]} Dashboard
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentUser && <span className="text-sm text-muted-foreground hidden sm:inline">{currentUser.name}</span>}
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <Home className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push("/profile/new")}>
            <UserCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
