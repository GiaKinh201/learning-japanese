export interface JishoWord {
  slug: string
  is_common: boolean
  tags: string[]
  jlpt: string[]
  japanese: {
    word?: string
    reading: string
  }[]
  senses: {
    english_definitions: string[]
    parts_of_speech: string[]
    examples?: {
      text: string
      sentences: { text: string; lang: string }[]
    }[]
  }[]
}

export interface JishoResult {
  meta: { status: number }
  data: JishoWord[]
}

export async function searchJisho(keyword: string): Promise<JishoWord[]> {
  const encoded = encodeURIComponent(keyword)
  const res = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${encoded}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; hoc-tieng-nhat/1.0)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    }
  )

  if (!res.ok) return []

  const json: JishoResult = await res.json()
  return json.data?.slice(0, 10) ?? []
}

export function getWordDisplay(word: JishoWord) {
  const firstJp = word.japanese[0]
  return {
    kanji: firstJp?.word ?? firstJp?.reading ?? '',
    reading: firstJp?.reading ?? '',
    meanings: word.senses[0]?.english_definitions ?? [],
    partsOfSpeech: word.senses[0]?.parts_of_speech ?? [],
    jlpt: word.jlpt?.[0]?.replace('jlpt-', '').toUpperCase() ?? '',
  }
}
