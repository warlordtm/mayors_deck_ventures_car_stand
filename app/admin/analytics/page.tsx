"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Car, DollarSign, Calendar } from "lucide-react"

interface AnalyticsData {
  overview: {
    totalCars: number
    availableCars: number
    totalBookings: number
    pendingBookings: number
    totalRevenue: number
  }
  monthlyBookings: { month: string; count: number }[]
  categoryStats: { name: string; count: number }[]
  statusStats: { status: string; count: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics")
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>
  }

  if (!data) {
    return <div className="flex justify-center p-8">Failed to load analytics</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Insights and reports for your business</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalCars}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.availableCars}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.overview.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.monthlyBookings.slice(-6).map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm">{item.month}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.statusStats.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{item.status}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Cars by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.categoryStats.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="font-medium">{item.count} cars</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}