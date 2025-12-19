import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Car } from "@/lib/types"
import Image from "next/image"

export default async function AdminCarsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!adminUser) {
    redirect("/admin/login")
  }

  const { data: cars } = await supabase
    .from("cars")
    .select(`
      *,
      category:categories(*),
      images:car_images(*)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Manage Cars</h1>
            <p className="text-zinc-400">Add, edit, or remove vehicles from your inventory</p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
            >
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-zinc-200">
              <Link href="/admin/cars/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Car
              </Link>
            </Button>
          </div>
        </div>

        {cars && cars.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car: Car) => {
              const primaryImage = car.images?.find((img) => img.is_primary) || car.images?.[0]
              return (
                <Card key={car.id} className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                    <Image
                      src={
                        primaryImage?.image_url ||
                        `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(car.name) || "/placeholder.svg"}`
                      }
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                    {car.is_featured && <Badge className="absolute left-3 top-3 bg-white text-black">Featured</Badge>}
                    <Badge
                      className={`absolute right-3 top-3 capitalize ${
                        car.status === "available"
                          ? "bg-green-500"
                          : car.status === "sold"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    >
                      {car.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 text-lg font-bold text-white">{car.name}</h3>
                    <p className="mb-3 text-sm text-zinc-400">
                      {car.model} • {car.year}
                    </p>
                    {car.show_price && car.price ? (
                      <p className="mb-4 text-xl font-bold text-white">${car.price.toLocaleString()}</p>
                    ) : (
                      <p className="mb-4 text-sm text-zinc-400">Price hidden</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1 border-zinc-700 text-zinc-300 bg-transparent"
                      >
                        <Link href={`/admin/cars/${car.id}/edit`}>
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-800 text-red-400 hover:bg-red-950 bg-transparent"
                        asChild
                      >
                        <Link href={`/admin/cars/${car.id}/delete`}>
                          <Trash2 className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardContent className="p-12 text-center">
              <p className="mb-4 text-xl text-zinc-400">No cars in inventory</p>
              <Button asChild className="bg-white text-black hover:bg-zinc-200">
                <Link href="/admin/cars/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Car
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
