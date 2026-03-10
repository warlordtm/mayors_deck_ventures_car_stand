"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { AdminForm } from "@/components/admin/admin-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MotionDiv, fadeInUp } from "@/components/motion-wrappers"

interface Powerbike {
  id: string
  name: string
  slug?: string | null
  model?: string
  year?: number
  category_id?: string | null
  brand?: string
  price?: number | null
  show_price?: boolean
  status?: string
  is_featured?: boolean
  created_at?: string
  images?: { image_url: string }[]
  transmission?: string
  fuel_type?: string
  mileage?: string
  condition?: string
  warranty?: string
  location?: string
  interior_features?: string
  exterior_features?: string
}

export default function AdminPowerbikes() {
  const [powerbikes, setPowerbikes] = useState<Powerbike[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [showForm, setShowForm] = useState(false)
  const [editingPowerbike, setEditingPowerbike] = useState<Powerbike | null>(null)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({ name: "", slug: "" })
  const [operationLoading, setOperationLoading] = useState(false)

  console.log("AdminPowerbikes render - showForm:", showForm, "editingPowerbike:", editingPowerbike)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const { toast } = useToast()

  const fetchPowerbikes = async () => {
    try {
      const res = await fetch("/api/admin/powerbikes")
      if (res.ok) {
        const data = await res.json()
        setPowerbikes(data.powerbikes || [])
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to fetch powerbikes", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to fetch powerbikes", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories((data.categories || []).map((c: any) => ({ id: c.id, name: c.name })))
      }
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    fetchPowerbikes()
    fetchCategories()
  }, [])

  const uploadWithProgress = (url: string, formData: FormData, method: string = 'POST') => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Determine which fields are being uploaded
      const hasImages = formData.has('images')
      const hasVideo = formData.has('video')

      // Initialize progress to 0
      setUploadProgress(prev => ({
        ...prev,
        ...(hasImages && { images: 0 }),
        ...(hasVideo && { video: 0 })
      }))

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(prev => ({
            ...prev,
            ...(hasImages && { images: percentComplete }),
            ...(hasVideo && { video: percentComplete })
          }))
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(new Error(xhr.responseText))
        }
      })

      xhr.addEventListener('error', () => reject(new Error('Upload failed')))
      xhr.open(method, url)
      xhr.send(formData)
    })
  }

  const handleCreate = async (data: any) => {
    setSaving(true)
    // Initialize progress for any files being uploaded
    const initialProgress: Record<string, number> = {}
    if (data.images && data.images.length > 0) initialProgress.images = 0
    if (data.video) initialProgress.video = 0
    setUploadProgress(initialProgress)

    try {
      let response

      if ((data.images && data.images.length > 0) || data.video) {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          if (key === 'images') {
            for (let i = 0; i < data.images.length; i++) {
              formData.append('images', data.images[i])
            }
          } else if (key === 'video' && data.video) {
            formData.append('video', data.video)
          } else {
            formData.append(key, data[key])
          }
        })
        response = await uploadWithProgress("/api/admin/powerbikes", formData, "POST")
      } else {
        const res = await fetch("/api/admin/powerbikes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        response = await res.json()
        if (!res.ok) throw new Error(response.error || "Failed to create powerbike")
      }

      toast({ title: "Success", description: "Powerbike added successfully!" })
      setPowerbikes(prev => [response.powerbike, ...prev])
      setShowForm(false)
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create powerbike", variant: "destructive" })
    } finally {
      setSaving(false)
      setUploadProgress({})
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingPowerbike) return

    setSaving(true)
    // Initialize progress for any files being uploaded
    const initialProgress: Record<string, number> = {}
    if (data.images && data.images.length > 0) initialProgress.images = 0
    if (data.video) initialProgress.video = 0
    setUploadProgress(initialProgress)

    try {
      let response

      if ((data.images && data.images.length > 0) || data.video) {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          if (key === 'images') {
            for (let i = 0; i < data.images.length; i++) {
              formData.append('images', data.images[i])
            }
          } else if (key === 'video' && data.video) {
            formData.append('video', data.video)
          } else {
            formData.append(key, data[key])
          }
        })
        response = await uploadWithProgress(`/api/admin/powerbikes/${editingPowerbike.id}`, formData, "PUT")
      } else {
        const res = await fetch(`/api/admin/powerbikes/${editingPowerbike.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        response = await res.json()
        if (!res.ok) throw new Error(response.error || "Failed to update powerbike")
      }

      toast({ title: "Success", description: "Powerbike updated successfully!" })
      setPowerbikes(prev => prev.map(p => p.id === editingPowerbike.id ? response.powerbike : p))
      setShowForm(false)
      setEditingPowerbike(null)
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update powerbike", variant: "destructive" })
    } finally {
      setSaving(false)
      setUploadProgress({})
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this powerbike?')) return

    setOperationLoading(true)
    try {
      const res = await fetch(`/api/admin/powerbikes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPowerbikes(prev => prev.filter(p => p.id !== id))
        toast({ title: "Success", description: "Powerbike deleted successfully" })
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to delete powerbike", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete powerbike", variant: "destructive" })
    } finally {
      setOperationLoading(false)
    }
  }

  const handleEdit = (powerbike: Powerbike) => {
    setEditingPowerbike(powerbike)
    setShowForm(true)
  }

  const handleAddCategory = async () => {
    if (!newCategoryData.name || !newCategoryData.slug) return

    setOperationLoading(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategoryData)
      })

      if (res.ok) {
        const data = await res.json()
        setCategories(prev => [...prev, { id: data.category.id, name: data.category.name }])
        setShowAddCategoryModal(false)
        setNewCategoryData({ name: "", slug: "" })
        toast({ title: "Success", description: "Category added successfully" })
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to add category", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to add category", variant: "destructive" })
    } finally {
      setOperationLoading(false)
    }
  }

  const formFields = [
    { name: "name", label: "Model", type: "text" as const, required: true },
    { name: "model", label: "Engine", type: "text" as const },
    { name: "year", label: "Year", type: "number" as const },
    {
      name: "category_id",
      label: "Category",
      type: "select" as const,
      required: true,
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
    { name: "price", label: "Price (₦)", type: "number" as const },
    { name: "show_price", label: "Show Price", type: "switch" as const },
    { name: "transmission", label: "Transmission", type: "select" as const, options: [
      { value: "Automatic", label: "Automatic" },
      { value: "Manual", label: "Manual" },
      { value: "CVT", label: "CVT" },
    ] },
    { name: "fuel_type", label: "Fuel Type", type: "select" as const, options: [
      { value: "Petrol", label: "Petrol" },
      { value: "Diesel", label: "Diesel" },
      { value: "Electric", label: "Electric" },
      { value: "Hybrid", label: "Hybrid" },
    ] },
    { name: "mileage", label: "Mileage", type: "text" as const },
    { name: "condition", label: "Condition", type: "select" as const, options: [
      { value: "Excellent", label: "Excellent" },
      { value: "Very Good", label: "Very Good" },
      { value: "Good", label: "Good" },
      { value: "Fair", label: "Fair" },
    ] },
    { name: "warranty", label: "Warranty", type: "text" as const },
    { name: "location", label: "Location", type: "text" as const },
    { name: "status", label: "Status", type: "select" as const, options: [
      { value: "available", label: "Available" },
      { value: "sold", label: "Sold" },
      { value: "reserved", label: "Reserved" },
    ] },
    { name: "is_featured", label: "Featured", type: "switch" as const },
    { name: "description", label: "Description", type: "textarea" as const },
    { name: "exterior_features", label: "Features", type: "textarea" as const },
    { name: "video", label: "Video", type: "file" as const, accept: "video/*" },
    { name: "images", label: "Images", type: "file" as const, multiple: true },
  ]

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (value: number) => value ? `$${value.toLocaleString()}` : 'N/A' },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'created_at', label: 'Created', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
  ]

  return (
    <MotionDiv className="space-y-6" variants={fadeInUp}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Powerbikes</h1>
          <p className="text-muted-foreground">Manage your powerbike inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddCategoryModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Powerbike
          </Button>
        </div>
      </div>

      <AdminDataTable
        data={powerbikes}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search powerbikes..."
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle>{editingPowerbike ? 'Edit Powerbike' : 'Add Powerbike'}</DialogTitle>
          </VisuallyHidden.Root>
          <AdminForm
            title=""
            fields={formFields}
            initialData={editingPowerbike || {
              show_price: true,
              status: "available",
              transmission: "Automatic",
              fuel_type: "Petrol",
              condition: "Excellent",
              location: "Abuja"
            }}
            onSubmit={editingPowerbike ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false)
              setEditingPowerbike(null)
              setUploadProgress({})
            }}
            loading={saving}
            uploadProgress={uploadProgress}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
        <DialogContent>
          <VisuallyHidden.Root>
            <DialogTitle>Add Category</DialogTitle>
          </VisuallyHidden.Root>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Sports Bikes"
              />
            </div>
            <div>
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                value={newCategoryData.slug}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g., sports-bikes"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddCategoryModal(false)}>Cancel</Button>
              <Button onClick={handleAddCategory} disabled={operationLoading}>
                {operationLoading ? 'Adding...' : 'Add Category'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MotionDiv>
  )
}