"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PageAnnotation, PrivacyConsent } from "@/components/ui-components"
import { ArrowLeft } from "lucide-react"

export default function NewAnalystProfilePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

  const validate = () => {
    const e: Record<string,string> = {}
    if(!name.trim()) e.name = "Name is required"
    if(!email.trim()) e.email = "Email is required"
    if(!consent) e.consent = "You must agree to continue"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if(!validate()) return
    // For prototype: simulate account creation and route to analyst dashboard
    router.push("/dashboard/analyst")
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="link" onClick={() => router.push("/")}> 
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to role selection
        </Button>

        <PageAnnotation
          title="Analyst Onboarding"
          criteria={[
            "Collect minimal account info for analyst role",
            "Ensure explicit consent before verification actions",
            "Provide links to demo dataset and evidence inspection tools",
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Analyst Account Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={e=>setName(e.target.value)} required />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <PrivacyConsent checked={consent} onChange={v=>setConsent(v)} />
              {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}

              <div className="flex gap-2">
                <Button type="submit">Create Analyst Account</Button>
                <Button variant="outline" onClick={()=>router.push('/dashboard/analyst')}>Skip (demo)</Button>
              </div>

            </form>

            <div className="mt-6 text-sm text-muted-foreground">
              <p className="font-medium">Analyst onboarding checklist</p>
              <ul className="list-disc ml-5 mt-2">
                <li>Access demo pilots and evidence bundles</li>
                <li>Use License Verification panel to check registries</li>
                <li>Export audit slices for compliance reporting</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
