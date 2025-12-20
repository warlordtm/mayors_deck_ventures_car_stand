import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Verify the signed-in user has admin role in profiles
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileErr || !profile || profile.role !== "admin") {
    redirect("/admin/login")
  }

  const { data: settings } = await supabase.from("site_settings").select("*")

  const settingsMap: Record<string, string> = {}
  settings?.forEach((setting) => {
    settingsMap[setting.key] = setting.value || ""
  })

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure your site settings and preferences</p>
          </div>
          <Button asChild variant="outline" className="border-border text-muted-foreground hover:bg-card/10 bg-transparent">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">Site Information</CardTitle>
              <CardDescription className="text-muted-foreground">Basic information about your dealership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Brand Name</label>
                <div className="rounded-md border border-border bg-card px-3 py-2 text-foreground">
                  {settingsMap["brand_name"] || "Gaskiya Auto"}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Brand Tagline</label>
                <div className="rounded-md border border-border bg-card px-3 py-2 text-foreground">
                  {settingsMap["brand_tagline"] || "Where Luxury Meets Performance"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">Contact Information</CardTitle>
              <CardDescription className="text-muted-foreground">How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">WhatsApp Number</label>
                <div className="rounded-md border border-border bg-card px-3 py-2 text-foreground">
                  {settingsMap["whatsapp_number"] || "+1234567890"}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Contact Phone</label>
                <div className="rounded-md border border-border bg-card px-3 py-2 text-foreground">
                  {settingsMap["contact_phone"] || "+1234567890"}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                <div className="rounded-md border border-border bg-card px-3 py-2 text-foreground">
                  {settingsMap["contact_email"] || "contact@luxurycars.com"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">Test Drive Settings</CardTitle>
              <CardDescription className="text-muted-foreground">Configure test drive booking options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Test Drive Fee</label>
                <div className="rounded-md border border-border bg-card px-3 py-2 text-foreground">
                  ${settingsMap["test_drive_fee"] || "99.99"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
