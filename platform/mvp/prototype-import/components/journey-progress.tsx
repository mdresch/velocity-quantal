"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Role, JourneyPhase, PhaseGate } from "@/lib/types"
import {
  getPhaseGatesForRole,
  getCurrentPhaseGate,
  getPhaseName,
  getPhaseIndex,
  getTotalPhases,
} from "@/lib/journey-phases"
import { CheckCircle2, Circle, Lock, ArrowRight, Unlock } from "lucide-react"

interface JourneyProgressProps {
  role: Role
  currentPhase: JourneyPhase
  completedPhases: JourneyPhase[]
  completionPercentage: number
  onStartPhase?: () => void
  compact?: boolean
}

export function JourneyProgress({
  role,
  currentPhase,
  completedPhases,
  completionPercentage,
  onStartPhase,
  compact = false,
}: JourneyProgressProps) {
  const gates = getPhaseGatesForRole(role)
  const currentIndex = getPhaseIndex(role, currentPhase)
  const totalPhases = getTotalPhases(role)
  const overallProgress = ((currentIndex + 1) / totalPhases) * 100

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{getPhaseName(currentPhase)}</span>
          <span className="text-muted-foreground">
            Phase {currentIndex + 1} of {totalPhases}
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Your Journey</CardTitle>
            <CardDescription>
              Phase {currentIndex + 1} of {totalPhases}: {getPhaseName(currentPhase)}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {Math.round(overallProgress)}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phase Timeline */}
        <div className="flex items-center gap-1">
          {gates.map((gate, index) => {
            const isCompleted = completedPhases.includes(gate.phase as JourneyPhase)
            const isCurrent = gate.phase === currentPhase
            const isLocked = index > currentIndex

            return (
              <div key={gate.phase} className="flex items-center flex-1">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0
                    ${isCompleted ? "bg-green-500 text-white" : ""}
                    ${isCurrent ? "bg-primary text-primary-foreground" : ""}
                    ${isLocked ? "bg-muted text-muted-foreground" : ""}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isLocked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                {index < gates.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 ${isCompleted ? "bg-green-500" : "bg-muted"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Phase Names */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {gates.map((gate, index) => (
            <span
              key={gate.phase}
              className={`text-center max-w-[80px] ${gate.phase === currentPhase ? "text-primary font-medium" : ""}`}
            >
              {getPhaseName(gate.phase as JourneyPhase)}
            </span>
          ))}
        </div>

        {/* Current Phase Details */}
        <CurrentPhaseCard
          gate={getCurrentPhaseGate(role, currentPhase)!}
          completionPercentage={completionPercentage}
          onStartPhase={onStartPhase}
        />
      </CardContent>
    </Card>
  )
}

interface CurrentPhaseCardProps {
  gate: PhaseGate
  completionPercentage: number
  onStartPhase?: () => void
}

function CurrentPhaseCard({ gate, completionPercentage, onStartPhase }: CurrentPhaseCardProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Current Phase Requirements</h4>
        <span className="text-sm text-muted-foreground">{completionPercentage}% complete</span>
      </div>

      <Progress value={completionPercentage} className="h-1.5" />

      {/* Completion Criteria */}
      <div className="space-y-1">
        {gate.completionCriteria.map((criteria, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Circle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{criteria}</span>
          </div>
        ))}
      </div>

      {/* Unlocks */}
      <div className="pt-2 border-t">
        <p className="text-xs font-medium mb-2 flex items-center gap-1">
          <Unlock className="h-3 w-3" />
          Complete this phase to unlock:
        </p>
        <div className="flex flex-wrap gap-1">
          {gate.unlocks.map((unlock, i) => (
            <Badge key={i} variant="outline" className="text-xs font-normal">
              {unlock}
            </Badge>
          ))}
        </div>
      </div>

      {onStartPhase && (
        <Button size="sm" onClick={onStartPhase} className="w-full mt-2 gap-2">
          Continue Setup
          <ArrowRight className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// Phase-specific form section component
interface PhaseFormSectionProps {
  role: Role
  phase: JourneyPhase
  title?: string
  children: React.ReactNode
}

export function PhaseFormSection({ role, phase, title, children }: PhaseFormSectionProps) {
  const gate = getCurrentPhaseGate(role, phase)

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {getPhaseName(phase)}
          </Badge>
        </div>
      )}
      {gate && (
        <p className="text-sm text-muted-foreground">
          Complete these fields to unlock: {gate.unlocks.slice(0, 2).join(", ")}
          {gate.unlocks.length > 2 && ` +${gate.unlocks.length - 2} more`}
        </p>
      )}
      {children}
    </div>
  )
}
