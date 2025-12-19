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

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!adminUser) {
    redirect("/admin/login")
  }

  const { data: settings } = await supabase.from("site_settings").select("*")

  const settingsMap: Record<string, string> = {}
  settings?.forEach((setting) => {
    settingsMap[setting.key] = setting.value || ""
  })

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Settings</h1>
            <p className="text-zinc-400">Configure your site settings and preferences</p>
          </div>
          <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Site Information</CardTitle>
              <CardDescription className="text-zinc-400">Basic information about your dealership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Brand Name</label>
                <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-white">
                  {settingsMap["brand_name"] || "Elite Motors"}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Brand Tagline</label>
                <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-white">
                  {settingsMap["brand_tagline"] || "Where Luxury Meets Performance"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Contact Information</CardTitle>
              <CardDescription className="text-zinc-400">How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">WhatsApp Number</label>
                <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-white">
                  {settingsMap["whatsapp_number"] || "+1234567890"}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Contact Phone</label>
                <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-white">
                  {settingsMap["contact_phone"] || "+1234567890"}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Contact Email</label>
                <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-white">
                  {settingsMap["contact_email"] || "contact@luxurycars.com"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Test Drive Settings</CardTitle>
              <CardDescription className="text-zinc-400">Configure test drive booking options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Test Drive Fee</label>
                <div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-white">
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
