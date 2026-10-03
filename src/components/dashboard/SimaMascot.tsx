'use client'

import React, { useState, useEffect, useRef } from 'react'

interface SimaMascotProps {
  size?: number
  className?: string
  animated?: boolean
  enableBreathing?: boolean
  onClick?: () => void
  ariaLabel?: string
}

export function SimaMascot({
  size = 72,
  className = '',
  animated = true,
  enableBreathing = false,
  onClick,
  ariaLabel = 'SIMA Mascot Asisten Pertanian',
}: SimaMascotProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const doubleBlinkRef = useRef<NodeJS.Timeout | null>(null)

  // One cancellable timer chain: no blinking while reduced motion is enabled.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      setPrefersReducedMotion(media.matches)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (doubleBlinkRef.current) clearTimeout(doubleBlinkRef.current)
      setIsBlinking(false)
      if (!animated || media.matches) return
      const schedule = () => {
        timeoutRef.current = setTimeout(() => {
          setIsBlinking(true)
          doubleBlinkRef.current = setTimeout(() => {
            setIsBlinking(false)
            schedule()
          }, 150)
        }, 4000 + Math.random() * 4000)
      }
      schedule()
    }
    const initial = window.setTimeout(syncMotion, 0)
    media.addEventListener('change', syncMotion)
    return () => {
      window.clearTimeout(initial)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (doubleBlinkRef.current) clearTimeout(doubleBlinkRef.current)
      media.removeEventListener('change', syncMotion)
    }
  }, [animated])

  // Optional subtle breathing scale (1.00 -> 1.004 -> 1.00)
  const shouldBreathe = enableBreathing && !prefersReducedMotion

  return (
    <div
      onClick={onClick}
      className={`relative select-none inline-flex items-center justify-center shrink-0 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        className={`w-full h-full ${shouldBreathe ? 'animate-sima-subtle-breathe' : ''}`}
        style={{ transformOrigin: 'center bottom' }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm filter"
        >
          <defs>
            {/* Shallot Body Gradient */}
            <linearGradient id="simaShallotGrad" x1="28" y1="20" x2="88" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C2456E" />
              <stop offset="35%" stopColor="#A63C5D" />
              <stop offset="75%" stopColor="#7F2442" />
              <stop offset="100%" stopColor="#5D152C" />
            </linearGradient>

            {/* Shallot Left Highlight */}
            <linearGradient id="simaShallotLight" x1="30" y1="35" x2="65" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E2658F" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#A63C5D" stopOpacity="0" />
            </linearGradient>

            {/* Top Leaf Sprout Left */}
            <linearGradient id="simaLeafLeft" x1="42" y1="35" x2="48" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#105B35" />
              <stop offset="60%" stopColor="#167A4A" />
              <stop offset="100%" stopColor="#2AB36D" />
            </linearGradient>

            {/* Top Leaf Sprout Right */}
            <linearGradient id="simaLeafRight" x1="56" y1="36" x2="72" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B4627" />
              <stop offset="50%" stopColor="#167A4A" />
              <stop offset="100%" stopColor="#32C97C" />
            </linearGradient>

            {/* Farmer Hat Brim Gradient */}
            <linearGradient id="simaHatBrim" x1="20" y1="52" x2="94" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0D4B2C" />
              <stop offset="30%" stopColor="#14673E" />
              <stop offset="70%" stopColor="#1C824F" />
              <stop offset="100%" stopColor="#25A062" />
            </linearGradient>

            {/* Farmer Hat Underside Rim */}
            <linearGradient id="simaHatUnder" x1="28" y1="62" x2="88" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#07301B" />
              <stop offset="100%" stopColor="#0F4C2D" />
            </linearGradient>

            {/* Face Mask Cream/Mint Gradient */}
            <linearGradient id="simaFaceGrad" x1="56" y1="58" x2="72" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5FDF8" />
              <stop offset="50%" stopColor="#E5F6EC" />
              <stop offset="100%" stopColor="#D6EFE0" />
            </linearGradient>

            {/* Eye Pupil Gradient */}
            <linearGradient id="simaEyeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#253A2D" />
              <stop offset="100%" stopColor="#13241A" />
            </linearGradient>
          </defs>

          {/* ================= BACKGROUND ELEMENTS ================= */}
          {/* Top Leaf Sprout - Left */}
          <path
            d="M54 34C48 26 40 18 36 12C46 12 55 20 58 32C56.5 32.8 55.2 33.4 54 34Z"
            fill="url(#simaLeafLeft)"
          />
          {/* Top Leaf Sprout - Right */}
          <path
            d="M56 34C60 22 66 14 74 10C73 22 68 30 62 36C59.8 35 57.8 34.4 56 34Z"
            fill="url(#simaLeafRight)"
          />
          {/* Leaf Rib Accent */}
          <path
            d="M55 33C59 24 64 18 70 14"
            stroke="#63E2A0"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* ================= SHALLOT MAIN BULB ================= */}
          {/* Bulb Body */}
          <path
            d="M58 28C59 31 66 40 74 46C86 55 92 68 88 82C84 96 70 102 58 103C44 102 32 94 30 79C28 65 37 50 48 38C52 33 56 29 58 28Z"
            fill="url(#simaShallotGrad)"
          />

          {/* Shallot Bulb Root Bottom Point */}
          <path
            d="M54 102.5C57 104.5 59 104.5 62 102.5C60 106 56 106 54 102.5Z"
            fill="#450F20"
          />

          {/* Subtle Bulb Texture Curves / Ridges */}
          <path
            d="M58 29C67 43 78 58 79 78"
            stroke="#FF8FB3"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.25"
          />
          <path
            d="M56 30C46 44 38 60 38 78"
            stroke="#FFA8C4"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />

          {/* ================= FARMER CAP / BRIM ================= */}
          {/* Cap Back Shadow */}
          <ellipse
            cx="58"
            cy="52"
            rx="36"
            ry="14"
            transform="rotate(-14 58 52)"
            fill="url(#simaHatUnder)"
          />

          {/* Cap Outer Brim Ring */}
          <ellipse
            cx="57"
            cy="50"
            rx="35"
            ry="11.5"
            transform="rotate(-14 57 50)"
            fill="url(#simaHatBrim)"
          />

          {/* Cap Rim Highlight Arc */}
          <path
            d="M24 55C34 46 72 38 90 48"
            stroke="#5CE69E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />

          {/* ================= FACE APERTURE / MASK ================= */}
          {/* Cream / Mint Face Patch */}
          <path
            d="M45 59C51 55 60 55 68 57C76 59 81 66 80 75C79 84 71 89 62 89C51 89 42 82 41 73C40 66 42 61 45 59Z"
            fill="url(#simaFaceGrad)"
          />

          {/* Soft Cheek Blush (Left & Right) */}
          <ellipse cx="46" cy="74" rx="4.5" ry="3" fill="#F49EB4" fillOpacity="0.45" />
          <ellipse cx="74" cy="73" rx="4.5" ry="3" fill="#F49EB4" fillOpacity="0.45" />

          {/* Delicate Smile */}
          <path
            d="M57 78C59 80 62 80 64 78"
            stroke="#2B3F32"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* ================= EXPRESSIVE EYES (OPEN vs BLINK) ================= */}
          {isBlinking ? (
            /* CLOSED EYES - Smooth Curved Eyelids (⌒ ⌒) */
            <g className="transition-all duration-75">
              {/* Left Eyelid Arc */}
              <path
                d="M48 67C50.5 63.8 54.5 63.8 57 67"
                stroke="#1B2F23"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Right Eyelid Arc */}
              <path
                d="M66 66C68.5 63 72.5 63 75 66"
                stroke="#1B2F23"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>
          ) : (
            /* OPEN EYES - Friendly, Bright, Attentive */
            <g className="transition-all duration-75">
              {/* Left Eye Pupil */}
              <ellipse
                cx="52.5"
                cy="66"
                rx="4.2"
                ry="5"
                transform="rotate(2 52.5 66)"
                fill="url(#simaEyeGrad)"
              />
              {/* Left Eye Sparkle / Highlight */}
              <circle cx="51.2" cy="64" r="1.6" fill="#FFFFFF" />
              <circle cx="54.2" cy="67.5" r="0.8" fill="#FFFFFF" fillOpacity="0.8" />

              {/* Right Eye Pupil */}
              <ellipse
                cx="70.5"
                cy="65"
                rx="4.2"
                ry="5"
                transform="rotate(-2 70.5 65)"
                fill="url(#simaEyeGrad)"
              />
              {/* Right Eye Sparkle / Highlight */}
              <circle cx="69.2" cy="63" r="1.6" fill="#FFFFFF" />
              <circle cx="72.2" cy="66.5" r="0.8" fill="#FFFFFF" fillOpacity="0.8" />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}

export default SimaMascot
