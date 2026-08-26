'use client'

import React, { useRef } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  max?: number
  className?: string
  cardClassName?: string
  glare?: boolean
}

export function TiltCard({
  children,
  max = 32,
  className = '',
  cardClassName = '',
  glare = true,
}: TiltCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current
    const card = cardRef.current
    if (!wrap || !card) return

    const rect = wrap.getBoundingClientRect()
    const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))

    wrap.classList.add('is-hover')
    card.classList.add('is-tilting')

    card.style.setProperty('--tilt-ry', `${((px - 0.5) * max).toFixed(2)}deg`)
    card.style.setProperty('--tilt-rx', `${((0.5 - py) * max).toFixed(2)}deg`)
    card.style.setProperty('--tilt-gx', `${(px * 100).toFixed(1)}%`)
    card.style.setProperty('--tilt-gy', `${(py * 100).toFixed(1)}%`)
  }

  const onLeave = () => {
    const wrap = wrapRef.current
    const card = cardRef.current
    if (wrap) wrap.classList.remove('is-hover')
    if (card) {
      card.classList.remove('is-tilting')
      card.style.setProperty('--tilt-rx', '0deg')
      card.style.setProperty('--tilt-ry', '0deg')
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`t-tilt cursor-pointer ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div ref={cardRef} className={`t-tilt-card ${cardClassName}`}>
        {children}
        {glare && <div className="t-tilt-glare" aria-hidden="true" />}
      </div>
    </div>
  )
}
