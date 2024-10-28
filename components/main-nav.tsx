'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/lib/auth/auth-service'

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
  })

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">Expert Platform</span>
          </Link>

          <div className="hidden md:flex md:gap-6">
            <Link
              href="/experts"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/experts'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              Find Experts
            </Link>
            <Link
              href="/how-it-works"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/how-it-works'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              How it Works
            </Link>
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/login?as=expert">Become an Expert</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-b bg-background md:hidden">
          <div className="container py-4 space-y-4">
            <Link
              href="/experts"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              Find Experts
            </Link>
            <Link
              href="/how-it-works"
              className="block py-2 text-sm font-medium hover:text-primary"
            >
              How it Works
            </Link>
            {user ? (
              <Button asChild className="w-full">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth/login?as=expert">Become an Expert</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}