'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DICTS, type Dict, type UiLang } from '@/lib/i18n'
import { toScript, type Script } from '@/lib/chinese'

export type StudyLang = 'zh' | 'en'
export type Theme = 'dark' | 'light'

interface Settings {
  uiLang: UiLang
  script: Script
  study: StudyLang
  theme: Theme
  setUiLang: (v: UiLang) => void
  setScript: (v: Script) => void
  setStudy: (v: StudyLang) => void
  setTheme: (v: Theme) => void
  t: Dict
  hz: (text: string, phrases?: boolean) => string
  hanziLang: 'zh-Hans' | 'zh-Hant'
}

const Ctx = createContext<Settings | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [uiLang, setUiLang] = useState<UiLang>('vi')
  const [script, setScript] = useState<Script>('simp')
  const [study, setStudy] = useState<StudyLang>('zh')
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = uiLang
  }, [uiLang])

  const hz = useCallback((text: string, phrases = false) => toScript(text, script, phrases), [script])

  const value = useMemo<Settings>(
    () => ({
      uiLang,
      script,
      study,
      theme,
      setUiLang,
      setScript,
      setStudy,
      setTheme,
      t: DICTS[uiLang],
      hz,
      hanziLang: script === 'trad' ? 'zh-Hant' : 'zh-Hans',
    }),
    [uiLang, script, study, theme, hz],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSettings() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
