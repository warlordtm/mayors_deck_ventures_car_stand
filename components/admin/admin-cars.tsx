"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { AdminForm } from "@/components/admin/admin-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
}

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)

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

  const handleCreate = async (data: any) => {
    try {
      let body: string | FormData
      let headers: Record<string, string> = {}

      if (data.images && data.images.length > 0) {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          if (key === 'images') {
            for (let i = 0; i < data.images.length; i++) {
              formData.append('images', data.images[i])
            }
          } else {
            formData.append(key, data[key])
          }
        })
        body = formData
      } else {
        body = JSON.stringify(data)
        headers = { "Content-Type": "application/json" }
      }

      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers,
        body,
      })

      if (res.ok) {
        toast({ title: "Success", description: "Car created successfully" })
        setShowForm(false)
        fetchCars()
      } else {
        const error = await res.json()
        toast({ title: "Error", description: error.error || "Failed to create car", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to create car", variant: "destructive" })
    }
  }

  const handleUpdate = async (data: any) => {
    console.log("handleUpdate called with data:", data)
    if (!editingCar) {
      console.log("No editingCar, returning")
      return
    }

    try {
      let body: string | FormData
      let headers: Record<string, string> = {}

      if (data.images && data.images.length > 0) {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          if (key === 'images') {
            for (let i = 0; i < data.images.length; i++) {
              formData.append('images', data.images[i])
            }
          } else {
            formData.append(key, data[key])
          }
        })
        body = formData
      } else {
        body = JSON.stringify(data)
        headers = { "Content-Type": "application/json" }
      }

      const res = await fetch(`/api/admin/cars/${editingCar.id}`, {
        method: "PUT",
        headers,
        body,
      })

      if (res.ok) {
        console.log("Update successful")
        toast({ title: "Success", description: "Car updated successfully" })
        setEditingCar(null)
        fetchCars()
      } else {
        const errorText = await res.text()
        console.error("Update failed:", res.status, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          toast({ title: "Error", description: errorJson.error || "Failed to update car", variant: "destructive" })
        } catch (e) {
          toast({ title: "Error", description: `Failed to update car (status ${res.status})`, variant: "destructive" })
        }
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to update car", variant: "destructive" })
    }
  }

  const handleDelete = async (car: Car) => {
    console.log("handleDelete called for:", car.name)
    if (!confirm(`Are you sure you want to delete "${car.name}"?`)) {
      console.log("Delete cancelled by user")
      return
    }

    try {
      console.log("Making DELETE request to:", `/api/admin/cars/${car.id}`)
      const res = await fetch(`/api/admin/cars/${car.id}`, { method: "DELETE" })
      console.log("DELETE response status:", res.status)
      if (res.ok) {
        console.log("Delete successful")
        toast({ title: "Success", description: "Car deleted" })
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
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "brand", label: "Brand" },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ]

  const formFields = [
    { name: "name", label: "Name", type: "text" as const, required: true },
    { name: "model", label: "Model", type: "text" as const },
    { name: "year", label: "Year", type: "number" as const },
    {
      name: "category_id",
      label: "Category",
      type: "select" as const,
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
    { name: "brand", label: "Brand", type: "text" as const },
    { name: "price", label: "Price", type: "number" as const },
    { name: "show_price", label: "Show Price", type: "switch" as const },
    { name: "status", label: "Status", type: "select" as const, options: [
      { value: "available", label: "Available" },
      { value: "sold", label: "Sold" },
      { value: "reserved", label: "Reserved" },
    ] },
    { name: "is_featured", label: "Featured", type: "switch" as const },
    { name: "description", label: "Description", type: "textarea" as const },
    { name: "video", label: "Video", type: "file" as const, accept: "video/*" },
    { name: "images", label: "Images", type: "file" as const, multiple: true },
  ]

  if (loading) return <div className="flex justify-center p-8">Loading...</div>

  return (
    <div className="space-y-6">
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
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Button>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="sr-only">
              {editingCar ? "Edit Car" : "Add New Car"}
            </DialogTitle>
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
                initialData={editingCar || { show_price: true, status: "available" }}
                onSubmit={editingCar ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditingCar(null) }}
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
      />
    </div>
  )
}
