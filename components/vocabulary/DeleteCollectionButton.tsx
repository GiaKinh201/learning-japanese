'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteCollectionButton({ collectionId }: { collectionId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  function handleDelete() {
    startTransition(async () => {
      // 1. Tìm các từ vựng trong bộ này
      const { data: vocabs } = await supabase
        .from('vocabulary')
        .select('id')
        .eq('collection_id', collectionId)

      const vocabIds = vocabs?.map((v) => v.id) || []

      // 2. Xóa các bản ghi lịch sử học liên quan trước (tránh lỗi khóa ngoại)
      if (vocabIds.length > 0) {
        await supabase.from('study_logs').delete().in('vocabulary_id', vocabIds)
      }

      // 3. Xóa các từ vựng trong bộ
      await supabase.from('vocabulary').delete().eq('collection_id', collectionId)

      // 4. Xóa bộ sưu tập
      await supabase.from('collections').delete().eq('id', collectionId)
      router.refresh()
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#E8D5D8] text-[#6B6B7E] hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Huỷ
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#C8102E] hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
        >
          {isPending ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Đang xóa
            </>
          ) : (
            'Xác nhận'
          )}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="min-w-[36px] min-h-[36px] p-2 rounded-xl text-[#6B6B7E] hover:text-[#C8102E] hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer"
      title="Xoá bộ từ vựng này"
      aria-label="Xoá bộ từ vựng này"
    >
      <Trash2 size={15} />
    </button>
  )
}
