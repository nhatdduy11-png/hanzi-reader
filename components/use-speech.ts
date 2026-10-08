'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type SpeechLang = 'zh-CN' | 'zh-TW' | 'en-US'

function voiceScore(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase()
  let s = 0
  if (/natural|neural|premium|enhanced|online/.test(n)) s += 4
  if (/google|microsoft|apple|siri/.test(n)) s += 2
  if (v.localService) s += 1
  return s
}

function matchesLang(v: SpeechSynthesisVoice, lang: SpeechLang) {
  const l = v.lang.replace('_', '-').toLowerCase()
  if (lang === 'en-US') return l.startsWith('en')
  if (lang === 'zh-TW') return l === 'zh-tw' || l === 'zh-hk' || l.includes('hant')
  return l === 'zh-cn' || l.includes('hans') || l === 'zh'
}

export function useSpeech(lang: SpeechLang) {
  const [supported, setSupported] = useState(true)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURI] = useState('')
  const [rate, setRate] = useState(0.9)
  const [speaking, setSpeaking] = useState(false)
  const token = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false)
      return
    }
    const load = () => {
      const all = window.speechSynthesis.getVoices()
      const filtered = all.filter((v) => matchesLang(v, lang)).sort((a, b) => voiceScore(b) - voiceScore(a))
      setVoices(filtered)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [lang])

  useEffect(() => {
    setVoiceURI('')
  }, [lang])

  const cancel = useCallback(() => {
    token.current += 1
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()
      const mine = ++token.current
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      u.rate = rate
      const chosen = voices.find((v) => v.voiceURI === voiceURI) ?? voices[0]
      if (chosen) u.voice = chosen
      u.onstart = () => {
        if (token.current === mine) setSpeaking(true)
      }
      u.onend = () => {
        if (token.current !== mine) return
        setSpeaking(false)
        onEnd?.()
      }
      u.onerror = () => {
        if (token.current !== mine) return
        setSpeaking(false)
      }
      window.speechSynthesis.speak(u)
    },
    [lang, rate, voices, voiceURI],
  )

  useEffect(() => cancel, [cancel])

  return { supported, voices, voiceURI, setVoiceURI, rate, setRate, speaking, speak, cancel }
}

interface RecognitionResultLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}
interface RecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: RecognitionResultLike) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

export function useRecognizer(lang: SpeechLang) {
  const [supported, setSupported] = useState(true)
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<RecognitionLike | null>(null)

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    if (!w.SpeechRecognition && !w.webkitSpeechRecognition) setSupported(false)
  }, [])

  const stop = useCallback(() => {
    ref.current?.abort()
    setListening(false)
  }, [])

  const start = useCallback(
    (onResult: (transcript: string) => void) => {
      const w = window as unknown as Record<string, new () => RecognitionLike>
      const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition
      if (!Ctor) {
        setSupported(false)
        return
      }
      ref.current?.abort()
      const rec = new Ctor()
      rec.lang = lang
      rec.interimResults = false
      rec.maxAlternatives = 1
      setError(null)
      rec.onresult = (e) => {
        const transcript = e.results[0]?.[0]?.transcript ?? ''
        onResult(transcript)
      }
      rec.onerror = (e) => {
        setError(e.error)
        setListening(false)
      }
      rec.onend = () => setListening(false)
      ref.current = rec
      setListening(true)
      try {
        rec.start()
      } catch {
        setListening(false)
      }
    },
    [lang],
  )

  useEffect(() => () => ref.current?.abort(), [])

  return { supported, listening, error, start, stop }
}
