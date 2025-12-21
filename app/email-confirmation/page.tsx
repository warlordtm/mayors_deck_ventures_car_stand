"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function EmailConfirmationPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground text-center">Check Your Email</CardTitle>
            <CardDescription className="text-muted-foreground text-center">
              We've sent you a confirmation link. Please check your email and click the link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
              <Button asChild className="w-full bg-white text-black hover:bg-zinc-200">
                <Link href="/login">
                  OK, I Confirmed
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}