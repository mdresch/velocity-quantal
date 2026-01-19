"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation, FitBadge } from "@/components/ui-components"
import { DocumentViewerDialog } from "@/components/document-viewer-dialog"
import { useApp } from "@/lib/context"
import { getOpportunities, matchAllOpportunities } from "@/lib/mock-api"
import type { Opportunity, OpportunityMatch, OpportunityDocument } from "@/lib/types"
import {
  ArrowRight,
  Clock,
  Users,
  MapPin,
  Shield,
  CheckCircle2,
  XCircle,
  Lightbulb,
  DollarSign,
  Briefcase,
  AlertTriangle,
  FileText,
  ExternalLink,
  Plus,
} from "lucide-react"

export default function OpportunitiesPage() {
  const router = useRouter()
  const { currentUser, currentRole } = useApp()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [matches, setMatches] = useState<Map<string, OpportunityMatch>>(new Map())
  const [loading, setLoading] = useState(true)
  const [selectedOpp, setSelectedOpp] = useState<string | null>(null)
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<OpportunityDocument | null>(null)

  useEffect(() => {
    loadData()
  }, [currentUser])

  const loadData = async () => {
    setLoading(true)
    try {
      const oppResponse = await getOpportunities({ status: "published" })
      setOpportunities(oppResponse.data)

      if (currentUser) {
        const matchResponse = await matchAllOpportunities(currentUser)
        const matchMap = new Map<string, OpportunityMatch>()
        matchResponse.data.forEach((m) => matchMap.set(m.opportunityId, m))
        setMatches(matchMap)
      }
    } catch (error) {
      console.error("Failed to load opportunities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentUpdated = () => {
    // Reload opportunities to get updated document versions
    loadData()
  }

  const handleAddDocument = (documentType: "ideation" | "businessCase") => {
    if (!selectedOpportunity || !currentUser) return
    
    // Create a placeholder document to trigger edit mode
    const newDoc = {
      id: `temp-${Date.now()}`,
      name: documentType === "ideation" ? "Ideation Document" : "Business Case Document",
      type: (documentType === "ideation" ? "ideation" : "business_case") as const,
      content: documentType === "ideation" 
        ? "# Ideation Document\n\n## Problem Statement\n\n## Solution Overview\n\n## Target Market\n\n## Unique Value Proposition\n\n## Initial Services\n\n## Success Metrics"
        : "# Business Case\n\n## Executive Summary\n\n## Market Analysis\n\n## Financial Projections\n\n## Risk Assessment\n\n## Resource Requirements\n\n## Go-to-Market Strategy\n\n## Success Criteria",
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 0, // 0 indicates not yet saved
    }
    
    setSelectedDocument(newDoc)
    setDocumentViewerOpen(true)
  }

  const selectedOpportunity = opportunities.find((o) => o.id === selectedOpp)
  const selectedMatch = selectedOpp ? matches.get(selectedOpp) : null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <PageAnnotation
          title="Opportunity Browser"
          criteria={[
            "List published opportunities from mentors",
            "Match score and fit badge for each opportunity",
            "Detailed comparison view showing matched/missing requirements",
            "Recommendations for improving fit",
          ]}
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Browse Opportunities</h1>
          <p className="text-muted-foreground">
            Find opportunities that match your skills, experience, and certifications
          </p>
        </div>

        {!currentUser && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <p className="text-amber-800">
                <strong>Complete your profile</strong> to see personalized match scores for each opportunity.
              </p>
              <Button variant="outline" className="mt-2 bg-transparent" onClick={() => router.push("/profile/new")}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Opportunities List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold">Available Opportunities</h2>
            {loading ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent>
              </Card>
            ) : opportunities.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No opportunities available at this time.
                </CardContent>
              </Card>
            ) : (
              opportunities.map((opp) => {
                const match = matches.get(opp.id)
                return (
                  <Card
                    key={opp.id}
                    className={`cursor-pointer transition-all ${
                      selectedOpp === opp.id ? "ring-2 ring-primary" : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedOpp(opp.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{opp.title}</CardTitle>
                        {match && <FitBadge level={match.fitLevel} showScore score={match.score} />}
                      </div>
                      <CardDescription className="text-xs">by {opp.mentorName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {opp.compensation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {opp.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {opp.currentParticipants}/{opp.maxParticipants} spots filled
                        </span>
                      </div>
                      {opp.protectedActivityFlags.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Protected Activity
                        </Badge>
                      )}
                      {match && <Progress value={match.score} className="h-1.5 mt-2" />}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Detailed Match View */}
          <div className="lg:col-span-2">
            {!selectedOpportunity ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select an opportunity to see detailed match analysis</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedOpportunity.title}</CardTitle>
                      <CardDescription>Posted by {selectedOpportunity.mentorName}</CardDescription>
                    </div>
                    {selectedMatch && (
                      <div className="text-right">
                        <FitBadge level={selectedMatch.fitLevel} showScore score={selectedMatch.score} />
                        <p className="text-xs text-muted-foreground mt-1">Match Score</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedOpportunity.description}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="h-4 w-4 text-green-600 mb-1" />
                      <p className="text-xs text-muted-foreground">Compensation</p>
                      <p className="text-sm font-medium">{selectedOpportunity.compensation}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600 mb-1" />
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">{selectedOpportunity.duration}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Users className="h-4 w-4 text-purple-600 mb-1" />
                      <p className="text-xs text-muted-foreground">Spots</p>
                      <p className="text-sm font-medium">
                        {selectedOpportunity.maxParticipants - selectedOpportunity.currentParticipants} available
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-orange-600 mb-1" />
                      <p className="text-xs text-muted-foreground">Jurisdiction</p>
                      <p className="text-sm font-medium">{selectedOpportunity.requirements.jurisdictions[0]}</p>
                    </div>
                  </div>

                  {/* Analyst Assessment */}
                  {(selectedOpportunity.expectedROI ||
                    selectedOpportunity.initialTimeToCash ||
                    selectedOpportunity.successEstimate) && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-900">Analyst Assessment</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedOpportunity.expectedROI && (
                          <div>
                            <p className="text-xs text-blue-700">Expected ROI</p>
                            <p className="text-sm font-semibold text-blue-900">{selectedOpportunity.expectedROI}</p>
                          </div>
                        )}
                        {selectedOpportunity.initialTimeToCash && (
                          <div>
                            <p className="text-xs text-blue-700">Time to Cash</p>
                            <p className="text-sm font-semibold text-blue-900">
                              {selectedOpportunity.initialTimeToCash}
                            </p>
                          </div>
                        )}
                        {selectedOpportunity.successEstimate !== undefined && (
                          <div>
                            <p className="text-xs text-blue-700">Success Estimate</p>
                            <p className="text-sm font-semibold text-blue-900">
                              {selectedOpportunity.successEstimate}%
                            </p>
                          </div>
                        )}
                      </div>
                      {selectedOpportunity.assessmentNotes && (
                        <p className="text-xs text-blue-700 mt-2 pt-2 border-t border-blue-200">
                          {selectedOpportunity.assessmentNotes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Documents */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      Opportunity Documents
                    </h4>
                    <div className="space-y-2">
                      {/* Ideation Document */}
                      {selectedOpportunity.ideationDocument ? (
                          <Card className="border-purple-200 bg-purple-50/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-purple-600" />
                                  Ideation Document
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  v{selectedOpportunity.ideationDocument.version || 1}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-xs">
                                Updated {new Date(selectedOpportunity.ideationDocument.lastModified).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  setSelectedDocument(selectedOpportunity.ideationDocument!)
                                  setDocumentViewerOpen(true)
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Document
                              </Button>
                            </CardContent>
                          </Card>
                        ) : currentUser && currentRole === "mentor" && selectedOpportunity.mentorId === currentUser.id ? (
                          <Card className="border-purple-200 bg-purple-50/50 border-dashed">
                            <CardContent className="pt-6">
                              <Button
                                variant="outline"
                                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                                onClick={() => handleAddDocument("ideation")}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Ideation Document
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="border-gray-200 bg-gray-50/50">
                            <CardContent className="pt-6 text-center">
                              <p className="text-sm text-muted-foreground">No ideation document available</p>
                            </CardContent>
                          </Card>
                        )}

                        {/* Business Case Document */}
                        {selectedOpportunity.businessCaseDocument ? (
                          <Card className="border-indigo-200 bg-indigo-50/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4 text-indigo-600" />
                                  Business Case
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  v{selectedOpportunity.businessCaseDocument.version || 1}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-xs">
                                Updated{" "}
                                {new Date(selectedOpportunity.businessCaseDocument.lastModified).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  setSelectedDocument(selectedOpportunity.businessCaseDocument!)
                                  setDocumentViewerOpen(true)
                                }}
                              >
                                <Briefcase className="h-4 w-4 mr-2" />
                                View Document
                              </Button>
                            </CardContent>
                          </Card>
                        ) : currentUser && (currentRole === "mentor" && selectedOpportunity.mentorId === currentUser.id || currentRole === "analyst") ? (
                          <Card className="border-indigo-200 bg-indigo-50/50 border-dashed">
                            <CardContent className="pt-6">
                              <Button
                                variant="outline"
                                className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                                onClick={() => handleAddDocument("businessCase")}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Business Case Document
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="border-gray-200 bg-gray-50/50">
                            <CardContent className="pt-6 text-center">
                              <p className="text-sm text-muted-foreground">No business case document available</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-sm text-muted-foreground mr-2">Skills:</span>
                        {selectedOpportunity.requirements.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Experience:</span>{" "}
                        {selectedOpportunity.requirements.minExperienceYears}+ years
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Availability:</span>{" "}
                        {selectedOpportunity.requirements.availability}
                      </p>
                      {selectedOpportunity.requirements.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-sm text-muted-foreground mr-2">Certifications:</span>
                          {selectedOpportunity.requirements.certifications.map((cert) => (
                            <Badge key={cert} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Protected Activities */}
                  {selectedOpportunity.protectedActivityFlags.length > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-amber-600" />
                        <span className="font-medium text-amber-800">Protected Activities</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedOpportunity.protectedActivityFlags.map((flag) => (
                          <Badge key={flag} variant="outline" className="text-xs border-amber-300 text-amber-700">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Assessment */}
                  {selectedOpportunity.risks && selectedOpportunity.risks.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Risk Assessment & Mitigation
                      </h4>
                      <div className="space-y-2">
                        {selectedOpportunity.risks.map((risk) => (
                          <div key={risk.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    risk.severity === "critical" || risk.severity === "high"
                                      ? "destructive"
                                      : risk.severity === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {risk.severity}
                                </Badge>
                                {risk.likelihood && (
                                  <span className="text-xs text-muted-foreground capitalize">{risk.likelihood}</span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-amber-900">{risk.description}</p>
                              <div className="pt-1 border-t border-amber-200">
                                <p className="text-xs text-muted-foreground">Mitigation Strategy:</p>
                                <p className="text-sm text-amber-800">{risk.mitigation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Analysis */}
                  {selectedMatch && currentUser && (
                    <Tabs defaultValue="matched" className="mt-6">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="matched">Matched</TabsTrigger>
                        <TabsTrigger value="missing">Missing</TabsTrigger>
                        <TabsTrigger value="recommendations">Tips</TabsTrigger>
                      </TabsList>

                      <TabsContent value="matched" className="mt-4 space-y-2">
                        {selectedMatch.matchedRequirements.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No requirements matched yet.</p>
                        ) : (
                          selectedMatch.matchedRequirements.map((req, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm text-green-800">{req}</span>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="missing" className="mt-4 space-y-2">
                        {selectedMatch.missingRequirements.length === 0 ? (
                          <p className="text-sm text-muted-foreground">You meet all requirements!</p>
                        ) : (
                          selectedMatch.missingRequirements.map((req, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                              <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                              <span className="text-sm text-red-800">{req}</span>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      <TabsContent value="recommendations" className="mt-4 space-y-2">
                        {selectedMatch.recommendations.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No recommendations - you're a great fit!</p>
                        ) : (
                          selectedMatch.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm text-blue-800">{rec}</span>
                            </div>
                          ))
                        )}
                      </TabsContent>
                    </Tabs>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    {selectedMatch && selectedMatch.fitLevel !== "Low" ? (
                      <Button className="flex-1">
                        Apply Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => router.push("/profile/new")}
                      >
                        Improve Profile to Apply
                      </Button>
                    )}
                    <Button variant="outline">Contact Mentor</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Document Viewer Dialog */}
      <DocumentViewerDialog
        open={documentViewerOpen}
        onOpenChange={setDocumentViewerOpen}
        document={selectedDocument}
        opportunityId={selectedOpportunity?.id}
        mentorId={selectedOpportunity?.mentorId}
        onDocumentUpdated={handleDocumentUpdated}
      />
    </div>
  )
}
