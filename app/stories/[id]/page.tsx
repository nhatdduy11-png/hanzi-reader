import { notFound } from 'next/navigation'
import { STORIES, getStory } from '@/lib/stories'
import { StoryReader } from '@/components/story-reader'

export function generateStaticParams() {
  return STORIES.map((s) => ({ id: s.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const story = getStory(id)
  return { title: story ? `${story.title.zh} · ${story.title.en}` : 'Story' }
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const story = getStory(id)
  if (!story) notFound()
  return <StoryReader story={story} />
}
