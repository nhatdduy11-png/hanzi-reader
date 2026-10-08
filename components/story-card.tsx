'use client'

import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { Story } from '@/lib/stories'
import { useSettings } from './settings-provider'
import { Hanzi, LevelBadge } from './ui-bits'

export function StoryCard({ story }: { story: Story }) {
  const { t, uiLang, study, hz } = useSettings()
  const title = study === 'zh' ? hz(story.title.zh) : story.title.en
  const sub = study === 'zh' ? (uiLang === 'vi' ? story.title.vi : story.title.en) : uiLang === 'vi' ? story.title.vi : hz(story.title.zh)
  const preview = uiLang === 'vi' ? story.lines[1].vi : story.lines[1].en

  return (
    <Link
      href={`/stories/${story.id}`}
      className="glass glass-lift card-cv group relative flex min-h-[18rem] flex-col overflow-hidden rounded-3xl p-6"
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 size-52 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `oklch(0.7 0.16 ${story.hue} / 45%)` }}
      />
      <Hanzi
        as="div"
        className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[9rem] leading-none text-foreground/[0.07] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
      >
        {hz(story.glyph)}
      </Hanzi>
      <div className="relative flex items-center justify-between">
        <LevelBadge level={story.level} />
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden="true" />
          {story.minutes} {t.stories.minutes}
        </span>
      </div>
      <div className="relative mt-6">
        {study === 'zh' ? (
          <Hanzi as="h3" className="text-balance text-3xl leading-tight">
            {title}
          </Hanzi>
        ) : (
          <h3 lang="en" className="text-balance text-2xl font-bold leading-tight">
            {title}
          </h3>
        )}
        <p className="mt-1.5 text-sm font-medium text-gold">{sub}</p>
        <p className="mt-3 line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">{preview}</p>
      </div>
      <div className="relative mt-auto flex items-center justify-between pt-6">
        <span className="text-xs text-muted-foreground">{uiLang === 'vi' ? story.topic.vi : story.topic.en}</span>
        <span className="flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-1">
          {t.stories.read}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
