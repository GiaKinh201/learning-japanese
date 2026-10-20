'use client'

import React, { useState, useEffect } from 'react'
import {
  SEION_CHARACTERS,
  DAKUON_CHARACTERS,
  YOON_CHARACTERS,
  SPECIAL_RULES,
  KanaCharacter,
} from '@/lib/kana-data'
import { KanaCard } from './KanaCard'
import { KanaDetailModal } from './KanaDetailModal'
import { playJapaneseAudio } from '@/lib/tts'

type ScriptType = 'hiragana' | 'katakana'
type SectionType = 'seion' | 'dakuon' | 'yoon' | 'rules'

export function KanaChart() {
  const [scriptType, setScriptType] = useState<ScriptType>('hiragana')
  const [section, setSection] = useState<SectionType>('seion')
  const [selectedChar, setSelectedChar] = useState<KanaCharacter | null>(null)
  const [masteredIds, setMasteredIds] = useState<string[]>([])

  // Đọc danh sách chữ đã thuộc từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kana_mastered_ids')
      if (saved) {
        setMasteredIds(JSON.parse(saved))
      }
    } catch {
      // Ignore localStorage error
    }
  }, [])

  // Đánh dấu thuộc / chưa thuộc
  function handleToggleMastered(id: string) {
    setMasteredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      try {
        localStorage.setItem('kana_mastered_ids', JSON.stringify(next))
      } catch {
        // Ignore localStorage error
      }
      return next
    })
  }

  // Lấy danh sách ký tự hiện tại để tính tiến độ
  const currentChars =
    section === 'seion'
      ? SEION_CHARACTERS
      : section === 'dakuon'
      ? DAKUON_CHARACTERS
      : section === 'yoon'
      ? YOON_CHARACTERS
      : []

  const masteredCount = currentChars.filter((c) => masteredIds.includes(c.id)).length
  const progressPercent = currentChars.length > 0 ? Math.round((masteredCount / currentChars.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Thanh điều khiển chính */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm">
        {/* Chọn bảng Hiragana hoặc Katakana */}
        <div className="flex items-center p-1 bg-neutral-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setScriptType('hiragana')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              scriptType === 'hiragana'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Hiragana (Chữ mềm)
          </button>
          <button
            onClick={() => setScriptType('katakana')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              scriptType === 'katakana'
                ? 'bg-white text-neutral-900 shadow-sm font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Katakana (Chữ cứng)
          </button>
        </div>

        {/* Thanh tiến độ thuộc */}
        {section !== 'rules' && (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-right">
              <span className="text-xs text-neutral-500">Đã thuộc</span>
              <p className="text-sm font-bold text-neutral-800">
                {masteredCount} / {currentChars.length} ({progressPercent}%)
              </p>
            </div>
            <div className="w-24 h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs phân loại nhóm âm */}
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 border-b border-neutral-200">
        <button
          onClick={() => setSection('seion')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            section === 'seion'
              ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          Cơ bản (46 âm)
        </button>
        <button
          onClick={() => setSection('dakuon')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            section === 'dakuon'
              ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          Âm đục & Bán đục (25 âm)
        </button>
        <button
          onClick={() => setSection('yoon')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            section === 'yoon'
              ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          Âm ghép (36 âm)
        </button>
        <button
          onClick={() => setSection('rules')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            section === 'rules'
              ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          Quy tắc ngữ âm đặc biệt
        </button>
      </div>

      {/* Hướng dẫn tương tác ngắn */}
      {section !== 'rules' && (
        <p className="text-xs text-neutral-400 italic">
          💡 Mẹo: Bấm vào biểu tượng loa để nghe phát âm, hoặc bấm vào thẻ chữ để xem chi tiết ví dụ từ vựng Nhật - Việt.
        </p>
      )}

      {/* Bố cục lưới cho nhóm Cơ bản (Seion) và Âm đục (Dakuon) */}
      {(section === 'seion' || section === 'dakuon') && (
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {/* Header 5 nguyên âm a, i, u, e, o */}
          {['a', 'i', 'u', 'e', 'o'].map((vowel) => (
            <div
              key={vowel}
              className="py-1.5 text-center text-xs font-bold uppercase tracking-widest text-neutral-400 bg-neutral-100 rounded-lg"
            >
              {vowel}
            </div>
          ))}

          {/* Lưới các ký tự */}
          {currentChars.map((char) => (
            <KanaCard
              key={char.id}
              character={char}
              scriptType={scriptType}
              onSelect={setSelectedChar}
              isMastered={masteredIds.includes(char.id)}
            />
          ))}
        </div>
      )}

      {/* Bố cục lưới cho Âm ghép (Yōon - 3 cột ya, yu, yo) */}
      {section === 'yoon' && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
            {['ya', 'yu', 'yo'].map((header) => (
              <div
                key={header}
                className="py-1.5 text-center text-xs font-bold uppercase tracking-widest text-neutral-400 bg-neutral-100 rounded-lg"
              >
                -{header}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
            {YOON_CHARACTERS.map((char) => (
              <KanaCard
                key={char.id}
                character={char}
                scriptType={scriptType}
                onSelect={setSelectedChar}
                isMastered={masteredIds.includes(char.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quy tắc ngữ âm đặc biệt */}
      {section === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SPECIAL_RULES.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase text-rose-600 tracking-wider">
                    {rule.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{rule.title}</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{rule.description}</p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                  Ví dụ minh họa:
                </span>
                {rule.examples.map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-200/50 last:border-none">
                    <div>
                      <span className="font-bold text-neutral-800 text-sm">{ex.jp}</span>
                      <span className="text-neutral-500 ml-1.5 font-mono">({ex.reading})</span>
                      <p className="text-rose-700 font-medium">{ex.meaning} — <span className="text-neutral-400 font-normal">{ex.note}</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => playJapaneseAudio(ex.jp)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                      title="Nghe phát âm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết chữ */}
      <KanaDetailModal
        character={selectedChar}
        onClose={() => setSelectedChar(null)}
        isMastered={selectedChar ? masteredIds.includes(selectedChar.id) : false}
        onToggleMastered={handleToggleMastered}
      />
    </div>
  )
}
