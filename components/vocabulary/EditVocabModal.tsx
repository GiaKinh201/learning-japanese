'use client'

import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import type { Vocabulary } from '@/types/database'
import { X, Sparkles, RefreshCw, Loader2, Check } from 'lucide-react'
import AudioButton from '@/components/common/AudioButton'

interface EditVocabModalProps {
  vocab: Vocabulary
  isOpen: boolean
  onClose: () => void
  onSuccess?: (updated: Vocabulary) => void
}

interface ExampleSuggestion {
  sentence_jp: string
  reading: string
  meaning_vi: string
}

export default function EditVocabModal({
  vocab,
  isOpen,
  onClose,
  onSuccess,
}: EditVocabModalProps) {
  const supabase = createClient()
  const [mounted, setMounted] = useState(false)

  const [meaningVi, setMeaningVi] = useState(vocab.meaning_vi || '')
  const [reading, setReading] = useState(vocab.reading || '')
  const [exampleJp, setExampleJp] = useState(vocab.example_jp || '')
  const [exampleVi, setExampleVi] = useState(vocab.example_vi || '')

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AI suggestion states
  const [aiLoading, setAiLoading] = useState(false)
  const [aiExamples, setAiExamples] = useState<ExampleSuggestion[]>([])
  const [aiError, setAiError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Sync state whenever modal opens or vocab prop changes
  useEffect(() => {
    if (isOpen) {
      setMeaningVi(vocab.meaning_vi || '')
      setReading(vocab.reading || '')
      setExampleJp(vocab.example_jp || '')
      setExampleVi(vocab.example_vi || '')
      setError(null)
      setAiExamples([])
      setAiError(null)
    }
  }, [isOpen, vocab])

  // Handle ESC key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSaving, onClose])

  const handleFetchAi = useCallback(async () => {
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await fetch('/api/ai/examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: vocab.word,
          reading: reading || vocab.reading,
          meaning: meaningVi || vocab.meaning_vi,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi gọi AI gợi ý')
      }

      if (Array.isArray(data.examples) && data.examples.length > 0) {
        setAiExamples(data.examples)
      } else {
        setAiError('Không có gợi ý nào từ AI')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lấy gợi ý AI'
      setAiError(msg)
    } finally {
      setAiLoading(false)
    }
  }, [vocab.word, vocab.reading, vocab.meaning_vi, reading, meaningVi])

  const handleSelectSuggestion = (item: ExampleSuggestion) => {
    setExampleJp(item.sentence_jp)
    setExampleVi(item.meaning_vi)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meaningVi.trim()) {
      setError('Vui lòng nhập nghĩa tiếng Việt')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const updatedData = {
        meaning_vi: meaningVi.trim(),
        reading: reading.trim() || vocab.reading,
        example_jp: exampleJp.trim() || null,
        example_vi: exampleVi.trim() || null,
      }

      const { data, error: updateError } = await supabase
        .from('vocabulary')
        .update(updatedData)
        .eq('id', vocab.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      onSuccess?.(data as Vocabulary)
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu chỉnh sửa'
      setError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-vocab-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-[#E8D5D8] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5E6E8] bg-[#FFFBFB]">
          <div className="flex items-center gap-3">
            <div>
              <h2 id="edit-vocab-title" className="text-lg font-bold text-[#1A1A2E]">
                Chỉnh sửa từ vựng
              </h2>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-[#C8102E]">{vocab.word}</span>
                <span className="text-xs font-medium text-[#6B6B7E]">({vocab.reading})</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6B6B7E] hover:text-[#1A1A2E] hover:bg-[#FFF5F6] rounded-xl transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* AI Suggestion Section */}
          <div className="p-4 rounded-xl border border-[#F5D0D5] bg-[#FFFBFB] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#C8102E]" />
                <span className="text-xs font-bold text-[#1A1A2E]">
                  Trợ lý AI đổi câu ví dụ
                </span>
              </div>
              <button
                type="button"
                onClick={handleFetchAi}
                disabled={aiLoading}
                className="text-xs font-semibold text-[#C8102E] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={12} className={aiLoading ? 'animate-spin' : ''} />
                {aiLoading ? 'Đang tạo...' : 'Gợi ý câu khác'}
              </button>
            </div>

            {aiLoading && (
              <div className="py-4 text-center space-y-1.5">
                <Loader2 size={20} className="animate-spin mx-auto text-[#C8102E]" />
                <p className="text-xs text-[#6B6B7E]">Đang tạo gợi ý câu ví dụ mới...</p>
              </div>
            )}

            {aiError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{aiError}</p>
            )}

            {!aiLoading && aiExamples.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-[#6B6B7E]">
                  Bấm vào câu bên dưới để thay thế:
                </p>
                {aiExamples.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="p-3 rounded-xl border border-[#E8D5D8] bg-white hover:border-[#C8102E] hover:bg-[#FFF5F6] transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#1A1A2E]">
                        {item.sentence_jp}
                      </span>
                      <AudioButton text={item.sentence_jp} size={14} />
                    </div>
                    <p className="text-xs text-[#6B6B7E]">{item.reading}</p>
                    <p className="text-xs font-semibold text-[#C8102E]">{item.meaning_vi}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <form id="edit-vocab-form" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A2E] mb-1.5">
                Nghĩa tiếng Việt <span className="text-[#C8102E]">*</span>
              </label>
              <input
                type="text"
                value={meaningVi}
                onChange={(e) => setMeaningVi(e.target.value)}
                placeholder="Nhập nghĩa tiếng Việt..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5D8] bg-[#FFFAF9] text-sm text-[#1A1A2E] outline-none focus:border-[#C8102E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A2E] mb-1.5">
                Cách đọc Hiragana / Furigana
              </label>
              <input
                type="text"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                placeholder="Cách đọc Hiragana..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5D8] bg-[#FFFAF9] text-sm text-[#1A1A2E] outline-none focus:border-[#C8102E] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#1A1A2E]">
                  Câu ví dụ tiếng Nhật
                </label>
                {exampleJp.trim() && (
                  <AudioButton text={exampleJp} label="Nghe câu" size={13} />
                )}
              </div>
              <input
                type="text"
                value={exampleJp}
                onChange={(e) => setExampleJp(e.target.value)}
                placeholder="Nhập hoặc chỉnh sửa câu ví dụ tiếng Nhật..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5D8] bg-[#FFFAF9] text-sm text-[#1A1A2E] outline-none focus:border-[#C8102E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A2E] mb-1.5">
                Dịch nghĩa câu ví dụ
              </label>
              <input
                type="text"
                value={exampleVi}
                onChange={(e) => setExampleVi(e.target.value)}
                placeholder="Dịch nghĩa câu ví dụ sang tiếng Việt..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D5D8] bg-[#FFFAF9] text-sm text-[#1A1A2E] outline-none focus:border-[#C8102E] transition-colors"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F5E6E8] bg-[#FFFBFB]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-[#E8D5D8] text-[#6B6B7E] hover:bg-white hover:text-[#1A1A2E] transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="edit-vocab-form"
            disabled={isSaving || !meaningVi.trim()}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#C8102E] hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Đang lưu...
              </>
            ) : (
              <>
                <Check size={15} /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
