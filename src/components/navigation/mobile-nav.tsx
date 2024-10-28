'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { type User } from '@/types/database'

interface MobileNavProps {
  user: User | null
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isExpert = user?.role === 'expert'
  const isAdmin = user?.role === 'admin'
    
  const routes = isAdmin
    ? [
        {
          href: '/dashboard/admin',
          label: 'Dashboard',
          icon: Icons.dashboard,
        },
        {
          href: '/dashboard/admin/moderation',
          label: 'Moderation',
          icon: Icons.shield,
        },
        {
          href: '/dashboard/admin/monitoring',
          label: 'Monitoring',
          icon: Icons.activity,
        },
        {
          href: '/dashboard/admin/audit',
          label: 'Audit Log',
          icon: Icons.list,
        },
        {
          href: '/dashboard/admin/users',
          label: 'Users',
          icon: Icons.users,
        },
      ]
    : isExpert
    ? [
        {
          href: '/dashboard/expert/profile',
          label: 'Profile',
          icon: Icons.user,
        },
        {
          href: '/dashboard/expert/availability',
          label: 'Availability',
          icon: Icons.calendar,
        },
        {
          href: '/dashboard/expert/bookings',
          label: 'Bookings',
          icon: Icons.calendar,
        },
      ]
    : [
        {
          href: '/dashboard/client/bookings',
          label: 'My Bookings',
          icon: Icons.calendar,
        },
      ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-14 items-center border-b px-4">
          <Icons.logo className="h-6 w-6" />
          <span className="ml-2 font-semibold">Expert Platform</span>
          <Button
            variant="ghost"
            className="ml-auto"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === route.href ? 'bg-accent' : 'transparent'
                )}
              >
                <Icon className="h-4 w-4" />
                {route.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}