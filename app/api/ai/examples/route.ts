import { NextResponse } from 'next/server'

interface ExampleItem {
  sentence_jp: string
  reading: string
  meaning_vi: string
}

interface ApiResponse {
  word_meaning_vi: string
  examples: ExampleItem[]
  level: string
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chưa cấu hình GEMINI_API_KEY trong file .env.local' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const { word, reading, meaning, jlpt } = body

    if (!word?.trim()) {
      return NextResponse.json({ error: 'Thiếu từ vựng cần tạo câu ví dụ' }, { status: 400 })
    }

    const targetLevel = jlpt ? jlpt.toUpperCase() : ''

    const prompt = `Bạn là giáo viên tiếng Nhật chuyên dạy học viên người Việt Nam.
Hãy xử lý từ vựng tiếng Nhật sau:
- Từ vựng: "${word}"
- Cách đọc (Hiragana/Furigana): "${reading || word}"
- Nghĩa gốc tiếng Anh từ Jisho: "${meaning || ''}"
${targetLevel ? `- Cấp độ JLPT: "${targetLevel}"` : ''}

YÊU CẦU:
1. "word_meaning_vi": Dịch nghĩa từ vựng sang tiếng Việt chuẩn xác, súc tích, tự nhiên và sát với ngữ cảnh thực tế của người Việt (1-3 từ, ví dụ "ngôi nhà", "ăn uống", "bạn bè"). Ưu tiên nghĩa thông dụng nhất trong đời sống hằng ngày. Tuyệt đối KHÔNG chứa tiếng Anh.
2. "examples": Tạo đúng 2 câu ví dụ ngắn gọn (khoảng 10-18 chữ), tự nhiên, chuẩn ngữ pháp tiếng Nhật ${targetLevel ? `cấp độ ${targetLevel}` : ''}:
   - sentence_jp: câu ngắn gọn tiếng Nhật chuẩn Kanji
   - reading: cách đọc toàn bộ câu bằng Hiragana có khoảng trắng phân tách từ/trợ từ
   - meaning_vi: dịch nghĩa tiếng Việt tự nhiên của câu ví dụ`

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            word_meaning_vi: { type: 'STRING' },
            examples: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  sentence_jp: { type: 'STRING' },
                  reading: { type: 'STRING' },
                  meaning_vi: { type: 'STRING' },
                },
                required: ['sentence_jp', 'reading', 'meaning_vi'],
              },
            },
          },
          required: ['word_meaning_vi', 'examples'],
        },
      },
    }

    // Danh sách model ưu tiên theo tốc độ và độ sẵn sàng cao
    const models = [
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3-flash-preview',
      'gemini-flash-latest',
      'gemini-3.8-flash',
    ]
    let data = null
    let lastStatus = 0

    for (const model of models) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000),
          }
        )

        if (res.ok) {
          data = await res.json()
          break
        } else {
          lastStatus = res.status
          if (res.status === 503 || res.status === 429) {
            await new Promise((r) => setTimeout(r, 300))
          }
        }
      } catch {
        // Timeout hoặc lỗi mạng, thử model tiếp theo
      }
    }

    if (!data) {
      const isOverloaded = lastStatus === 503 || lastStatus === 429
      const userMessage = isOverloaded
        ? 'Dịch vụ AI của Google tạm thời quá tải. Bạn có thể tự nhập nghĩa hoặc bấm "Thử lại".'
        : 'Không thể kết nối đến dịch vụ AI. Bạn có thể tự nhập nghĩa tiếng Việt thủ công.'
      return NextResponse.json({ error: userMessage }, { status: 503 })
    }

    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!candidateText) {
      return NextResponse.json({ error: 'AI không trả về kết quả hợp lệ' }, { status: 500 })
    }

    const parsed = JSON.parse(candidateText)
    const responseData: ApiResponse = {
      word_meaning_vi: parsed.word_meaning_vi || '',
      examples: parsed.examples || [],
      level: targetLevel,
    }

    return NextResponse.json(responseData)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ khi tạo câu ví dụ'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
