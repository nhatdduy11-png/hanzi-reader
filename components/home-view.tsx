'use client'

import Link from 'next/link'
import { ArrowRight, AudioLines, Mic, SpellCheck, Type } from 'lucide-react'
import { LEVELS, WORDS } from '@/lib/vocab'
import { STORIES } from '@/lib/stories'
import { langFor, speakOnce } from '@/lib/speak'
import { useSettings } from './settings-provider'
import { Hanzi, LevelBadge, SpeakButton } from './ui-bits'
import { StoryCard } from './story-card'

export function HomeView() {
  const { t, uiLang, study, script, hz } = useSettings()

  const dayIndex = Math.floor(Date.now() / 86_400_000) % WORDS.length
  const wotd = WORDS[dayIndex]
  const speakText = study === 'zh' ? hz(wotd.zh, true) : wotd.en

  const features = [
    { Icon: AudioLines, title: t.home.f1t, desc: t.home.f1d, tone: 'text-primary' },
    { Icon: Mic, title: t.home.f2t, desc: t.home.f2d, tone: 'text-jade' },
    { Icon: SpellCheck, title: t.home.f3t, desc: t.home.f3d, tone: 'text-gold' },
    { Icon: Type, title: t.home.f4t, desc: t.home.f4d, tone: 'text-primary' },
  ]

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="grid items-stretch gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="glass-strong relative overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-12">
          <Hanzi
            as="div"
            className="pointer-events-none absolute -bottom-10 -right-4 select-none text-[16rem] leading-none text-foreground/[0.05] sm:text-[22rem]"
          >
            {hz('学')}
          </Hanzi>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-semibold tracking-wide">
            <span className="size-1.5 rounded-full bg-jade" aria-hidden="true" />
            {t.home.badge}
          </p>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {t.home.titleA}
            <br />
            <span className="text-gradient">{t.home.titleB}</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.home.desc}
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link
              href="/stories"
              className="btn-primary inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold"
            >
              {t.home.ctaStories}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/vocabulary"
              className="glass inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold transition-colors hover:bg-accent"
            >
              {t.home.ctaVocab}
            </Link>
          </div>
          <dl className="relative mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { v: `${WORDS.length}+`, l: t.home.stats.words },
              { v: STORIES.length, l: t.home.stats.stories },
              { v: LEVELS.length, l: t.home.stats.levels },
            ].map((s) => (
              <div key={s.l}>
                <dd className="text-2xl font-extrabold tabular-nums sm:text-3xl">{s.v}</dd>
                <dt className="text-xs text-muted-foreground">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>

        <aside
          aria-label={t.home.wotd}
          className="glass relative flex flex-col justify-between gap-8 overflow-hidden rounded-[2rem] p-6 sm:p-8"
        >
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/30 blur-3xl"
          />
          <div className="relative flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{t.home.wotd}</p>
            <LevelBadge level={wotd.lvl} />
          </div>
          <div className="relative">
            {study === 'zh' ? (
              <>
                <Hanzi as="div" className="text-balance text-6xl leading-tight sm:text-7xl">
                  {hz(wotd.zh, true)}
                </Hanzi>
                <p className="mt-3 text-xl font-medium text-gold">{wotd.py}</p>
              </>
            ) : (
              <>
                <p lang="en" className="text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
                  {wotd.en}
                </p>
                <p className="mt-3 flex items-baseline gap-3 text-xl text-gold">
                  <Hanzi className="text-3xl text-foreground">{hz(wotd.zh, true)}</Hanzi>
                  {wotd.py}
                </p>
              </>
            )}
          </div>
          <div className="relative flex items-end justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">{uiLang === 'vi' ? wotd.vi : wotd.en}</p>
              <p className="text-sm text-muted-foreground">{uiLang === 'vi' ? wotd.en : wotd.vi}</p>
            </div>
            <SpeakButton
              className="size-12"
              label={`${t.vocab.listen}: ${speakText}`}
              onClick={() => speakOnce(speakText, langFor(study, script), 0.85)}
            />
          </div>
        </aside>
      </section>

      <section aria-labelledby="features-title">
        <div className="mb-8 max-w-2xl">
          <h2 id="features-title" className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.home.featuresTitle}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">{t.home.featuresDesc}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, desc, tone }) => (
            <div key={title} className="glass glass-lift flex flex-col gap-4 rounded-3xl p-6">
              <span className="grid size-12 place-items-center rounded-2xl border border-border bg-muted shadow-[inset_0_1px_0_var(--glass-shine)]">
                <Icon className={`size-5 ${tone}`} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-bold leading-snug">{title}</h3>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="featured-title">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="featured-title" className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.home.featuredStories}
          </h2>
          <Link href="/stories" className="flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline">
            {t.home.viewAll}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[STORIES[0], STORIES[3], STORIES[5]].map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      </section>

      <section aria-labelledby="roadmap-title" className="glass rounded-[2rem] p-6 sm:p-10">
        <div className="mb-8 max-w-2xl">
          <h2 id="roadmap-title" className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.home.roadmapTitle}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">{t.home.roadmapDesc}</p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {LEVELS.map((l, i) => {
            const count = WORDS.filter((w) => w.lvl === l).length
            return (
              <li key={l}>
                <Link
                  href="/vocabulary"
                  className="glass-lift flex h-full flex-col gap-3 rounded-2xl border border-border bg-muted/60 p-4 hover:bg-accent"
                >
                  <span className="text-xs font-semibold text-muted-foreground tabular-nums">0{i + 1}</span>
                  <LevelBadge level={l} className="w-fit" />
                  <span className="text-sm font-semibold leading-snug">{t.levels[l]}</span>
                  <span className="mt-auto text-xs text-muted-foreground">
                    {count} {t.home.words}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
