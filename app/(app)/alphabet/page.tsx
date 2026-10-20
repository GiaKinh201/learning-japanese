import AlphabetClient from '@/components/alphabet/AlphabetClient'

export const metadata = {
  title: 'Bảng chữ cái tiếng Nhật (Hiragana & Katakana) | Học tiếng Nhật',
  description: 'Học bảng chữ cái Hiragana và Katakana với phát âm âm thanh chuẩn bản xứ, flashcard lật thẻ và bài tập trắc nghiệm phản xạ.',
}

export default async function AlphabetPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const validTab = tab === 'flashcard' || tab === 'quiz' ? tab : 'chart'
  return <AlphabetClient initialTab={validTab} />
}
