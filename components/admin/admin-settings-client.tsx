"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface AdminSettingsClientProps {
  initialSettings: Record<string, string>
}

export default function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings || {})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSave = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage("Settings saved successfully!")
        // Refresh the page to show updated content
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        setMessage("Failed to save settings")
      }
    } catch (error) {
      setMessage("Error saving settings")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-foreground">Site Information</CardTitle>
          <CardDescription className="text-muted-foreground">Basic information about your dealership</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="brand_name" className="text-sm font-medium text-muted-foreground">Brand Name</Label>
            <Input
              id="brand_name"
              value={settings.brand_name || ""}
              onChange={(e) => updateSetting("brand_name", e.target.value)}
              className="border-border bg-card text-foreground"
              placeholder="Gaskiya Auto"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="brand_tagline" className="text-sm font-medium text-muted-foreground">Brand Tagline</Label>
            <Input
              id="brand_tagline"
              value={settings.brand_tagline || ""}
              onChange={(e) => updateSetting("brand_tagline", e.target.value)}
              className="border-border bg-card text-foreground"
              placeholder="Where Luxury Meets Performance"
            />
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
            <Label htmlFor="whatsapp_number" className="text-sm font-medium text-muted-foreground">WhatsApp Number</Label>
            <Input
              id="whatsapp_number"
              value={settings.whatsapp_number || ""}
              onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
              className="border-border bg-card text-foreground"
              placeholder="+234 800 000 0000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_phone" className="text-sm font-medium text-muted-foreground">Contact Phone</Label>
            <Input
              id="contact_phone"
              value={settings.contact_phone || ""}
              onChange={(e) => updateSetting("contact_phone", e.target.value)}
              className="border-border bg-card text-foreground"
              placeholder="+234 800 000 0000"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_email" className="text-sm font-medium text-muted-foreground">Contact Email</Label>
            <Input
              id="contact_email"
              value={settings.contact_email || ""}
              onChange={(e) => updateSetting("contact_email", e.target.value)}
              className="border-border bg-card text-foreground"
              type="email"
              placeholder="hello@gaskiya.autos"
            />
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
            <Label htmlFor="test_drive_fee" className="text-sm font-medium text-muted-foreground">Test Drive Fee (₦)</Label>
            <Input
              id="test_drive_fee"
              value={settings.test_drive_fee || ""}
              onChange={(e) => updateSetting("test_drive_fee", e.target.value)}
              className="border-border bg-card text-foreground"
              placeholder="50000"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}