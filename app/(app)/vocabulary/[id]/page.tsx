import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, BookOpen } from 'lucide-react'
import DeleteVocabButton from '@/components/vocabulary/DeleteVocabButton'

export default async function CollectionDetailPage({ params }: PageProps<'/vocabulary/[id]'>) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [collectionRes, vocabRes] = await Promise.all([
    supabase.from('collections').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('vocabulary').select('*').eq('collection_id', id).eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  if (!collectionRes.data) notFound()

  const collection = collectionRes.data
  const vocabulary = vocabRes.data ?? []

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/vocabulary" className="p-2 rounded-xl hover:bg-[#FFF5F6] transition-colors" style={{ color: '#6B6B7E' }}>
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>{collection.name}</h1>
          {collection.description && (
            <p className="text-sm" style={{ color: '#6B6B7E' }}>{collection.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {vocabulary.length > 0 && (
            <Link
              href={`/study/${id}`}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90"
              style={{ background: '#C8102E' }}
            >
              Học ngay ▶
            </Link>
          )}
          <Link
            href={`/vocabulary/${id}/add`}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border hover:bg-[#FFF5F6]"
            style={{ borderColor: '#E8D5D8', color: '#C8102E' }}
          >
            <Plus size={15} /> Thêm từ
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: '#FFE4E8' }}
      >
        <BookOpen size={18} style={{ color: '#C8102E' }} />
        <span className="text-sm font-medium" style={{ color: '#C8102E' }}>
          {vocabulary.length} từ vựng
        </span>
      </div>

      {/* Vocab list */}
      {vocabulary.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border-2 border-dashed"
          style={{ borderColor: '#E8D5D8' }}
        >
          <div className="text-4xl mb-3">✨</div>
          <p className="font-medium mb-1" style={{ color: '#1A1A2E' }}>Bộ này chưa có từ nào</p>
          <p className="text-sm mb-4" style={{ color: '#6B6B7E' }}>Thêm từ đầu tiên qua tìm kiếm Jisho</p>
          <Link
            href={`/vocabulary/${id}/add`}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-medium"
            style={{ background: '#C8102E' }}
          >
            <Plus size={15} /> Thêm từ vựng
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {vocabulary.map((vocab) => (
            <div
              key={vocab.id}
              className="rounded-2xl p-5 border"
              style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
                      {vocab.word}
                    </span>
                    <span className="text-sm" style={{ color: '#6B6B7E' }}>
                      {vocab.reading}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1" style={{ color: '#C8102E' }}>
                    {vocab.meaning_vi}
                  </p>
                  {vocab.meaning_en && (
                    <p className="text-xs mt-0.5" style={{ color: '#6B6B7E' }}>{vocab.meaning_en}</p>
                  )}
                  {vocab.example_jp && (
                    <div
                      className="mt-3 p-3 rounded-xl"
                      style={{ background: '#FFF5F6', borderLeft: '3px solid #FFB7C5' }}
                    >
                      <p className="text-sm" style={{ color: '#1A1A2E' }}>{vocab.example_jp}</p>
                      {vocab.example_vi && (
                        <p className="text-xs mt-1" style={{ color: '#6B6B7E' }}>{vocab.example_vi}</p>
                      )}
                    </div>
                  )}
                </div>
                <DeleteVocabButton vocabId={vocab.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
