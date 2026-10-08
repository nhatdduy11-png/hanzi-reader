'use client'

import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Level } from '@/lib/vocab'
import { useSettings } from './settings-provider'

const LEVEL_STYLE: Record<Level, string> = {
  A1: 'bg-jade/15 text-jade ring-jade/30',
  A2: 'bg-jade/15 text-jade ring-jade/30',
  B1: 'bg-gold/15 text-gold ring-gold/30',
  B2: 'bg-gold/15 text-gold ring-gold/30',
  C1: 'bg-primary/15 text-primary ring-primary/30',
  Native: 'bg-gradient-to-r from-primary/25 to-gold/25 text-foreground ring-gold/40',
}

export function LevelBadge({ level, className }: { level: Level; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ring-1 ring-inset',
        LEVEL_STYLE[level],
        className,
      )}
    >
      {level}
    </span>
  )
}

export function Hanzi({
  children,
  className,
  as: Tag = 'span',
}: {
  children: React.ReactNode
  className?: string
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
}) {
  const { hanziLang } = useSettings()
  return (
    <Tag lang={hanziLang} className={cn('font-hanzi', className)}>
      {children}
    </Tag>
  )
}

export function SpeakButton({
  onClick,
  label,
  active,
  className,
}: {
  onClick: () => void
  label: string
  active?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full border border-border bg-muted text-foreground transition-all hover:bg-accent hover:text-gold active:scale-95',
        active && 'border-gold/50 bg-gold/15 text-gold',
        className,
      )}
    >
      <Volume2 className="size-4" aria-hidden="true" />
    </button>
  )
}

export function PageHeader({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow?: string
  title: string
  desc?: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        )}
        <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {desc && <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
        active
          ? 'border-transparent bg-foreground text-background shadow-[0_6px_16px_-6px_oklch(0_0_0/50%)]'
          : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
