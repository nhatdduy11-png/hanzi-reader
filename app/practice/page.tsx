import type { Metadata } from 'next'
import { PracticeView } from '@/components/practice-view'

export const metadata: Metadata = { title: 'Luyện tập · Practice' }

export default function PracticePage() {
  return <PracticeView />
}
