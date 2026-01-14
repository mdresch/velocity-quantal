"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation, VerificationBadge, ProtectedLabel } from "@/components/ui-components"
import { getPilot, verifyCertificate, updateEvidenceVerification } from "@/lib/mock-api"
import type { Pilot, Evidence } from "@/lib/types"
import { ArrowLeft, Download, Flag, FileText, Calendar, Building, Hash, Shield, Eye, Plus } from "lucide-react"

export default function EvidenceViewerPage({ params }: { params: Promise<{ pilotId: string }> }) {
  const { pilotId } = use(params)
  const router = useRouter()
  const [pilot, setPilot] = useState<Pilot | null>(null)
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [reviewerNote, setReviewerNote] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPilot()
  }, [pilotId])

  const loadPilot = async () => {
    setIsLoading(true)
    const response = await getPilot(pilotId)
    setPilot(response.data)
    if (response.data?.evidence.length) {
      setSelectedEvidence(response.data.evidence[0])
    }
    setIsLoading(false)
  }

  const handleVerify = async (evidence: Evidence) => {
    const result = await verifyCertificate(evidence.issuer, evidence.registryId)
    await updateEvidenceVerification(pilotId, evidence.id, result.data.status)
    await loadPilot()
  }

  const handleAddNote = () => {
    if (!reviewerNote.trim() || !selectedEvidence) return
    // In real app, would save to database
    alert(`Note added: ${reviewerNote}`)
    setReviewerNote("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading evidence...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!pilot) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Pilot not found</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const isProtected = pilot.protectedActivityFlags.length > 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <PageAnnotation
          title="Evidence Viewer"
          criteria={[
            "List each evidence item with metadata: filename, issuer, registryId, issuedAt, expiresAt, checksum, verified badge",
            "Preview pane for documents/images",
            "Actions: download original, flag issue, add reviewer note",
            "AC: Reviewer can view issuer, id, issue/expiry and download source",
          ]}
        />

        {/* Pilot Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{pilot.title}</CardTitle>
                <CardDescription>Evidence for pilot by {pilot.ownerName}</CardDescription>
              </div>
              {isProtected && <ProtectedLabel />}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{pilot.description}</p>
            {isProtected && (
              <div className="mt-3 flex flex-wrap gap-1">
                {pilot.protectedActivityFlags.map((flag) => (
                  <span
                    key={flag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded"
                  >
                    <Shield className="h-3 w-3" />
                    {flag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evidence List & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evidence List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Evidence Items ({pilot.evidence.length})
            </h3>

            {pilot.evidence.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No evidence uploaded</p>
                </CardContent>
              </Card>
            ) : (
              pilot.evidence.map((evidence) => (
                <Card
                  key={evidence.id}
                  className={`cursor-pointer transition-colors ${
                    selectedEvidence?.id === evidence.id
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedEvidence(evidence)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="font-medium text-sm truncate">{evidence.filename}</span>
                      </div>
                      <VerificationBadge status={evidence.verified} />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {evidence.issuer}
                      </p>
                      <p className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {evidence.registryId}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Preview Pane */}
          <div className="lg:col-span-2">
            {selectedEvidence ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedEvidence.filename}</CardTitle>
                      <CardDescription>
                        Uploaded {new Date(selectedEvidence.uploadedAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    <VerificationBadge status={selectedEvidence.verified} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preview Area */}
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Document Preview</p>
                    <p className="text-xs text-muted-foreground">{selectedEvidence.mimeType}</p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Issuer</p>
                        <p className="font-medium flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {selectedEvidence.issuer}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Registry ID</p>
                        <p className="font-medium flex items-center gap-1">
                          <Hash className="h-4 w-4" />
                          {selectedEvidence.registryId}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Checksum</p>
                        <p className="font-mono text-xs truncate">{selectedEvidence.checksum}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Issued At</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedEvidence.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Expires At</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {selectedEvidence.expiresAt
                            ? new Date(selectedEvidence.expiresAt).toLocaleDateString()
                            : "No expiry"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Original
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Flag Issue
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleVerify(selectedEvidence)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Verify License
                    </Button>
                  </div>

                  {/* Reviewer Notes */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-medium text-sm">Reviewer Notes</h4>
                    {selectedEvidence.reviewerNotes && selectedEvidence.reviewerNotes.length > 0 ? (
                      <ul className="text-sm space-y-2">
                        {selectedEvidence.reviewerNotes.map((note, i) => (
                          <li key={i} className="p-2 bg-muted rounded">
                            {note}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No reviewer notes</p>
                    )}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a reviewer note..."
                        value={reviewerNote}
                        onChange={(e) => setReviewerNote(e.target.value)}
                        className="flex-1"
                        rows={2}
                      />
                      <Button onClick={handleAddNote} disabled={!reviewerNote.trim()}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an evidence item to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
