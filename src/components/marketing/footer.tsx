import Link from 'next/link'
import { Icons } from '@/components/icons'

const navigation = {
  platform: [
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Browse Experts', href: '/experts' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Success Stories', href: '/success-stories' },
  ],
  experts: [
    { name: 'Become an Expert', href: '/auth/login?as=expert' },
    { name: 'Expert Guidelines', href: '/expert-guidelines' },
    { name: 'Expert Dashboard', href: '/dashboard/expert' },
    { name: 'Expert Support', href: '/expert-support' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  social: [
    {
      name: 'Twitter',
      href: '#',
      icon: Icons.twitter,
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: Icons.linkedIn,
    },
    {
      name: 'GitHub',
      href: '#',
      icon: Icons.gitHub,
    },
  ],
}

export function Footer() {
  return (
    <footer className="bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">Expert Platform</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connect with industry experts for professional consultations
              and accelerate your career growth.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Platform</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.platform.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">For Experts</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.experts.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Support</h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Expert Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}