"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  carId: string
  className?: string
}

export function FavoriteButton({ carId, className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkUserAndFavorite = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from("user_favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("car_id", carId)
          .single()

        setIsFavorite(!!data)
      }
    }

    checkUserAndFavorite()
  }, [carId])

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add favorites",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("car_id", carId)

        if (error) {
          console.error("Delete error:", error)
          throw error
        }
        setIsFavorite(false)
        toast({ title: "Removed from watchlist" })
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("user_favorites")
          .insert({
            user_id: user.id,
            car_id: carId
          })

        if (error) {
          console.error("Insert error:", error)
          throw error
        }
        setIsFavorite(true)
        toast({ title: "Added to watchlist" })
      }
    } catch (error: any) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to update watchlist",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFavorite}
      disabled={loading}
      className={`border-border ${className}`}
    >
      <Heart
        className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
      />
      <span className="ml-2 hidden sm:inline">
        {isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </span>
    </Button>
  )
}