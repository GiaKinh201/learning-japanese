import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DeleteCollectionButton from '@/components/vocabulary/DeleteCollectionButton'

export default async function VocabularyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: collections } = await supabase
    .from('collections')
    .select('*, vocabulary(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Từ vựng của tôi</h1>
          <p className="text-sm mt-1" style={{ color: '#6B6B7E' }}>Quản lý các bộ sưu tập từ vựng</p>
        </div>
        <Link
          href="/vocabulary/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: '#C8102E' }}
        >
          <Plus size={16} />
          Bộ mới
        </Link>
      </div>

      {!collections || collections.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center border-2 border-dashed"
          style={{ borderColor: '#E8D5D8' }}
        >
          <div className="text-5xl mb-3">📚</div>
          <p className="font-medium mb-1" style={{ color: '#1A1A2E' }}>Chưa có bộ từ vựng nào</p>
          <p className="text-sm mb-5" style={{ color: '#6B6B7E' }}>
            Tạo bộ đầu tiên (ví dụ: N5, Du lịch, Công việc...)
          </p>
          <Link
            href="/vocabulary/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium"
            style={{ background: '#C8102E' }}
          >
            <Plus size={16} /> Tạo bộ từ vựng
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => {
            const count = (col.vocabulary as unknown as { count: number }[])?.[0]?.count ?? 0
            return (
              <div
                key={col.id}
                className="rounded-2xl p-5 border hover:shadow-md transition-all"
                style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate" style={{ color: '#1A1A2E' }}>{col.name}</h3>
                    {col.description && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: '#6B6B7E' }}>{col.description}</p>
                    )}
                  </div>
                  <span
                    className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                    style={{ background: '#FFE4E8', color: '#C8102E' }}
                  >
                    {count} từ
                  </span>
                </div>

                <p className="text-xs mb-4" style={{ color: '#6B6B7E' }}>
                  Tạo {new Date(col.created_at).toLocaleDateString('vi-VN')}
                </p>

                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={`/vocabulary/${col.id}`}
                    className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[#FFF5F6]"
                    style={{ borderColor: '#E8D5D8', color: '#6B6B7E', minWidth: '60px' }}
                  >
                    Xem từ
                  </Link>
                  <Link
                    href={`/vocabulary/${col.id}/add`}
                    className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[#FFF5F6]"
                    style={{ borderColor: '#C8102E', color: '#C8102E', minWidth: '60px' }}
                  >
                    + Thêm từ
                  </Link>
                  {count > 0 && (
                    <Link
                      href={`/study/${col.id}`}
                      className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90"
                      style={{ background: '#C8102E', minWidth: '60px' }}
                    >
                      Học ▶
                    </Link>
                  )}
                  <DeleteCollectionButton collectionId={col.id} />
                </div>
              </div>
            )
          })}

          {/* Add new card */}
          <Link
            href="/vocabulary/new"
            className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 p-8 text-sm font-medium transition-colors hover:bg-[#FFF5F6] min-h-[160px]"
            style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
          >
            <Plus size={24} />
            Tạo bộ mới
          </Link>
        </div>
      )}
    </div>
  )
}
