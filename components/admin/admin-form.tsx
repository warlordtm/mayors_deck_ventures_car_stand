"use client"

import React, { useState, useEffect } from "react"
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
  type: "text" | "email" | "textarea" | "select" | "switch" | "number" | "file" | "date"
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  multiple?: boolean
}

interface AdminFormProps {
  fields: FormField[]
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => void
  onCancel?: () => void
  submitLabel?: string
  title?: string
  loading?: boolean
  // Optional: automatically generate a slug from a source field into a target field
  autoSlug?: { sourceField: string; targetField: string }
}

export function AdminForm({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Save",
  title,
  loading = false,
  autoSlug,
}: AdminFormProps) {
  const [formData, setFormData] = useState(initialData)

  // remember last auto-generated slug to avoid clobbering a manual edit
  const [lastAutoSlug, setLastAutoSlug] = useState<string | null>(null)

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")

  // Effect: generate slug when sourceField changes
  useEffect(() => {
    if (!autoSlug) return

    const source = autoSlug.sourceField
    const target = autoSlug.targetField

    const value = formData[source]
    if (typeof value !== "string" || value.length === 0) return

    const generated = slugify(value)

    // Only set target if it's empty OR previously auto-generated (so we don't clobber manual edits)
    const currentTarget = formData[target]
    if (!currentTarget || currentTarget === lastAutoSlug) {
      setFormData((prev) => ({ ...prev, [target]: generated }))
      setLastAutoSlug(generated)
    }
  }, [formData[autoSlug?.sourceField || ''], autoSlug, lastAutoSlug])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // if user edits the target slug manually, stop treating it as auto-generated
    if (autoSlug && name === autoSlug.targetField) {
      setLastAutoSlug(null)
    }
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
              ) : field.type === "file" ? (
                <input
                  id={field.name}
                  type="file"
                  multiple={field.multiple}
                  onChange={(e) => updateField(field.name, e.target.files)}
                  required={field.required}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              ) : field.type === "date" ? (
                <Input
                  id={field.name}
                  type="date"
                  value={formData[field.name] || ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
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