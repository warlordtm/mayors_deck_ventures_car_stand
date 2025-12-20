import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AdminSettingsClient from "@/components/admin/admin-settings-client"

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
    <div className="min-h-screen bg-background pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Site Settings</h1>
            <p className="text-muted-foreground">Configure your site settings and preferences</p>
          </div>
          <Button asChild variant="outline" className="border-border text-muted-foreground hover:bg-card/10 bg-transparent">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        <AdminSettingsClient initialSettings={settingsMap} />
      </div>
    </div>
  )
}
