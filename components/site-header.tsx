'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSettings } from './settings-provider'
import { Segmented } from './segmented'
import { NAV_ITEMS } from './nav-items'

export function SiteHeader() {
  const pathname = usePathname()
  const { t, script, setScript, study, setStudy, uiLang, setUiLang, theme, setTheme } = useSettings()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const scriptOptions = [
    { value: 'simp' as const, label: t.settings.simp, lang: 'zh-Hans' },
    { value: 'trad' as const, label: t.settings.trad, lang: 'zh-Hant' },
  ]
  const studyOptions = [
    { value: 'zh' as const, label: t.settings.studyZh, lang: 'zh-Hans' },
    { value: 'en' as const, label: t.settings.studyEn, lang: 'en' },
  ]

  return (
    <header className="site-header sticky top-0 z-40 px-3 pt-2 sm:px-6 sm:pt-3">
      <div className="glass-nav mx-auto flex h-12 max-w-6xl items-center gap-2 rounded-full pl-2 pr-1.5 sm:h-16 sm:gap-3 sm:pl-4 sm:pr-2">
        <Link href="/" className="flex items-center gap-2.5" aria-label={t.appName}>
          <span
            lang="zh-Hans"
            className="font-hanzi grid size-8 place-items-center rounded-lg text-base text-white shadow-[inset_0_1px_0_oklch(1_0_0/40%)] sm:size-9 sm:rounded-xl sm:text-lg"
            style={{ background: 'linear-gradient(135deg, oklch(0.74 0.19 30), oklch(0.58 0.23 22))' }}
          >
            汉
          </span>
          <span className="hidden text-base font-bold tracking-tight min-[420px]:block">{t.appName}</span>
        </Link>

        <nav aria-label="Primary" className="ml-4 hidden flex-1 items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ href, key, Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-foreground/10 text-foreground shadow-[inset_0_1px_0_var(--glass-shine)]'
                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t.nav[key]}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Segmented
            size="sm"
            label={t.settings.script}
            value={script}
            onChange={setScript}
            options={scriptOptions}
          />
          <Segmented
            size="sm"
            className="hidden lg:inline-flex"
            label={t.settings.study}
            value={study}
            onChange={setStudy}
            options={studyOptions}
          />
          <div className="relative" ref={panelRef}>
            <button
              type="button"
              aria-label={t.settings.open}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-accent active:scale-95 sm:size-10"
            >
              {open ? <X className="size-4" /> : <SlidersHorizontal className="size-4" />}
            </button>
            {open && (
              <div
                role="dialog"
                aria-label={t.settings.title}
                className="glass-nav absolute right-0 top-[calc(100%+10px)] z-50 w-[min(19rem,calc(100vw-1.5rem))] rounded-3xl p-4 animate-in fade-in duration-150 sm:p-5"
                style={{ background: 'color-mix(in oklab, var(--card) 92%, transparent)' }}
              >
                <p className="mb-4 text-sm font-semibold">{t.settings.title}</p>
                <div className="flex flex-col gap-4">
                  <Field label={t.settings.script}>
                    <Segmented label={t.settings.script} value={script} onChange={setScript} options={[
                      { value: 'simp', label: t.settings.simpFull },
                      { value: 'trad', label: t.settings.tradFull },
                    ]} />
                  </Field>
                  <Field label={t.settings.study}>
                    <Segmented label={t.settings.study} value={study} onChange={setStudy} options={[
                      { value: 'zh', label: '中文' },
                      { value: 'en', label: 'English' },
                    ]} />
                  </Field>
                  <Field label={t.settings.ui}>
                    <Segmented label={t.settings.ui} value={uiLang} onChange={setUiLang} options={[
                      { value: 'vi', label: 'Tiếng Việt' },
                      { value: 'en', label: 'English' },
                    ]} />
                  </Field>
                  <Field label={t.settings.theme}>
                    <Segmented label={t.settings.theme} value={theme} onChange={setTheme} options={[
                      { value: 'dark', label: t.settings.dark },
                      { value: 'light', label: t.settings.light },
                    ]} />
                  </Field>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
