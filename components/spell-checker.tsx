'use client'

import { useState } from 'react'
import { ArrowRight, Check, Copy, Loader2, Sparkles, Volume2, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { speakOnce } from '@/lib/speak'
import { useSettings } from './settings-provider'
import { Segmented } from './segmented'
import { PageHeader } from './ui-bits'

interface Issue {
  original: string
  suggestion: string
  type: 'typo' | 'grammar' | 'punctuation' | 'wordChoice'
  explanation: string
}
interface Result {
  language: 'zh' | 'en' | 'mixed'
  corrected: string
  issues: Issue[]
}

const TYPE_STYLE: Record<Issue['type'], string> = {
  typo: 'bg-primary/15 text-primary',
  grammar: 'bg-gold/15 text-gold',
  punctuation: 'bg-jade/15 text-jade',
  wordChoice: 'bg-foreground/10 text-foreground',
}

export function SpellChecker() {
  const { t, uiLang, hanziLang } = useSettings()
  const [text, setText] = useState('')
  const [language, setLanguage] = useState<'auto' | 'zh' | 'en'>('auto')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | 'billing' | 'generic'>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/spellcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, explainIn: uiLang }),
      })
      if (res.status === 402) {
        setError('billing')
        return
      }
      if (!res.ok) throw new Error('failed')
      setResult((await res.json()) as Result)
    } catch {
      setError('generic')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.corrected)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const useSample = () => {
    setText(language === 'en' ? t.spell.sampleTextEn : t.spell.sampleText)
    setResult(null)
  }

  const speakLang = result?.language === 'en' ? 'en-US' : hanziLang === 'zh-Hant' ? 'zh-TW' : 'zh-CN'

  return (
    <>
      <PageHeader eyebrow={t.spell.poweredBy} title={t.spell.title} desc={t.spell.desc} />

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className="glass-strong flex flex-col gap-4 rounded-[2rem] p-5 sm:p-6" aria-label={t.spell.title}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              size="sm"
              label={t.spell.auto}
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'auto', label: t.spell.auto },
                { value: 'zh', label: t.spell.zh, lang: 'zh' },
                { value: 'en', label: t.spell.en, lang: 'en' },
              ]}
            />
            <button type="button" onClick={useSample} className="text-sm font-semibold text-gold hover:underline">
              {t.spell.sample}
            </button>
          </div>
          <label>
            <span className="sr-only">{t.spell.title}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.spell.placeholder}
              maxLength={2000}
              rows={10}
              spellCheck={false}
              className="min-h-56 w-full resize-y rounded-2xl border border-input bg-background/40 p-4 text-lg leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs tabular-nums text-muted-foreground">
              {text.length}/2000 {t.spell.chars}
            </span>
            <div className="flex gap-2">
              {text && (
                <button
                  type="button"
                  onClick={() => {
                    setText('')
                    setResult(null)
                  }}
                  className="h-11 rounded-full border border-border bg-muted px-5 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  {t.spell.clear}
                </button>
              )}
              <button
                type="button"
                onClick={run}
                disabled={!text.trim() || loading}
                className="btn-primary inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Wand2 className="size-4" aria-hidden="true" />}
                {loading ? t.spell.checking : t.spell.check}
              </button>
            </div>
          </div>
        </section>

        <section className="glass flex min-h-72 flex-col gap-5 rounded-[2rem] p-5 sm:p-6" aria-live="polite" aria-label={t.spell.result}>
          {!result && !loading && !error && (
            <div className="m-auto flex max-w-xs flex-col items-center gap-3 text-center text-muted-foreground">
              <span className="grid size-14 place-items-center rounded-2xl border border-border bg-muted">
                <Sparkles className="size-6 text-gold" aria-hidden="true" />
              </span>
              <p className="text-pretty">{t.spell.desc}</p>
            </div>
          )}
          {loading && (
            <div className="m-auto flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-gold" aria-hidden="true" />
              {t.spell.checking}
            </div>
          )}
          {error && (
          <p role="alert" className="m-auto max-w-sm text-balance text-center font-medium text-destructive">
            {error === 'billing' ? t.spell.billing : t.spell.error}
          </p>
        )}
          {result && (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">{t.spell.corrected}</h2>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-bold',
                    result.issues.length ? 'bg-primary/15 text-primary' : 'bg-jade/15 text-jade',
                  )}
                >
                  {result.issues.length} {t.spell.foundIssues}
                </span>
              </div>
              <p
                lang={result.language === 'en' ? 'en' : hanziLang}
                className={cn(
                  'rounded-2xl border border-jade/30 bg-jade/10 p-4 text-lg leading-relaxed',
                  result.language !== 'en' && 'font-hanzi text-xl',
                )}
              >
                {result.corrected}
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copy} className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-muted px-4 text-sm font-semibold hover:bg-accent">
                  {copied ? <Check className="size-4 text-jade" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                  {copied ? t.spell.copied : t.spell.copy}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setText(result.corrected)
                    setResult(null)
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-muted px-4 text-sm font-semibold hover:bg-accent"
                >
                  {t.spell.apply}
                </button>
                <button
                  type="button"
                  onClick={() => speakOnce(result.corrected, speakLang)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-muted px-4 text-sm font-semibold hover:bg-accent"
                >
                  <Volume2 className="size-4" aria-hidden="true" />
                  {t.spell.listen}
                </button>
              </div>

              {result.issues.length === 0 ? (
                <p className="flex items-center gap-2 font-medium text-jade">
                  <Check className="size-5" aria-hidden="true" />
                  {t.spell.noIssues}
                </p>
              ) : (
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.spell.issues}</h3>
                  <ul className="flex flex-col gap-3">
                    {result.issues.map((issue, i) => (
                      <li key={i} className="rounded-2xl border border-border bg-muted/60 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', TYPE_STYLE[issue.type])}>
                            {t.spell.types[issue.type]}
                          </span>
                          <span className="font-medium text-destructive line-through decoration-2">{issue.original}</span>
                          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                          <span className="font-semibold text-jade">{issue.suggestion}</span>
                        </div>
                        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{issue.explanation}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  )
}
