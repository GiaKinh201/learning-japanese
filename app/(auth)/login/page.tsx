'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #FFFAF9 0%, #FFF0F3 60%, #FFE4E8 100%)' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-10 shadow-xl text-center"
        style={{ background: '#FFFFFF', border: '1px solid #E8D5D8' }}
      >
        {/* Logo / Icon */}
        <div className="mb-2 text-6xl">🌸</div>
        <div className="text-3xl font-bold mb-1" style={{ color: '#C8102E' }}>
          日本語
        </div>
        <h1 className="text-xl font-bold mb-1" style={{ color: '#1A1A2E' }}>
          Học tiếng Nhật cùng nhau
        </h1>
        <p className="text-sm mb-8" style={{ color: '#6B6B7E' }}>
          Đăng nhập để bắt đầu học
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-medium transition-all hover:shadow-md hover:-translate-y-0.5 border"
          style={{
            background: '#FFFFFF',
            borderColor: '#E8D5D8',
            color: '#1A1A2E',
          }}
        >
          {/* Google Icon */}
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.4 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z" fill="#4285F4"/>
            <path d="M24 48c6.5 0 12-2.2 15.9-5.9l-7.9-6c-2.2 1.5-5 2.4-8 2.4-6.1 0-11.3-4.1-13.2-9.7H2.7v6.1C6.6 42.6 14.8 48 24 48z" fill="#34A853"/>
            <path d="M10.8 28.8A14.5 14.5 0 0 1 10 24c0-1.7.3-3.3.8-4.8v-6.1H2.7A24 24 0 0 0 0 24c0 3.9.9 7.6 2.7 10.9l8.1-6.1z" fill="#FBBC04"/>
            <path d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.9 2.2 30.4 0 24 0 14.8 0 6.6 5.4 2.7 13.1l8.1 6.1c1.9-5.6 7.1-9.7 13.2-9.7z" fill="#E94235"/>
          </svg>
          Đăng nhập với Google
        </button>

        <p className="text-xs mt-6" style={{ color: '#6B6B7E' }}>
          Bất kỳ ai cũng có thể đăng ký và học cùng nhóm 🎌
        </p>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="mt-6 text-sm hover:underline"
        style={{ color: '#6B6B7E' }}
      >
        ← Về trang chủ
      </Link>
    </main>
  )
}
