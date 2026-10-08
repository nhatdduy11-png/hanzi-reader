'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Mic, MicOff, Pause, Play, SlidersHorizontal, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Story } from '@/lib/stories'
import { langFor } from '@/lib/speak'
import { normalizeForCompare, rubyFor, similarity, toSimplified } from '@/lib/chinese'
import { useSettings } from './settings-provider'
import { useRecognizer, useSpeech } from './use-speech'
import { Segmented } from './segmented'
import { Hanzi, LevelBadge, SpeakButton } from './ui-bits'

interface ShadowResult {
  index: number
  heard: string
  score: number
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex items-center gap-2 text-sm font-medium"
    >
      <span
        className={cn(
          'relative h-6 w-10 rounded-full border border-border transition-colors',
          on ? 'bg-jade/70' : 'bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all',
            on ? 'left-[1.1rem]' : 'left-0.5',
          )}
        />
      </span>
      {label}
    </button>
  )
}

export function StoryReader({ story }: { story: Story }) {
  const { t, uiLang, study, script, hz } = useSettings()
  const lang = langFor(study, script)
  const speech = useSpeech(lang)
  const recognizer = useRecognizer(lang)

  const [active, setActive] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [showPinyin, setShowPinyin] = useState(true)
  const [showTrans, setShowTrans] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shadow, setShadow] = useState<ShadowResult | null>(null)
  const [shadowIdx, setShadowIdx] = useState<number | null>(null)

  const playingRef = useRef(false)
  const playFromRef = useRef<(i: number) => void>(() => {})
  const lineRefs = useRef<(HTMLLIElement | null)[]>([])

  const lineText = useCallback(
    (i: number) => (study === 'zh' ? hz(story.lines[i].zh) : story.lines[i].en),
    [study, hz, story.lines],
  )

  playFromRef.current = (i: number) => {
    if (i >= story.lines.length) {
      playingRef.current = false
      setPlaying(false)
      setActive(null)
      return
    }
    setActive(i)
    playingRef.current = true
    setPlaying(true)
    speech.speak(lineText(i), () => {
      if (playingRef.current) playFromRef.current(i + 1)
    })
  }

  const stopAll = useCallback(() => {
    playingRef.current = false
    setPlaying(false)
    speech.cancel()
  }, [speech])

  const jumpTo = (i: number) => {
    if (playing) {
      speech.cancel()
      playFromRef.current(i)
      return
    }
    setActive(i)
  }

  useEffect(() => {
    if (!settingsOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [settingsOpen])

  useEffect(() => {
    playingRef.current = false
    setPlaying(false)
    setActive(null)
    setShadow(null)
  }, [study, script])

  const togglePlay = () => {
    if (playing) {
      stopAll()
      return
    }
    playFromRef.current(active ?? 0)
  }

  const playOne = (i: number) => {
    stopAll()
    setActive(i)
    speech.speak(lineText(i))
  }

  const startShadow = (i: number) => {
    stopAll()
    if (shadowIdx === i && recognizer.listening) {
      recognizer.stop()
      setShadowIdx(null)
      return
    }
    setShadowIdx(i)
    setActive(i)
    setShadow(null)
    recognizer.start((heard) => {
      const target = study === 'zh' ? story.lines[i].zh : story.lines[i].en
      const spoken = study === 'zh' ? toSimplified(heard) : heard
      const score = similarity(normalizeForCompare(spoken), normalizeForCompare(target))
      setShadow({ index: i, heard, score })
      setShadowIdx(null)
    })
  }

  const rubies = useMemo(
    () => story.lines.map((l) => (study === 'zh' ? rubyFor(l.zh, hz(l.zh)) : null)),
    [story.lines, study, hz],
  )

  const title = study === 'zh' ? hz(story.title.zh) : story.title.en
  const topic = uiLang === 'vi' ? story.topic.vi : story.topic.en
  const progress = active === null ? 0 : ((active + 1) / story.lines.length) * 100

  const settings = (
    <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Segmented
              size="sm"
              label={t.stories.speed}
              value={String(speech.rate)}
              onChange={(v) => speech.setRate(Number(v))}
              options={[
                { value: '0.6', label: '0.6x' },
                { value: '0.9', label: '1x' },
                { value: '1.15', label: '1.25x' },
              ]}
            />
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t.stories.voice}</span>
              <select
                value={speech.voiceURI}
                onChange={(e) => speech.setVoiceURI(e.target.value)}
                className="max-w-44 truncate rounded-full border border-input bg-muted px-3 py-1.5 text-sm outline-none focus:border-gold/60"
              >
                <option value="">{t.stories.autoVoice}</option>
                {speech.voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI} className="bg-card text-foreground">
                    {v.name}
                  </option>
                ))}
              </select>
            </label>
            {study === 'zh' && <Toggle on={showPinyin} onChange={setShowPinyin} label={t.stories.pinyin} />}
            <Toggle on={showTrans} onChange={setShowTrans} label={t.stories.translation} />
          </div>
          {!speech.supported && <p className="text-sm text-destructive">{t.stories.noVoice}</p>}
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/stories"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t.stories.back}
      </Link>

      <header className="glass-strong relative mb-6 overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-12 size-64 rounded-full blur-3xl"
          style={{ background: `oklch(0.7 0.16 ${story.hue} / 40%)` }}
        />
        <Hanzi
          as="div"
          className="pointer-events-none absolute -bottom-8 right-0 select-none text-[11rem] leading-none text-foreground/[0.06]"
        >
          {hz(story.glyph)}
        </Hanzi>
        <div className="relative flex items-center gap-3">
          <LevelBadge level={story.level} />
          <span className="text-sm text-muted-foreground">{topic}</span>
        </div>
        {study === 'zh' ? (
          <Hanzi as="h1" className="relative mt-4 text-balance text-4xl leading-tight sm:text-5xl">
            {title}
          </Hanzi>
        ) : (
          <h1 lang="en" className="relative mt-4 text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
            {title}
          </h1>
        )}
        <p className="relative mt-2 text-gold">{uiLang === 'vi' ? story.title.vi : story.title.en}</p>
      </header>

      <div
        className="fixed inset-x-0 z-30 flex justify-center px-4 bottom-[calc(env(safe-area-inset-bottom)+4.25rem)] md:bottom-[calc(env(safe-area-inset-bottom)+1rem)]"
      >
      <section
        aria-label={t.stories.voiceAi}
        className="glass-nav relative flex w-full max-w-3xl flex-col gap-2 rounded-3xl p-3 shadow-xl"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              'btn-primary inline-flex h-10 items-center gap-2 rounded-full pl-4 pr-5 text-sm font-bold',
              playing && 'pulse-ring',
            )}
          >
            {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {playing ? t.stories.pause : t.stories.play}
          </button>
          {(playing || active !== null) && (
            <button
              type="button"
              aria-label={t.stories.stop}
              onClick={() => {
                stopAll()
                setActive(null)
              }}
              className="grid size-10 place-items-center rounded-full border border-border bg-muted transition-colors hover:bg-accent"
            >
              <Square className="size-4" aria-hidden="true" />
            </button>
          )}
          {playing && (
            <span aria-hidden="true" className="flex h-6 items-end gap-1">
              {[0, 0.2, 0.4, 0.1, 0.3].map((d) => (
                <span key={d} className="eq-bar h-full w-1 rounded-full bg-gold" style={{ animationDelay: `${d}s` }} />
              ))}
            </span>
          )}
          <div className="ml-auto text-xs font-medium tabular-nums text-muted-foreground">
            {active !== null ? active + 1 : 0} / {story.lines.length}
          </div>
          <button
            type="button"
            aria-label={t.settings.open}
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((v) => !v)}
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-full border border-border bg-muted transition-colors hover:bg-accent active:scale-95',
              settingsOpen && 'border-gold/60 bg-gold/15 text-gold',
            )}
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex h-5 items-center" aria-label={t.stories.sentence}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="relative flex h-full w-full">
            {story.lines.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => jumpTo(i)}
                aria-label={`${t.stories.sentence} ${i + 1}`}
                aria-current={active === i ? 'step' : undefined}
                title={`${t.stories.sentence} ${i + 1}`}
                className="group flex h-full flex-1 items-center justify-end"
              >
                <span
                  className={cn(
                    'h-1.5 w-px bg-background/60 group-last:hidden',
                    active === i && 'bg-transparent',
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {settingsOpen && (
          <div
            className="absolute inset-x-0 bottom-[calc(100%+8px)] z-10 max-h-[50vh] overflow-y-auto rounded-3xl border border-border p-4 shadow-xl"
            style={{ background: 'color-mix(in oklab, var(--card) 96%, transparent)' }}
          >
            {settings}
          </div>
        )}
      </section>
      </div>

      <p className="mb-3 px-1 text-sm text-muted-foreground">{t.stories.tapToListen}</p>

      <ol className="flex flex-col gap-3">
        {story.lines.map((line, i) => {
          const isActive = active === i
          const ruby = rubies[i]
          const result = shadow?.index === i ? shadow : null
          const listeningHere = shadowIdx === i && recognizer.listening
          return (
            <li
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el
              }}
              className={cn(
                'glass rounded-3xl p-4 transition-all duration-300 sm:p-5',
                isActive && 'scale-[1.015] border-gold/50 bg-gold/10 shadow-[0_0_0_1px_var(--gold),0_24px_48px_-20px_var(--gold)]',
              )}
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => playOne(i)}
                  aria-label={`${t.vocab.listen}: ${lineText(i)}`}
                  className="min-w-0 flex-1 text-left"
                >
                  {study === 'zh' ? (
                    <Hanzi as="p" className="text-balance text-2xl leading-[2.6] sm:text-3xl sm:leading-[2.8]">
                      {ruby && showPinyin
                        ? ruby.map((r, k) => (
                            <ruby key={k} className="[ruby-position:over]">
                              {r.char}
                              <rt className="font-sans text-[0.4em] font-medium text-gold">{r.py}</rt>
                            </ruby>
                          ))
                        : hz(line.zh)}
                    </Hanzi>
                  ) : (
                    <p lang="en" className="text-pretty text-xl font-medium leading-relaxed sm:text-2xl">
                      {line.en}
                    </p>
                  )}
                  {showTrans && (
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {study === 'zh'
                        ? uiLang === 'vi'
                          ? line.vi
                          : line.en
                        : uiLang === 'vi'
                          ? line.vi
                          : hz(line.zh)}
                    </p>
                  )}
                </button>
                <div className="flex shrink-0 flex-col gap-2">
                  <SpeakButton label={`${t.vocab.listen} ${i + 1}`} active={isActive && speech.speaking} onClick={() => playOne(i)} />
                  <button
                    type="button"
                    aria-label={t.stories.shadow}
                    title={t.stories.shadow}
                    onClick={() => startShadow(i)}
                    className={cn(
                      'grid size-10 place-items-center rounded-full border border-border bg-muted transition-all hover:bg-accent active:scale-95',
                      listeningHere && 'pulse-ring border-primary bg-primary/20 text-primary',
                    )}
                  >
                    {recognizer.supported ? <Mic className="size-4" aria-hidden="true" /> : <MicOff className="size-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {(listeningHere || result || (recognizer.error && shadowIdx === null && shadow === null && active === i)) && (
                <div className="mt-3 rounded-2xl border border-border bg-background/30 p-3 text-sm" aria-live="polite">
                  {listeningHere && <p className="font-medium text-primary">{t.stories.listening}</p>}
                  {result && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">{t.stories.score}</span>
                        <span
                          className={cn(
                            'text-lg font-extrabold tabular-nums',
                            result.score >= 0.8 ? 'text-jade' : result.score >= 0.5 ? 'text-gold' : 'text-destructive',
                          )}
                        >
                          {Math.round(result.score * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-700',
                            result.score >= 0.8 ? 'bg-jade' : result.score >= 0.5 ? 'bg-gold' : 'bg-destructive',
                          )}
                          style={{ width: `${Math.round(result.score * 100)}%` }}
                        />
                      </div>
                      <p className="text-muted-foreground">
                        {t.stories.heard}: <span lang={study === 'zh' ? 'zh' : 'en'} className="font-medium text-foreground">{result.heard}</span>
                      </p>
                      <p className="font-semibold">
                        {result.score >= 0.8 ? t.stories.great : result.score >= 0.5 ? t.stories.good : t.stories.retry}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {!recognizer.supported && <p className="mt-6 text-center text-sm text-muted-foreground">{t.stories.noMic}</p>}
      {recognizer.error === 'not-allowed' && (
        <p className="mt-3 text-center text-sm text-destructive">{t.stories.micDenied}</p>
      )}
      <div aria-hidden="true" className="h-28" />
    </div>
  )
}
