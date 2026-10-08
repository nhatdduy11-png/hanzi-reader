'use client'

import { useState } from 'react'
import { LEVELS, type Level } from '@/lib/vocab'
import { STORIES } from '@/lib/stories'
import { useSettings } from './settings-provider'
import { StoryCard } from './story-card'
import { Chip, PageHeader } from './ui-bits'

export function StoryList() {
  const { t } = useSettings()
  const [level, setLevel] = useState<Level | 'all'>('all')
  const list = STORIES.filter((s) => level === 'all' || s.level === level)
  const available = LEVELS.filter((l) => STORIES.some((s) => s.level === l))

  return (
    <>
      <PageHeader eyebrow={t.stories.voiceAi} title={t.stories.title} desc={t.stories.desc} />
      <div className="scroll-hide -mx-1 mb-6 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t.vocab.level}>
        <Chip active={level === 'all'} onClick={() => setLevel('all')}>
          {t.stories.all}
        </Chip>
        {available.map((l) => (
          <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
            {l === 'Native' ? t.levels.Native : `${l} · ${t.levels[l]}`}
          </Chip>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </>
  )
}
