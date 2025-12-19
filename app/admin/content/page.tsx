"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { AdminForm } from "@/components/admin/admin-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContentBlock {
  id: string
  key: string
  title: string
  content: string
  image_url: string
  display_order: number
  is_active: boolean
  created_at: string
}

export default function ContentPage() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const { toast } = useToast()

  const fetchContentBlocks = async () => {
    try {
      const response = await fetch("/api/admin/content")
      if (response.ok) {
        const data = await response.json()
        setContentBlocks(data.contentBlocks)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch content blocks",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content blocks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContentBlocks()
  }, [])

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Content block created successfully",
        })
        setShowForm(false)
        fetchContentBlocks()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create content block",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content block",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingBlock) return

    try {
      const response = await fetch(`/api/admin/content/${editingBlock.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Content block updated successfully",
        })
        setEditingBlock(null)
        fetchContentBlocks()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update content block",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content block",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (block: ContentBlock) => {
    if (!confirm(`Are you sure you want to delete "${block.title}"?`)) return

    try {
      const response = await fetch(`/api/admin/content/${block.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Content block deleted successfully",
        })
        fetchContentBlocks()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete content block",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content block",
        variant: "destructive",
      })
    }
  }

  const columns = [
    {
      key: "key",
      label: "Key",
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "is_active",
      label: "Active",
      render: (value: boolean) => value ? "Yes" : "No",
    },
    {
      key: "display_order",
      label: "Order",
    },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  const formFields = [
    {
      name: "key",
      label: "Key",
      type: "text" as const,
      required: true,
      placeholder: "e.g., home_hero_title",
    },
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      required: true,
    },
    {
      name: "content",
      label: "Content",
      type: "textarea" as const,
    },
    {
      name: "image_url",
      label: "Image URL",
      type: "text" as const,
    },
    {
      name: "display_order",
      label: "Display Order",
      type: "number" as const,
    },
    {
      name: "is_active",
      label: "Active",
      type: "switch" as const,
    },
  ]

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">Manage site content blocks and pages</p>
        </div>
        <Dialog open={showForm || !!editingBlock} onOpenChange={(open) => {
          if (!open) {
            setShowForm(false)
            setEditingBlock(null)
          }
        }}>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Content Block
          </Button>
          <DialogContent className="max-w-2xl">
            <AdminForm
              title={editingBlock ? "Edit Content Block" : "Add New Content Block"}
              fields={editingBlock ? formFields.slice(1) : formFields} // Exclude key when editing
              initialData={editingBlock || {}}
              onSubmit={editingBlock ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false)
                setEditingBlock(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AdminDataTable
        data={contentBlocks}
        columns={columns}
        onEdit={setEditingBlock}
        onDelete={handleDelete}
        searchPlaceholder="Search content blocks..."
      />
    </div>
  )
}