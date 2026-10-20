import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Flame, BookOpen, GraduationCap, Calendar } from 'lucide-react'
import StatCard from '@/components/common/StatCard'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, totalVocabRes, totalStudiedRes, collectionsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('vocabulary').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('study_logs').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('collections').select('id', { count: 'exact' }).eq('user_id', user.id),
  ])

  const profile = profileRes.data
  const totalVocab = totalVocabRes.count ?? 0
  const totalStudied = totalStudiedRes.count ?? 0
  const totalCollections = collectionsRes.count ?? 0

  return (
    <div className="max-w-lg mx-auto space-y-6 fade-in">
      {/* User info */}
      <div
        className="rounded-2xl p-6 border text-center"
        style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
      >
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.full_name ?? 'Avatar'}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
            style={{ background: '#FFE4E8' }}
          >
            🌸
          </div>
        )}
        <h1 className="text-xl font-bold" style={{ color: '#1A1A2E' }}>
          {profile?.full_name ?? 'Học viên'}
        </h1>
        <p className="text-sm" style={{ color: '#6B6B7E' }}>{profile?.email}</p>
        <p className="text-xs mt-1" style={{ color: '#6B6B7E' }}>
          Tham gia từ {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN') : ''}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard layout="inline" icon={<Flame size={20} style={{ color: '#C8102E' }} />} label="Streak hiện tại" value={`${profile?.streak ?? 0} ngày`} />
        <StatCard layout="inline" icon={<BookOpen size={20} style={{ color: '#C8102E' }} />} label="Tổng từ vựng" value={`${totalVocab} từ`} />
        <StatCard layout="inline" icon={<GraduationCap size={20} style={{ color: '#C8102E' }} />} label="Lượt đã học" value={`${totalStudied} lần`} />
        <StatCard layout="inline" icon={<Calendar size={20} style={{ color: '#C8102E' }} />} label="Bộ sưu tập" value={`${totalCollections} bộ`} />
      </div>

      {/* Encouragement */}
      <div
        className="rounded-2xl p-4 text-center"
        style={{ background: 'linear-gradient(135deg, #FFE4E8, #FFF0F3)' }}
      >
        <p className="text-sm font-medium" style={{ color: '#C8102E' }}>
          {totalVocab === 0
            ? '🌱 Hãy thêm từ vựng đầu tiên để bắt đầu!'
            : totalStudied === 0
            ? '📖 Bạn có từ rồi, hãy bắt đầu học ngay!'
            : `🔥 Tuyệt vời! Bạn đã học ${totalStudied} lần. Tiếp tục nhé!`}
        </p>
      </div>
    </div>
  )
}
