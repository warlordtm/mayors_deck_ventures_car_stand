"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function TestAdminPage() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("")
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
    images: null as FileList | null,
    video: null as File | null
  })
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createClient()
    supabase.from("categories").select("id, name").then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Test Admin - Add Car</h1>
          <p className="text-muted-foreground">Test car uploads without admin routing</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Car</CardTitle>
          </CardHeader>
          <CardContent>
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

            <div className="space-y-2 mt-4">
              <Label htmlFor="car-description">Description</Label>
              <Textarea
                id="car-description"
                value={carForm.description}
                onChange={(e) => setCarForm({...carForm, description: e.target.value})}
                placeholder="Detailed description of the car..."
                rows={3}
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="car-images">Car Images</Label>
              <input
                id="car-images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setCarForm({...carForm, images: e.target.files})}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="car-video">Car Video (Optional)</Label>
              <input
                id="car-video"
                type="file"
                accept="video/*"
                onChange={(e) => setCarForm({...carForm, video: e.target.files?.[0] || null})}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            {isSubmitting && (
              <div className="space-y-2 mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{uploadStatus}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={handleAddCar} disabled={isSubmitting || !carForm.name}>
                {isSubmitting ? "Adding..." : "Add Car"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}