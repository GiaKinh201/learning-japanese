import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  bg?: string
  layout?: 'stack' | 'inline'
}

export default function StatCard({
  icon,
  label,
  value,
  bg = '#FFFFFF',
  layout = 'stack',
}: StatCardProps) {
  if (layout === 'inline') {
    return (
      <div
        className="rounded-2xl p-4 border transition-all hover:shadow-xs"
        style={{ background: bg, borderColor: '#E8D5D8' }}
      >
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-xs" style={{ color: '#6B6B7E' }}>{label}</span>
        </div>
        <div className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>{value}</div>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 transition-all hover:shadow-xs border"
      style={{ background: bg, borderColor: '#E8D5D8' }}
    >
      <div className="p-2 rounded-xl w-fit" style={{ background: '#FFE4E8' }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: '#6B6B7E' }}>{label}</p>
        <p className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{value}</p>
      </div>
    </div>
  )
}
