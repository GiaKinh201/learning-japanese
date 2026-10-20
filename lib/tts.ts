/**
 * Utility phát âm tiếng Nhật sử dụng Web Speech API của trình duyệt.
 * Hoàn toàn miễn phí, 0ms latency, không tốn quota server.
 */

let currentUtterance: SpeechSynthesisUtterance | null = null

export function playJapaneseAudio(
  text: string,
  options?: {
    rate?: number
    onStart?: () => void
    onEnd?: () => void
    onError?: () => void
  }
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false
  }

  try {
    // Huỷ bỏ âm thanh đang phát trước đó để tránh nói đè lên nhau
    window.speechSynthesis.cancel()

    const cleanText = text.trim()
    if (!cleanText) return false

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'ja-JP'
    // Tốc độ 0.85 vừa vặn cho người mới học nghe rõ từng âm tiết
    utterance.rate = options?.rate ?? 0.85
    utterance.pitch = 1.0

    // Cố gắng chọn voice tiếng Nhật chuẩn nếu có trong hệ điều hành
    const voices = window.speechSynthesis.getVoices?.() || []
    const jaVoice = voices.find((v) => v.lang === 'ja-JP' || v.lang.startsWith('ja'))
    if (jaVoice) {
      utterance.voice = jaVoice
    }

    utterance.onstart = () => {
      options?.onStart?.()
    }

    utterance.onend = () => {
      currentUtterance = null
      options?.onEnd?.()
    }

    utterance.onerror = () => {
      currentUtterance = null
      options?.onError?.()
    }

    currentUtterance = utterance
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}

export function stopJapaneseAudio() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (currentUtterance) {
      currentUtterance.onend = null
      currentUtterance.onerror = null
      currentUtterance = null
    }
    window.speechSynthesis.cancel()
  }
}
