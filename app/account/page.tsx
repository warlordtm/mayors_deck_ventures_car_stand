"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [profile, setProfile] = useState({ full_name: "", phone: "", nin: "", nin_status: "unverified" })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        // Not logged in
        return
      }

      const { data } = await supabase.from("profiles").select("full_name, phone, nin, nin_status").eq("id", user.id).single()
      if (data) {
        setProfile(data)
      }
    } catch (err) {
      console.error("Failed to load profile", err)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error("Not authenticated")

      // Upsert profile
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profile.full_name,
        phone: profile.phone,
        nin: profile.nin,
        nin_status: profile.nin ? "pending" : profile.nin_status,
      })

      if (error) throw error
      // Inform user that NIN will be verified
      setError("Profile saved. NIN verification status: " + (profile.nin ? "pending" : profile.nin_status))
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Your Account</CardTitle>
            <CardDescription className="text-muted-foreground">Complete your profile and submit your NIN for verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Full name</Label>
                  <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div>
                  <Label className="text-muted-foreground">NIN</Label>
                  <Input value={profile.nin} onChange={(e) => setProfile({ ...profile, nin: e.target.value })} />
                  <p className="text-sm text-muted-foreground">Verification status: {profile.nin_status}</p>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save profile"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
