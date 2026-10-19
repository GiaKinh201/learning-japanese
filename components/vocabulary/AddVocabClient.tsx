'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getWordDisplay, type JishoWord } from '@/lib/jisho'
import { ArrowLeft, Search, Loader2, Check, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import AudioButton from '@/components/common/AudioButton'

interface ExampleSuggestion {
  sentence_jp: string
  reading: string
  meaning_vi: string
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
  const [exampleJp, setExampleJp] = useState('')
  const [exampleVi, setExampleVi] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  // AI Suggestions state
  const [aiLoading, setAiLoading] = useState(false)
  const [aiExamples, setAiExamples] = useState<ExampleSuggestion[]>([])
  const [aiLevel, setAiLevel] = useState<string>('')
  const [aiError, setAiError] = useState<string | null>(null)
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number | null>(null)

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

  const fetchAiExamples = useCallback(async (word: JishoWord) => {
    const display = getWordDisplay(word)
    const targetWord = display.kanji || display.reading
    const targetJlpt = display.jlpt || ''

    setAiLoading(true)
    setAiError(null)
    setAiExamples([])
    setAiLevel(targetJlpt)
    setSelectedExampleIndex(null)

    try {
      const res = await fetch('/api/ai/examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          reading: display.reading,
          meaning: display.meanings.join(', '),
          jlpt: targetJlpt,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Dịch vụ AI tạm thời không khả dụng')
      }

      // Tự động điền nghĩa tiếng Việt do AI dịch (chỉ khi người dùng chưa tự nhập)
      if (data.word_meaning_vi) {
        setMeaningVi((prev) => (prev.trim() ? prev : data.word_meaning_vi))
      }

      // Tự động điền câu ví dụ đầu tiên vào form nếu chưa có
      if (Array.isArray(data.examples) && data.examples.length > 0) {
        setAiExamples(data.examples)
        setAiLevel(data.level || targetJlpt)
        setSelectedExampleIndex(0)
        setExampleJp((prev) => (prev.trim() ? prev : data.examples[0].sentence_jp))
        setExampleVi((prev) => (prev.trim() ? prev : data.examples[0].meaning_vi))
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lấy gợi ý AI'
      setAiError(msg)
    } finally {
      setAiLoading(false)
    }
  }, [])

  function handleSelect(word: JishoWord) {
    setSelected(word)
    // Để trống nghĩa tiếng Việt chờ AI dịch (không lấy tiếng Anh thô từ Jisho)
    setMeaningVi('')
    setExampleJp('')
    setExampleVi('')
    setSaveError('')
    setSaved(false)
    // Tự động kích hoạt gọi AI siêu tốc
    fetchAiExamples(word)
  }

  function handleSelectExample(item: ExampleSuggestion, index: number) {
    setSelectedExampleIndex(index)
    setExampleJp(item.sentence_jp)
    setExampleVi(item.meaning_vi)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !meaningVi.trim()) return

    const display = getWordDisplay(selected)

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
        example_jp: exampleJp.trim() || null,
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
      setSearched(false)
      setMeaningVi('')
      setExampleJp('')
      setExampleVi('')
      setAiExamples([])
      setSelectedExampleIndex(null)
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
            className="px-4 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            style={{ background: '#C8102E' }}
          >
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Tìm
          </button>
        </div>
      </div>

      {/* Search results */}
      {searched && !searching && !selected && query.trim() && (
        <div className="space-y-2">
          {results.length > 0 ? (
            <>
              <p className="text-sm font-medium" style={{ color: '#6B6B7E' }}>
                Tìm thấy {results.length} kết quả — bấm để chọn:
              </p>
              {results.map((word, i) => {
                const display = getWordDisplay(word)
                const isExpanded = expandedIndex === i
                const targetText = display.kanji || display.reading
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
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>
                            {targetText}
                          </span>
                          {display.kanji && (
                            <span className="text-sm font-medium" style={{ color: '#6B6B7E' }}>{display.reading}</span>
                          )}
                          {display.jlpt && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: '#FFE4E8', color: '#C8102E' }}>
                              {display.jlpt}
                            </span>
                          )}
                        </div>
                        <p className="text-sm truncate" style={{ color: '#6B6B7E' }}>
                          {display.meanings.slice(0, 3).join(' · ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <AudioButton text={targetText} size={16} />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelect(word) }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 cursor-pointer"
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
          className="rounded-2xl border p-5 space-y-5"
          style={{ background: '#FFFFFF', borderColor: '#C8102E' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg" style={{ color: '#1A1A2E' }}>Xác nhận và lưu từ</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-xs px-2.5 py-1 rounded-lg border hover:bg-gray-50 cursor-pointer"
              style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
            >
              Chọn lại từ khác
            </button>
          </div>

          {/* Selected word preview */}
          {(() => {
            const display = getWordDisplay(selected)
            const targetText = display.kanji || display.reading
            return (
              <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: '#FFF5F6' }}>
                <div>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-3xl font-bold" style={{ color: '#1A1A2E' }}>{targetText}</span>
                    {display.kanji && (
                      <span className="text-base font-semibold" style={{ color: '#6B6B7E' }}>
                        {display.reading}
                      </span>
                    )}
                    {display.jlpt && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#FFE4E8', color: '#C8102E' }}>
                        {display.jlpt}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: '#6B6B7E' }}>
                    Nguồn gốc tra cứu: {display.meanings.slice(0, 3).join(' · ')}
                  </p>
                </div>
                <AudioButton text={targetText} label="Nghe từ" size={18} />
              </div>
            )
          })()}

          {/* AI Example suggestions */}
          <div className="rounded-2xl border p-4.5" style={{ background: '#FFFAF9', borderColor: '#F5D0D5' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: '#C8102E' }} />
                <span className="text-sm font-bold" style={{ color: '#1A1A2E' }}>
                  Gợi ý câu ví dụ
                </span>
                {aiLevel && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: '#FFE4E8', color: '#C8102E' }}
                  >
                    {aiLevel}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fetchAiExamples(selected)}
                disabled={aiLoading}
                className="text-xs flex items-center gap-1 font-semibold hover:underline cursor-pointer disabled:opacity-50"
                style={{ color: '#C8102E' }}
              >
                <RefreshCw size={13} className={aiLoading ? 'animate-spin' : ''} />
                {aiLoading ? 'Đang tạo...' : 'Đổi câu khác'}
              </button>
            </div>

            {aiLoading && (
              <div className="py-6 text-center space-y-2">
                <Loader2 size={24} className="animate-spin mx-auto" style={{ color: '#C8102E' }} />
                <p className="text-xs font-medium" style={{ color: '#6B6B7E' }}>
                  Đang dịch nghĩa tiếng Việt và tạo câu ví dụ phù hợp...
                </p>
              </div>
            )}

            {aiError && (
              <div
                className="p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 border"
                style={{ background: '#FFF5F6', borderColor: '#F5D0D5', color: '#991B1B' }}
              >
                <span className="leading-relaxed">⚠️ {aiError}</span>
                <button
                  type="button"
                  onClick={() => fetchAiExamples(selected)}
                  className="underline font-bold shrink-0 cursor-pointer hover:opacity-80"
                  style={{ color: '#C8102E' }}
                >
                  Thử lại
                </button>
              </div>
            )}

            {!aiLoading && aiExamples.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-medium" style={{ color: '#6B6B7E' }}>
                  ✨ Bấm vào 1 câu bạn thích để tự động điền vào thẻ từ:
                </p>
                {aiExamples.map((item, idx) => {
                  const isSelected = selectedExampleIndex === idx
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectExample(item, idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C8102E] bg-white ring-2 ring-[#C8102E]/20 shadow-sm'
                          : 'border-[#E8D5D8] bg-white/70 hover:bg-white hover:border-[#FFB7C5]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold" style={{ color: '#1A1A2E' }}>
                              {item.sentence_jp}
                            </span>
                            <AudioButton text={item.sentence_jp} size={15} />
                          </div>
                          <p className="text-xs font-medium mt-1 tracking-wide" style={{ color: '#6B6B7E' }}>
                            {item.reading}
                          </p>
                          <p className="text-xs mt-1.5 font-semibold" style={{ color: '#C8102E' }}>
                            {item.meaning_vi}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: '#D1FAE5', color: '#065F46' }}>
                            ✓ Đã chọn
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Nghĩa tiếng Việt <span style={{ color: '#C8102E' }}>*</span>
                </label>
                {aiLoading && (
                  <span className="text-xs flex items-center gap-1 font-medium animate-pulse" style={{ color: '#C8102E' }}>
                    <Loader2 size={12} className="animate-spin" /> AI đang dịch nghĩa...
                  </span>
                )}
              </div>
              <input
                type="text"
                value={meaningVi}
                onChange={(e) => setMeaningVi(e.target.value)}
                placeholder={aiLoading ? 'Nhập nghĩa tiếng Việt (hoặc chờ AI điền)...' : 'Nhập nghĩa tiếng Việt cho từ này...'}
                required
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#E8D5D8', background: '#FFFAF9', color: '#1A1A2E' }}
                onFocus={(e) => (e.target.style.borderColor = '#C8102E')}
                onBlur={(e) => (e.target.style.borderColor = '#E8D5D8')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Câu ví dụ tiếng Nhật <span style={{ color: '#6B6B7E' }}>(tùy chọn)</span>
                </label>
                {exampleJp.trim() && (
                  <AudioButton text={exampleJp} label="Nghe câu" size={14} />
                )}
              </div>
              <input
                type="text"
                value={exampleJp}
                onChange={(e) => setExampleJp(e.target.value)}
                placeholder="Câu ví dụ bằng tiếng Nhật (đã tự điền từ gợi ý ở trên)..."
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#E8D5D8', background: '#FFFAF9', color: '#1A1A2E' }}
                onFocus={(e) => (e.target.style.borderColor = '#C8102E')}
                onBlur={(e) => (e.target.style.borderColor = '#E8D5D8')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A2E' }}>
                Dịch nghĩa câu ví dụ <span style={{ color: '#6B6B7E' }}>(tùy chọn)</span>
              </label>
              <input
                type="text"
                value={exampleVi}
                onChange={(e) => setExampleVi(e.target.value)}
                placeholder="Dịch nghĩa câu ví dụ sang tiếng Việt..."
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#E8D5D8', background: '#FFFAF9', color: '#1A1A2E' }}
                onFocus={(e) => (e.target.style.borderColor = '#C8102E')}
                onBlur={(e) => (e.target.style.borderColor = '#E8D5D8')}
              />
            </div>

            {saveError && <p className="text-sm font-medium" style={{ color: '#C8102E' }}>{saveError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border cursor-pointer hover:bg-gray-50"
                style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={isPending || !meaningVi.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 cursor-pointer hover:opacity-90 shadow-sm"
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
