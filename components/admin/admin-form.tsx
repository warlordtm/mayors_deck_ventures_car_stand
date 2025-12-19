"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FormField {
  name: string
  label: string
  type: "text" | "email" | "textarea" | "select" | "switch" | "number"
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface AdminFormProps {
  fields: FormField[]
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => void
  onCancel?: () => void
  submitLabel?: string
  title?: string
  loading?: boolean
}

export function AdminForm({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Save",
  title,
  loading = false,
}: AdminFormProps) {
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <Select
                  value={formData[field.name] || ""}
                  onValueChange={(value) => updateField(field.name, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "switch" ? (
                <Switch
                  id={field.name}
                  checked={formData[field.name] || false}
                  onCheckedChange={(checked) => updateField(field.name, checked)}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : submitLabel}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}