export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface Car {
  id: string
  name: string
  model: string
  year: number
  category_id: string | null
  brand: string
  price: number | null
  show_price: boolean
  description: string | null
  engine: string | null
  mileage: string | null
  transmission: string | null
  fuel_type: string | null
  interior_features: string | null
  exterior_features: string | null
  condition: string | null
  warranty: string | null
  location: string | null
  status: "available" | "sold" | "reserved"
  is_featured: boolean
  created_at: string
  updated_at: string
  category?: Category
  images?: CarImage[]
}

export interface CarImage {
  id: string
  car_id: string
  image_url: string
  is_primary: boolean
  display_order: number
  created_at: string
}

export interface TestDriveBooking {
  id: string
  car_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  booking_date: string
  booking_time: string
  location: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  assigned_agent_id: string | null
  payment_status: "pending" | "paid" | "refunded"
  payment_amount: number | null
  stripe_payment_intent_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  car?: Car
}

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: "admin" | "manager" | "agent"
  is_active: boolean
  created_at: string
}
