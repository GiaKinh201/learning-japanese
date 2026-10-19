import { searchJisho } from '@/lib/jisho'

// Simple heuristic: contains Vietnamese diacritics → Vietnamese
function isVietnamese(text: string): boolean {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)
}

// Contains Japanese characters (hiragana/katakana/kanji)
function isJapanese(text: string): boolean {
  return /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)
}

// Translate Vietnamese → Japanese using MyMemory, then extract best Japanese word
async function translateViToJa(text: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=vi|ja`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return text
    const json = await res.json()
    const translated: string = json?.responseData?.translatedText ?? ''
    // MyMemory sometimes returns romaji or garbage; only use if it has Japanese chars
    if (translated && isJapanese(translated)) {
      return translated.trim()
    }
    // Try matches array for better result
    const matches: Array<{ translation: string; match: number }> = json?.matches ?? []
    for (const m of matches) {
      if (isJapanese(m.translation)) return m.translation.trim()
    }
    return text // fallback: search as-is
  } catch {
    return text
  }
}

// Translate Vietnamese → English using MyMemory (fallback)
async function translateViToEn(text: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=vi|en`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return text
    const json = await res.json()
    const translated = json?.responseData?.translatedText
    return translated && translated.toLowerCase() !== text.toLowerCase() ? translated : text
  } catch {
    return text
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword')

  if (!keyword?.trim()) {
    return Response.json({ error: 'Missing keyword' }, { status: 400 })
  }

  try {
    const raw = keyword.trim()

    if (isVietnamese(raw)) {
      // Strategy 1: translate VI → JA then search Jisho (best for VI input)
      const jaQuery = await translateViToJa(raw)
      if (jaQuery !== raw) {
        const results = await searchJisho(jaQuery)
        if (results.length > 0) return Response.json(results)
      }
      // Strategy 2: translate VI → EN then search Jisho (fallback)
      const enQuery = await translateViToEn(raw)
      const results = await searchJisho(enQuery !== raw ? enQuery : raw)
      return Response.json(results)
    }

    // Japanese or English: search directly
    const results = await searchJisho(raw)
    return Response.json(results)
  } catch {
    return Response.json({ error: 'Failed to fetch from Jisho' }, { status: 500 })
  }
}
