"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { AdminForm } from "@/components/admin/admin-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  seo_title: string
  seo_description: string
  description: string
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category created successfully",
        })
        setShowForm(false)
        fetchCategories()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingCategory) return

    try {
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
        setEditingCategory(null)
        fetchCategories()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        fetchCategories()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "slug",
      label: "Slug",
    },
    {
      key: "seo_title",
      label: "SEO Title",
    },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  const formFields = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text" as const,
      required: true,
    },
    {
      name: "image_url",
      label: "Image URL",
      type: "text" as const,
    },
    {
      name: "seo_title",
      label: "SEO Title",
      type: "text" as const,
    },
    {
      name: "seo_description",
      label: "SEO Description",
      type: "textarea" as const,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
    },
  ]

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Category Management</h1>
          <p className="text-muted-foreground">Manage car categories and their settings</p>
        </div>
        <Dialog open={showForm || !!editingCategory} onOpenChange={(open) => {
          if (!open) {
            setShowForm(false)
            setEditingCategory(null)
          }
        }}>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <DialogContent className="max-w-2xl">
            <AdminForm
              title={editingCategory ? "Edit Category" : "Add New Category"}
              fields={formFields}
              initialData={editingCategory || {}}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false)
                setEditingCategory(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AdminDataTable
        data={categories}
        columns={columns}
        onEdit={setEditingCategory}
        onDelete={handleDelete}
        searchPlaceholder="Search categories..."
      />
    </div>
  )
}