"use client"

import { useState, useMemo, useEffect } from "react"
import type { Car, Category } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { CarCard } from "@/components/car-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import {
  getUserSearchHistory,
  findPersonalizedRecommendations,
  shouldShowPersonalizedRecommendations
} from "@/lib/car-recommendations"

interface CarsClientProps {
  initialCars: Car[]
  initialCategories: Category[]
}

export default function CarsClient({ initialCars, initialCategories }: CarsClientProps) {
  const [cars, setCars] = useState<Car[]>(initialCars)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [personalizedCars, setPersonalizedCars] = useState<Car[]>([])
  const [showPersonalized, setShowPersonalized] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [carsRes, categoriesRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/categories')
      ])

      if (carsRes.ok) {
        const carsData = await carsRes.json()
        setCars(carsData.cars || [])
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Refetch data every 5 minutes to keep it fresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  // Refetch when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchData()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  useEffect(() => {
    if (shouldShowPersonalizedRecommendations()) {
      const searchHistory = getUserSearchHistory()
      const personalized = findPersonalizedRecommendations(cars, searchHistory)
      if (personalized.length > 0) {
        setPersonalizedCars(personalized)
        setShowPersonalized(true)
      }
    }
  }, [cars])

  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars.filter((car) => {
      const matchesSearch =
        car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || car.category?.slug === selectedCategory

      const matchesPrice = (() => {
        if (priceRange === "all") return true
        if (!car.price) return false

        const priceInNaira = car.price
        switch (priceRange) {
          case "under-50m":
            return priceInNaira < 50000000
          case "50m-100m":
            return priceInNaira >= 50000000 && priceInNaira < 100000000
          case "100m-200m":
            return priceInNaira >= 100000000 && priceInNaira < 200000000
          case "over-200m":
            return priceInNaira >= 200000000
          default:
            return true
        }
      })()

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "price-low":
          return (a.price || 0) - (b.price || 0)
        case "price-high":
          return (b.price || 0) - (a.price || 0)
        case "name":
          return (a.name || "").localeCompare(b.name || "")
        default:
          return 0
      }
    })

    return filtered
  }, [cars, searchTerm, selectedCategory, priceRange, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange("all")
    setSortBy("newest")
  }

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || priceRange !== "all" || sortBy !== "newest"

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Our Collection</h1>
          <p className="text-lg text-muted-foreground">Explore our complete inventory of luxury vehicles</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search cars by name, brand, or model..."
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value || "")}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50m">Under ₦50M</SelectItem>
                <SelectItem value="50m-100m">₦50M - ₦100M</SelectItem>
                <SelectItem value="100m-200m">₦100M - ₦200M</SelectItem>
                <SelectItem value="over-200m">Over ₦200M</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchTerm}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Brand: {categories.find(c => c.slug === selectedCategory)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCategory("all")}
                  />
                </Badge>
              )}
              {priceRange !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Price: {
                    priceRange === "under-50m" ? "Under ₦50M" :
                    priceRange === "50m-100m" ? "₦50M - ₦100M" :
                    priceRange === "100m-200m" ? "₦100M - ₦200M" :
                    "Over ₦200M"
                  }
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setPriceRange("all")}
                  />
                </Badge>
              )}
              {sortBy !== "newest" && (
                <Badge variant="secondary" className="gap-1">
                  Sort: {
                    sortBy === "oldest" ? "Oldest First" :
                    sortBy === "price-low" ? "Price: Low to High" :
                    sortBy === "price-high" ? "Price: High to Low" :
                    "Name A-Z"
                  }
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSortBy("newest")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Personalized Recommendations */}
        {showPersonalized && personalizedCars.length > 0 && (
          <div className="mb-12">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Recommended for You</h2>
              <p className="text-muted-foreground">Based on your recent car searches</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {personalizedCars.slice(0, 6).map((car: Car) => (
                <div key={car.id} className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                      ⭐ Recommended
                    </span>
                  </div>
                  <CarCard car={car} />
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-8">
              <h3 className="text-xl font-bold text-foreground mb-6 text-center">All Vehicles</h3>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredAndSortedCars.length} {filteredAndSortedCars.length === 1 ? 'vehicle' : 'vehicles'} found
          </p>
        </div>

        {/* Cars Grid */}
        {filteredAndSortedCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No vehicles found matching your criteria.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedCars.map((car: Car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}