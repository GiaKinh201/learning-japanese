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
  title: 'Học tiếng Nhật cùng nhau',
  description: 'Website học tiếng Nhật cho nhóm bạn bè',
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
