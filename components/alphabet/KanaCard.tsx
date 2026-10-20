'use client'

import React, { useState } from 'react'
import { KanaCharacter } from '@/lib/kana-data'
import { playJapaneseAudio } from '@/lib/tts'

interface KanaCardProps {
  character: KanaCharacter
  scriptType: 'hiragana' | 'katakana'
  onSelect: (char: KanaCharacter) => void
  isMastered?: boolean
}

export function KanaCard({ character, scriptType, onSelect, isMastered }: KanaCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const displayChar = scriptType === 'hiragana' ? character.hiragana : character.katakana

  function handlePlayAudio(e: React.MouseEvent) {
    e.stopPropagation()
    setIsPlaying(true)
    playJapaneseAudio(displayChar, {
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    })
  }

  return (
    <div
      onClick={() => onSelect(character)}
      className={`group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        isMastered
          ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300 hover:shadow-md'
          : 'bg-white border-neutral-200 hover:border-rose-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Huy hiệu đã thuộc */}
      {isMastered && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" title="Đã thuộc" />
      )}

      {/* Chữ Kana lớn */}
      <span className="text-3xl sm:text-4xl font-bold text-neutral-800 group-hover:text-rose-600 transition-colors my-1">
        {displayChar}
      </span>

      {/* Romaji */}
      <span className="text-xs sm:text-sm font-medium text-neutral-500 tracking-wider">
        {character.romaji}
      </span>

      {/* Nút phát âm thanh nhanh */}
      <button
        type="button"
        onClick={handlePlayAudio}
        aria-label={`Nghe phát âm ${displayChar}`}
        className={`mt-2 p-1.5 rounded-full transition-all ${
          isPlaying
            ? 'bg-rose-100 text-rose-600 scale-110 ring-2 ring-rose-400'
            : 'text-neutral-400 hover:text-rose-600 hover:bg-rose-50'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      </button>
    </div>
  )
}
