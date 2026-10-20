'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import type { Vocabulary } from '@/types/database'
import EditVocabModal from './EditVocabModal'

export default function EditVocabButton({ vocab }: { vocab: Vocabulary }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Chỉnh sửa từ này"
        aria-label="Chỉnh sửa từ này"
        className="min-w-[36px] min-h-[36px] p-2 rounded-xl text-[#6B6B7E] hover:text-[#C8102E] hover:bg-[#FFF5F6] transition-colors flex items-center justify-center cursor-pointer"
      >
        <Pencil size={15} />
      </button>

      {isOpen && (
        <EditVocabModal
          key={vocab.id}
          vocab={vocab}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            router.refresh()
          }}
        />
      )}
    </>
  )
}
