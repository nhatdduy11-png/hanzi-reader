import type { Metadata } from 'next'
import { VocabBrowser } from '@/components/vocab-browser'

export const metadata: Metadata = { title: 'Từ vựng · Vocabulary' }

export default function VocabularyPage() {
  return <VocabBrowser />
}
