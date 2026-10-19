import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Flame, GraduationCap, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch data in parallel
  const [profileRes, collectionsRes, todayLogsRes, totalVocabRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('collections').select('*, vocabulary(count)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(4),
    supabase.from('study_logs').select('id', { count: 'exact' }).eq('user_id', user.id).gte('studied_at', new Date().toISOString().split('T')[0]),
    supabase.from('vocabulary').select('id', { count: 'exact' }).eq('user_id', user.id),
  ])

  const profile = profileRes.data
  const collections = collectionsRes.data ?? []
  const todayCount = todayLogsRes.count ?? 0
  const totalVocab = totalVocabRes.count ?? 0
  const firstName = profile?.full_name?.split(' ').pop() ?? 'bạn'

  return (
    <div className="space-y-6 fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
            こんにちは、{firstName}さん！👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B6B7E' }}>
            {todayCount > 0
              ? `Hôm nay bạn đã học ${todayCount} từ. Tiếp tục phát huy!`
              : 'Hôm nay bạn chưa học từ nào. Bắt đầu ngay nhé!'}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<Flame size={22} style={{ color: '#C8102E' }} />}
          label="Streak"
          value={`${profile?.streak ?? 0} ngày`}
          bg="#FFF0F3"
        />
        <StatCard
          icon={<BookOpen size={22} style={{ color: '#C8102E' }} />}
          label="Tổng từ vựng"
          value={`${totalVocab} từ`}
          bg="#FFF0F3"
        />
        <StatCard
          icon={<GraduationCap size={22} style={{ color: '#C8102E' }} />}
          label="Học hôm nay"
          value={`${todayCount} từ`}
          bg="#FFF0F3"
        />
      </div>

      {/* Collections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg" style={{ color: '#1A1A2E' }}>
            Bộ từ vựng của bạn
          </h2>
          <Link
            href="/vocabulary"
            className="text-sm font-medium hover:underline"
            style={{ color: '#C8102E' }}
          >
            Xem tất cả →
          </Link>
        </div>

        {collections.length === 0 ? (
          <EmptyCollections />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collections.map((col) => {
              const count = (col.vocabulary as unknown as { count: number }[])?.[0]?.count ?? 0
              return (
                <CollectionCard
                  key={col.id}
                  id={col.id}
                  name={col.name}
                  description={col.description}
                  count={count}
                />
              )
            })}
            <Link
              href="/vocabulary/new"
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-sm font-medium transition-colors hover:bg-[#FFF5F6]"
              style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
            >
              <Plus size={18} />
              Tạo bộ mới
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon, label, value, bg
}: {
  icon: React.ReactNode
  label: string
  value: string
  bg: string
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{ background: bg, border: '1px solid #E8D5D8' }}
    >
      <div className="p-2 rounded-xl w-fit" style={{ background: '#FFE4E8' }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: '#6B6B7E' }}>{label}</p>
        <p className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{value}</p>
      </div>
    </div>
  )
}

function CollectionCard({
  id, name, description, count
}: {
  id: string
  name: string
  description: string | null
  count: number
}) {
  return (
    <div
      className="rounded-2xl p-5 border hover:shadow-md transition-shadow"
      style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold" style={{ color: '#1A1A2E' }}>{name}</h3>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: '#6B6B7E' }}>{description}</p>
          )}
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: '#FFE4E8', color: '#C8102E' }}
        >
          {count} từ
        </span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/vocabulary/${id}`}
          className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[#FFF5F6]"
          style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
        >
          Xem từ
        </Link>
        {count > 0 && (
          <Link
            href={`/study/${id}`}
            className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium text-white transition-colors hover:opacity-90"
            style={{ background: '#C8102E' }}
          >
            Học ngay ▶
          </Link>
        )}
      </div>
    </div>
  )
}

function EmptyCollections() {
  return (
    <div
      className="rounded-2xl p-10 text-center border-2 border-dashed"
      style={{ borderColor: '#E8D5D8' }}
    >
      <div className="text-5xl mb-3">📚</div>
      <p className="font-medium mb-1" style={{ color: '#1A1A2E' }}>Chưa có bộ từ vựng nào</p>
      <p className="text-sm mb-4" style={{ color: '#6B6B7E' }}>
        Tạo bộ đầu tiên để bắt đầu hành trình học tiếng Nhật!
      </p>
      <Link
        href="/vocabulary/new"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-medium"
        style={{ background: '#C8102E' }}
      >
        <Plus size={16} />
        Tạo bộ từ vựng
      </Link>
    </div>
  )
}
