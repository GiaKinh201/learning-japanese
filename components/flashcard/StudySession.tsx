'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Vocabulary } from '@/types/database'

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

  // Shuffle cards
  const [cards] = useState(() => [...initialCards].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardState, setCardState] = useState<CardState>('question')
  const [results, setResults] = useState<SessionResult[]>([])
  const [done, setDone] = useState(false)

  const current = cards[currentIndex]
  const progress = ((currentIndex) / cards.length) * 100

  const flip = useCallback(() => {
    setCardState((s) => s === 'question' ? 'answer' : 'question')
  }, [])

  const handleResult = useCallback(async (correct: boolean) => {
    const newResults = [...results, { id: current.id, correct }]
    setResults(newResults)

    // Log to DB
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('study_logs').insert({
        user_id: user.id,
        vocabulary_id: current.id,
        result: correct,
      })

      // Update streak if this is the first study action today
      const today = new Date().toISOString().split('T')[0]
      const { data: profile } = await supabase.from('profiles').select('streak, last_study_date').eq('id', user.id).single()
      if (profile) {
        const isNewDay = profile.last_study_date !== today
        if (isNewDay) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yStr = yesterday.toISOString().split('T')[0]
          const newStreak = profile.last_study_date === yStr ? (profile.streak ?? 0) + 1 : 1
          await supabase.from('profiles').update({
            streak: newStreak,
            last_study_date: today,
          }).eq('id', user.id)
        }
      }
    }

    if (currentIndex + 1 >= cards.length) {
      setDone(true)
    } else {
      setCurrentIndex(currentIndex + 1)
      setCardState('question')
    }
  }, [current, currentIndex, cards.length, results, supabase])

  if (done) {
    const correctCount = results.filter((r) => r.correct).length
    const total = cards.length
    const pct = Math.round((correctCount / total) * 100)
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 fade-in">
        <div className="text-6xl">
          {pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📖'}
        </div>
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
          Phiên học hoàn thành!
        </h2>
        <div
          className="rounded-2xl p-6 border"
          style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
        >
          <div className="text-5xl font-bold mb-1" style={{ color: '#C8102E' }}>{pct}%</div>
          <p className="text-sm" style={{ color: '#6B6B7E' }}>
            Đúng {correctCount}/{total} thẻ
          </p>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#059669' }}>{correctCount}</div>
              <div className="text-xs" style={{ color: '#6B6B7E' }}>Đúng ✓</div>
            </div>
            <div className="w-px" style={{ background: '#E8D5D8' }} />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#C8102E' }}>{total - correctCount}</div>
              <div className="text-xs" style={{ color: '#6B6B7E' }}>Sai ✗</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setDone(false); setCurrentIndex(0); setResults([]); setCardState('question') }}
            className="flex-1 py-3 rounded-xl font-medium border"
            style={{ borderColor: '#E8D5D8', color: '#6B6B7E' }}
          >
            Học lại
          </button>
          <button
            onClick={() => router.push(`/vocabulary/${collectionId}`)}
            className="flex-1 py-3 rounded-xl font-medium text-white"
            style={{ background: '#C8102E' }}
          >
            Về bộ từ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium" style={{ color: '#6B6B7E' }}>
            {collectionName} · {currentIndex + 1}/{cards.length}
          </p>
          <button
            onClick={() => router.back()}
            className="text-xs"
            style={{ color: '#6B6B7E' }}
          >
            Thoát
          </button>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full" style={{ background: '#FFE4E8' }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: '#C8102E' }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="card-scene" style={{ height: '340px' }}>
        <div className={`card-inner ${cardState === 'answer' ? 'flipped' : ''}`}>
          {/* Front — Japanese word */}
          <div
            className="card-front rounded-3xl border flex flex-col items-center justify-center p-8 cursor-pointer select-none"
            style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
            onClick={flip}
          >
            <p className="text-xs mb-4 font-medium" style={{ color: '#6B6B7E' }}>
              Từ tiếng Nhật — bấm để lật
            </p>
            <div className="text-5xl font-bold mb-3" style={{ color: '#1A1A2E' }}>
              {current.word}
            </div>
            <div className="text-xl" style={{ color: '#6B6B7E' }}>
              {current.reading}
            </div>
          </div>

          {/* Back — meaning + example */}
          <div
            className="card-back rounded-3xl border flex flex-col p-8"
            style={{ background: '#FFF5F6', borderColor: '#C8102E' }}
          >
            <p className="text-xs font-medium mb-3" style={{ color: '#C8102E' }}>Nghĩa</p>
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-3xl font-bold mb-1" style={{ color: '#1A1A2E' }}>
                {current.meaning_vi}
              </div>
              {current.meaning_en && (
                <p className="text-sm mb-4" style={{ color: '#6B6B7E' }}>{current.meaning_en}</p>
              )}
              {current.example_jp && (
                <div
                  className="p-3 rounded-xl text-sm"
                  style={{ background: '#FFFFFF', borderLeft: '3px solid #FFB7C5' }}
                >
                  <p style={{ color: '#1A1A2E' }}>{current.example_jp}</p>
                  {current.example_vi && (
                    <p className="text-xs mt-1" style={{ color: '#6B6B7E' }}>{current.example_vi}</p>
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
            className="flex-1 py-3 rounded-2xl font-bold text-lg border-2 transition-all hover:scale-105"
            style={{ borderColor: '#FECDD3', color: '#C8102E', background: '#FFF5F6' }}
          >
            ✗ Sai
          </button>
          <button
            onClick={() => handleResult(true)}
            className="flex-1 py-3 rounded-2xl font-bold text-lg border-2 transition-all hover:scale-105"
            style={{ borderColor: '#A7F3D0', color: '#059669', background: '#F0FDF4' }}
          >
            ✓ Đúng
          </button>
        </div>
      ) : (
        <button
          onClick={flip}
          className="w-full py-3 rounded-2xl font-medium text-white"
          style={{ background: '#C8102E' }}
        >
          Lật thẻ xem đáp án
        </button>
      )}
    </div>
  )
}
