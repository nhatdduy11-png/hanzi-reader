import type { Script } from './chinese'
import type { SpeechLang } from '@/components/use-speech'

export function langFor(study: 'zh' | 'en', script: Script): SpeechLang {
  if (study === 'en') return 'en-US'
  return script === 'trad' ? 'zh-TW' : 'zh-CN'
}

function matches(v: SpeechSynthesisVoice, lang: SpeechLang) {
  const l = v.lang.replace('_', '-').toLowerCase()
  if (lang === 'en-US') return l.startsWith('en')
  if (lang === 'zh-TW') return l === 'zh-tw' || l === 'zh-hk' || l.includes('hant')
  return l === 'zh-cn' || l.includes('hans') || l === 'zh'
}

function score(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase()
  return (/natural|neural|premium|enhanced|online/.test(n) ? 4 : 0) + (/google|microsoft|apple|siri/.test(n) ? 2 : 0) + (v.localService ? 1 : 0)
}

export function speakOnce(text: string, lang: SpeechLang, rate = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  const voice = window.speechSynthesis
    .getVoices()
    .filter((v) => matches(v, lang))
    .sort((a, b) => score(b) - score(a))[0]
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
}
