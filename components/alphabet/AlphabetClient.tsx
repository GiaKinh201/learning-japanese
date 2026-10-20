'use client'

import React, { useState } from 'react'
import SakuraIcon from '@/components/common/SakuraIcon'
import { KanaChart } from './KanaChart'
import { KanaFlashcard } from './KanaFlashcard'
import { KanaQuiz } from './KanaQuiz'

type ActiveTab = 'chart' | 'flashcard' | 'quiz'

interface AlphabetClientProps {
  initialTab?: ActiveTab
}

export default function AlphabetClient({ initialTab = 'chart' }: AlphabetClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <SakuraIcon className="w-5 h-5 text-rose-600" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Bảng chữ cái tiếng Nhật
            </h1>
          </div>
          <p className="text-sm text-neutral-600">
            Nền tảng khởi đầu cho người mới: Hiragana & Katakana kèm âm thanh chuẩn bản xứ, flashcard và trắc nghiệm phản xạ.
          </p>
        </div>

        {/* Chuyển tab chế độ học */}
        <div className="flex items-center p-1 bg-neutral-100 rounded-2xl border border-neutral-200/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'chart'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Bảng tra cứu</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'flashcard'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Flashcard</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Trắc nghiệm</span>
          </button>
        </div>
      </div>

      {/* Nội dung theo từng tab */}
      {activeTab === 'chart' && <KanaChart />}
      {activeTab === 'flashcard' && <KanaFlashcard />}
      {activeTab === 'quiz' && <KanaQuiz />}
    </div>
  )
}
