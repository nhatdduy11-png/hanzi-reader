'use client'

import { useEffect, useState } from 'react'

const SEEN_KEY = 'hz-intro'

type Phase = 'playing' | 'leaving' | 'done'

export function IntroSplash() {
  const [phase, setPhase] = useState<Phase>('playing')

  useEffect(() => {
    // The head script adds `intro-seen` before hydration; reading the class (not sessionStorage)
    // keeps the intro alive when Strict Mode runs this effect twice.
    if (document.documentElement.classList.contains('intro-seen')) {
      setPhase('done')
      return
    }
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {}

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const showFor = reduced ? 900 : 2600
    const leaveTimer = setTimeout(() => setPhase('leaving'), showFor)
    const doneTimer = setTimeout(() => setPhase('done'), showFor + 550)
    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className="intro-splash fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background"
      data-leaving={phase === 'leaving' || undefined}
      role="status"
      aria-live="polite"
      aria-label="Đang tải Hanzi Studio"
      onClick={() => setPhase('leaving')}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="intro-logo relative">
          <span aria-hidden className="intro-glow absolute inset-0 rounded-[1.75rem]" />
          <span
            lang="zh-Hans"
            className="font-hanzi relative grid size-24 place-items-center rounded-[1.75rem] text-5xl text-white shadow-[inset_0_1px_0_oklch(1_0_0/40%)] sm:size-28 sm:text-6xl"
            style={{ background: 'linear-gradient(135deg, oklch(0.74 0.19 30), oklch(0.58 0.23 22))' }}
          >
            汉
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="intro-title text-2xl font-bold tracking-tight sm:text-3xl">Hanzi Studio</p>
          <p className="intro-tagline text-sm text-muted-foreground">
            <span lang="zh-Hans">学中文</span>
            <span aria-hidden className="mx-2 opacity-50">
              ·
            </span>
            Học tiếng Trung mỗi ngày
          </p>
        </div>
      </div>

      <div className="intro-loader flex w-48 flex-col items-center gap-2.5">
        <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
          <div className="intro-bar h-full rounded-full bg-primary" />
        </div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground">Đang tải…</p>
      </div>
    </div>
  )
}
