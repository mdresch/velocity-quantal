"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FitBadge, PilotStatusBadge, ProtectedLabel } from "@/components/ui-components"
import type { Pilot, Role } from "@/lib/types"
import { Eye, Download, FileSpreadsheet, MapPin, Calendar, Shield } from "lucide-react"

interface PilotCardProps {
  pilot: Pilot
  role: Role
  onViewEvidence?: (pilotId: string) => void
  onVerify?: (pilotId: string) => void
  onExportCSV?: (pilotId: string) => void
}

export function PilotCard({ pilot, role, onViewEvidence, onVerify, onExportCSV }: PilotCardProps) {
  const isProtected = pilot.protectedActivityFlags.length > 0
  const hasEvidence = pilot.evidence.length > 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{pilot.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">by {pilot.ownerName}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <PilotStatusBadge status={pilot.status} />
            {pilot.fitBadge && <FitBadge level={pilot.fitBadge} />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{pilot.description}</p>

        {/* Protected Activity Warning */}
        {isProtected && (
          <div className="space-y-2">
            <ProtectedLabel />
            <div className="flex flex-wrap gap-1">
              {pilot.protectedActivityFlags.map((flag) => (
                <Badge key={flag} variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {pilot.jurisdictions.join(", ")}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(pilot.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Evidence Count */}
        {hasEvidence && (
          <p className="text-xs text-muted-foreground">
            {pilot.evidence.length} evidence item{pilot.evidence.length > 1 ? "s" : ""} attached
          </p>
        )}

        {/* Partner Fallback Note */}
        {pilot.partnerFallbackNote && (
          <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
            <strong>Partner Fallback:</strong> {pilot.partnerFallbackNote}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {onViewEvidence && (
            <Button size="sm" variant="outline" onClick={() => onViewEvidence(pilot.id)}>
              <Eye className="h-3 w-3 mr-1" />
              Preview Evidence
            </Button>
          )}

          {role === "mentor" && onVerify && isProtected && (
            <Button size="sm" variant="outline" onClick={() => onVerify(pilot.id)}>
              <Shield className="h-3 w-3 mr-1" />
              Verify License
            </Button>
          )}

          <Button size="sm" variant="ghost">
            <Download className="h-3 w-3 mr-1" />
            Download Bundle
          </Button>

          {role === "admin" && onExportCSV && (
            <Button size="sm" variant="ghost" onClick={() => onExportCSV(pilot.id)}>
              <FileSpreadsheet className="h-3 w-3 mr-1" />
              Export CSV
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
