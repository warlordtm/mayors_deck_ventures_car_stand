"use client"

import { useState, useEffect } from "react"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Inquiry {
  id: string
  type: string
  status: string
  message: string | null
  created_at: string
  car?: { name: string }
  customer?: { name: string; email: string }
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries")
      if (res.ok) {
        const data = await res.json()
        setInquiries(data.inquiries || [])
      } else {
        const err = await res.json()
        toast({ title: "Error", description: err.error || "Failed to fetch inquiries", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to fetch inquiries", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const columns = [
    { key: "type", label: "Type" },
    {
      key: "customer",
      label: "Customer",
      render: (value: any) => value?.name || "Unknown"
    },
    {
      key: "car",
      label: "Car",
      render: (value: any) => value?.name || "N/A"
    },
    { key: "status", label: "Status" },
    {
      key: "created_at",
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ]

  if (loading) return <div className="flex justify-center p-8">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inquiries</h1>
        <p className="text-muted-foreground">Manage customer inquiries and requests</p>
      </div>

      <AdminDataTable
        data={inquiries}
        columns={columns}
        searchPlaceholder="Search inquiries..."
      />
    </div>
  )
}