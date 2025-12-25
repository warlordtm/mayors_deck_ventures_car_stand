import type { Car } from "@/lib/types"

export interface SearchHistory {
  car?: string
  referrer: string
  timestamp: number
  url: string
}

export function getUserSearchHistory(): SearchHistory[] {
  if (typeof window === 'undefined') return []

  const consent = localStorage.getItem('cookie-consent')
  if (consent !== 'accepted') return []

  try {
    const searches = JSON.parse(localStorage.getItem('car-searches') || '[]')
    return searches.filter((search: SearchHistory) => {
      // Only consider searches from the last 30 days
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
      return search.timestamp > thirtyDaysAgo
    })
  } catch {
    return []
  }
}

export function extractCarFromSearch(searchHistory: SearchHistory[]): string[] {
  const carNames: string[] = []

  searchHistory.forEach(search => {
    if (search.car) {
      carNames.push(search.car.toLowerCase())
    }

    // Extract car names from referrer URLs
    if (search.referrer) {
      const url = new URL(search.referrer)
      const searchParams = url.searchParams

      // Common search parameter names
      const searchTerms = [
        searchParams.get('q'),
        searchParams.get('query'),
        searchParams.get('search'),
        searchParams.get('car'),
        searchParams.get('model'),
        searchParams.get('vehicle')
      ].filter(Boolean)

      carNames.push(...searchTerms.map(term => term!.toLowerCase()))
    }
  })

  return [...new Set(carNames)] // Remove duplicates
}

export function findPersonalizedRecommendations(allCars: Car[], searchHistory: SearchHistory[]): Car[] {
  if (!searchHistory.length) return []

  const searchedCars = extractCarFromSearch(searchHistory)
  if (!searchedCars.length) return []

  const recommendations: Car[] = []

  // First, find exact matches
  searchedCars.forEach(searchTerm => {
    const exactMatches = allCars.filter(car =>
      car.name.toLowerCase().includes(searchTerm) ||
      car.brand.toLowerCase().includes(searchTerm) ||
      car.model.toLowerCase().includes(searchTerm)
    )
    recommendations.push(...exactMatches)
  })

  // Remove duplicates
  const uniqueRecommendations = recommendations.filter((car, index, self) =>
    index === self.findIndex(c => c.id === car.id)
  )

  // If we have exact matches, return them
  if (uniqueRecommendations.length > 0) {
    return uniqueRecommendations.slice(0, 6) // Limit to 6 cars
  }

  // If no exact matches, find similar cars based on search terms
  const similarCars: Car[] = []
  searchedCars.forEach(searchTerm => {
    // Look for cars with similar characteristics
    const similar = allCars.filter(car => {
      const carText = `${car.brand} ${car.model} ${car.name}`.toLowerCase()
      // Check if any word from the search appears in the car description
      return searchTerm.split(' ').some(word =>
        carText.includes(word) && word.length > 2 // Only meaningful words
      )
    })
    similarCars.push(...similar)
  })

  // Remove duplicates and return
  return [...new Set(similarCars)].slice(0, 6)
}

export function shouldShowPersonalizedRecommendations(): boolean {
  const consent = typeof window !== 'undefined' ? localStorage.getItem('cookie-consent') : null
  return consent === 'accepted'
}