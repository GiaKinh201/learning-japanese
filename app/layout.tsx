import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://learning-japanese-one.vercel.app'),
  title: {
    default: 'Học tiếng Nhật cùng nhau | Nihongo Flashcards & AI',
    template: '%s | Học tiếng Nhật',
  },
  description:
    'Ứng dụng học từ vựng tiếng Nhật thông minh cho nhóm bạn bè. Tra cứu Jisho, trợ lý Gemini AI tạo câu ví dụ thực tế và thẻ học 3D Active Recall kèm phát âm chuẩn bản xứ.',
  keywords: [
    'học tiếng nhật',
    'tiếng nhật flashcard',
    'từ điển jisho',
    'học từ vựng tiếng nhật',
    'nihongo',
    'gemini ai tiếng nhật',
  ],
  openGraph: {
    title: 'Học tiếng Nhật cùng nhau · Nihongo Flashcards & AI',
    description:
      'Học từ vựng tiếng Nhật mỗi ngày với từ điển Jisho thông minh, trợ lý Gemini AI tạo câu ví dụ và thẻ học 3D Active Recall.',
    url: 'https://learning-japanese-one.vercel.app',
    siteName: 'Học tiếng Nhật cùng nhau',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Học tiếng Nhật cùng nhau · Nihongo Flashcards & AI',
    description:
      'Học từ vựng tiếng Nhật mỗi ngày với từ điển Jisho thông minh, trợ lý Gemini AI và thẻ học 3D Active Recall.',
  },
  applicationName: 'Học tiếng Nhật cùng nhau',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Học tiếng Nhật',
  },
}

export const viewport = {
  themeColor: '#C8102E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" className={`${notoSansJP.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ background: 'var(--jp-background)', color: 'var(--jp-ink)' }}>
        {children}
      </body>
    </html>
  )
}
