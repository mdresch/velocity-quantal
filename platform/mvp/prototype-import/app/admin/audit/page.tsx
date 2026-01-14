"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation } from "@/components/ui-components"
import { getAuditLog, exportAuditLogCSV, exportAuditLogJSON } from "@/lib/mock-api"
import { sampleProfiles, samplePilots } from "@/lib/sample-data"
import type { AuditLogEntry } from "@/lib/types"
import {
  ArrowLeft,
  FileSpreadsheet,
  FileJson,
  Filter,
  Upload,
  Shield,
  CheckCircle2,
  FileText,
  User,
  Archive,
} from "lucide-react"

const actionIcons: Record<string, React.ElementType> = {
  upload_evidence: Upload,
  verify_license: Shield,
  verify_certificate: Shield,
  approve_pilot: CheckCircle2,
  create_pilot: FileText,
  create_profile: User,
  request_clarification: FileText,
  update_verification: Shield,
}

const actionColors: Record<string, string> = {
  upload_evidence: "bg-blue-100 text-blue-800",
  verify_license: "bg-green-100 text-green-800",
  verify_certificate: "bg-green-100 text-green-800",
  approve_pilot: "bg-green-100 text-green-800",
  create_pilot: "bg-purple-100 text-purple-800",
  create_profile: "bg-purple-100 text-purple-800",
  request_clarification: "bg-amber-100 text-amber-800",
  update_verification: "bg-blue-100 text-blue-800",
}

export default function AuditPage() {
  const router = useRouter()
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [userFilter, setUserFilter] = useState<string>("")
  const [pilotFilter, setPilotFilter] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  useEffect(() => {
    loadAuditLog()
  }, [userFilter, pilotFilter, startDate, endDate])

  const loadAuditLog = async () => {
    setIsLoading(true)
    const response = await getAuditLog({
      userId: userFilter || undefined,
      pilotId: pilotFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
    setAuditLog(response.data)
    setIsLoading(false)
  }

  const handleExportCSV = () => {
    const csv = exportAuditLogCSV(auditLog)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const json = exportAuditLogJSON(auditLog)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportEvidenceBundle = () => {
    // Mock evidence bundle export
    alert(
      "Evidence bundle export would download a ZIP file containing:\n- evidence files\n- metadata.json\n- audit-trail.csv",
    )
  }

  const clearFilters = () => {
    setUserFilter("")
    setPilotFilter("")
    setStartDate("")
    setEndDate("")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <PageAnnotation
          title="Admin / Audit Timeline"
          criteria={[
            "Timeline of actions: uploads, verifications, approvals",
            "Filters: user, date, pilot",
            "Export button produces CSV/JSON with references to evidence files",
            "AC: Export produces CSV/JSON with references to evidence files",
          ]}
        />

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Audit Timeline</h1>
            <p className="text-muted-foreground">Review all platform activities and compliance events</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handleExportJSON}>
              <FileJson className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" onClick={handleExportEvidenceBundle}>
              <Archive className="h-4 w-4 mr-2" />
              Export Bundle
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>User</Label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All users</SelectItem>
                    {sampleProfiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="admin-001">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pilot</Label>
                <Select value={pilotFilter} onValueChange={setPilotFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All pilots" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All pilots</SelectItem>
                    {samplePilots.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
              <span className="text-sm text-muted-foreground self-center">Showing {auditLog.length} entries</span>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Chronological list of all platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading audit log...</div>
            ) : auditLog.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No entries match your filters</div>
            ) : (
              <div className="space-y-4">
                {auditLog.map((entry, index) => {
                  const Icon = actionIcons[entry.action] || FileText
                  const colorClass = actionColors[entry.action] || "bg-gray-100 text-gray-800"

                  return (
                    <div key={entry.id} className="flex gap-4">
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {index < auditLog.length - 1 && <div className="w-px h-full bg-border flex-1 mt-2" />}
                      </div>

                      {/* Entry content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{entry.details}</p>
                            <p className="text-sm text-muted-foreground">by {entry.userName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {entry.action.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-muted rounded">Type: {entry.resourceType}</span>
                          <span className="px-2 py-1 bg-muted rounded font-mono">ID: {entry.resourceId}</span>
                          {entry.pilotId && (
                            <span className="px-2 py-1 bg-muted rounded font-mono">Pilot: {entry.pilotId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
