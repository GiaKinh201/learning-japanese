import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StudySession from '@/components/flashcard/StudySession'

interface Props {
  searchParams: Promise<{ ids?: string }>
}

export default async function MultiStudyPage({ searchParams }: Props) {
  const { ids } = await searchParams
  const collectionIds = (ids || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (collectionIds.length === 0) {
    redirect('/vocabulary')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [collectionsRes, vocabRes] = await Promise.all([
    supabase
      .from('collections')
      .select('id, name')
      .in('id', collectionIds)
      .eq('user_id', user.id),
    supabase
      .from('vocabulary')
      .select('*')
      .in('collection_id', collectionIds)
      .eq('user_id', user.id),
  ])

  if (!collectionsRes.data || collectionsRes.data.length === 0) {
    redirect('/vocabulary')
  }

  const cards = vocabRes.data || []
  if (cards.length === 0) {
    redirect('/vocabulary')
  }

  const collections = collectionsRes.data
  const collectionName =
    collections.length === 1
      ? collections[0].name
      : collections.length === 2
      ? `${collections[0].name} & ${collections[1].name}`
      : `${collections.length} bộ từ (${collections.map((c) => c.name).slice(0, 2).join(', ')}...)`

  return (
    <StudySession
      initialCards={cards}
      collectionId="multi"
      collectionName={collectionName}
    />
  )
}
