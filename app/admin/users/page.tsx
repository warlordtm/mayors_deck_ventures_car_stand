"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import { AdminForm } from "@/components/admin/admin-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User created successfully",
        })
        setShowForm(false)
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingUser) return

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User updated successfully",
        })
        setEditingUser(null)
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Are you sure you want to delete ${user.full_name}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const columns = [
    {
      key: "full_name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
      render: (value: string) => (
        <Badge variant={value === "admin" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  const formFields = [
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      required: true,
    },
    {
      name: "full_name",
      label: "Full Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "select" as const,
      options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "agent", label: "Agent" },
      ],
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
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage admin users and their permissions</p>
        </div>
        <Dialog open={showForm || !!editingUser} onOpenChange={(open) => {
          if (!open) {
            setShowForm(false)
            setEditingUser(null)
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AdminForm
              title={editingUser ? "Edit User" : "Add New User"}
              fields={editingUser ? formFields.slice(1) : formFields} // Exclude email when editing
              initialData={editingUser || {}}
              onSubmit={editingUser ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false)
                setEditingUser(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AdminDataTable
        data={users}
        columns={columns}
        onEdit={setEditingUser}
        onDelete={handleDelete}
        searchPlaceholder="Search users..."
      />
    </div>
  )
}