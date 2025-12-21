"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Car, Calendar, Users, Tag, BarChart3, FileText, Settings, Home, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Inquiries", href: "/admin/inquiries", icon: Tag },
  { name: "Sales", href: "/admin/sales", icon: BarChart3 },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`border-r border-border bg-card/50 backdrop-blur transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex h-16 items-center border-b border-border px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mr-2"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
          {!isCollapsed && <h1 className="text-xl font-bold text-foreground">Gaskiya Auto</h1>}
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-muted-foreground hover:bg-card/80 hover:text-foreground ${isCollapsed ? 'px-3' : 'gap-3'}`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
