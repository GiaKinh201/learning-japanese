'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewCollectionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('collections').insert({
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
      })

      if (error) {
        setError('Có lỗi xảy ra. Vui lòng thử lại.')
        return
      }

      router.push('/vocabulary')
      router.refresh()
    })
  }

  const suggestions = ['N5', 'N4', 'N3', 'Du lịch', 'Công việc', 'Ẩm thực', 'Gia đình', 'Màu sắc']

  return (
    <div className="max-w-lg mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Tạo bộ từ vựng mới</h1>
        <p className="text-sm mt-1" style={{ color: '#6B6B7E' }}>Đặt tên theo chủ đề hoặc cấp độ JLPT</p>
      </div>

      <div
        className="rounded-2xl p-6 border"
        style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
              Tên bộ từ vựng <span style={{ color: '#C8102E' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: N5, Du lịch, Công việc..."
              maxLength={50}
              required
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
              style={{
                borderColor: '#E8D5D8',
                background: '#FFFAF9',
                color: '#1A1A2E',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#C8102E')}
              onBlur={(e) => (e.target.style.borderColor = '#E8D5D8')}
            />
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setName(s)}
                  className="px-2.5 py-1 rounded-full text-xs border transition-colors hover:bg-[#FFE4E8]"
                  style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
              Mô tả <span style={{ color: '#6B6B7E' }}>(tùy chọn)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về bộ từ này..."
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none transition-colors"
              style={{
                borderColor: '#E8D5D8',
                background: '#FFFAF9',
                color: '#1A1A2E',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#C8102E')}
              onBlur={(e) => (e.target.style.borderColor = '#E8D5D8')}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: '#C8102E' }}>{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-[#FFF5F6]"
              style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
              style={{ background: '#C8102E' }}
            >
              {isPending ? 'Đang tạo...' : 'Tạo bộ từ vựng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
