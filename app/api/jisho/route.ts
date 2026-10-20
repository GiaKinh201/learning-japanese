import { searchJisho } from '@/lib/jisho'

// Simple heuristic: contains Vietnamese diacritics → Vietnamese
function isVietnamese(text: string): boolean {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)
}

// Contains Japanese characters (hiragana/katakana/kanji)
function isJapanese(text: string): boolean {
  return /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)
}

// Translate Vietnamese → Japanese using Google Translate (primary) and MyMemory (fallback)
async function translateViToJa(text: string): Promise<string> {
  try {
    // Ưu tiên 1: Google Translate (luôn dịch ra từ cơ bản N5 chuẩn: "nhà" -> "家", "ăn" -> "食べる")
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=ja&dt=t&q=${encodeURIComponent(text)}`
    const gRes = await fetch(gUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      signal: AbortSignal.timeout(4000),
    })
    if (gRes.ok) {
      const gData = await gRes.json()
      const translated = gData?.[0]?.[0]?.[0]
      if (translated && isJapanese(translated)) {
        return translated.trim()
      }
    }
  } catch {
    // Tiếp tục thử fallback MyMemory bên dưới
  }

  try {
    // Dự phòng 2: MyMemory
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=vi|ja`,
      { signal: AbortSignal.timeout(4000) }
    )
    if (res.ok) {
      const json = await res.json()
      const translated: string = json?.responseData?.translatedText ?? ''
      if (translated && isJapanese(translated)) {
        return translated.trim()
      }
      const matches: Array<{ translation: string; match: number }> = json?.matches ?? []
      for (const m of matches) {
        if (isJapanese(m.translation)) return m.translation.trim()
      }
    }
  } catch {
    // Fallback
  }

  return text
}

// Translate Vietnamese → English using Google Translate (primary) and MyMemory (fallback)
async function translateViToEn(text: string): Promise<string> {
  try {
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text)}`
    const gRes = await fetch(gUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      signal: AbortSignal.timeout(4000),
    })
    if (gRes.ok) {
      const gData = await gRes.json()
      const translated = gData?.[0]?.[0]?.[0]
      if (translated && translated.toLowerCase() !== text.toLowerCase()) {
        return translated.trim()
      }
    }
  } catch {
    // Fallback
  }

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=vi|en`,
      { signal: AbortSignal.timeout(4000) }
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
