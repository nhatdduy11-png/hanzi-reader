import type { Metadata } from 'next'
import { StoryList } from '@/components/story-list'

export const metadata: Metadata = { title: 'Truyện đọc · Stories' }

export default function StoriesPage() {
  return <StoryList />
}
