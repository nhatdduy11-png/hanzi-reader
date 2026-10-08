import type { Metadata } from 'next'
import { SpellChecker } from '@/components/spell-checker'

export const metadata: Metadata = { title: 'Kiểm tra lỗi · Spell check' }

export default function SpellcheckPage() {
  return <SpellChecker />
}
