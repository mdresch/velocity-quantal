"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageAnnotation, VerificationBadge, ProtectedLabel } from "@/components/ui-components"
import { getPilot, verifyCertificate, updateEvidenceVerification } from "@/lib/mock-api"
import type { Pilot, VerificationStatus } from "@/lib/types"
import { ArrowLeft, Shield, CheckCircle2, XCircle, Clock, Loader2, ExternalLink } from "lucide-react"

const registryOptions = [
  "EU Medical Device Authority",
  "FDA Medical Device Registry",
  "UK Professional Registry",
  "Health Data Institute",
  "Clinical Research Board",
  "Other",
]

interface VerificationResult {
  status: VerificationStatus
  sourceUrl: string
  verifiedAt: string
  issuer: string
  registryId: string
}

export default function LicenseVerificationPage({ params }: { params: Promise<{ pilotId: string }> }) {
  const { pilotId } = use(params)
  const router = useRouter()
  const [pilot, setPilot] = useState<Pilot | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [registry, setRegistry] = useState("")
  const [registryId, setRegistryId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)

  useEffect(() => {
    loadPilot()
  }, [pilotId])

  const loadPilot = async () => {
    setIsLoading(true)
    const response = await getPilot(pilotId)
    setPilot(response.data)

    // Pre-fill with first evidence item if available
    if (response.data?.evidence.length) {
      const firstEvidence = response.data.evidence[0]
      setRegistry(firstEvidence.issuer)
      setRegistryId(firstEvidence.registryId)
    }

    setIsLoading(false)
  }

  const handleVerify = async () => {
    if (!registry || !registryId) return

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      const result = await verifyCertificate(registry, registryId)
      setVerificationResult({
        ...result.data,
        issuer: registry,
        registryId: registryId,
      })

      // Update evidence if it exists
      if (pilot?.evidence.length) {
        const matchingEvidence = pilot.evidence.find((e) => e.registryId === registryId)
        if (matchingEvidence) {
          await updateEvidenceVerification(pilotId, matchingEvidence.id, result.data.status)
          await loadPilot()
        }
      }
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />
      case "expired":
        return <Clock className="h-6 w-6 text-red-600" />
      case "pending":
        return <Clock className="h-6 w-6 text-amber-600" />
      default:
        return <XCircle className="h-6 w-6 text-red-600" />
    }
  }

  const getStatusAlert = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return {
          variant: "default" as const,
          className: "border-green-300 bg-green-50",
          title: "License Verified",
          description: "This license is valid and current in the registry.",
        }
      case "expired":
        return {
          variant: "destructive" as const,
          className: "border-red-300 bg-red-50",
          title: "License Expired",
          description: "This license has expired and is no longer valid.",
        }
      case "pending":
        return {
          variant: "default" as const,
          className: "border-amber-300 bg-amber-50",
          title: "Verification Pending",
          description: "This license is awaiting verification from the issuing authority.",
        }
      default:
        return {
          variant: "destructive" as const,
          className: "border-red-300 bg-red-50",
          title: "License Not Found",
          description: "No matching license was found in the registry.",
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <PageAnnotation
          title="License Verification Panel"
          criteria={[
            "Inputs: registry (text dropdown), registryId (text), Verify button",
            "Mock verify displays {status: verified|not_found|expired, details}",
            "Attaches result to evidence metadata",
            "AC: Manual verify and automated mock run must show result and timestamp",
          ]}
        />

        {/* Pilot Context */}
        {pilot && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pilot.title}</CardTitle>
                  <CardDescription>Verify licenses for this pilot</CardDescription>
                </div>
                {pilot.protectedActivityFlags.length > 0 && <ProtectedLabel />}
              </div>
            </CardHeader>
            {pilot.evidence.length > 0 && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{pilot.evidence.length} evidence item(s) attached</p>
              </CardContent>
            )}
          </Card>
        )}

        {/* Verification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              License Verification
            </CardTitle>
            <CardDescription>Enter the registry details to verify a license or certification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registry">Registry</Label>
              <Select value={registry} onValueChange={setRegistry}>
                <SelectTrigger id="registry">
                  <SelectValue placeholder="Select a registry" />
                </SelectTrigger>
                <SelectContent>
                  {registryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registryId">Registry ID</Label>
              <Input
                id="registryId"
                value={registryId}
                onChange={(e) => setRegistryId(e.target.value)}
                placeholder="e.g., EUMDA-2024-78432"
              />
              <p className="text-xs text-muted-foreground">
                Enter the exact ID as it appears on the license or certificate
              </p>
            </div>

            <Button onClick={handleVerify} disabled={!registry || !registryId || isVerifying} className="w-full">
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Verify License
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(verificationResult.status)}
                Verification Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className={getStatusAlert(verificationResult.status).className}>
                <AlertTitle>{getStatusAlert(verificationResult.status).title}</AlertTitle>
                <AlertDescription>{getStatusAlert(verificationResult.status).description}</AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">Status</p>
                  <VerificationBadge status={verificationResult.status} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">Verified At</p>
                  <p className="font-medium">{new Date(verificationResult.verifiedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">Issuer</p>
                  <p className="font-medium">{verificationResult.issuer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">Registry ID</p>
                  <p className="font-medium font-mono text-xs">{verificationResult.registryId}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Source URL</p>
                <a
                  href={verificationResult.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {verificationResult.sourceUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push(`/evidence/${pilotId}`)}
                >
                  View All Evidence
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setVerificationResult(null)
                    setRegistry("")
                    setRegistryId("")
                  }}
                >
                  Verify Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Registry IDs for Testing */}
        <Card className="mt-6 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sample Registry IDs for Testing</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1 text-muted-foreground">
            <p>
              <code className="bg-background px-1 rounded">EUMDA-2024-78432</code> → Verified (Bas's license)
            </p>
            <p>
              <code className="bg-background px-1 rounded">EXPIRED-123</code> → Expired
            </p>
            <p>
              <code className="bg-background px-1 rounded">PENDING-456</code> → Pending
            </p>
            <p>
              <code className="bg-background px-1 rounded">any-other-id</code> → Not Found
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
