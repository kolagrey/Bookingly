'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { type User } from '@/types/database'

interface DesktopNavProps {
  user: User | null
}

export function DesktopNav({ user }: DesktopNavProps) {
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
          href: '/dashboard/profile/expert',
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
        {
          href: '/dashboard/profile/client',
          label: 'Profile',
          icon: Icons.user,
        },
      ]

  return (
    <nav className="hidden md:flex md:flex-col gap-1">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
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
  )
}