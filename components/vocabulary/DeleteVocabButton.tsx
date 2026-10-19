'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

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
      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded-lg text-xs border"
          style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
        >
          Huỷ
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-2 py-1 rounded-lg text-xs text-white"
          style={{ background: '#C8102E' }}
        >
          {isPending ? '...' : 'Xoá'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-lg transition-colors hover:bg-red-50 shrink-0"
      title="Xoá từ này"
      style={{ color: '#6B6B7E' }}
    >
      <Trash2 size={15} />
    </button>
  )
}
