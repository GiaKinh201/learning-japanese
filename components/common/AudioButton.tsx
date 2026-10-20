'use client'

import { useState, useCallback, useEffect } from 'react'
import { Volume2 } from 'lucide-react'
import { playJapaneseAudio, stopJapaneseAudio } from '@/lib/tts'

interface AudioButtonProps {
  text: string
  title?: string
  size?: number
  className?: string
  rate?: number
  label?: string
}

export default function AudioButton({
  text,
  title = 'Nghe phát âm',
  size = 18,
  className = '',
  rate = 0.85,
  label,
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Dọn dẹp âm thanh khi component unmount
  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopJapaneseAudio()
      }
    }
  }, [isPlaying])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (isPlaying) {
        stopJapaneseAudio()
        setIsPlaying(false)
        return
      }

      setIsPlaying(true)
      const ok = playJapaneseAudio(text, {
        rate,
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      })

      if (!ok) {
        setIsPlaying(false)
      }
    },
    [text, rate, isPlaying]
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      aria-label={title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
        isPlaying
          ? 'bg-[#FFE4E8] text-[#C8102E] ring-2 ring-[#C8102E]/40 scale-105'
          : 'bg-[#FFF5F6] text-[#C8102E] hover:bg-[#FFE4E8] hover:scale-105 active:scale-95'
      } ${className}`}
    >
      {isPlaying ? (
        <Volume2 size={size} className="animate-pulse" />
      ) : (
        <Volume2 size={size} />
      )}
      {label && <span>{label}</span>}
    </button>
  )
}
