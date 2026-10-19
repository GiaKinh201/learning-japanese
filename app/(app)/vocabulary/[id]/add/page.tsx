import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AddVocabClient from '@/components/vocabulary/AddVocabClient'

export default async function AddVocabPage({ params }: PageProps<'/vocabulary/[id]/add'>) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: collection } = await supabase
    .from('collections')
    .select('id, name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!collection) notFound()

  return <AddVocabClient collectionId={collection.id} collectionName={collection.name} />
}
