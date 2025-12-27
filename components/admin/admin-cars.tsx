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

interface Car {
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

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({ name: "", slug: "" })
  const [operationLoading, setOperationLoading] = useState(false)

  console.log("AdminCars render - showForm:", showForm, "editingCar:", editingCar)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const { toast } = useToast()

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/admin/cars")
      if (res.ok) {
        const data = await res.json()
        setCars(data.cars || [])
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to fetch cars", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to fetch cars", variant: "destructive" })
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
    fetchCars()
    fetchCategories()
  }, [])

  const uploadWithProgress = (url: string, formData: FormData, method: string = 'POST') => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Determine which fields are being uploaded
      const hasImages = formData.has('images')
      const hasVideo = formData.has('video')

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setUploadProgress(prev => ({
            ...prev,
            ...(hasImages && { images: progress }),
            ...(hasVideo && { video: progress })
          }))
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Set progress to 100% on successful completion
          setUploadProgress(prev => ({
            ...prev,
            ...(hasImages && { images: 100 }),
            ...(hasVideo && { video: 100 })
          }))
          resolve(xhr.response)
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open(method, url)
      xhr.send(formData)
    })
  }

  const handleCreate = async (data: any) => {
    setSaving(true)
    setUploadProgress({})
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
        response = await uploadWithProgress("/api/admin/cars", formData, "POST")
      } else {
        const res = await fetch("/api/admin/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        response = await res.json()
        if (!res.ok) throw new Error(response.error || "Failed to create car")
      }

      toast({ title: "Success", description: "Car added successfully!" })
      setShowForm(false)
      fetchCars()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message || "Failed to create car", variant: "destructive" })
    } finally {
      setSaving(false)
      setUploadProgress({})
    }
  }

  const handleUpdate = async (data: any) => {
    console.log("handleUpdate called with data:", data)
    if (!editingCar) {
      console.log("No editingCar, returning")
      return
    }

    setSaving(true)
    setUploadProgress({})
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
        response = await uploadWithProgress(`/api/admin/cars/${editingCar.id}`, formData, "PUT")
      } else {
        const res = await fetch(`/api/admin/cars/${editingCar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        response = await res.json()
        if (!res.ok) throw new Error(response.error || "Failed to update car")
      }

      console.log("Update successful")
      toast({ title: "Success", description: "Car updated successfully!" })
      setEditingCar(null)
      fetchCars()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message || "Failed to update car", variant: "destructive" })
    } finally {
      setSaving(false)
      setUploadProgress({})
    }
  }

  const handleDelete = async (car: Car) => {
    console.log("handleDelete called for:", car.name)
    if (!confirm(`Are you sure you want to delete "${car.name}"?`)) {
      console.log("Delete cancelled by user")
      return
    }

    setOperationLoading(true)
    try {
      console.log("Making DELETE request to:", `/api/admin/cars/${car.id}`)
      const res = await fetch(`/api/admin/cars/${car.id}`, { method: "DELETE" })
      console.log("DELETE response status:", res.status)
      if (res.ok) {
        console.log("Delete successful")
        toast({ title: "Success", description: "Car deleted successfully!" })
        fetchCars()
      } else {
        const errorText = await res.text()
        console.error("Delete failed:", res.status, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          toast({ title: "Error", description: errorJson.error || "Failed to delete car", variant: "destructive" })
        } catch (e) {
          toast({ title: "Error", description: `Failed to delete car (status ${res.status})`, variant: "destructive" })
        }
      }
    } catch (e) {
      console.error("Delete request error:", e)
      toast({ title: "Error", description: "Failed to delete car", variant: "destructive" })
    } finally {
      setOperationLoading(false)
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    {
      key: "category",
      label: "Category",
      render: (value: any) => value?.name || "-",
    },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ]

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
    { name: "interior_features", label: "Interior Features", type: "textarea" as const },
    { name: "exterior_features", label: "Exterior Features", type: "textarea" as const },
    { name: "video", label: "Video", type: "file" as const, accept: "video/*" },
    { name: "images", label: "Images", type: "file" as const, multiple: true },
  ]

  if (loading) return <div className="flex justify-center p-8">Loading...</div>

  return (
    <MotionDiv {...fadeInUp} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Car Inventory</h1>
          <p className="text-muted-foreground">Add, edit, or remove vehicles from your inventory</p>
        </div>
        <Dialog open={showForm || !!editingCar} onOpenChange={(open) => {
          if (!open) {
            setShowForm(false)
            setEditingCar(null)
          }
        }}>
          <Button onClick={() => setShowForm(true)} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Button>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <VisuallyHidden.Root>
              <DialogTitle>
                {editingCar ? "Edit Car" : "Add New Car"}
              </DialogTitle>
            </VisuallyHidden.Root>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {editingCar ? "Edit Car" : "Add New Car"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {editingCar ? "Update the car details below" : "Fill in the details to add a new car to your inventory"}
                </p>
              </div>
              <AdminForm
                title=""
                fields={formFields}
                initialData={editingCar || {
                  show_price: true,
                  status: "available",
                  transmission: "Automatic",
                  fuel_type: "Petrol",
                  condition: "Excellent",
                  location: "Abuja"
                }}
                onSubmit={editingCar ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditingCar(null) }}
                loading={saving}
                uploadProgress={uploadProgress}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AdminDataTable
        data={cars}
        columns={columns}
        onEdit={(item) => {
          console.log("Edit clicked for item:", item)
          setEditingCar(item)
        }}
        onDelete={(item) => {
          console.log("Delete clicked for item:", item)
          handleDelete(item)
        }}
        searchPlaceholder="Search cars..."
        loading={operationLoading}
      />
    </MotionDiv>
  )
}
