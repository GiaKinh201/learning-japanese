import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VocabularyListClient from '@/components/vocabulary/VocabularyListClient'

export default async function VocabularyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: collections } = await supabase
    .from('collections')
    .select('*, vocabulary(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <VocabularyListClient collections={collections || []} />
}
