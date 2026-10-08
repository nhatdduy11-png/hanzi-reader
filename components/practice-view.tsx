'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, RotateCcw, Shuffle, Volume2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LEVELS, WORDS, stripPinyin, type Level, type Word } from '@/lib/vocab'
import { langFor, speakOnce } from '@/lib/speak'
import { normalizeForCompare, toSimplified } from '@/lib/chinese'
import { useSettings } from './settings-provider'
import { Segmented } from './segmented'
import { Chip, Hanzi, LevelBadge, PageHeader } from './ui-bits'

type Mode = 'flash' | 'quiz' | 'dictation'
const DECK_SIZE = 12

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function useWordHelpers() {
  const { study, script, uiLang, hz } = useSettings()
  const speak = (w: Word) => speakOnce(study === 'zh' ? hz(w.zh, true) : w.en, langFor(study, script), 0.85)
  const prompt = (w: Word) => (study === 'zh' ? hz(w.zh, true) : w.en)
  const meaning = (w: Word) => (uiLang === 'vi' ? w.vi : study === 'zh' ? w.en : `${hz(w.zh, true)} · ${w.py}`)
  return { speak, prompt, meaning, study }
}

function Flashcards({ deck, onRestart }: { deck: Word[]; onRestart: () => void }) {
  const { t, uiLang, hz } = useSettings()
  const { speak, study } = useWordHelpers()
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)

  useEffect(() => {
    setI(0)
    setKnown(0)
    setFlipped(false)
  }, [deck])

  const next = (ok: boolean) => {
    if (ok) setKnown((k) => k + 1)
    setFlipped(false)
    setI((n) => n + 1)
  }

  if (i >= deck.length) {
    return (
      <div className="glass-strong mx-auto flex max-w-md flex-col items-center gap-4 rounded-[2rem] p-10 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-jade/20 text-jade">
          <Check className="size-8" aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-extrabold">{t.practice.done}</h2>
        <p className="text-muted-foreground">
          {t.practice.score}: {known}/{deck.length}
        </p>
        <button type="button" onClick={onRestart} className="btn-primary inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold">
          <RotateCcw className="size-4" aria-hidden="true" />
          {t.practice.restart}
        </button>
      </div>
    )
  }

  const w = deck[i]
  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="tabular-nums">
          {t.practice.card} {i + 1}/{deck.length}
        </span>
        <LevelBadge level={w.lvl} />
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-to-r from-gold to-primary transition-all" style={{ width: `${(i / deck.length) * 100}%` }} />
      </div>
      <button
        type="button"
        onClick={() => {
          setFlipped((f) => !f)
          if (!flipped) speak(w)
        }}
        aria-label={t.practice.flip}
        className="flip-scene relative block h-72 w-full text-left sm:h-80"
      >
        <span className="flip-card block h-full w-full" data-flipped={flipped}>
          <span className="flip-face glass-strong flex flex-col items-center justify-center gap-4 rounded-[2rem] p-8 text-center">
            {study === 'zh' ? (
              <Hanzi as="div" className="text-balance text-7xl leading-tight">
                {hz(w.zh, true)}
              </Hanzi>
            ) : (
              <p lang="en" className="text-balance text-5xl font-extrabold">
                {w.en}
              </p>
            )}
            <span className="text-xs text-muted-foreground">{t.practice.flip}</span>
          </span>
          <span className="flip-face flip-back glass-strong flex flex-col items-center justify-center gap-3 rounded-[2rem] p-8 text-center">
            {study === 'zh' ? (
              <p className="text-3xl font-semibold text-gold">{w.py}</p>
            ) : (
              <p className="flex items-baseline gap-3 text-gold">
                <Hanzi className="text-4xl text-foreground">{hz(w.zh, true)}</Hanzi>
                <span className="text-2xl">{w.py}</span>
              </p>
            )}
            <p className="text-2xl font-bold">{uiLang === 'vi' ? w.vi : w.en}</p>
            <p className="text-muted-foreground">{uiLang === 'vi' ? w.en : w.vi}</p>
          </span>
        </span>
      </button>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <button type="button" onClick={() => next(false)} className="flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-muted text-sm font-semibold hover:bg-accent">
          <X className="size-4 text-primary" aria-hidden="true" />
          {t.practice.again}
        </button>
        <button type="button" onClick={() => speak(w)} aria-label={t.practice.listenAgain} className="grid size-12 place-items-center rounded-full border border-border bg-muted hover:bg-accent">
          <Volume2 className="size-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => next(true)} className="btn-primary flex h-12 items-center justify-center gap-2 rounded-full text-sm font-bold">
          <Check className="size-4" aria-hidden="true" />
          {t.practice.know}
        </button>
      </div>
    </div>
  )
}

