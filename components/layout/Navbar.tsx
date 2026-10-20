'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { BookOpen, LayoutDashboard, LogOut, User, GraduationCap } from 'lucide-react'

interface NavbarProps {
  profile: Profile | null
}

const navLinks = [
  { href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/vocabulary', label: 'Từ vựng', icon: BookOpen },
]

export default function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: '#FFFFFF', borderColor: '#E8D5D8' }}
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between sm:justify-start gap-2 sm:gap-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-lg shrink-0"
          style={{ color: '#C8102E' }}
        >
          <GraduationCap size={22} />
          <span className="hidden sm:block">日本語</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0"
                style={{
                  background: active ? '#FFE4E8' : 'transparent',
                  color: active ? '#C8102E' : '#6B6B7E',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-2 py-1 rounded-lg text-sm transition-colors hover:bg-[#FFF5F6]"
            style={{ color: '#1A1A2E' }}
          >
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.full_name ?? 'Avatar'}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: '#FFE4E8' }}
              >
                <User size={14} style={{ color: '#C8102E' }} />
              </div>
            )}
            <span className="hidden sm:block max-w-24 truncate text-sm">
              {profile?.full_name?.split(' ').pop() ?? 'Tôi'}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="min-w-[36px] min-h-[36px] p-2 rounded-xl transition-colors hover:bg-[#FFF5F6] flex items-center justify-center cursor-pointer"
            title="Đăng xuất"
            aria-label="Đăng xuất khỏi tài khoản"
            style={{ color: '#6B6B7E' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  )
}
