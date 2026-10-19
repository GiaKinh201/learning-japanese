import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFFAF9 0%, #FFF0F3 50%, #FFE4E8 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-16 right-16 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FFB7C5, transparent)' }} />
        <div className="absolute bottom-16 left-16 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #C8102E, transparent)' }} />

        {/* Japanese character decoration */}
        <div className="mb-6 text-7xl font-bold opacity-10 select-none" style={{ color: '#C8102E' }}>
          日本語
        </div>

        <div className="-mt-8 mb-4 flex items-center gap-3">
          <span className="text-4xl">🌸</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#1A1A2E' }}>
            Học tiếng Nhật
          </h1>
          <span className="text-4xl">🌸</span>
        </div>
        <p className="text-xl font-medium mb-2" style={{ color: '#C8102E' }}>
          cùng nhau
        </p>
        <p className="text-base max-w-md mb-10" style={{ color: '#6B6B7E' }}>
          Xây dựng bộ từ vựng cá nhân, học flashcard mỗi ngày và theo dõi tiến độ của bạn. みんなで日本語を勉強しましょう！
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          style={{ background: '#C8102E' }}
        >
          <span>Bắt đầu học ngay</span>
          <span>→</span>
        </Link>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ background: '#FFFFFF' }}>
        <h2 className="text-center text-2xl font-bold mb-12" style={{ color: '#1A1A2E' }}>
          Tính năng chính
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 border"
              style={{ borderColor: '#E8D5D8', background: '#FFFAF9' }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A2E' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B7E' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm" style={{ color: '#6B6B7E', borderTop: '1px solid #E8D5D8' }}>
        🌸 Học tiếng Nhật cùng nhau — みんなで日本語を学ぼう
      </footer>
    </main>
  )
}

const features = [
  {
    icon: '📚',
    title: 'Từ điển Jisho',
    desc: 'Tìm từ bằng tiếng Việt hoặc tiếng Anh, hệ thống tự tìm chữ Nhật và nghĩa cho bạn.',
  },
  {
    icon: '🃏',
    title: 'Flashcard thông minh',
    desc: 'Học theo thẻ lật — xem chữ Nhật, đoán nghĩa, rồi kiểm tra. Có ví dụ câu đi kèm.',
  },
  {
    icon: '🔥',
    title: 'Theo dõi streak',
    desc: 'Học mỗi ngày để duy trì streak. Xem tổng từ đã học và tiến độ hôm nay.',
  },
]