function Quiz({ deck, pool, onRestart }: { deck: Word[]; pool: Word[]; onRestart: () => void }) {
  const { t } = useSettings()
  const { prompt, meaning, speak, study } = useWordHelpers()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [options, setOptions] = useState<Word[]>([])

  useEffect(() => {
    setI(0)
    setScore(0)
    setStreak(0)
    setPicked(null)
  }, [deck])

  const current = deck[i]
  useEffect(() => {
    if (!current) return
    const distractors = shuffle(pool.filter((w) => w.id !== current.id)).slice(0, 3)
    setOptions(shuffle([current, ...distractors]))
  }, [current, pool])

  if (!current) {
    return (
      <div className="glass-strong mx-auto flex max-w-md flex-col items-center gap-4 rounded-[2rem] p-10 text-center">
        <h2 className="text-2xl font-extrabold">{t.practice.done}</h2>
        <p className="text-4xl font-extrabold tabular-nums text-gold">
          {score}/{deck.length}
        </p>
        <button type="button" onClick={onRestart} className="btn-primary inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold">
          <RotateCcw className="size-4" aria-hidden="true" />
          {t.practice.restart}
        </button>
      </div>
    )
  }

  const choose = (idx: number) => {
    if (picked !== null) return
    setPicked(idx)
    if (options[idx].id === current.id) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else setStreak(0)
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="tabular-nums">
          {i + 1}/{deck.length}
        </span>
        <span>
          {t.practice.streak}: <b className="tabular-nums text-gold">{streak}</b>
        </span>
      </div>
      <div className="glass-strong flex flex-col items-center gap-4 rounded-[2rem] p-8 text-center">
        <p className="text-sm text-muted-foreground">{t.practice.chooseMeaning}</p>
        {study === 'zh' ? (
          <Hanzi as="div" className="text-6xl leading-tight">
            {prompt(current)}
          </Hanzi>
        ) : (
          <p lang="en" className="text-5xl font-extrabold">
            {prompt(current)}
          </p>
        )}
        <button type="button" onClick={() => speak(current)} className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
          <Volume2 className="size-4" aria-hidden="true" />
          {t.vocab.listen}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o, idx) => {
          const isRight = o.id === current.id
          const show = picked !== null
          return (
            <button
              key={o.id}
              type="button"
              disabled={show}
              onClick={() => choose(idx)}
              className={cn(
                'glass rounded-2xl p-4 text-left font-medium transition-all enabled:hover:-translate-y-0.5 enabled:hover:bg-accent',
                show && isRight && 'border-jade bg-jade/20',
                show && picked === idx && !isRight && 'border-destructive bg-destructive/20',
              )}
            >
              {meaning(o)}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <div className="flex items-center justify-between gap-3" aria-live="polite">
          <p className={cn('font-bold', options[picked].id === current.id ? 'text-jade' : 'text-destructive')}>
            {options[picked].id === current.id ? t.practice.correct : t.practice.wrong}
          </p>
          <button
            type="button"
            onClick={() => {
              setPicked(null)
              setI((n) => n + 1)
            }}
            className="btn-primary h-11 rounded-full px-6 text-sm font-bold"
          >
            {t.practice.next}
          </button>
        </div>
      )}
    </div>
  )
}

