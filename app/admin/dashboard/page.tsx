"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Car, Calendar, DollarSign, Users, UserCheck, Tag, BarChart3, FileText, Settings, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboardPage() {
  const [showCarModal, setShowCarModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [carForm, setCarForm] = useState({
    name: "",
    model: "",
    year: "",
    category_id: "",
    brand: "",
    price: "",
    show_price: true,
    status: "available",
    is_featured: false,
    description: ""
  })
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image_url: "",
    seo_title: "",
    seo_description: "",
    description: ""
  })
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile || profile.role !== "admin") {
        router.push("/admin/login")
        return
      }

      setCurrentUser(user)
      setLoading(false)

      // Fetch categories for the car form
      const { data: cats } = await supabase.from("categories").select("id, name")
      setCategories(cats || [])
    }

    checkAdmin()
  }, [router])

  const handleAddCar = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...carForm,
          year: parseInt(carForm.year),
          price: carForm.price ? parseFloat(carForm.price) : null,
          category_id: carForm.category_id || null,
        }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Car added successfully" })
        setShowCarModal(false)
        setCarForm({
          name: "",
          model: "",
          year: "",
          category_id: "",
          brand: "",
          price: "",
          show_price: true,
          status: "available",
          is_featured: false,
          description: "",
        })
      } else {
        // Try to parse JSON error body, otherwise show status/text for debugging
        let bodyText = null
        try {
          const json = await response.json()
          bodyText = json?.error || JSON.stringify(json)
        } catch (err) {
          bodyText = await response.text()
        }
        console.error("Add car failed", response.status, bodyText)
        toast({
          title: "Error",
          description: bodyText || `Failed to add car (status ${response.status})`,
          variant: "destructive",
        })
      }
    } catch (e) {
      console.error("Add car request error:", e)
      toast({ title: "Error", description: "Failed to add car", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCategory = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Category added successfully" })
        setShowCategoryModal(false)
        setCategoryForm({
          name: "", slug: "", image_url: "", seo_title: "", seo_description: "", description: ""
        })
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.error || "Failed to add category", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to add category", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-4 text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome {currentUser.email}</p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <Button
              type="submit"
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
            >
              Sign Out
            </Button>
          </form>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cars</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">8</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Cars</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">8</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">0</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-foreground">Quick Add</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80 cursor-pointer"
              onClick={() => setShowCarModal(true)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Add New Car</h3>
                  <p className="text-sm text-muted-foreground">Add a vehicle to inventory</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80 cursor-pointer"
              onClick={() => setShowCategoryModal(true)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Add Category</h3>
                  <p className="text-sm text-muted-foreground">Create new car category</p>
                </div>
              </CardContent>
            </Card>

            <Link href="/admin/content">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80 cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Plus className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Add Content</h3>
                    <p className="text-sm text-muted-foreground">Add website content</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80 cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Plus className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Add Admin</h3>
                    <p className="text-sm text-muted-foreground">Add new admin user</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Management Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-foreground">Management</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/cars">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <Car className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Manage Cars</h3>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove vehicles</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/bookings">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <Calendar className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Test Drive Bookings</h3>
                    <p className="text-sm text-muted-foreground">View and manage bookings</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <Users className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure site settings</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <UserCheck className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Users</h3>
                    <p className="text-sm text-muted-foreground">Manage admin users</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/categories">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <Tag className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Categories</h3>
                    <p className="text-sm text-muted-foreground">Manage car categories</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/analytics">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <BarChart3 className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Analytics</h3>
                    <p className="text-sm text-muted-foreground">View reports and insights</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/content">
              <Card className="border-border bg-card/50 backdrop-blur transition-colors hover:bg-card/80">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <FileText className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Content</h3>
                    <p className="text-sm text-muted-foreground">Manage site content</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Add Car Modal */}
        <Dialog open={showCarModal} onOpenChange={setShowCarModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="sr-only">Add New Car</DialogTitle>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Add New Car</h2>
                <p className="text-muted-foreground mt-1">Fill in the details to add a new car to your inventory</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="car-name">Name *</Label>
                  <Input
                    id="car-name"
                    value={carForm.name}
                    onChange={(e) => setCarForm({...carForm, name: e.target.value})}
                    placeholder="e.g., Ferrari Roma"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-model">Model</Label>
                  <Input
                    id="car-model"
                    value={carForm.model}
                    onChange={(e) => setCarForm({...carForm, model: e.target.value})}
                    placeholder="e.g., V8"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-year">Year</Label>
                  <Input
                    id="car-year"
                    type="number"
                    value={carForm.year}
                    onChange={(e) => setCarForm({...carForm, year: e.target.value})}
                    placeholder="e.g., 2023"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-category">Category</Label>
                  <Select value={carForm.category_id} onValueChange={(value) => setCarForm({...carForm, category_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-brand">Brand *</Label>
                  <Input
                    id="car-brand"
                    value={carForm.brand}
                    onChange={(e) => setCarForm({...carForm, brand: e.target.value})}
                    placeholder="e.g., Ferrari"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-price">Price (₦)</Label>
                  <Input
                    id="car-price"
                    type="number"
                    value={carForm.price}
                    onChange={(e) => setCarForm({...carForm, price: e.target.value})}
                    placeholder="e.g., 50000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-status">Status</Label>
                  <Select value={carForm.status} onValueChange={(value) => setCarForm({...carForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-price"
                    checked={carForm.show_price}
                    onCheckedChange={(checked) => setCarForm({...carForm, show_price: checked})}
                  />
                  <Label htmlFor="show-price">Show Price</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-featured"
                    checked={carForm.is_featured}
                    onCheckedChange={(checked) => setCarForm({...carForm, is_featured: checked})}
                  />
                  <Label htmlFor="is-featured">Featured</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="car-description">Description</Label>
                <Textarea
                  id="car-description"
                  value={carForm.description}
                  onChange={(e) => setCarForm({...carForm, description: e.target.value})}
                  placeholder="Detailed description of the car..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCarModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCar} disabled={isSubmitting || !carForm.name || !carForm.brand}>
                  {isSubmitting ? "Adding..." : "Add Car"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Category Modal */}
        <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
          <DialogContent className="max-w-2xl">
            <DialogTitle className="sr-only">Add New Category</DialogTitle>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Add New Category</h2>
                <p className="text-muted-foreground mt-1">Create a new car category for organizing vehicles</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Name *</Label>
                  <Input
                    id="cat-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    placeholder="e.g., Supercars"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-slug">Slug</Label>
                  <Input
                    id="cat-slug"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                    placeholder="e.g., supercars (auto-generated from name)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-image">Image URL</Label>
                  <Input
                    id="cat-image"
                    value={categoryForm.image_url}
                    onChange={(e) => setCategoryForm({...categoryForm, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-seo-title">SEO Title</Label>
                  <Input
                    id="cat-seo-title"
                    value={categoryForm.seo_title}
                    onChange={(e) => setCategoryForm({...categoryForm, seo_title: e.target.value})}
                    placeholder="SEO title for search engines"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-seo-desc">SEO Description</Label>
                  <Textarea
                    id="cat-seo-desc"
                    value={categoryForm.seo_description}
                    onChange={(e) => setCategoryForm({...categoryForm, seo_description: e.target.value})}
                    placeholder="SEO description for search engines"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-description">Description</Label>
                  <Textarea
                    id="cat-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    placeholder="Detailed description of the category"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCategoryModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} disabled={!categoryForm.name}>
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}