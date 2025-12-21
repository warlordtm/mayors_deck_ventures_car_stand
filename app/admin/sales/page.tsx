"use client"

import { useState, useEffect } from "react"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AdminForm } from "@/components/admin/admin-form"
import { useToast } from "@/hooks/use-toast"

interface Sale {
  id: string
  car_id: string | null
  customer_id: string | null
  sale_price: number
  payment_method: string | null
  sale_date: string
  created_at: string
  car?: { name: string }
  customer?: { name: string }
}

export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [cars, setCars] = useState<{ id: string; name: string }[]>([])
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()

  const fetchSales = async () => {
    try {
      const res = await fetch("/api/admin/sales")
      if (res.ok) {
        const data = await res.json()
        setSales(data.sales || [])
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to fetch sales", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to fetch sales", variant: "destructive" })
    }
  }

  const fetchData = async () => {
    try {
      const [carsRes, customersRes] = await Promise.all([
        fetch("/api/admin/cars"),
        fetch("/api/admin/customers")
      ])

      if (carsRes.ok) {
        const carsData = await carsRes.json()
        setCars(carsData.cars?.map((c: any) => ({ id: c.id, name: c.name })) || [])
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json()
        setCustomers(customersData.customers?.map((c: any) => ({ id: c.id, name: c.name })) || [])
      }
    } catch (e) {
      console.error("Failed to fetch data")
    }
  }

  useEffect(() => {
    Promise.all([fetchSales(), fetchData()]).then(() => setLoading(false))
  }, [])

  const handleCreate = async (data: any) => {
    try {
      const res = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast({ title: "Success", description: "Sale recorded successfully" })
        setShowForm(false)
        fetchSales()
      } else {
        const error = await res.json()
        toast({ title: "Error", description: error.error || "Failed to record sale", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to record sale", variant: "destructive" })
    }
  }

  const columns = [
    {
      key: "car",
      label: "Car",
      render: (value: any) => value?.name || "N/A"
    },
    {
      key: "customer",
      label: "Customer",
      render: (value: any) => value?.name || "N/A"
    },
    {
      key: "sale_price",
      label: "Sale Price",
      render: (value: number) => `₦${value.toLocaleString()}`
    },
    { key: "payment_method", label: "Payment Method" },
    {
      key: "sale_date",
      label: "Sale Date",
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ]

  const formFields = [
    {
      name: "car_id",
      label: "Car",
      type: "select" as const,
      options: cars.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      name: "customer_id",
      label: "Customer",
      type: "select" as const,
      options: customers.map((c) => ({ value: c.id, label: c.name })),
    },
    { name: "sale_price", label: "Sale Price (₦)", type: "number" as const, required: true },
    {
      name: "payment_method",
      label: "Payment Method",
      type: "select" as const,
      options: [
        { value: "cash", label: "Cash" },
        { value: "bank_transfer", label: "Bank Transfer" },
        { value: "card", label: "Card" },
      ],
    },
    { name: "sale_date", label: "Sale Date", type: "date" as const },
  ]

  if (loading) return <div className="flex justify-center p-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales</h1>
          <p className="text-muted-foreground">Record and track completed sales</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <Button onClick={() => setShowForm(true)}>
            Record Sale
          </Button>
          <DialogContent className="max-w-2xl">
            <DialogTitle className="sr-only">Record New Sale</DialogTitle>
            <AdminForm
              title="Record New Sale"
              fields={formFields}
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AdminDataTable
        data={sales}
        columns={columns}
        searchPlaceholder="Search sales..."
      />
    </div>
  )
}