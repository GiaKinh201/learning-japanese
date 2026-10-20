'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  SEION_CHARACTERS,
  DAKUON_CHARACTERS,
  YOON_CHARACTERS,
  KanaCharacter,
} from '@/lib/kana-data'
import { playJapaneseAudio } from '@/lib/tts'

type QuestionType = 'kana_to_romaji' | 'romaji_to_kana' | 'audio_to_kana'
type ScriptType = 'hiragana' | 'katakana' | 'both'

interface Question {
  id: string
  character: KanaCharacter
  questionType: QuestionType
  scriptType: 'hiragana' | 'katakana'
  prompt: string
  correctAnswer: string
  options: string[]
}

export function KanaQuiz() {
  const [scriptType, setScriptType] = useState<ScriptType>('hiragana')
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([])

  // Pool of all characters
  const allPool = useMemo(() => {
    return [...SEION_CHARACTERS, ...DAKUON_CHARACTERS, ...YOON_CHARACTERS]
  }, [])

  // Start new quiz
  const startQuiz = useCallback((customPool?: KanaCharacter[]) => {
    const targetPool = customPool && customPool.length >= 4 ? customPool : allPool
    const count = Math.min(questionCount, targetPool.length)
    const shuffled = [...targetPool].sort(() => Math.random() - 0.5).slice(0, count)

    const generatedQuestions: Question[] = shuffled.map((char, index) => {
      // Determine script for this question
      const qScript: 'hiragana' | 'katakana' =
        scriptType === 'both' ? (Math.random() > 0.5 ? 'hiragana' : 'katakana') : scriptType

      // Random question type: 0: kana->romaji, 1: romaji->kana, 2: audio->kana
      const typeRand = Math.random()
      const qType: QuestionType =
        typeRand < 0.35
          ? 'kana_to_romaji'
          : typeRand < 0.7
          ? 'romaji_to_kana'
          : 'audio_to_kana'

      const charKana = qScript === 'hiragana' ? char.hiragana : char.katakana

      let prompt = ''
      let correctAnswer = ''
      let optionPool: string[] = []

      if (qType === 'kana_to_romaji') {
        prompt = charKana
        correctAnswer = char.romaji
        optionPool = targetPool
          .filter((c) => c.romaji !== char.romaji)
          .map((c) => c.romaji)
      } else if (qType === 'romaji_to_kana') {
        prompt = `/${char.romaji}/`
        correctAnswer = charKana
        optionPool = targetPool
          .filter((c) => c.id !== char.id)
          .map((c) => (qScript === 'hiragana' ? c.hiragana : c.katakana))
      } else {
        // audio_to_kana
        prompt = '🔊 Bấm để nghe âm'
        correctAnswer = charKana
        optionPool = targetPool
          .filter((c) => c.id !== char.id)
          .map((c) => (qScript === 'hiragana' ? c.hiragana : c.katakana))
      }

      // Pick 3 wrong unique options
      const uniqueWrong = Array.from(new Set(optionPool))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      const options = [...uniqueWrong, correctAnswer].sort(() => Math.random() - 0.5)

      return {
        id: `q-${index}`,
        character: char,
        questionType: qType,
        scriptType: qScript,
        prompt,
        correctAnswer,
        options,
      }
    })

    setQuestions(generatedQuestions)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setStreak(0)
    setWrongAnswers([])
    setGameState('playing')
  }, [allPool, questionCount, scriptType])

  const currentQ = questions[currentIndex]

  // Play audio automatically on audio questions
  useEffect(() => {
    if (gameState === 'playing' && currentQ?.questionType === 'audio_to_kana') {
      const charKana =
        currentQ.scriptType === 'hiragana' ? currentQ.character.hiragana : currentQ.character.katakana
      playJapaneseAudio(charKana)
    }
  }, [currentIndex, gameState, currentQ])

  function handleSelectOption(option: string) {
    if (isAnswered || !currentQ) return
    setSelectedOption(option)
    setIsAnswered(true)

    const isCorrect = option === currentQ.correctAnswer
    if (isCorrect) {
      setScore((prev) => prev + 10 + streak * 2)
      setStreak((prev) => prev + 1)
      const soundText =
        currentQ.scriptType === 'hiragana' ? currentQ.character.hiragana : currentQ.character.katakana
      playJapaneseAudio(soundText)
    } else {
      setStreak(0)
      setWrongAnswers((prev) => [...prev, currentQ])
    }
  }

  function handleNextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setGameState('finished')
    }
  }

  // MÀN HÌNH BẮT ĐẦU
  if (gameState === 'idle') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🎯
        </div>
        <div>
          <h3 className="text-xl font-black text-neutral-900">Trắc nghiệm phản xạ Kana</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Luyện tập nhận diện mặt chữ, phát âm và cách đọc qua các câu hỏi trắc nghiệm nhanh 4 đáp án.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
              Bảng chữ cái
            </label>
            <select
              value={scriptType}
              onChange={(e) => setScriptType(e.target.value as ScriptType)}
              className="w-full text-sm font-medium border border-neutral-200 rounded-xl p-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="hiragana">Hiragana (Chữ mềm)</option>
              <option value="katakana">Katakana (Chữ cứng)</option>
              <option value="both">Hỗn hợp cả 2 bảng chữ</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
              Số lượng câu hỏi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    questionCount === num
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => startQuiz()}
          className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base transition-all shadow-md shadow-rose-600/20 active:scale-98"
        >
          Bắt đầu luyện tập
        </button>
      </div>
    )
  }

  // MÀN HÌNH TỔNG KẾT
  if (gameState === 'finished') {
    const totalQ = questions.length
    const correctCount = totalQ - wrongAnswers.length
    const percent = Math.round((correctCount / totalQ) * 100)

    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-5xl">{percent >= 80 ? '🏆' : percent >= 50 ? '👏' : '💪'}</span>
          <h3 className="text-2xl font-black text-neutral-900">Hoàn thành bài tập!</h3>
          <p className="text-sm text-neutral-500">
            {percent >= 80
              ? 'Xuất sắc! Phản xạ bảng chữ cái của bạn rất tốt.'
              : percent >= 50
              ? 'Khá lắm! Hãy ôn luyện thêm các chữ bạn đã chọn sai nhé.'
              : 'Đừng nản lòng, hãy xem lại các chữ bên dưới và thử lại.'}
          </p>
        </div>

        {/* Thống kê điểm */}
        <div className="grid grid-cols-3 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-center">
          <div>
            <span className="text-xs text-neutral-400 font-semibold block uppercase">Điểm số</span>
            <span className="text-2xl font-black text-rose-600">{score}</span>
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-semibold block uppercase">Chính xác</span>
            <span className="text-2xl font-black text-neutral-800">{percent}%</span>
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-semibold block uppercase">Đúng / Tổng</span>
            <span className="text-2xl font-black text-emerald-600">
              {correctCount}/{totalQ}
            </span>
          </div>
        </div>

        {/* Danh sách các câu làm sai để ôn lại */}
        {wrongAnswers.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Chữ cần ôn lại ({wrongAnswers.length} chữ):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {wrongAnswers.map((w, idx) => {
                const charKana =
                  w.scriptType === 'hiragana' ? w.character.hiragana : w.character.katakana
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 text-xs"
                  >
                    <div>
                      <span className="text-lg font-bold text-neutral-900 block leading-tight">
                        {charKana}
                      </span>
                      <span className="text-neutral-500 font-mono">/{w.character.romaji}/</span>
                    </div>
                    <button
                      onClick={() => playJapaneseAudio(charKana)}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Nghe lại phát âm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setGameState('idle')}
            className="flex-1 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-sm hover:bg-neutral-50 transition-colors"
          >
            Về màn hình chính
          </button>
          <button
            onClick={() => startQuiz()}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors shadow-sm"
          >
            Chơi lại vòng mới
          </button>
        </div>
      </div>
    )
  }

  // MÀN HÌNH ĐANG LÀM BÀI QUIZ
  const charSound =
    currentQ.scriptType === 'hiragana' ? currentQ.character.hiragana : currentQ.character.katakana

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Thanh trạng thái */}
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
        <div className="flex items-center gap-2">
          <span>Câu {currentIndex + 1} / {questions.length}</span>
          {streak >= 3 && (
            <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold border border-amber-200/80 shadow-xs transition-all">
              🔥 Streak x{streak}
            </span>
          )}
        </div>
        <div className="font-bold text-neutral-800">
          Điểm: <span className="text-rose-600">{score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-600 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Thẻ câu hỏi */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[220px]">
        <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-2">
          {currentQ.questionType === 'kana_to_romaji'
            ? 'Chọn cách đọc Romaji đúng:'
            : currentQ.questionType === 'romaji_to_kana'
            ? 'Chọn chữ cái tương ứng:'
            : 'Nghe âm thanh và chọn chữ đúng:'}
        </span>

        {currentQ.questionType === 'audio_to_kana' ? (
          <button
            onClick={() => playJapaneseAudio(charSound)}
            className="my-3 p-5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 ring-4 ring-rose-100/60 hover:scale-105 transition-all shadow-sm flex items-center justify-center"
            title="Bấm để nghe lại"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        ) : (
          <span className="text-6xl sm:text-7xl font-black text-neutral-900 my-2">
            {currentQ.prompt}
          </span>
        )}
      </div>

      {/* 4 đáp án lựa chọn */}
      <div className="grid grid-cols-2 gap-3">
        {currentQ.options.map((option, idx) => {
          let btnStyle = 'bg-white border-neutral-200 hover:border-rose-400 text-neutral-800'
          if (isAnswered) {
            if (option === currentQ.correctAnswer) {
              btnStyle = 'bg-emerald-500 border-emerald-500 text-white font-bold ring-2 ring-emerald-300'
            } else if (option === selectedOption) {
              btnStyle = 'bg-rose-500 border-rose-500 text-white font-bold ring-2 ring-rose-300'
            } else {
              btnStyle = 'bg-neutral-100 border-neutral-200 text-neutral-400 opacity-60'
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelectOption(option)}
              className={`p-4 rounded-2xl border text-xl font-bold transition-all shadow-sm flex items-center justify-center min-h-[64px] active:scale-98 ${btnStyle}`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* Nút Tiếp tục */}
      {isAnswered && (
        <button
          onClick={handleNextQuestion}
          className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 animate-in fade-in"
        >
          <span>
            {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
          </span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      )}
    </div>
  )
}
