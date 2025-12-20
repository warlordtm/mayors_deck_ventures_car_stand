"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { AdminForm } from "@/components/admin/admin-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
}

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
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
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    if (!editingCar) return

    try {
      const res = await fetch(`/api/admin/cars/${editingCar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast({ title: "Success", description: "Car updated successfully" })
        setEditingCar(null)
        fetchCars()
      } else {
        const error = await res.json()
        toast({ title: "Error", description: error.error || "Failed to update car", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to update car", variant: "destructive" })
    }
  }

  const handleDelete = async (car: Car) => {
    if (!confirm(`Are you sure you want to delete "${car.name}"?`)) return

    try {
      const res = await fetch(`/api/admin/cars/${car.id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Success", description: "Car deleted" })
        fetchCars()
      } else {
        const error = await res.json()
        toast({ title: "Error", description: error.error || "Failed to delete car", variant: "destructive" })
      }
    } catch (e) {
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
    { name: "slug", label: "Slug", type: "text" as const, required: false },
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
          <DialogContent className="max-w-3xl">
            <AdminForm
              title={editingCar ? "Edit Car" : "Add New Car"}
              fields={formFields}
              initialData={editingCar || { show_price: true, status: "available" }}
              onSubmit={editingCar ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditingCar(null) }}
              autoSlug={{ sourceField: "name", targetField: "slug" }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AdminDataTable
        data={cars}
        columns={columns}
        onEdit={(item) => setEditingCar(item)}
        onDelete={handleDelete}
        searchPlaceholder="Search cars..."
      />
    </div>
  )
}
