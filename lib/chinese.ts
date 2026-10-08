import * as OpenCC from 'opencc-js'
import { pinyin } from 'pinyin-pro'

export type Script = 'simp' | 'trad'

// "tw" keeps a 1:1 character mapping (needed for aligned pinyin); "twp" uses Taiwan phrasing for vocabulary.
const toTradChars = OpenCC.Converter({ from: 'cn', to: 'tw' })
const toTradPhrases = OpenCC.Converter({ from: 'cn', to: 'twp' })
const toSimpChars = OpenCC.Converter({ from: 'tw', to: 'cn' })

export function toScript(text: string, script: Script, phrases = false) {
  if (script === 'simp') return text
  return phrases ? toTradPhrases(text) : toTradChars(text)
}

export function toSimplified(text: string) {
  return toSimpChars(text)
}

export interface RubyChar {
  char: string
  py: string
}

// Pinyin is always derived from the simplified source and mapped onto the displayed text.
export function rubyFor(simplified: string, displayed: string): RubyChar[] | null {
  const all = pinyin(simplified, { type: 'all', toneType: 'symbol' }) as {
    origin: string
    pinyin: string
    isZh: boolean
  }[]
  const display = Array.from(displayed)
  if (all.length !== display.length) return null
  return all.map((item, i) => ({
    char: display[i],
    py: item.isZh ? item.pinyin : '',
  }))
}

export function normalizeForCompare(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '')
}

export function similarity(a: string, b: string) {
  const x = Array.from(a)
  const y = Array.from(b)
  if (!x.length && !y.length) return 1
  if (!x.length || !y.length) return 0
  const dp: number[][] = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0))
  for (let i = 0; i <= x.length; i++) dp[i][0] = i
  for (let j = 0; j <= y.length; j++) dp[0][j] = j
  for (let i = 1; i <= x.length; i++) {
    for (let j = 1; j <= y.length; j++) {
      const cost = x[i - 1] === y[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return 1 - dp[x.length][y.length] / Math.max(x.length, y.length)
}
