import { NextResponse } from "next/server"
import Stripe from "stripe"

// Only initialize Stripe if the secret key is available at build/runtime. This avoids
// throwing during Next.js build when environment variables are not present.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      // Use the apiVersion expected by the installed Stripe types/runtime in this project
      apiVersion: "2025-12-15.clover",
    })
  : null

export async function POST(request: Request) {
  try {
    if (!stripe) {
      console.error("Stripe not configured: STRIPE_SECRET_KEY missing")
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }
    const { bookingId, amount } = await request.json()

    if (!bookingId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100)

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        bookingId,
      },
      description: `Test Drive Booking Fee - Booking ID: ${bookingId}`,
    })

    // For demo purposes, we'll auto-confirm the payment
    // In production, you'd use Stripe Elements or Checkout for actual payment collection
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: "pm_card_visa", // Test payment method
      return_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000"}/test-drive/success?bookingId=${bookingId}`,
    })

    return NextResponse.json({
      paymentIntentId: confirmedPayment.id,
      status: confirmedPayment.status,
    })
  } catch (error) {
    console.error("[v0] Payment error:", error)
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
