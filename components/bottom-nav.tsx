'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSettings } from './settings-provider'
import { NAV_ITEMS } from './nav-items'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useSettings()
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null)

  // Highlight the tapped tab immediately; it only applies until the route actually changes.
  const current = pending && pending.from === pathname ? pending.href : pathname

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-6 md:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }}
    >
      <ul className="glass-nav flex w-full max-w-xs items-center rounded-full p-1">
        {NAV_ITEMS.map(({ href, key, Icon }) => {
          const active = href === '/' ? current === '/' : current.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                prefetch
                aria-current={active ? 'page' : undefined}
                onClick={() => setPending({ href, from: pathname })}
                className={cn(
                  'flex min-h-11 flex-col items-center justify-center gap-px rounded-full px-0.5 text-[9px] font-semibold leading-tight transition-colors duration-150 active:scale-95',
                  active ? 'bg-foreground text-background' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="max-w-full truncate">{t.nav[key]}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
