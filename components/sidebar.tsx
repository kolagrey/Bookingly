'use client'

import { MobileNav } from '@/components/navigation/mobile-nav'
import { DesktopNav } from '@/components/navigation/desktop-nav'
import { type User } from '@/types/database'

interface SidebarProps {
  user: User | null
}

export function Sidebar({ user }: SidebarProps) {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/10">
      <div className="flex h-14 items-center border-b px-4">
        <MobileNav user={user} />
        <span className="ml-2 font-semibold">Expert Platform</span>
      </div>

      <div className="flex-1 overflow-auto py-4 px-2">
        <DesktopNav user={user} />
      </div>
    </div>
  )
}