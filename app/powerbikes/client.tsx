"use client"

import { useState, useMemo } from "react"
import type { Powerbike, Category } from "@/lib/types"
import { PowerbikeCard } from "@/components/powerbike-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface PowerbikesClientProps {
  initialPowerbikes: Powerbike[]
  initialCategories: Category[]
}

export default function PowerbikesClient({ initialPowerbikes, initialCategories }: PowerbikesClientProps) {
  const [powerbikes, setPowerbikes] = useState<Powerbike[]>(initialPowerbikes)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  const filteredAndSortedPowerbikes = useMemo(() => {
    let filtered = powerbikes.filter((powerbike) => {
      const matchesSearch =
        powerbike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        powerbike.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        powerbike.model?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || powerbike.category_id === selectedCategory

      const matchesPrice = (() => {
        if (priceRange === "all") return true
        const price = powerbike.price || 0
        switch (priceRange) {
          case "under-50m":
            return price < 50000000
          case "50m-100m":
            return price >= 50000000 && price < 100000000
          case "100m-200m":
            return price >= 100000000 && price < 200000000
          case "over-200m":
            return price >= 200000000
          default:
            return true
        }
      })()

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort
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
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [powerbikes, searchTerm, selectedCategory, priceRange, sortBy])

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Powerbikes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of high-performance motorcycles and powerbikes.
            From sport bikes to cruisers, find your perfect ride.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search powerbikes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
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
              <SelectTrigger>
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
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {priceRange !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: {priceRange.replace("-", " ")}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange("all")} />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedPowerbikes.length} powerbike{filteredAndSortedPowerbikes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Powerbikes Grid */}
        {filteredAndSortedPowerbikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedPowerbikes.map((powerbike) => (
              <PowerbikeCard key={powerbike.id} powerbike={powerbike} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No powerbikes found matching your criteria.</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}