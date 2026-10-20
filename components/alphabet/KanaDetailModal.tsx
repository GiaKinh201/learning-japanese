'use client'

import React, { useState } from 'react'
import { KanaCharacter } from '@/lib/kana-data'
import { playJapaneseAudio } from '@/lib/tts'

interface KanaDetailModalProps {
  character: KanaCharacter | null
  onClose: () => void
  isMastered: boolean
  onToggleMastered: (id: string) => void
}

export function KanaDetailModal({
  character,
  onClose,
  isMastered,
  onToggleMastered,
}: KanaDetailModalProps) {
  const [isPlayingChar, setIsPlayingChar] = useState(false)
  const [isPlayingWord, setIsPlayingWord] = useState(false)

  if (!character) return null

  function handlePlayChar() {
    if (!character) return
    setIsPlayingChar(true)
    playJapaneseAudio(character.hiragana, {
      onEnd: () => setIsPlayingChar(false),
      onError: () => setIsPlayingChar(false),
    })
  }

  function handlePlayWord() {
    if (!character?.example) return
    setIsPlayingWord(true)
    playJapaneseAudio(character.example.wordJp, {
      onEnd: () => setIsPlayingWord(false),
      onError: () => setIsPlayingWord(false),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-100 p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Đóng cửa sổ"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* So sánh Hiragana & Katakana */}
        <div className="flex items-center justify-center gap-8 my-4">
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-semibold text-rose-500 tracking-wider mb-1">
              Hiragana
            </span>
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-rose-50 text-rose-700 rounded-2xl text-5xl font-bold border border-rose-100 shadow-inner">
              {character.hiragana}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-semibold text-neutral-600 tracking-wider mb-1">
              Katakana
            </span>
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-neutral-100 text-neutral-800 rounded-2xl text-5xl font-bold border border-neutral-200 shadow-inner">
              {character.katakana}
            </div>
          </div>
        </div>

        {/* Romaji & Nút nghe phát âm */}
        <div className="flex items-center justify-center gap-3 my-4">
          <span className="text-2xl font-bold text-neutral-800 tracking-wider">
            /{character.romaji}/
          </span>
          <button
            onClick={handlePlayChar}
            disabled={isPlayingChar}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isPlayingChar
                ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-400'
                : 'bg-neutral-100 text-neutral-700 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            <span>Nghe đọc</span>
          </button>
        </div>

        {/* Từ vựng ví dụ minh họa bằng tiếng Việt */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 my-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">
              Ví dụ từ vựng
            </span>
            <button
              onClick={handlePlayWord}
              disabled={isPlayingWord}
              className={`p-1 rounded-md transition-colors ${
                isPlayingWord ? 'text-rose-600' : 'text-neutral-400 hover:text-rose-600'
              }`}
              title="Nghe phát âm từ ví dụ"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-neutral-900">{character.example.wordJp}</span>
            <span className="text-sm text-neutral-500">({character.example.reading})</span>
            <span className="text-xs text-neutral-400 font-mono">[{character.example.romaji}]</span>
          </div>
          <p className="text-sm font-medium text-rose-700 mt-1">
            👉 Nghĩa tiếng Việt: {character.example.meaningVi}
          </p>
        </div>

        {/* Nút đánh dấu đã thuộc */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <button
            onClick={() => onToggleMastered(character.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isMastered
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {isMastered ? (
              <>
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Đã ghi nhớ chữ này</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>Đánh dấu đã thuộc</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
