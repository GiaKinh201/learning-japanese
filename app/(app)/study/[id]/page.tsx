import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import StudySession from '@/components/flashcard/StudySession'
import { shuffleArray } from '@/lib/shuffle'

export default async function StudyPage({ params }: PageProps<'/study/[id]'>) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [collectionRes, vocabRes] = await Promise.all([
    supabase.from('collections').select('id, name').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('vocabulary').select('*').eq('collection_id', id).eq('user_id', user.id),
  ])

  if (!collectionRes.data) notFound()
  if (!vocabRes.data || vocabRes.data.length === 0) redirect(`/vocabulary/${id}`)

  return (
    <StudySession
      initialCards={shuffleArray(vocabRes.data)}
      collectionId={id}
      collectionName={collectionRes.data.name}
    />
  )
}
