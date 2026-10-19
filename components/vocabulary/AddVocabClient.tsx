'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getWordDisplay, type JishoWord } from '@/lib/jisho'
import { ArrowLeft, Search, Loader2, Check, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
  collectionName: string
}

export default function AddVocabClient({ collectionId, collectionName }: { collectionId: string; collectionName: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<JishoWord[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState<JishoWord | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  // Form state for saving
  const [meaningVi, setMeaningVi] = useState('')
  const [exampleVi, setExampleVi] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setSearching(true)
    setResults([])
    setSelected(null)
    setSearched(false)
    try {
      const res = await fetch(`/api/jisho?keyword=${encodeURIComponent(query)}`)
      const data: JishoWord[] = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch {
      setResults([])
    } finally {
      setSearching(false)
      setSearched(true)
    }
  }, [query])

  function handleSelect(word: JishoWord) {
    const display = getWordDisplay(word)
    setSelected(word)
    setMeaningVi('')
    setExampleVi('')
    setSaveError('')
    setSaved(false)
    // Try to auto-translate meaning (simple placeholder)
    setMeaningVi(display.meanings.join(', '))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !meaningVi.trim()) return

    const display = getWordDisplay(selected)
    const example = selected.senses[0]?.examples?.[0]

    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('vocabulary').insert({
        collection_id: collectionId,
        user_id: user.id,
        word: display.kanji || display.reading,
        reading: display.reading,
        meaning_vi: meaningVi.trim(),
        meaning_en: display.meanings.join(', '),
        example_jp: example?.text ?? null,
        example_vi: exampleVi.trim() || null,
        jisho_slug: selected.slug,
      })

      if (error) {
        setSaveError('Lỗi khi lưu. Vui lòng thử lại.')
        return
      }

      setSaved(true)
      setSelected(null)
      setQuery('')
      setResults([])
      setMeaningVi('')
      setExampleVi('')
      router.refresh()
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/vocabulary/${collectionId}`} className="p-2 rounded-xl hover:bg-[#FFF5F6]" style={{ color: '#6B6B7E' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1A1A2E' }}>Thêm từ vựng</h1>
          <p className="text-sm" style={{ color: '#6B6B7E' }}>Vào bộ: <strong>{collectionName}</strong></p>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium"
          style={{ background: '#D1FAE5', color: '#065F46' }}
        >
          <Check size={16} /> Đã lưu từ thành công! Tiếp tục tìm từ khác.
        </div>
      )}

      {/* Search box */}
      <div
        className="rounded-2xl p-5 border"
        style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: '#1A1A2E' }}>
          🔍 Tìm từ — nhập tiếng Việt, tiếng Anh, hoặc tiếng Nhật
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="VD: ăn, eat, 食べる, family..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: '#E8D5D8', background: '#FFFAF9', color: '#1A1A2E' }}
            onFocus={(e) => (e.target.style.borderColor = '#C8102E')}
            onBlur={(e) => (e.target.style.borderColor = '#E8D5D8')}
          />
          <button
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="px-4 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50"
            style={{ background: '#C8102E' }}
          >
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Tìm
          </button>
        </div>
      </div>

      {/* Search results */}
      {searched && !searching && !selected && (
        <div className="space-y-2">
          {results.length > 0 ? (
            <>
              <p className="text-sm font-medium" style={{ color: '#6B6B7E' }}>
                Tìm thấy {results.length} kết quả — bấm để chọn:
              </p>
              {results.map((word, i) => {
                const display = getWordDisplay(word)
                const isExpanded = expandedIndex === i
                return (
                  <div
                    key={word.slug}
                    className="rounded-xl border transition-all"
                    style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
                  >
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#FFF5F6]"
                      onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>
                            {display.kanji || display.reading}
                          </span>
                          {display.kanji && (
                            <span className="text-sm" style={{ color: '#6B6B7E' }}>{display.reading}</span>
                          )}
                          {display.jlpt && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#FFE4E8', color: '#C8102E' }}>
                              {display.jlpt}
                            </span>
                          )}
                        </div>
                        <p className="text-sm truncate" style={{ color: '#6B6B7E' }}>
                          {display.meanings.slice(0, 3).join(' · ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelect(word) }}
                          className="px-3 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90"
                          style={{ background: '#C8102E' }}
                        >
                          Chọn
                        </button>
                        {isExpanded ? <ChevronUp size={16} style={{ color: '#6B6B7E' }} /> : <ChevronDown size={16} style={{ color: '#6B6B7E' }} />}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-4 text-sm" style={{ borderTop: '1px solid #F5E6E8' }}>
                        {word.senses.slice(0, 3).map((sense, si) => (
                          <div key={si} className="mt-2">
                            <span className="text-xs" style={{ color: '#6B6B7E' }}>
                              {sense.parts_of_speech.join(', ')}
                            </span>
                            <p style={{ color: '#1A1A2E' }}>{sense.english_definitions.join(', ')}</p>
                            {sense.examples?.[0] && (
                              <p className="mt-1 text-xs italic" style={{ color: '#6B6B7E' }}>
                                {sense.examples[0].text}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          ) : (
            <div
              className="p-4 rounded-xl text-sm text-center"
              style={{ background: '#FFF5F6', color: '#6B6B7E' }}
            >
              😅 Không tìm thấy kết quả cho <strong>&ldquo;{query}&rdquo;</strong>.<br />
              Thử nhập tiếng Nhật (VD: <span style={{ color: '#C8102E' }}>食べる</span>) hoặc tiếng Anh.
            </div>
          )}
        </div>
      )}

      {/* Selected word form */}
      {selected && (
        <div
          className="rounded-2xl border p-5"
          style={{ background: '#FFFFFF', borderColor: '#C8102E' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: '#1A1A2E' }}>Xác nhận và lưu từ</h3>
            <button onClick={() => setSelected(null)} className="text-xs" style={{ color: '#6B6B7E' }}>
              Chọn lại
            </button>
          </div>

          {/* Selected word preview */}
          <div className="p-3 rounded-xl mb-4" style={{ background: '#FFF5F6' }}>
            {(() => {
              const display = getWordDisplay(selected)
              const example = selected.senses[0]?.examples?.[0]
              return (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>{display.kanji || display.reading}</span>
                    {display.kanji && <span className="text-sm" style={{ color: '#6B6B7E' }}>{display.reading}</span>}
                  </div>
                  {example && (
                    <p className="text-xs mt-1" style={{ color: '#6B6B7E' }}>Ví dụ: {example.text}</p>
                  )}
                </>
              )
            })()}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A2E' }}>
                Nghĩa tiếng Việt <span style={{ color: '#C8102E' }}>*</span>
              </label>
              <input
                type="text"
                value={meaningVi}
                onChange={(e) => setMeaningVi(e.target.value)}
                placeholder="Nhập nghĩa tiếng Việt..."
                required
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#E8D5D8', background: '#FFFAF9', color: '#1A1A2E' }}
                onFocus={(e) => (e.target.style.borderColor = '#C8102E')}
                onBlur={(e) => (e.target.style.borderColor = '#E8D5D8')}
              />
              <p className="text-xs mt-1" style={{ color: '#6B6B7E' }}>
                💡 Gợi ý từ Jisho đã điền sẵn — sửa lại nếu cần
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A2E' }}>
                Dịch ví dụ câu <span style={{ color: '#6B6B7E' }}>(tùy chọn)</span>
              </label>
              <input
                type="text"
                value={exampleVi}
                onChange={(e) => setExampleVi(e.target.value)}
                placeholder="Dịch câu ví dụ sang tiếng Việt..."
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#E8D5D8', background: '#FFFAF9', color: '#1A1A2E' }}
                onFocus={(e) => (e.target.style.borderColor = '#C8102E')}
                onBlur={(e) => (e.target.style.borderColor = '#E8D5D8')}
              />
            </div>

            {saveError && <p className="text-sm" style={{ color: '#C8102E' }}>{saveError}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={isPending || !meaningVi.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: '#C8102E' }}
              >
                {isPending ? 'Đang lưu...' : '✓ Lưu từ này'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
