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
import { MotionDiv, staggerContainer, staggerItem, fadeInUp } from "@/components/motion-wrappers"

export default function AdminDashboardPage() {
  const [showCarModal, setShowCarModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    soldCars: 0,
    totalImpressions: 0,
    monthlyRevenue: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [carForm, setCarForm] = useState({
    name: "",
    model: "",
    year: "",
    category_id: "",
    price: "",
    show_price: true,
    status: "available",
    is_featured: false,
    description: "",
    transmission: "",
    fuel_type: "",
    mileage: "",
    condition: "",
    warranty: "",
    location: "",
    interior_features: "",
    exterior_features: "",
    images: null as FileList | null,
    video: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("")
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image_url: "",
    seo_title: "",
    seo_description: "",
    description: ""
  })
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const fetchStats = async () => {
    try {
      const supabase = createClient()

      // Fetch car stats
      const { data: cars } = await supabase.from("cars").select("status")
      const totalCars = cars?.length || 0
      const availableCars = cars?.filter(c => c.status === 'available').length || 0
      const soldCars = cars?.filter(c => c.status === 'sold').length || 0

      // Fetch monthly revenue (current month sales)
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const { data: sales } = await supabase
        .from("sales")
        .select("sale_price")
        .gte("created_at", startOfMonth.toISOString())
      const monthlyRevenue = sales?.reduce((sum, s) => sum + (s.sale_price || 0), 0) || 0

      setStats({
        totalCars,
        availableCars,
        soldCars,
        totalImpressions: 0,
        monthlyRevenue,
      })

      // Fetch recent activity
      const { data: activity } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)
      setRecentActivity(activity || [])
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    setMounted(true)

    const loadData = async () => {
      try {
        const supabase = createClient()
  
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
  
        if (authError) {
          console.error('Auth error:', authError)
          setError('Authentication failed')
          router.push('/admin/login')
          return
        }
  
        if (!user) {
          console.log('No user found, redirecting to login')
          router.push('/admin/login')
          return
        }
  
        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
  
        if (profileError) {
          console.error('Profile fetch error:', profileError)
          setError('Failed to load user profile')
          router.push('/admin/login')
          return
        }
  
        if (!profile || profile.role !== 'admin') {
          console.log('User is not admin, redirecting to login')
          router.push('/admin/login')
          return
        }
  
        setCurrentUser(user)
  
        // Fetch categories for the car form
        const { data: cats, error: catsError } = await supabase.from("categories").select("id, name")
        if (catsError) {
          console.error('Categories fetch error:', catsError)
          // Don't fail completely for categories error
        }
        setCategories(cats || [])
  
        // Fetch stats
        await fetchStats()
  
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error in loadData:', err)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Auto-fill additional information based on category, model, and year
  useEffect(() => {
    if (carForm.category_id && carForm.name && carForm.year) {
      const category = categories.find(c => c.id === carForm.category_id)?.name || ''
      const description = `Experience the pinnacle of automotive excellence with this ${carForm.year} ${carForm.name}. This ${category} masterpiece combines breathtaking performance with unparalleled luxury, featuring cutting-edge technology and premium materials throughout.`

      // Auto-fill other fields with sensible defaults
      const updates: Partial<typeof carForm> = {
        description,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        condition: 'Excellent',
        warranty: '1 year remaining',
        location: 'Abuja',
        interior_features: 'Leather upholstery, Premium audio system, Climate control, Navigation',
        exterior_features: 'LED headlights, Alloy wheels, Carbon fiber accents, Sport exhaust'
      }

      setCarForm(prev => ({ ...prev, ...updates }))
    }
  }, [carForm.category_id, carForm.name, carForm.year, categories])

  const handleAddCar = async () => {
    setIsSubmitting(true)
    setUploadProgress(0)
    setUploadStatus("Preparing upload...")
    try {
      let body: string | FormData
      let headers: Record<string, string> = {}

      if (carForm.images && carForm.images.length > 0) {
        const formData = new FormData()
        Object.keys(carForm).forEach(key => {
          if (key === 'images') {
            for (let i = 0; i < carForm.images!.length; i++) {
              formData.append('images', carForm.images![i])
            }
          } else if (key === 'video' && carForm.video) {
            formData.append('video', carForm.video)
          } else if (key === 'year') {
            formData.append(key, parseInt((carForm as any)[key]).toString())
          } else if (key === 'price' && (carForm as any)[key]) {
            formData.append(key, parseFloat((carForm as any)[key]).toString())
          } else {
            formData.append(key, (carForm as any)[key])
          }
        })
        formData.set('category_id', carForm.category_id || '')
        body = formData
      } else {
        body = JSON.stringify({
          ...carForm,
          year: parseInt(carForm.year),
          price: carForm.price ? parseFloat(carForm.price) : null,
          category_id: carForm.category_id || null,
        })
        headers = { "Content-Type": "application/json" }
      }

      const response = await fetch("/api/admin/cars", {
        method: "POST",
        headers,
        body,
      })

      if (response.ok) {
        setUploadProgress(100)
        setUploadStatus("Car added successfully!")
        toast({ title: "Success", description: "Car added successfully" })
        setTimeout(() => {
          setShowCarModal(false)
          setCarForm({
            name: "",
            model: "",
            year: "",
            category_id: "",
            price: "",
            show_price: true,
            status: "available",
            is_featured: false,
            description: "",
            transmission: "",
            fuel_type: "",
            mileage: "",
            condition: "",
            warranty: "",
            location: "",
            interior_features: "",
            exterior_features: "",
            images: null,
            video: null
          })
          setUploadProgress(0)
          setUploadStatus("")
        }, 2000)
      } else {
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
    // Auto-generate slug if not provided
    const finalForm = {
      ...categoryForm,
      slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalForm),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Category added successfully!" })
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

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div>Loading...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              {error ? (
                <div>
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div>Please log in to access the admin dashboard</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
           <h1 className="mb-4 text-3xl font-bold text-foreground">Admin Dashboard</h1>
           <p className="text-muted-foreground">Welcome {currentUser.email}</p>
         </div>

        {/* Stats Grid */}
        <MotionDiv {...staggerContainer} className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MotionDiv {...staggerItem}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Cars</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalCars}</div>
              </CardContent>
            </Card>
          </MotionDiv>

          <MotionDiv {...staggerItem}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Cars</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.availableCars}</div>
              </CardContent>
            </Card>
          </MotionDiv>


          <MotionDiv {...staggerItem}>
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">₦{stats.monthlyRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </MotionDiv>
        </MotionDiv>

         {/* Recent Activity */}
         <div className="mb-8">
           <h2 className="mb-4 text-xl font-bold text-foreground">Recent Activity</h2>
           <Card className="border-border bg-card/50 backdrop-blur">
             <CardContent className="p-6">
               {recentActivity.length > 0 ? (
                 <div className="space-y-4">
                   {recentActivity.map((activity) => (
                     <div key={activity.id} className="flex items-center gap-4 pb-4 border-b border-border/50 last:border-b-0 last:pb-0">
                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                         <FileText className="h-4 w-4 text-primary" />
                       </div>
                       <div className="flex-1">
                         <p className="text-sm font-medium text-foreground">{activity.action}</p>
                         <p className="text-xs text-muted-foreground">
                           {new Date(activity.created_at).toLocaleString()}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-muted-foreground text-center py-8">No recent activity</p>
               )}
             </CardContent>
           </Card>
         </div>

         {/* Quick Add Actions */}
         <MotionDiv {...fadeInUp} className="mb-8">
           <h2 className="mb-4 text-xl font-bold text-foreground">Quick Add</h2>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MotionDiv {...staggerItem}>
              <Card
                className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer"
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
            </MotionDiv>

            <MotionDiv {...staggerItem}>
              <Card
                className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer"
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
            </MotionDiv>

            <MotionDiv {...staggerItem}>
              <Link href="/admin/content">
                <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
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
            </MotionDiv>

            <MotionDiv {...staggerItem}>
              <Link href="/admin/users">
                <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
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
            </MotionDiv>
          </div>
        </MotionDiv>

        {/* Management Actions */}
       <MotionDiv {...fadeInUp} className="mb-8">
         <h2 className="mb-4 text-xl font-bold text-foreground">Management</h2>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/cars">
              <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
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



            <Link href="/admin/sales">
              <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <DollarSign className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Sales</h3>
                    <p className="text-sm text-muted-foreground">Record and track sales</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/customers">
              <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                    <Users className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Customers</h3>
                    <p className="text-sm text-muted-foreground">Manage customer database</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
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
              <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
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
              <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
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
              <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
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
              <Card className="border-border bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:scale-105 hover:shadow-md cursor-pointer">
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
        </MotionDiv>

        {/* Add Car Modal */}
        <Dialog open={showCarModal} onOpenChange={setShowCarModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>Add New Car</DialogTitle>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Add New Car</h2>
                <p className="text-muted-foreground mt-1">Fill in the details to add a new car to your inventory</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="car-name">Model *</Label>
                  <Input
                    id="car-name"
                    value={carForm.name}
                    onChange={(e) => setCarForm({...carForm, name: e.target.value})}
                    placeholder="e.g., Ferrari Roma"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-model">Engine</Label>
                  <Input
                    id="car-model"
                    value={carForm.model}
                    onChange={(e) => setCarForm({...carForm, model: e.target.value})}
                    placeholder="e.g., V8 Twin-Turbo"
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

                <div className="space-y-2">
                  <Label htmlFor="car-transmission">Transmission</Label>
                  <Select value={carForm.transmission} onValueChange={(value) => setCarForm({...carForm, transmission: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-fuel">Fuel Type</Label>
                  <Select value={carForm.fuel_type} onValueChange={(value) => setCarForm({...carForm, fuel_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-mileage">Mileage</Label>
                  <Input
                    id="car-mileage"
                    value={carForm.mileage}
                    onChange={(e) => setCarForm({...carForm, mileage: e.target.value})}
                    placeholder="e.g., 15000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-condition">Condition</Label>
                  <Select value={carForm.condition} onValueChange={(value) => setCarForm({...carForm, condition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Very Good">Very Good</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-warranty">Warranty</Label>
                  <Input
                    id="car-warranty"
                    value={carForm.warranty}
                    onChange={(e) => setCarForm({...carForm, warranty: e.target.value})}
                    placeholder="e.g., 1 year remaining"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-location">Location</Label>
                  <Input
                    id="car-location"
                    value={carForm.location}
                    onChange={(e) => setCarForm({...carForm, location: e.target.value})}
                    placeholder="e.g., Abuja"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="car-interior">Interior Features</Label>
                <Textarea
                  id="car-interior"
                  value={carForm.interior_features}
                  onChange={(e) => setCarForm({...carForm, interior_features: e.target.value})}
                  placeholder="e.g., Leather upholstery, Premium audio system, Climate control, Navigation"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="car-exterior">Exterior Features</Label>
                <Textarea
                  id="car-exterior"
                  value={carForm.exterior_features}
                  onChange={(e) => setCarForm({...carForm, exterior_features: e.target.value})}
                  placeholder="e.g., LED headlights, Alloy wheels, Carbon fiber accents, Sport exhaust"
                  rows={2}
                />
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

              <div className="space-y-2">
                <Label htmlFor="car-images">Car Images</Label>
                <input
                  id="car-images"
                  type="file"
                  multiple
                  onChange={(e) => setCarForm({...carForm, images: e.target.files})}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="car-video">Car Video (Optional)</Label>
                <input
                  id="car-video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setCarForm({...carForm, video: e.target.files?.[0] || null})}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>

              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{uploadStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCarModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCar} disabled={isSubmitting || !carForm.name} className="cursor-pointer">
                  {isSubmitting ? "Adding..." : "Add Car"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Category Modal */}
        <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>Add New Category</DialogTitle>
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
                <Button onClick={handleAddCategory} disabled={!categoryForm.name} className="cursor-pointer">
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