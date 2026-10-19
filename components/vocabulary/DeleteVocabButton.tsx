'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteVocabButton({ vocabId }: { vocabId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  function handleDelete() {
    startTransition(async () => {
      await supabase.from('study_logs').delete().eq('vocabulary_id', vocabId)
      await supabase.from('vocabulary').delete().eq('id', vocabId)
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
            'Xóa'
          )}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="min-w-[36px] min-h-[36px] p-2 rounded-xl text-[#6B6B7E] hover:text-[#C8102E] hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer shrink-0"
      title="Xoá từ này"
      aria-label="Xoá từ này"
    >
      <Trash2 size={15} />
    </button>
  )
}