function Dictation({ deck, onRestart }: { deck: Word[]; onRestart: () => void }) {
  const { t } = useSettings()
  const { speak, study } = useWordHelpers()
  const [i, setI] = useState(0)
  const [value, setValue] = useState('')
  const [result, setResult] = useState<'ok' | 'bad' | null>(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setI(0)
    setScore(0)
    setValue('')
    setResult(null)
  }, [deck])

  const w = deck[i]

  const check = useCallback(() => {
    if (!w || result) return
    const input = normalizeForCompare(study === 'zh' ? toSimplified(value) : value)
    const targets =
      study === 'zh'
        ? [normalizeForCompare(w.zh), normalizeForCompare(stripPinyin(w.py))]
        : [normalizeForCompare(w.en)]
    const ok = targets.includes(input) || (study === 'zh' && normalizeForCompare(stripPinyin(value)) === normalizeForCompare(stripPinyin(w.py)))
    setResult(ok ? 'ok' : 'bad')
    if (ok) setScore((s) => s + 1)
  }, [w, result, value, study])

  if (!w) {
    return (
      <div className="glass-strong mx-auto flex max-w-md flex-col items-center gap-4 rounded-[2rem] p-10 text-center">
        <h2 className="text-2xl font-extrabold">{t.practice.done}</h2>
        <p className="text-4xl font-extrabold tabular-nums text-gold">
          {score}/{deck.length}
        </p>
        <button type="button" onClick={onRestart} className="btn-primary inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold">
          <RotateCcw className="size-4" aria-hidden="true" />
          {t.practice.restart}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <p className="text-sm tabular-nums text-muted-foreground">
        {i + 1}/{deck.length}
      </p>
      <div className="glass-strong flex flex-col items-center gap-5 rounded-[2rem] p-8 text-center">
        <p className="text-muted-foreground">{t.practice.listenPrompt}</p>
        <button
          type="button"
          onClick={() => speak(w)}
          aria-label={t.practice.listenAgain}
          className="btn-primary grid size-20 place-items-center rounded-full"
        >
          <Volume2 className="size-8" aria-hidden="true" />
        </button>
        <form
          className="flex w-full flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            check()
          }}
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={study === 'zh' ? t.practice.typeHere : t.practice.typeHereEn}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={result !== null}
            aria-label={t.practice.dictation}
            className="h-12 w-full rounded-2xl border border-input bg-background/40 px-4 text-center text-lg outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
          />
          {study === 'zh' && <p className="text-xs text-muted-foreground">{t.practice.spellingHint}</p>}
          {result === null && (
            <button type="submit" disabled={!value.trim()} className="btn-primary h-12 rounded-full text-sm font-bold disabled:opacity-50">
              {t.practice.check}
            </button>
          )}
        </form>
        {result && (
          <div className="flex w-full flex-col items-center gap-2" aria-live="polite">
            <p className={cn('text-lg font-bold', result === 'ok' ? 'text-jade' : 'text-destructive')}>
              {result === 'ok' ? t.practice.correct : t.practice.wrong}
            </p>
            <p className="text-sm text-muted-foreground">
              {t.practice.answer}: <b className="text-foreground">{w.zh}</b> · {w.py} · {w.en}
            </p>
            <button
              type="button"
              onClick={() => {
                setI((n) => n + 1)
                setValue('')
                setResult(null)
              }}
              className="btn-primary mt-2 h-11 rounded-full px-6 text-sm font-bold"
            >
              {t.practice.next}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function PracticeView() {
  const { t } = useSettings()
  const [mode, setMode] = useState<Mode>('flash')
  const [level, setLevel] = useState<Level | 'all'>('A1')
  const [deck, setDeck] = useState<Word[]>([])

  const pool = WORDS.filter((w) => level === 'all' || w.lvl === level)
  const build = useCallback(() => {
    const p = WORDS.filter((w) => level === 'all' || w.lvl === level)
    setDeck(shuffle(p).slice(0, DECK_SIZE))
  }, [level])

  useEffect(() => {
    build()
  }, [build])

  return (
    <>
      <PageHeader title={t.practice.title} desc={t.practice.desc} />
      <div className="mb-8 flex flex-col items-start gap-4">
        <Segmented
          label={t.practice.title}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'flash', label: t.practice.flash },
            { value: 'quiz', label: t.practice.quiz },
            { value: 'dictation', label: t.practice.dictation },
          ]}
        />
        <div className="scroll-hide -mx-1 flex max-w-full gap-2 overflow-x-auto px-1" role="group" aria-label={t.vocab.level}>
          <Chip active={level === 'all'} onClick={() => setLevel('all')}>
            {t.vocab.all}
          </Chip>
          {LEVELS.map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {l}
            </Chip>
          ))}
          <button
            type="button"
            onClick={build}
            className="ml-1 flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-gold hover:bg-accent"
          >
            <Shuffle className="size-3.5" aria-hidden="true" />
            {t.practice.shuffle}
          </button>
        </div>
      </div>
      {deck.length > 0 && mode === 'flash' && <Flashcards deck={deck} onRestart={build} />}
      {deck.length > 0 && mode === 'quiz' && <Quiz deck={deck} pool={pool.length >= 4 ? pool : WORDS} onRestart={build} />}
      {deck.length > 0 && mode === 'dictation' && <Dictation deck={deck} onRestart={build} />}
    </>
  )
}
