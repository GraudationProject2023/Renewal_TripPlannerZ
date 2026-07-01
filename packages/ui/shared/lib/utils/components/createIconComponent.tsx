import React from 'react'

type IconProps = {
  size?: number
  className?: string
  color?: string
  stroke?: string
  fill?: string
  alt?: string
}

export function createIconComponent(
  SvgComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>,
) {
  return function IconComponent({
    size = 24,
    className = '',
    color,
    stroke,
    fill,
    alt = 'icon',
  }: IconProps) {
    const strokeColor = stroke || color || 'currentColor'
    const fillColor = fill || color || 'currentColor'

    return (
      <SvgComponent
        width={size}
        height={size}
        stroke={strokeColor}
        fill={fillColor}
        className={className}
        aria-label={alt}
        role="img"
        style={{ color }}
      />
    )
  }
}
