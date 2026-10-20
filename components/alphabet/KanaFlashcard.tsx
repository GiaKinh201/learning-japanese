'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  SEION_CHARACTERS,
  DAKUON_CHARACTERS,
  YOON_CHARACTERS,
  KanaCharacter,
} from '@/lib/kana-data'
import { playJapaneseAudio } from '@/lib/tts'

type ScriptType = 'hiragana' | 'katakana' | 'both'
type CategoryType = 'seion' | 'dakuon' | 'yoon' | 'all'

export function KanaFlashcard() {
  const [scriptType, setScriptType] = useState<ScriptType>('hiragana')
  const [category, setCategory] = useState<CategoryType>('seion')
  const [unmasteredOnly, setUnmasteredOnly] = useState(false)
  const [masteredIds, setMasteredIds] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [shuffledList, setShuffledList] = useState<KanaCharacter[]>(() => [...SEION_CHARACTERS])

  // Load mastered state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kana_mastered_ids')
      if (saved) setMasteredIds(JSON.parse(saved))
    } catch {
      // Ignore
    }
  }, [])

  // Filter pool
  const pool = useMemo(() => {
    let list: KanaCharacter[] = []
    if (category === 'seion') list = [...SEION_CHARACTERS]
    else if (category === 'dakuon') list = [...DAKUON_CHARACTERS]
    else if (category === 'yoon') list = [...YOON_CHARACTERS]
    else list = [...SEION_CHARACTERS, ...DAKUON_CHARACTERS, ...YOON_CHARACTERS]

    if (unmasteredOnly) {
      list = list.filter((c) => !masteredIds.includes(c.id))
    }
    return list
  }, [category, unmasteredOnly, masteredIds])

  // Reset shuffled list when pool changes
  const resetCards = useCallback((sourceList: KanaCharacter[]) => {
    const copy = [...sourceList].sort(() => Math.random() - 0.5)
    setShuffledList(copy)
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [])

  useEffect(() => {
    resetCards(pool)
  }, [pool, resetCards])

  const activeList = shuffledList.length > 0 ? shuffledList : pool
  const currentChar = activeList[currentIndex] || activeList[0]

  // Decide display character based on scriptType
  const displayChar = useMemo(() => {
    if (!currentChar) return ''
    if (scriptType === 'hiragana') return currentChar.hiragana
    if (scriptType === 'katakana') return currentChar.katakana
    // 'both': alternate randomly or show hiragana
    return currentIndex % 2 === 0 ? currentChar.hiragana : currentChar.katakana
  }, [currentChar, scriptType, currentIndex])

  function handlePlayAudio(e?: React.MouseEvent) {
    e?.stopPropagation()
    if (!displayChar) return
    playJapaneseAudio(displayChar)
  }

  function handleFlip() {
    setIsFlipped((prev) => !prev)
    if (!isFlipped && displayChar) {
      playJapaneseAudio(displayChar)
    }
  }

  function handleNext() {
    if (currentIndex < activeList.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setIsFlipped(false)
    }
  }

  function handleMarkMastered(mastered: boolean) {
    if (!currentChar) return
    const id = currentChar.id
    setMasteredIds((prev) => {
      const next = mastered
        ? prev.includes(id) ? prev : [...prev, id]
        : prev.filter((item) => item !== id)
      try {
        localStorage.setItem('kana_mastered_ids', JSON.stringify(next))
      } catch {
        // Ignore
      }
      return next
    })
    handleNext()
  }

  // Keyboard shortcut listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault()
        handleFlip()
      } else if (e.code === 'ArrowRight') {
        handleNext()
      } else if (e.code === 'ArrowLeft') {
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, activeList.length, isFlipped, displayChar])

  if (pool.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          🎉
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2">Chúc mừng bạn!</h3>
        <p className="text-sm text-neutral-600 mb-6">
          Bạn đã thuộc hết tất cả các chữ cái trong nhóm này rồi.
        </p>
        <button
          onClick={() => setUnmasteredOnly(false)}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
        >
          Ôn tập lại toàn bộ bảng
        </button>
      </div>
    )
  }

  const isCurrentMastered = currentChar ? masteredIds.includes(currentChar.id) : false

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Bộ lọc cài đặt flashcard */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Loại chữ */}
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
              Loại bảng chữ
            </label>
            <select
              value={scriptType}
              onChange={(e) => setScriptType(e.target.value as ScriptType)}
              className="w-full text-sm font-medium border border-neutral-200 rounded-xl p-2.5 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="hiragana">Hiragana (Chữ mềm)</option>
              <option value="katakana">Katakana (Chữ cứng)</option>
              <option value="both">Xen kẽ cả hai bảng</option>
            </select>
          </div>

          {/* Nhóm âm */}
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
              Nhóm âm
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full text-sm font-medium border border-neutral-200 rounded-xl p-2.5 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="seion">Cơ bản (46 âm)</option>
              <option value="dakuon">Âm đục & Bán đục (25 âm)</option>
              <option value="yoon">Âm ghép (36 âm)</option>
              <option value="all">Toàn bộ tất cả các âm</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-neutral-700 font-medium select-none">
            <input
              type="checkbox"
              checked={unmasteredOnly}
              onChange={(e) => setUnmasteredOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 border-neutral-300"
            />
            <span>Chỉ luyện các chữ chưa thuộc</span>
          </label>

          <button
            onClick={() => resetCards(pool)}
            className="text-neutral-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Xáo trộn thẻ</span>
          </button>
        </div>
      </div>

      {/* Tiến độ số thẻ */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1 font-medium">
        <span>Thẻ {currentIndex + 1} / {activeList.length}</span>
        <span>Phím tắt: [Space] Lật thẻ • [←/→] Qua lại</span>
      </div>

      {/* Thẻ Flashcard 3D */}
      <div
        onClick={handleFlip}
        className="card-scene w-full cursor-pointer select-none group"
        style={{ height: '370px' }}
      >
        <div
          key={currentIndex}
          className={`card-inner rounded-3xl shadow-xl border border-neutral-200/80 bg-white ${
            isFlipped ? 'flipped' : ''
          }`}
        >
          {/* MẶT TRƯỚC (Kana) */}
          <div className="card-front rounded-3xl flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-white to-rose-50/30">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                {scriptType === 'katakana' ? 'Katakana' : 'Hiragana'}
              </span>
              {isCurrentMastered && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-100">
                  ✓ Đã thuộc
                </span>
              )}
            </div>

            <div className="my-auto flex flex-col items-center">
              <span className="text-7xl sm:text-8xl font-black text-neutral-900 group-hover:scale-105 transition-transform duration-300">
                {displayChar}
              </span>
              <button
                type="button"
                onClick={handlePlayAudio}
                className="mt-4 p-3 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-sm cursor-pointer"
                title="Nghe phát âm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-medium animate-pulse">
              Bấm để lật xem cách đọc & ví dụ
            </p>
          </div>

          {/* MẶT SAU (Romaji + Ví dụ tiếng Việt) */}
          <div className="card-back rounded-3xl flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-white to-[#FFF5F6] border border-[#F5D0D5]">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C8102E] bg-[#FFE4E8] px-2.5 py-1 rounded-full border border-[#F5D0D5]">
                Phiên âm & Ví dụ
              </span>
              <span className="text-lg font-bold text-neutral-400">
                {currentChar?.hiragana} / {currentChar?.katakana}
              </span>
            </div>

            <div className="my-auto flex flex-col items-center text-center space-y-3">
              <span className="text-5xl font-black text-[#1A1A2E] tracking-wider font-mono">
                /{currentChar?.romaji}/
              </span>

              {currentChar?.example && (
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-[#F5D0D5] shadow-xs max-w-xs">
                  <div className="flex items-center justify-center gap-1.5 text-base font-bold text-neutral-800">
                    <span>{currentChar.example.wordJp}</span>
                    <span className="text-neutral-500 font-normal">({currentChar.example.reading})</span>
                  </div>
                  <p className="text-sm font-semibold text-[#C8102E] mt-1">
                    {currentChar.example.meaningVi}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-400 font-medium">
              Bấm để lật lại mặt chữ
            </p>
          </div>
        </div>
      </div>

      {/* Các nút hành động */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleMarkMastered(false)}
          className="flex-1 py-3 px-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Chưa nhớ</span>
        </button>

        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 transition-colors shadow-sm"
          title="Thẻ trước"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex >= activeList.length - 1}
          className="p-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 transition-colors shadow-sm"
          title="Thẻ tiếp theo"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => handleMarkMastered(true)}
          className="flex-1 py-3 px-4 rounded-xl border border-emerald-200 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span>✓ Đã thuộc</span>
        </button>
      </div>
    </div>
  )
}
