'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, CheckSquare, Check, X, BookOpen, Sparkles } from 'lucide-react'
import DeleteCollectionButton from './DeleteCollectionButton'

export interface CollectionItem {
  id: string
  name: string
  description: string | null
  created_at: string
  vocabulary?: unknown
}

interface Props {
  collections: CollectionItem[]
}

export default function VocabularyListClient({ collections }: Props) {
  const router = useRouter()
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Helper to extract word count for each collection
  const getCount = (col: CollectionItem): number => {
    return (col.vocabulary as unknown as { count: number }[])?.[0]?.count ?? 0
  }

  // Eligible collections (only collections with at least 1 word can be studied)
  const eligibleCollections = collections.filter((c) => getCount(c) > 0)

  // Calculate total words selected
  const totalSelectedWords = collections
    .filter((c) => selectedIds.has(c.id))
    .reduce((sum, c) => sum + getCount(c), 0)

  const toggleSelect = (id: string, count: number) => {
    if (count === 0) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === eligibleCollections.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(eligibleCollections.map((c) => c.id)))
    }
  }

  const handleStartMultiStudy = () => {
    if (selectedIds.size === 0 || totalSelectedWords === 0) return
    const idsParam = Array.from(selectedIds).join(',')
    router.push(`/study/multi?ids=${encodeURIComponent(idsParam)}`)
  }

  const exitSelectMode = () => {
    setIsSelectMode(false)
    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-6 fade-in pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Từ vựng của tôi</h1>
          <p className="text-sm mt-1 text-[#6B6B7E]">
            {isSelectMode
              ? 'Chọn các bộ từ vựng bạn muốn học gộp chung'
              : 'Quản lý các bộ sưu tập từ vựng'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {collections.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (isSelectMode) {
                  exitSelectMode()
                } else {
                  setIsSelectMode(true)
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isSelectMode
                  ? 'bg-[#FFE4E8] text-[#C8102E] border border-[#F5D0D5]'
                  : 'bg-white border border-[#E8D5D8] text-[#1A1A2E] hover:border-[#C8102E] hover:text-[#C8102E] hover:bg-[#FFF5F6]'
              }`}
            >
              <CheckSquare size={16} />
              {isSelectMode ? 'Hủy chọn' : 'Chọn nhiều bộ'}
            </button>
          )}

          <Link
            href="/vocabulary/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: '#C8102E' }}
          >
            <Plus size={16} />
            Bộ mới
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {collections.length === 0 ? (
        <div className="rounded-2xl p-16 text-center border-2 border-dashed border-[#E8D5D8] bg-[#FFFBFB]">
          <div className="text-5xl mb-3">📚</div>
          <p className="font-medium mb-1 text-[#1A1A2E]">Chưa có bộ từ vựng nào</p>
          <p className="text-sm mb-5 text-[#6B6B7E]">
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
        /* Collections Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => {
            const count = getCount(col)
            const isSelected = selectedIds.has(col.id)
            const isDisabled = isSelectMode && count === 0

            return (
              <div
                key={col.id}
                onClick={() => {
                  if (isSelectMode && count > 0) {
                    toggleSelect(col.id, count)
                  }
                }}
                className={`rounded-2xl p-5 border transition-all duration-200 relative ${
                  isSelectMode ? 'cursor-pointer select-none' : ''
                } ${
                  isSelected
                    ? 'border-[#C8102E] ring-2 ring-[#FFE4E8] bg-[#FFFBFB] shadow-sm'
                    : isDisabled
                    ? 'bg-gray-50/70 border-gray-200 opacity-60'
                    : 'bg-white border-[#E8D5D8] hover:shadow-md'
                }`}
              >
                {/* Header row of card */}
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1A1A2E] truncate">{col.name}</h3>
                    {col.description && (
                      <p className="text-xs mt-0.5 text-[#6B6B7E] truncate">{col.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{ background: '#FFE4E8', color: '#C8102E' }}
                    >
                      {count} từ
                    </span>

                    {/* Selection Checkbox */}
                    {isSelectMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSelect(col.id, count)
                        }}
                        disabled={count === 0}
                        aria-label={isSelected ? 'Bỏ chọn' : 'Chọn bộ này'}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#C8102E] text-white shadow-xs'
                            : count === 0
                            ? 'border border-gray-200 bg-gray-100 cursor-not-allowed'
                            : 'border-2 border-[#E8D5D8] hover:border-[#C8102E] bg-white'
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs mb-4 text-[#6B6B7E]">
                  Tạo {new Date(col.created_at).toLocaleDateString('vi-VN')}
                </p>

                {/* Normal Mode Action Buttons */}
                {!isSelectMode ? (
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/vocabulary/${col.id}`}
                      className="flex-1 text-center py-2 rounded-xl text-xs font-medium border border-[#E8D5D8] text-[#6B6B7E] transition-colors hover:bg-[#FFF5F6] hover:text-[#1A1A2E]"
                      style={{ minWidth: '60px' }}
                    >
                      Xem từ
                    </Link>
                    <Link
                      href={`/vocabulary/${col.id}/add`}
                      className="flex-1 text-center py-2 rounded-xl text-xs font-medium border border-[#C8102E] text-[#C8102E] transition-colors hover:bg-[#FFF5F6]"
                      style={{ minWidth: '60px' }}
                    >
                      + Thêm từ
                    </Link>
                    {count > 0 && (
                      <Link
                        href={`/study/${col.id}`}
                        className="flex-1 text-center py-2 rounded-xl text-xs font-medium text-white hover:opacity-90 transition-opacity"
                        style={{ background: '#C8102E', minWidth: '60px' }}
                      >
                        Học ▶
                      </Link>
                    )}
                    <DeleteCollectionButton collectionId={col.id} />
                  </div>
                ) : (
                  /* Select Mode Help Hint */
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    {count === 0 ? (
                      <span className="text-gray-400 italic">Bộ này chưa có từ vựng</span>
                    ) : (
                      <span className={`font-medium ${isSelected ? 'text-[#C8102E]' : 'text-[#6B6B7E]'}`}>
                        {isSelected ? '✓ Đã chọn để học' : 'Bấm để chọn bộ này'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Add new collection card */}
          {!isSelectMode && (
            <Link
              href="/vocabulary/new"
              className="rounded-2xl border-2 border-dashed border-[#E8D5D8] text-[#6B6B7E] flex flex-col items-center justify-center gap-2 p-8 text-sm font-medium transition-colors hover:bg-[#FFF5F6] hover:border-[#C8102E] hover:text-[#C8102E] min-h-[160px]"
            >
              <Plus size={24} />
              Tạo bộ mới
            </Link>
          )}
        </div>
      )}

      {/* Floating Action Bar in Select Mode */}
      {isSelectMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl bg-white/95 backdrop-blur-md border border-[#E8D5D8] shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFE4E8] text-[#C8102E] flex items-center justify-center shrink-0">
              <BookOpen size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1A1A2E]">
                Đã chọn <span className="text-[#C8102E]">{selectedIds.size}</span> bộ từ
              </p>
              <p className="text-xs text-[#6B6B7E]">
                Tổng cộng <span className="font-semibold text-[#1A1A2E]">{totalSelectedWords}</span> từ vựng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {eligibleCollections.length > 1 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-2 rounded-xl text-xs font-medium text-[#6B6B7E] hover:text-[#1A1A2E] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {selectedIds.size === eligibleCollections.length ? 'Bỏ chọn hết' : 'Chọn tất cả'}
              </button>
            )}

            <button
              type="button"
              onClick={handleStartMultiStudy}
              disabled={selectedIds.size === 0 || totalSelectedWords === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C8102E] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
            >
              <Sparkles size={15} />
              Bắt đầu học ngay ▶
            </button>

            <button
              type="button"
              onClick={exitSelectMode}
              title="Đóng chế độ chọn"
              aria-label="Đóng chế độ chọn"
              className="p-2 rounded-xl text-[#6B6B7E] hover:text-[#1A1A2E] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
