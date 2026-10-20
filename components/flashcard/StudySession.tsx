'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Vocabulary } from '@/types/database'
import AudioButton from '@/components/common/AudioButton'
import { playJapaneseAudio } from '@/lib/tts'
import { shuffleArray } from '@/lib/shuffle'
import { Pencil, Shuffle, RotateCcw, Trophy, Sparkles, BookOpen, Check, X } from 'lucide-react'
import EditVocabModal from '@/components/vocabulary/EditVocabModal'

interface Props {
  initialCards: Vocabulary[]
  collectionId: string
  collectionName: string
}

type CardState = 'question' | 'answer'
type SessionResult = { id: string; correct: boolean }

export default function StudySession({ initialCards, collectionId, collectionName }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // initialCards đã được xáo trộn sẵn từ Server Component
  const [cards, setCards] = useState(initialCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardState, setCardState] = useState<CardState>('question')
  const [results, setResults] = useState<SessionResult[]>([])
  const [done, setDone] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isReviewingMissed, setIsReviewingMissed] = useState(false)

  const current = cards[currentIndex]
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0

  const flip = useCallback(() => {
    setCardState((s) => (s === 'question' ? 'answer' : 'question'))
  }, [])

  const handleShuffle = useCallback(() => {
    setCards((prev) => shuffleArray(prev))
    setCurrentIndex(0)
    setResults([])
    setCardState('question')
  }, [])

  const handleResult = useCallback(
    (correct: boolean) => {
      const currentVocabId = current.id
      setResults((prev) => [...prev, { id: currentVocabId, correct }])

      // 1. Phản hồi tức thì 0ms (Optimistic UI): Chuyển thẻ tiếp theo ngay lập tức không chờ mạng
      if (currentIndex + 1 >= cards.length) {
        setDone(true)
      } else {
        setCurrentIndex((prev) => prev + 1)
        setCardState('question')
      }

      // 2. Ghi nhận log và cập nhật Streak ngầm trong background (fire-and-forget, không block UI)
      void (async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (!user) return

          await supabase.from('study_logs').insert({
            user_id: user.id,
            vocabulary_id: currentVocabId,
            result: correct,
          })

          // Cập nhật streak học tập
          const today = new Date().toISOString().split('T')[0]
          const { data: profile } = await supabase
            .from('profiles')
            .select('streak, last_study_date')
            .eq('id', user.id)
            .single()

          if (profile) {
            const isNewDay = profile.last_study_date !== today
            if (isNewDay) {
              const yesterday = new Date()
              yesterday.setDate(yesterday.getDate() - 1)
              const yStr = yesterday.toISOString().split('T')[0]
              const newStreak = profile.last_study_date === yStr ? (profile.streak ?? 0) + 1 : 1
              await supabase
                .from('profiles')
                .update({
                  streak: newStreak,
                  last_study_date: today,
                })
                .eq('id', user.id)
            }
          }
        } catch (err) {
          console.error('Lỗi khi ghi study log ngầm:', err)
        }
      })()
    },
    [current.id, currentIndex, cards.length, supabase]
  )

  // Phím tắt bàn phím (Active Recall Keyboard Shortcuts)
  useEffect(() => {
    if (done || isEditing || !current) return

    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.code === 'Space') {
        e.preventDefault()
        flip()
      } else if (e.key === '1' || e.key === 'ArrowLeft') {
        if (cardState === 'answer') {
          e.preventDefault()
          handleResult(false)
        }
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        if (cardState === 'answer') {
          e.preventDefault()
          handleResult(true)
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        const textToPlay =
          cardState === 'answer' && current.example_jp ? current.example_jp : current.word
        playJapaneseAudio(textToPlay)
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        setIsEditing(true)
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        handleShuffle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [done, isEditing, current, cardState, flip, handleResult, handleShuffle])

  // Màn hình kết thúc vòng học
  if (done) {
    const correctCount = results.filter((r) => r.correct).length
    const total = cards.length
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0
    const incorrectCards = cards.filter((c) =>
      results.some((r) => r.id === c.id && !r.correct)
    )

    return (
      <div className="max-w-lg mx-auto text-center space-y-6 fade-in">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-[#FFF0F3] text-[#C8102E] shadow-xs border border-[#F5D0D5]">
          {pct === 100 ? (
            <Trophy size={36} />
          ) : pct >= 50 ? (
            <Sparkles size={36} />
          ) : (
            <BookOpen size={36} />
          )}
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A2E]">
          {pct === 100 ? 'Xuất sắc! Đã thuộc 100%!' : 'Phiên học hoàn thành!'}
        </h2>
        <div className="rounded-2xl p-6 border border-[#E8D5D8] bg-white shadow-xs">
          <div className="text-5xl font-bold mb-1 text-[#C8102E]">{pct}%</div>
          <p className="text-sm text-[#6B6B7E]">
            Đúng {correctCount}/{total} thẻ {isReviewingMissed && '(vòng ôn từ chưa nhớ)'}
          </p>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#059669] flex items-center justify-center gap-1">
                <span>{correctCount}</span>
                <Check size={18} />
              </div>
              <div className="text-xs text-[#6B6B7E]">Đã thuộc</div>
            </div>
            <div className="w-px bg-[#E8D5D8]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C8102E] flex items-center justify-center gap-1">
                <span>{incorrectCards.length}</span>
                <X size={18} />
              </div>
              <div className="text-xs text-[#6B6B7E]">Chưa nhớ</div>
            </div>
          </div>
        </div>

        {/* Action Options */}
        <div className="space-y-3">
          {incorrectCards.length > 0 && (
            <button
              onClick={() => {
                setCards(shuffleArray(incorrectCards))
                setCurrentIndex(0)
                setResults([])
                setCardState('question')
                setIsReviewingMissed(true)
                setDone(false)
              }}
              className="w-full py-3.5 rounded-xl font-bold text-base text-white bg-[#C8102E] hover:opacity-90 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Ôn lại {incorrectCards.length} từ chưa nhớ
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCards(shuffleArray(initialCards))
                setCurrentIndex(0)
                setResults([])
                setCardState('question')
                setIsReviewingMissed(false)
                setDone(false)
              }}
              className="flex-1 py-3 rounded-xl font-medium border border-[#E8D5D8] text-[#6B6B7E] hover:bg-gray-50 hover:text-[#1A1A2E] cursor-pointer transition-colors"
            >
              Học lại tất cả
            </button>
            <button
              onClick={() => router.push(collectionId === 'multi' ? '/vocabulary' : `/vocabulary/${collectionId}`)}
              className={`flex-1 py-3 rounded-xl font-medium cursor-pointer transition-colors ${
                incorrectCards.length === 0
                  ? 'bg-[#C8102E] text-white hover:opacity-90 shadow-sm'
                  : 'border border-[#E8D5D8] text-[#6B6B7E] hover:bg-gray-50 hover:text-[#1A1A2E]'
              }`}
            >
              {collectionId === 'multi' ? 'Về danh sách bộ' : 'Về bộ từ'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[#6B6B7E]">
              {collectionName} · {currentIndex + 1}/{cards.length}
            </p>
            {isReviewingMissed && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-[#FFE4E8] text-[#C8102E]">
                Ôn từ chưa nhớ
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              title="Xáo trộn lại thứ tự thẻ"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border border-[#E8D5D8] text-[#6B6B7E] hover:text-[#C8102E] hover:border-[#F5D0D5] hover:bg-[#FFF5F6] transition-colors cursor-pointer"
            >
              <Shuffle size={13} />
              Xáo trộn
            </button>
            <button
              onClick={() => router.back()}
              className="text-xs cursor-pointer hover:underline text-[#6B6B7E]"
            >
              Thoát
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#FFE4E8]">
          <div
            className="h-2 rounded-full transition-all duration-500 bg-[#C8102E]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="card-scene" style={{ height: '370px' }}>
        <div
          key={current.id}
          className={`card-inner ${cardState === 'answer' ? 'flipped' : ''}`}
        >
          {/* Front — Japanese word */}
          <div
            className="card-front rounded-3xl border border-[#E8D5D8] bg-white flex flex-col items-center justify-center p-8 cursor-pointer select-none relative"
            onClick={flip}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              title="Chỉnh sửa từ này"
              className="absolute top-4 right-4 p-2 rounded-xl text-[#6B6B7E] hover:text-[#C8102E] hover:bg-[#FFF5F6] transition-colors cursor-pointer"
            >
              <Pencil size={15} />
            </button>
            <p className="text-xs mb-3 font-medium text-[#6B6B7E]">
              Từ tiếng Nhật — bấm để lật
            </p>
            {/* Kanji / Main word */}
            <div className="text-5xl font-bold mb-4 tracking-wide text-[#1A1A2E]">
              {current.word}
            </div>

            {current.reading && (
              <div className="text-lg font-semibold px-3.5 py-1 rounded-full mb-4 tracking-wider bg-[#FFE4E8] text-[#C8102E]">
                {current.reading}
              </div>
            )}

            <AudioButton text={current.word} label="Nghe phát âm" size={16} />
          </div>

          {/* Back — meaning + example */}
          <div className="card-back rounded-3xl border border-[#C8102E] bg-[#FFF5F6] flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#F5D0D5]">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-[#1A1A2E]">{current.word}</span>
                {current.reading && (
                  <span className="text-xs font-semibold text-[#6B6B7E]">({current.reading})</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                  }}
                  title="Chỉnh sửa từ này"
                  className="p-1.5 rounded-lg text-[#6B6B7E] hover:text-[#C8102E] hover:bg-[#FFE4E8] transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <AudioButton text={current.word} size={14} />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#C8102E]">
                  Nghĩa tiếng Việt
                </p>
                <div className="text-2xl font-bold text-[#1A1A2E]">{current.meaning_vi}</div>
                {current.meaning_en && (
                  <p className="text-xs mt-0.5 text-[#6B6B7E]">{current.meaning_en}</p>
                )}
              </div>

              {current.example_jp && (
                <div className="p-3.5 rounded-2xl shadow-xs border border-[#F5D0D5] bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-base leading-snug text-[#1A1A2E]">
                      {current.example_jp}
                    </p>
                    <AudioButton text={current.example_jp} size={15} />
                  </div>
                  {current.example_vi && (
                    <p className="text-xs font-medium mt-1.5 text-[#6B6B7E]">{current.example_vi}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons — only show when card is flipped */}
      {cardState === 'answer' ? (
        <div className="flex gap-3">
          <button
            onClick={() => handleResult(false)}
            className="flex-1 py-3 rounded-2xl font-bold text-lg border-2 border-[#FECDD3] text-[#C8102E] bg-[#FFF5F6] transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <X size={20} />
            <span>Chưa nhớ</span>
          </button>
          <button
            onClick={() => handleResult(true)}
            className="flex-1 py-3 rounded-2xl font-bold text-lg border-2 border-[#A7F3D0] text-[#059669] bg-[#F0FDF4] transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <Check size={20} />
            <span>Đã thuộc</span>
          </button>
        </div>
      ) : (
        <button
          onClick={flip}
          className="w-full py-3 rounded-2xl font-medium text-white bg-[#C8102E] cursor-pointer hover:opacity-90 shadow-sm"
        >
          Lật thẻ xem đáp án
        </button>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="text-center text-xs text-[#6B6B7E] hidden sm:flex items-center justify-center gap-2 pt-1 select-none">
        <span className="opacity-75">Phím tắt:</span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-[#E8D5D8] font-mono text-[11px] text-[#1A1A2E] shadow-2xs">Space</kbd> Lật
        </span>
        <span>·</span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-[#E8D5D8] font-mono text-[11px] text-[#1A1A2E] shadow-2xs">1 / ←</kbd> Chưa nhớ
        </span>
        <span>·</span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-[#E8D5D8] font-mono text-[11px] text-[#1A1A2E] shadow-2xs">2 / →</kbd> Đã thuộc
        </span>
        <span>·</span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-[#E8D5D8] font-mono text-[11px] text-[#1A1A2E] shadow-2xs">R</kbd> Nghe
        </span>
      </div>

      {/* Edit Modal */}
      {current && isEditing && (
        <EditVocabModal
          key={current.id}
          vocab={current}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSuccess={(updated) => {
            setCards((prev) =>
              prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
            )
          }}
        />
      )}
    </div>
  )
}
