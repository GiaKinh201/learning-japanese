import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Học tiếng Nhật cùng nhau',
    short_name: 'Học tiếng Nhật',
    description: 'Ứng dụng học từ vựng tiếng Nhật thông minh với flashcard 3D Active Recall và trợ lý Gemini AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFBFB',
    theme_color: '#C8102E',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
