'use client'

import { cn } from '@/lib/utils'

interface Option<T extends string> {
  value: T
  label: React.ReactNode
  lang?: string
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = 'md',
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: Option<T>[]
  label: string
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('inline-flex rounded-full border border-border bg-muted p-0.5', className)}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            lang={o.lang}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-full font-semibold transition-all',
              o.lang?.startsWith('zh') && 'font-hanzi',
              size === 'sm' ? 'px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs' : 'px-3 py-1.5 text-[13px] sm:px-3.5 sm:text-sm',
              active
                ? 'bg-foreground text-background shadow-[0_4px_14px_-4px_oklch(0_0_0/50%)]'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
