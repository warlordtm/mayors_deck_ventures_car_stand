"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // User is logged in, redirect to admin dashboard
        router.push("/admin")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground">Sign in to access the admin panel</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                },
                space: {
                  spaceSmall: '4px',
                  spaceMedium: '8px',
                  spaceLarge: '16px',
                  labelBottomMargin: '8px',
                  anchorBottomMargin: '4px',
                  emailInputSpacing: '4px',
                  socialAuthSpacing: '4px',
                  buttonPadding: '10px 15px',
                  inputPadding: '10px 15px',
                },
                fontSizes: {
                  baseBodySize: '13px',
                  baseInputSize: '14px',
                  baseLabelSize: '14px',
                  baseButtonSize: '14px',
                },
                radii: {
                  borderRadiusButton: '4px',
                  buttonBorderRadius: '4px',
                  inputBorderRadius: '4px',
                },
              },
            },
          }}
          providers={[]}
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/admin`}
          showLinks={false}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Admin Email',
                password_label: 'Password',
                button_label: 'Sign In',
                loading_button_label: 'Signing In...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
            },
          }}
        />
      </div>
    </div>
  )
}
