"use client"

import { useState, useEffect } from "react"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { AdminForm } from "@/components/admin/admin-form"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  created_at: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers")
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.customers || [])
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to fetch customers", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to fetch customers", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleCreate = async (data: any) => {
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast({ title: "Success", description: "Customer added successfully" })
        setShowForm(false)
        fetchCustomers()
      } else {
        const error = await res.json()
        toast({ title: "Error", description: error.error || "Failed to add customer", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to add customer", variant: "destructive" })
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "created_at",
      label: "Joined",
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ]

  const formFields = [
    { name: "name", label: "Name", type: "text" as const, required: true },
    { name: "email", label: "Email", type: "email" as const, required: true },
    { name: "phone", label: "Phone", type: "text" as const },
  ]

  if (loading) return <div className="flex justify-center p-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage customer database and view purchase history</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <Button onClick={() => setShowForm(true)}>
            Add Customer
          </Button>
          <DialogContent className="max-w-2xl">
            <VisuallyHidden.Root>
              <DialogTitle>Add New Customer</DialogTitle>
            </VisuallyHidden.Root>
            <AdminForm
              title="Add New Customer"
              fields={formFields}
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AdminDataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customers..."
      />
    </div>
  )
}