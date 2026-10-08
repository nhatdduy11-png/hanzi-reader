'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, LEVELS, WORDS, stripPinyin, type Category, type Level } from '@/lib/vocab'
import { toSimplified } from '@/lib/chinese'
import { useSettings } from './settings-provider'
import { WordCard } from './word-card'
import { Chip, PageHeader } from './ui-bits'

const PAGE = 36

export function VocabBrowser() {
  const { t, study } = useSettings()
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [limit, setLimit] = useState(PAGE)
  const [panelOpen, setPanelOpen] = useState(false)
  const deferred = useDeferredValue(query)

  const filtered = useMemo(() => {
    const q = deferred.trim().toLowerCase()
    const qSimp = toSimplified(q)
    const qPy = stripPinyin(q)
    return WORDS.filter((w) => {
      if (level !== 'all' && w.lvl !== level) return false
      if (cat !== 'all' && w.cat !== cat) return false
      if (!q) return true
      return (
        w.zh.includes(qSimp) ||
        w.en.toLowerCase().includes(q) ||
        w.vi.toLowerCase().includes(q) ||
        w.py.toLowerCase().includes(q) ||
        (qPy.length > 1 && stripPinyin(w.py).includes(qPy))
      )
    })
  }, [deferred, level, cat])

  const reset = () => setLimit(PAGE)
  const activeFilters = (level !== 'all' ? 1 : 0) + (cat !== 'all' ? 1 : 0)

  const filterChips = (
    <div className="flex flex-col gap-3">
      <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t.vocab.level}>
        <Chip active={level === 'all'} onClick={() => { setLevel('all'); reset() }}>
          {t.vocab.all}
        </Chip>
        {LEVELS.map((l) => (
          <Chip key={l} active={level === l} onClick={() => { setLevel(l); reset() }}>
            {l === 'Native' ? t.levels.Native : `${l} · ${t.levels[l]}`}
          </Chip>
        ))}
      </div>
      <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t.vocab.topic}>
        <Chip active={cat === 'all'} onClick={() => { setCat('all'); reset() }}>
          {t.vocab.all}
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => { setCat(c); reset() }}>
            {t.categories[c]}
          </Chip>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <PageHeader eyebrow={`${WORDS.length}+ ${t.home.words}`} title={t.vocab.title} desc={t.vocab.desc} />

      <div className="sticky-bar mb-3">
        <div className="glass-nav relative flex items-center gap-2 rounded-full p-1.5">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">{t.vocab.search}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                reset()
              }}
              placeholder={t.vocab.search}
              className="h-10 w-full rounded-full border border-input bg-background/40 pl-10 pr-10 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear"
                onClick={() => {
                  setQuery('')
                  reset()
                }}
                className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </label>
          <button
            type="button"
            aria-label={`${t.vocab.level} / ${t.vocab.topic}`}
            aria-expanded={panelOpen}
            onClick={() => setPanelOpen((v) => !v)}
            className="show-when-scrolled relative size-10 shrink-0 place-items-center rounded-full border border-border bg-muted text-foreground active:scale-95"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            {activeFilters > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilters}
              </span>
            )}
          </button>

          {panelOpen && (
            <div
              className="show-when-scrolled absolute inset-x-0 top-[calc(100%+8px)] z-10 rounded-3xl border border-border p-4 shadow-xl"
              style={{ background: 'color-mix(in oklab, var(--card) 95%, transparent)' }}
            >
              {filterChips}
            </div>
          )}
        </div>
      </div>

      <div className="hide-when-scrolled mb-6 px-1">{filterChips}</div>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {t.vocab.results}
        {study === 'en' && ' · English'}
      </p>

      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-lg font-semibold">{t.vocab.empty}</p>
          <p className="mt-1 text-muted-foreground">{t.vocab.emptyHint}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, limit).map((w) => (
              <WordCard key={w.id} word={w} />
            ))}
          </div>
          {limit < filtered.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setLimit((l) => l + PAGE)}
                className="glass rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
              >
                {t.vocab.more} ({filtered.length - limit})
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
