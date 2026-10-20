import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: Request) {
  // Chỉ cho phép hoạt động ở môi trường development
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 })
  }

  const { searchParams, origin } = new URL(request.url)
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const redirectResponse = NextResponse.redirect(new URL(redirectTo, origin))

  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
            redirectResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Chưa cấu hình TEST_USER_EMAIL hoặc TEST_USER_PASSWORD' },
      { status: 500 }
    )
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message || 'Không thể đăng nhập tài khoản test' },
      { status: 500 }
    )
  }

  return redirectResponse
}
