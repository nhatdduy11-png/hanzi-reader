'use client'

import { memo } from 'react'
import type { Word } from '@/lib/vocab'
import { langFor, speakOnce } from '@/lib/speak'
import { useSettings } from './settings-provider'
import { Hanzi, LevelBadge, SpeakButton } from './ui-bits'

function WordCardBase({ word }: { word: Word }) {
  const { t, uiLang, study, script, hz } = useSettings()
  const speakText = study === 'zh' ? hz(word.zh, true) : word.en
  const meaning = uiLang === 'vi' ? word.vi : word.en

  return (
    <article className="glass glass-lift card-cv relative flex flex-col gap-3 overflow-hidden rounded-3xl p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LevelBadge level={word.lvl} />
          <span className="text-xs text-muted-foreground">{t.categories[word.cat]}</span>
        </div>
        <SpeakButton
          label={`${t.vocab.listen}: ${speakText}`}
          onClick={() => speakOnce(speakText, langFor(study, script), 0.85)}
        />
      </div>

      {study === 'zh' ? (
        <div>
          <Hanzi as="div" className="text-balance text-4xl leading-tight">
            {hz(word.zh, true)}
          </Hanzi>
          <p className="mt-1 text-sm font-medium text-gold">{word.py}</p>
        </div>
      ) : (
        <div>
          <p lang="en" className="text-balance text-2xl font-bold leading-tight">
            {word.en}
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-gold">
            <Hanzi className="text-lg text-foreground">{hz(word.zh, true)}</Hanzi>
            {word.py}
          </p>
        </div>
      )}

      <div className="mt-auto border-t border-border pt-3">
        <p className="text-pretty font-medium leading-snug">{study === 'zh' ? meaning : word.vi}</p>
        {study === 'zh' && (
          <p className="mt-0.5 text-pretty text-sm text-muted-foreground">
            {uiLang === 'vi' ? word.en : word.vi}
          </p>
        )}
        {study === 'en' && uiLang === 'en' && (
          <p className="mt-0.5 text-sm text-muted-foreground">{word.en}</p>
        )}
      </div>
    </article>
  )
}

export const WordCard = memo(WordCardBase)
