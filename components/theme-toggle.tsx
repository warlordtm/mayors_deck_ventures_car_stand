"use client"

import React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()

  // Resolve active theme: if theme is 'system', reflect the user's OS preference
  const active = theme === "system" ? systemTheme : theme

  const toggle = () => {
    // Toggle between explicit light and dark. If currently resolving to dark, switch to light.
    const resolved = active === "dark" ? "light" : "dark"
    setTheme(resolved)
  }

  return (
    <button
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={toggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-card/80 p-1 text-sm shadow-sm transition-colors hover:bg-white/5"
    >
      {active === "dark" ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M21.752 15.002A9 9 0 119.001 2.25 7 7 0 0021.752 15z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.222 5.636a1 1 0 011.414 0L6.343 6.343a1 1 0 11-1.414 1.414L4.222 7.05a1 1 0 010-1.414zM17.657 18.07a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM3 12a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm16 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.222 18.364a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM17.657 5.93a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM12 7a5 5 0 100 10A5 5 0 0012 7z" />
        </svg>
      )}
    </button>
  )
}
