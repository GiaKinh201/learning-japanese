import type { SVGProps } from 'react'

interface SakuraIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  className?: string
  petalColor?: string
  centerColor?: string
}

export default function SakuraIcon({
  size = 24,
  className = '',
  petalColor = '#F472B6',
  centerColor = '#C8102E',
  ...props
}: SakuraIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <g transform="translate(32, 32)">
        {/* 5 Sakura Petals with classic notch */}
        <path
          d="M 0,-5 C -7,-14 -14,-21 -5,-27 C -1,-23 1,-23 5,-27 C 14,-21 7,-14 0,-5 Z"
          fill={petalColor}
        />
        <path
          d="M 0,-5 C -7,-14 -14,-21 -5,-27 C -1,-23 1,-23 5,-27 C 14,-21 7,-14 0,-5 Z"
          fill={petalColor}
          transform="rotate(72)"
        />
        <path
          d="M 0,-5 C -7,-14 -14,-21 -5,-27 C -1,-23 1,-23 5,-27 C 14,-21 7,-14 0,-5 Z"
          fill={petalColor}
          transform="rotate(144)"
        />
        <path
          d="M 0,-5 C -7,-14 -14,-21 -5,-27 C -1,-23 1,-23 5,-27 C 14,-21 7,-14 0,-5 Z"
          fill={petalColor}
          transform="rotate(216)"
        />
        <path
          d="M 0,-5 C -7,-14 -14,-21 -5,-27 C -1,-23 1,-23 5,-27 C 14,-21 7,-14 0,-5 Z"
          fill={petalColor}
          transform="rotate(288)"
        />

        {/* Pistil ring & center */}
        <circle cx="0" cy="0" r="5.5" fill="#FFE4E8" />
        <circle cx="0" cy="0" r="3" fill={centerColor} />
      </g>
    </svg>
  )
}
