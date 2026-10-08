import { BookOpen, GraduationCap, Home, Languages, SpellCheck, type LucideIcon } from 'lucide-react'

export const NAV_ITEMS: {
  href: string
  key: 'home' | 'stories' | 'vocab' | 'practice' | 'spell'
  Icon: LucideIcon
}[] = [
  { href: '/', key: 'home', Icon: Home },
  { href: '/stories', key: 'stories', Icon: BookOpen },
  { href: '/vocabulary', key: 'vocab', Icon: Languages },
  { href: '/practice', key: 'practice', Icon: GraduationCap },
  { href: '/spellcheck', key: 'spell', Icon: SpellCheck },
]
