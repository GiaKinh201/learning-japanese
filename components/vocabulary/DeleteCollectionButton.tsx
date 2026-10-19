'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export default function DeleteCollectionButton({ collectionId }: { collectionId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  function handleDelete() {
    startTransition(async () => {
      // Delete all vocabulary first (cascade), then collection
      await supabase.from('vocabulary').delete().eq('collection_id', collectionId)
      await supabase.from('collections').delete().eq('id', collectionId)
      router.refresh()
    })
  }

  if (confirming) {
    return (
      <div className="flex gap-1">
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
      className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
      title="Xoá bộ này"
      style={{ color: '#6B6B7E' }}
    >
      <Trash2 size={14} />
    </button>
  )
}
