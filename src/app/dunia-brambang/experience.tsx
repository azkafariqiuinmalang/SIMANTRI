'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bug,
  CloudRain,
  Coins,
  Info,
  Landmark,
  RotateCcw,
  Sprout,
  TrendingDown,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as Tone from 'tone'

export default function DuniaBrambangExperience() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)

  // Flow node state
  const [selectedFlow, setSelectedFlow] = useState({
    id: 'domestic',
    title: 'Pilar Domestik (Jakarta & Jawa)',
    details: 'Menyuplai lebih dari 40% kebutuhan harian pasar induk di Jakarta.',
  })

  const synthRef = useRef<Tone.PolySynth | null>(null)
  const audioTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isAudioPlayingRef = useRef(false)

  // Keep ref in sync
  useEffect(() => {
    isAudioPlayingRef.current = isAudioPlaying
  }, [isAudioPlaying])

  const playAmbientNotes = () => {
    if (!isAudioPlayingRef.current || !synthRef.current) return
    const chords = [
      ['C3', 'G3', 'D4'],
      ['A2', 'E3', 'C4'],
      ['F2', 'C3', 'A3'],
    ]
    const randomChord = chords[Math.floor(Math.random() * chords.length)]
    try {
      synthRef.current.triggerAttackRelease(randomChord, '4n')
    } catch {
      // AudioContext might be suspended or closed
    }
    audioTimerRef.current = setTimeout(playAmbientNotes, 6000)
  }

  const handleAudioToggle = async () => {
    if (!isAudioPlaying) {
      try {
        await Tone.start()
        if (!synthRef.current) {
          synthRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 3, decay: 4, sustain: 0.8, release: 5 },
          }).toDestination()
          synthRef.current.volume.value = -24
        }
        setIsAudioPlaying(true)
        isAudioPlayingRef.current = true
        playAmbientNotes()
      } catch (err) {
        console.error('Audio init error:', err)
      }
    } else {
      setIsAudioPlaying(false)
      isAudioPlayingRef.current = false
      if (audioTimerRef.current) {
        clearTimeout(audioTimerRef.current)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (audioTimerRef.current) {
        clearTimeout(audioTimerRef.current)
      }
      if (synthRef.current) {
        try {
          synthRef.current.dispose()
        } catch {}
      }
    }
  }, [])

  // GSAP Animations & ScrollTriggers
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Hero intro animation
    const introTl = gsap.timeline()
    introTl
      .to('#g0-text-1', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.3,
      })
      .to(
        '#g0-text-2',
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' },
        '-=0.8'
      )
      .to('#g0-scroll', { opacity: 1, duration: 1 }, '-=0.5')

    // Tugu animation
    const tuguBulb = document.getElementById('tuguBulb') as SVGPathElement | null
    if (tuguBulb) {
      try {
        const length = tuguBulb.getTotalLength()
        tuguBulb.style.strokeDasharray = `${length}`
        tuguBulb.style.strokeDashoffset = `${length}`

        ScrollTrigger.create({
          trigger: '#gallery-tugu',
          start: 'top 60%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
            tl.to(tuguBulb, {
              strokeDashoffset: 0,
              duration: 1.6,
              ease: 'power1.inOut',
            })
              .to('#tuguInner', { opacity: 1, duration: 0.6 }, '-=0.4')
              .to('#tuguText', { opacity: 1, duration: 0.8 }, '-=0.3')
              .to(
                [
                  '#leaf-1',
                  '#leaf-2',
                  '#leaf-3',
                  '#part-base-1',
                  '#part-base-2',
                  '#part-base-3',
                  '#part-base-4',
                  '#part-base-5',
                  '#part-base-6',
                  '#part-pillar-1',
                  '#part-pillar-2',
                  '#part-pillar-3',
                  '#part-pillar-4',
                  '#part-pedestal-1',
                  '#part-pedestal-2',
                ],
                {
                  opacity: 1,
                  y: 0,
                  duration: 1.0,
                  stagger: 0.05,
                },
                '-=0.8'
              )
              .to('#tuguGlow', { opacity: 0.35, duration: 0.8 })
              .to('#tuguGlow', { opacity: 0.1, duration: 1.2 })
          },
        })
      } catch {}
    }

    // Timeline Gallery 5 (Memori Lisan)
    const timelineContainer = document.getElementById('timelineContainer')
    if (timelineContainer) {
      ScrollTrigger.create({
        trigger: '#gallery-5',
        start: 'top 55%',
        once: true,
        onEnter: () => {
          gsap.to('#timelineLine', {
            scaleY: 1,
            duration: 1.8,
            ease: 'power2.inOut',
          })
          const nodes = document.querySelectorAll('.timeline-node')
          nodes.forEach((node, index) => {
            const delay = 0.4 + index * 0.4
            gsap.to(node, {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: 'power2.out',
              delay: delay,
            })
          })
        },
      })
    }

    // Simantri Story Gallery 6
    const simantriStoryContainer = document.getElementById('simantriStoryContainer')
    if (simantriStoryContainer) {
      ScrollTrigger.create({
        trigger: '#gallery-6',
        start: 'top 50%',
        once: true,
        onEnter: () => {
          gsap.to('#simantriTimelineLine', {
            scaleY: 1,
            duration: 2.2,
            ease: 'power2.inOut',
          })
          const simantriNodes = document.querySelectorAll('.simantri-node')
          simantriNodes.forEach((node, index) => {
            const delay = 0.5 + index * 0.5
            gsap.to(node, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power2.out',
              delay: delay,
            })
          })
        },
      })
    }

    // Fase Timeline Gallery
    const faseTimelineContainer = document.getElementById('faseTimelineContainer')
    if (faseTimelineContainer) {
      ScrollTrigger.create({
        trigger: '#gallery-fase-penanaman',
        start: 'top 55%',
        once: true,
        onEnter: () => {
          gsap.to('#snakePath', {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power2.inOut',
          })
          const faseNodes = document.querySelectorAll('.fase-node')
          faseNodes.forEach((node, index) => {
            const delay = 0.2 + index * 0.15
            const circle = node.querySelector('.node-circle')
            if (circle) {
              gsap.to(circle, {
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                delay: delay,
              })
            }
            gsap.to(node, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              delay: delay + 0.1,
            })
          })
        },
      })
    }

    // Hasil Panen Section
    const hasilPanenSection = document.getElementById('gallery-hasil-panen')
    if (hasilPanenSection) {
      ScrollTrigger.create({
        trigger: '#gallery-hasil-panen',
        start: 'top 60%',
        once: true,
        onEnter: () => {
          const hpBlocks = hasilPanenSection.querySelectorAll('.hp-block')
          hpBlocks.forEach((block, index) => {
            gsap.to(block, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              delay: index * 0.2,
            })
          })
        },
      })
    }

    // Generic Section Reveal
    const sections = gsap.utils.toArray<HTMLElement>('main section')
    sections.forEach((section, i) => {
      if (i === 0) return
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power2.out',
      })
    })

    // Scroll listener for active nav dots & counter
    const handleScroll = () => {
      const allSections = document.querySelectorAll<HTMLElement>('main section')
      let current = 0
      allSections.forEach((section, index) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
          current = index
        }
      })
      setActiveGalleryIndex(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-[#0E080A] text-[#FBF4EE] font-sans antialiased selection:bg-[#C4487A] selection:text-[#FBF4EE] museum-noise min-h-screen relative overflow-x-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 md:p-8 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C4487A] animate-pulse"></span>
          <Link
            href="/"
            className="font-serif tracking-wider text-xs md:text-sm uppercase text-[#FBF4EE]/80 hover:text-[#FBF4EE] transition-colors"
          >
            Pameran SIMANTRI
          </Link>
        </div>

        <div className="pointer-events-auto flex items-center space-x-4">
          <button
            onClick={handleAudioToggle}
            className="glass-panel px-4 py-2 rounded-full text-xs flex items-center space-x-2 text-[#FBF4EE]/90 hover:text-[#FBF4EE] transition-all duration-300 cursor-pointer"
          >
            {isAudioPlaying ? (
              <Volume2 className="w-4 h-4 text-[#C4487A]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#C4487A]" />
            )}
            <span className="hidden sm:inline">
              {isAudioPlaying ? 'Suara Ambien: Nyala' : 'Suara Ambien: Mati'}
            </span>
          </button>

          <div className="glass-panel px-4 py-2 rounded-full text-xs font-mono text-[#FBF4EE]/80">
            G0{activeGalleryIndex} / G10
          </div>
        </div>
      </header>

      {/* Side Navigation Dots */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col space-y-3">
        {[
          { id: '#gallery-0', label: 'Kedatangan' },
          { id: '#gallery-1', label: 'Kota Brambang' },
          { id: '#gallery-tugu', label: 'Tugu Bawang Merah' },
          { id: '#gallery-2', label: 'Skala & Dampak' },
          { id: '#gallery-3', label: 'Bauji & Tajuk' },
          { id: '#gallery-4', label: 'Perjuangan' },
          { id: '#gallery-fase-penanaman', label: 'Fase Penanaman' },
          { id: '#gallery-hasil-panen', label: 'Hasil Panen' },
          { id: '#gallery-5', label: 'Memori Lisan' },
          { id: '#gallery-6', label: 'Lahirnya SIMANTRI' },
          { id: '#gallery-7', label: 'Masa Depan' },
        ].map((item, index) => (
          <a
            key={item.id}
            href={item.id}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 relative group ${
              activeGalleryIndex === index
                ? 'bg-[#C4487A] scale-125'
                : 'bg-[#FBF4EE]/20 hover:bg-[#C4487A]'
            }`}
            title={item.label}
          >
            <span className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] rounded bg-[#4A1F2B] text-[#FBF4EE] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* MAIN EXHIBITION CONTAINER */}
      <main id="exhibition-wrapper" className="w-full relative">
        {/* GALLERY 0: KEDATANGAN */}
        <section
          id="gallery-0"
          className="min-h-screen w-full relative flex flex-col justify-center items-center px-6 py-20 bg-[#0E080A] text-[#FBF4EE] overflow-hidden"
        >
          <div className="absolute inset-0 ambient-spotlight opacity-70"></div>

          <div className="absolute w-72 h-72 md:w-[500px] md:h-[500px] opacity-15 pointer-events-none animate-pulse">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full fill-none stroke-[#C4487A] stroke-[0.5]"
            >
              <path d="M100 20 C140 60, 180 110, 100 180 C20 110, 60 60, 100 20 Z" />
              <path d="M100 35 C125 70, 155 110, 100 170 C45 110, 75 70, 100 35 Z" />
              <path d="M100 50 C115 80, 130 110, 100 160 C70 110, 85 80, 100 50 Z" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto text-center z-10 space-y-12">
            <div className="inline-block px-3 py-1 rounded-full border border-[#C4487A]/30 text-[#C4487A] text-xs tracking-widest uppercase mb-4">
              Pameran Digital &bull; SIMANTRI
            </div>

            <div
              id="g0-text-1"
              className="opacity-0 translate-y-8 transition-all"
            >
              <p className="font-serif text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed text-[#FBF4EE]/90">
                &quot;Setiap hari, jutaan orang memasak dengan bawang.
              </p>
              <p className="font-serif text-2xl md:text-4xl lg:text-5xl italic font-light leading-relaxed text-[#C4487A] mt-4">
                Namun hanya sedikit yang tahu dari mana kisah ini bermula.&quot;
              </p>
            </div>

            <div
              id="g0-text-2"
              className="opacity-0 translate-y-8 transition-all"
            >
              <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-normal tracking-tight text-[#FBF4EE] mt-8">
                Dunia <span className="text-[#C4487A] italic">Brambang.</span>
              </h1>
              <p className="text-sm md:text-base font-light text-[#FBF4EE]/60 max-w-lg mx-auto mt-6 tracking-wide">
                Sebuah pengalaman museum interaktif yang mengeksplorasi jiwa
                kehidupan, tanah suci, dan warisan pertanian Nganjuk.
              </p>
            </div>

            <div
              id="g0-scroll"
              className="pt-12 flex flex-col items-center justify-center space-y-3 opacity-0"
            >
              <span className="text-xs uppercase tracking-widest text-[#FBF4EE]/50">
                Mulai Perjalanan
              </span>
              <div className="w-6 h-10 border border-[#FBF4EE]/30 rounded-full flex justify-center p-1">
                <div className="w-1.5 h-3 bg-[#C4487A] rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY 1: KOTA BRAMBANG */}
        <section
          id="gallery-1"
          className="min-h-screen w-full relative flex flex-col justify-center px-6 md:px-20 py-28 bg-[#4A1F2B] text-[#FBF4EE] transition-colors duration-1000"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8 lg:order-1 order-2">
              <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                Galeri 01 &bull; Identitas
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-light leading-tight">
                Nganjuk bukan sekadar kota biasa di Jawa Timur.
              </h2>
              <p className="text-[#FBF4EE]/80 leading-relaxed font-light text-base md:text-lg">
                Nganjuk telah menempa dirinya menjadi denyut nadi identitas
                pertanian Indonesia. Di sini, bawang merah bukan sekadar
                komoditas—melainkan napas, warisan, dan detak jantung kehidupan
                sehari-hari.
              </p>
            </div>

            <div className="lg:col-span-7 lg:order-2 order-1">
              <div className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden space-y-8 shadow-2xl">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#C4487A]/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-serif text-6xl md:text-8xl font-bold text-[#C4487A]">
                      38,72
                    </span>
                    <span className="font-serif text-3xl md:text-5xl text-[#FBF4EE]">
                      %
                    </span>
                  </div>
                  <p className="text-sm uppercase tracking-wider text-[#FBF4EE]/70 mt-2">
                    Kontribusi terhadap Total Produksi Bawang Merah Jawa Timur
                  </p>
                </div>

                <div className="relative z-10 py-6 border-y border-[#FBF4EE]/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-[#FBF4EE]">
                      Kota Brambang
                    </h3>
                    <p className="text-xs text-[#FBF4EE]/70 leading-relaxed">
                      Julukan ini diraih melalui penguasaan tanah selama
                      berdekade-dekade, di mana generasi demi generasi
                      menyempurnakan irigasi, kimia tanah, dan ketahanan benih.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-[#FBF4EE]">
                      Jangkar Kultural
                    </h3>
                    <p className="text-xs text-[#FBF4EE]/70 leading-relaxed">
                      Dari fajar hingga senja, ladang-ladang di Nganjuk bergerak
                      secara ritmis dalam penanaman, pemanenan, dan pengeringan
                      bawang yang memberi makan jutaan jiwa.
                    </p>
                  </div>
                </div>

                <div className="relative z-10 h-40 bg-[#0E080A]/40 rounded-xl border border-[#FBF4EE]/10 p-4 flex items-center justify-around">
                  <div className="text-center">
                    <Landmark className="w-8 h-8 text-[#C4487A] mx-auto mb-1" />
                    <span className="text-[11px] text-[#FBF4EE]/80 block">
                      Tengara Ikonik
                    </span>
                  </div>
                  <div className="w-px h-12 bg-[#FBF4EE]/10"></div>
                  <div className="text-center">
                    <Sprout className="w-8 h-8 text-[#3A5A40] mx-auto mb-1" />
                    <span className="text-[11px] text-[#FBF4EE]/80 block">
                      Sabuk Tanah Subur
                    </span>
                  </div>
                  <div className="w-px h-12 bg-[#FBF4EE]/10"></div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-[#E6A15C] mx-auto mb-1" />
                    <span className="text-[11px] text-[#FBF4EE]/80 block">
                      250.000+ Petani
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY TUGU: TUGU BAWANG MERAH */}
        <section
          id="gallery-tugu"
          className="min-h-screen w-full relative flex flex-col justify-center px-6 md:px-20 py-28 bg-[#0E080A] text-[#FBF4EE]"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 flex justify-center lg:order-2 order-1">
              <div className="relative w-80 h-[460px] md:w-[440px] md:h-[520px] flex items-center justify-center p-4">
                <div
                  id="tuguGlow"
                  className="absolute inset-0 bg-gradient-to-t from-[#C4487A]/0 via-[#C4487A]/0 to-transparent rounded-full blur-2xl transition-all duration-1000 opacity-0"
                ></div>

                <svg
                  id="tuguArtwork"
                  viewBox="0 0 400 450"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full fill-none stroke-[#C4487A] stroke-[2]"
                >
                  <ellipse
                    id="part-base-1"
                    cx="200"
                    cy="410"
                    rx="140"
                    ry="18"
                    className="stroke-[#C4487A] opacity-0 translate-y-4 transition-all"
                  />
                  <path
                    id="part-base-2"
                    d="M 60 410 C 60 425, 340 425, 340 410"
                    className="stroke-[#C4487A] opacity-0"
                  />
                  <path
                    id="part-base-3"
                    d="M 90 395 L 310 395"
                    className="stroke-[#C4487A] stroke-[1] opacity-0"
                  />
                  <line
                    id="part-base-4"
                    x1="140"
                    y1="395"
                    x2="140"
                    y2="416"
                    className="stroke-[#C4487A] stroke-[1] opacity-0"
                  />
                  <line
                    id="part-base-5"
                    x1="200"
                    y1="393"
                    x2="200"
                    y2="422"
                    className="stroke-[#C4487A] stroke-[1] opacity-0"
                  />
                  <line
                    id="part-base-6"
                    x1="260"
                    y1="395"
                    x2="260"
                    y2="416"
                    className="stroke-[#C4487A] stroke-[1] opacity-0"
                  />

                  <path
                    id="part-pillar-1"
                    d="M 75 390 L 60 365 L 85 360 L 95 385 Z"
                    className="fill-[#4A1F2B]/40 stroke-[#C4487A] opacity-0"
                  />
                  <path
                    id="part-pillar-2"
                    d="M 115 385 L 105 345 L 130 340 L 138 375 Z"
                    className="fill-[#4A1F2B]/40 stroke-[#C4487A] opacity-0"
                  />

                  <path
                    id="part-pedestal-1"
                    d="M 155 350 L 245 350 L 230 395 L 170 395 Z"
                    className="fill-[#4A1F2B]/60 stroke-[#C4487A] opacity-0"
                  />
                  <rect
                    id="part-pedestal-2"
                    x="150"
                    y="340"
                    width="100"
                    height="12"
                    rx="2"
                    className="fill-[#C4487A]/30 stroke-[#C4487A] opacity-0"
                  />

                  <path
                    id="part-pillar-3"
                    d="M 285 385 L 295 345 L 270 340 L 262 375 Z"
                    className="fill-[#4A1F2B]/40 stroke-[#C4487A] opacity-0"
                  />
                  <path
                    id="part-pillar-4"
                    d="M 325 390 L 340 365 L 315 360 L 305 385 Z"
                    className="fill-[#4A1F2B]/40 stroke-[#C4487A] opacity-0"
                  />

                  <path
                    id="tuguBulb"
                    d="M 200 70 C 290 100, 335 180, 320 260 C 305 330, 230 340, 200 340 C 170 340, 95 330, 80 260 C 65 180, 110 100, 200 70 Z"
                    className="fill-[#4A1F2B]/30 stroke-[#C4487A] stroke-[2.5]"
                  />
                  <path
                    id="tuguInner"
                    d="M 200 90 C 255 120, 280 180, 270 250 C 260 300, 220 320, 200 320 C 180 320, 140 300, 130 250 C 120 180, 145 120, 200 90 Z"
                    className="stroke-[#C4487A] stroke-[1] opacity-0"
                  />

                  <text
                    id="tuguText"
                    x="200"
                    y="225"
                    textAnchor="middle"
                    className="font-serif font-bold tracking-[0.35em] fill-[#FBF4EE] opacity-0"
                    style={{ fontSize: '26px' }}
                  >
                    NGANJUK
                  </text>

                  <path
                    id="leaf-1"
                    d="M 200 70 C 190 35, 175 20, 160 5 C 175 30, 190 50, 200 70 Z"
                    className="fill-[#3A5A40]/30 stroke-[#C4487A] stroke-[1.5] opacity-0"
                  />
                  <path
                    id="leaf-2"
                    d="M 200 70 C 210 35, 225 20, 240 5 C 225 30, 210 50, 200 70 Z"
                    className="fill-[#3A5A40]/30 stroke-[#C4487A] stroke-[1.5] opacity-0"
                  />
                  <path
                    id="leaf-3"
                    d="M 200 70 C 200 30, 200 15, 200 0 C 200 20, 200 50, 200 70 Z"
                    className="stroke-[#C4487A] stroke-[2] opacity-0"
                  />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-8 lg:order-1 order-2">
              <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                Galeri 02 &bull; Monumen
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
                Tugu Bawang Merah: Tengara Abadi
              </h2>
              <p className="text-[#FBF4EE]/80 leading-relaxed font-light text-base md:text-lg">
                Berdiri kokoh di jantung Nganjuk, monumen ikonik ini lebih dari
                sekadar struktur batu—ia adalah bentuk penghormatan sakral atas
                keringat, air mata, dan ketangguhan generasi petani bawang merah.
              </p>
              <div className="p-6 rounded-2xl glass-panel border-l-4 border-l-[#C4487A] space-y-2">
                <p className="font-serif text-lg text-[#FBF4EE]">
                  &quot;Setiap lekuk monumen mencerminkan bentuk si umbi suci
                  yang menopang kehidupan kita.&quot;
                </p>
                <p className="text-xs text-[#FBF4EE]/60">
                  — Arsip Warisan Budaya Lokal
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY 2: SKALA & DAMPAK */}
        <section
          id="gallery-2"
          className="min-h-screen w-full relative flex flex-col justify-center px-6 md:px-20 py-28 bg-[#0E080A] text-[#FBF4EE]"
        >
          <div className="max-w-7xl mx-auto w-full space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                Galeri 03 &bull; Skala & Dampak
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-light">
                Skala Kelimpahan
              </h2>
              <p className="text-[#FBF4EE]/70 font-light text-base md:text-lg">
                Angka saja tidak cukup untuk merefleksikan pengabdian, namun
                besarnya angka tersebut menuntut kagum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="glass-panel p-8 rounded-2xl space-y-3 transform hover:-translate-y-2 transition-all">
                <span className="text-xs font-mono text-[#C4487A] uppercase tracking-widest">
                  Hasil Tahunan
                </span>
                <div className="font-serif text-5xl md:text-6xl text-[#FBF4EE] font-light">
                  &gt; <span className="font-serif">1,8</span> Juta
                </div>
                <p className="text-sm text-[#FBF4EE]/80 font-medium">
                  Kuintal Dipanen
                </p>
                <p className="text-xs text-[#FBF4EE]/60 font-light">
                  Secara konsisten menstabilkan pasokan bawang merah nasional dan
                  mencegah lonjakan harga.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl space-y-3 transform hover:-translate-y-2 transition-all">
                <span className="text-xs font-mono text-[#E6A15C] uppercase tracking-widest">
                  Ketahanan Pangan Nasional
                </span>
                <div className="font-serif text-5xl md:text-6xl text-[#FBF4EE] font-light">
                  Top 3
                </div>
                <p className="text-sm text-[#FBF4EE]/80 font-medium">
                  Pusat Nasional
                </p>
                <p className="text-xs text-[#FBF4EE]/60 font-light">
                  Menyuplai pasar tradisional dan industri kuliner mulai dari
                  Sumatra hingga Papua.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl space-y-3 transform hover:-translate-y-2 transition-all">
                <span className="text-xs font-mono text-[#3A5A40] uppercase tracking-widest">
                  Jangkauan Global
                </span>
                <div className="font-serif text-5xl md:text-6xl text-[#FBF4EE] font-light">
                  ASEAN
                </div>
                <p className="text-sm text-[#FBF4EE]/80 font-medium">
                  Distinction Ekspor
                </p>
                <p className="text-xs text-[#FBF4EE]/60 font-light">
                  Termasyhur karena kepadatan umbi yang kokoh, aroma tajam, dan
                  daya simpan panjang di Asia Tenggara.
                </p>
              </div>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#FBF4EE]">
                    Alur Distribusi Hasil Panen
                  </h3>
                  <p className="text-xs text-[#FBF4EE]/60">
                    Klik salah satu simpul tujuan untuk melacak rantai pasok
                    bawang merah Nganjuk.
                  </p>
                </div>
                <div
                  id="activeFlowNode"
                  className="px-4 py-2 rounded-full bg-[#C4487A]/20 text-[#C4487A] text-xs font-mono"
                >
                  Terpilih: {selectedFlow.title}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="flowNodesContainer">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedFlow({
                      id: 'domestic',
                      title: 'Pilar Domestik (Jakarta & Jawa)',
                      details:
                        'Menyuplai lebih dari 40% kebutuhan harian pasar induk di Jakarta.',
                    })
                  }
                  className={`p-4 rounded-xl text-left space-y-2 transition-all cursor-pointer ${
                    selectedFlow.id === 'domestic'
                      ? 'border border-[#C4487A] bg-[#C4487A]/10'
                      : 'border border-[#FBF4EE]/10 hover:border-[#C4487A]/50'
                  }`}
                >
                  <span className="text-xs text-[#C4487A] uppercase font-mono">
                    Simpul 01
                  </span>
                  <p className="font-serif text-lg text-[#FBF4EE]">Pusat Domestik</p>
                  <span className="text-[11px] text-[#FBF4EE]/70 block">
                    Jakarta, Surabaya, Bandung
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFlow({
                      id: 'outer',
                      title: 'Logistik Luar Pulau',
                      details:
                        'Koridor pasokan vital yang memberi makan Maluku, Papua, dan Nusa Tenggara Timur.',
                    })
                  }
                  className={`p-4 rounded-xl text-left space-y-2 transition-all cursor-pointer ${
                    selectedFlow.id === 'outer'
                      ? 'border border-[#C4487A] bg-[#C4487A]/10'
                      : 'border border-[#FBF4EE]/10 hover:border-[#C4487A]/50'
                  }`}
                >
                  <span
                    className={`text-xs uppercase font-mono ${
                      selectedFlow.id === 'outer'
                        ? 'text-[#C4487A]'
                        : 'text-[#FBF4EE]/50'
                    }`}
                  >
                    Simpul 02
                  </span>
                  <p className="font-serif text-lg text-[#FBF4EE]">Pulau Luar Jawa</p>
                  <span className="text-[11px] text-[#FBF4EE]/70 block">
                    Papua, Gorontalo, Maluku
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFlow({
                      id: 'asean',
                      title: 'Jalur Ekspor Asia Tenggara',
                      details:
                        'Umbi varietas Tajuk berkualitas tinggi yang diekspor ke Malaysia, Thailand, dan Vietnam.',
                    })
                  }
                  className={`p-4 rounded-xl text-left space-y-2 transition-all cursor-pointer ${
                    selectedFlow.id === 'asean'
                      ? 'border border-[#C4487A] bg-[#C4487A]/10'
                      : 'border border-[#FBF4EE]/10 hover:border-[#C4487A]/50'
                  }`}
                >
                  <span
                    className={`text-xs uppercase font-mono ${
                      selectedFlow.id === 'asean'
                        ? 'text-[#C4487A]'
                        : 'text-[#FBF4EE]/50'
                    }`}
                  >
                    Simpul 03
                  </span>
                  <p className="font-serif text-lg text-[#FBF4EE]">Tetangga ASEAN</p>
                  <span className="text-[11px] text-[#FBF4EE]/70 block">
                    Malaysia, Thailand, Vietnam
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFlow({
                      id: 'industrial',
                      title: 'Pengolahan Kuliner & Industri',
                      details:
                        'Bahan baku esensial untuk produsen makanan nasional & produsen bawang goreng kemasan.',
                    })
                  }
                  className={`p-4 rounded-xl text-left space-y-2 transition-all cursor-pointer ${
                    selectedFlow.id === 'industrial'
                      ? 'border border-[#C4487A] bg-[#C4487A]/10'
                      : 'border border-[#FBF4EE]/10 hover:border-[#C4487A]/50'
                  }`}
                >
                  <span
                    className={`text-xs uppercase font-mono ${
                      selectedFlow.id === 'industrial'
                        ? 'text-[#C4487A]'
                        : 'text-[#FBF4EE]/50'
                    }`}
                  >
                    Simpul 04
                  </span>
                  <p className="font-serif text-lg text-[#FBF4EE]">
                    Industri Pengolahan
                  </p>
                  <span className="text-[11px] text-[#FBF4EE]/70 block">
                    Industri Makanan & FMCG
                  </span>
                </button>
              </div>

              <div
                id="flowNodeDetails"
                className="mt-6 p-4 rounded-xl bg-[#0E080A]/60 border border-[#FBF4EE]/10 text-sm text-[#FBF4EE]/80 flex items-center space-x-3"
              >
                <Info className="w-5 h-5 text-[#C4487A] flex-shrink-0" />
                <span id="flowDetailsText">{selectedFlow.details}</span>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY 3: BAUJI & TAJUK */}
        <section
          id="gallery-3"
          className="min-h-screen w-full relative flex flex-col justify-center px-6 md:px-20 py-28 bg-[#3D261A]/90 text-[#FBF4EE] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full space-y-20">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#E6A15C] text-xs font-mono uppercase tracking-widest">
                Galeri 04 &bull; Keajaiban Botani
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-light">
                Dua Karya Agung Tanah
              </h2>
              <p className="text-[#FBF4EE]/70 font-light text-base md:text-lg">
                Kenali Bauji dan Tajuk—kultivar bawang merah legendaris yang
                lahir dari iklim mikro Nganjuk.
              </p>
            </div>

            {/* VARIETY 1: BAUJI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
                <div className="inline-block px-3 py-1 rounded-full bg-[#3A5A40]/20 text-[#3A5A40] text-xs font-mono uppercase tracking-wider">
                  Raksasa Musim Hujan
                </div>
                <h3 className="font-serif text-5xl md:text-6xl font-light text-[#FBF4EE]">
                  BAUJI
                </h3>
                <p className="text-[#FBF4EE]/90 text-lg md:text-xl font-light leading-relaxed">
                  Dirancang oleh alam dan petani lokal untuk menaklukkan
                  derasnya hujan muson dan tanah tropis yang lembap. Bauji tumbuh
                  subur di saat bawang biasa membusuk, serta memiliki ketahanan
                  tinggi terhadap penyakit moler dan siklus panen cepat selama
                  55 hari.
                </p>
                <p className="text-[#FBF4EE]/70 text-sm leading-relaxed">
                  Petani dari Gorontalo dan Papua bahkan datang ribuan kilometer
                  ke Nganjuk demi mendapatkan benih asli Bauji.
                </p>
              </div>
              <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
                <div className="w-64 h-64 md:w-80 md:h-80 glass-panel rounded-full p-6 flex items-center justify-center animate-float border border-[#3A5A40]/30">
                  <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full fill-none stroke-[#3A5A40] stroke-[1.5]"
                  >
                    <path d="M100 20 C140 60, 170 110, 100 180 C30 110, 60 60, 100 20 Z" />
                    <path d="M100 40 C125 70, 145 110, 100 160 C55 110, 75 70, 100 40 Z" />
                    <ellipse
                      cx="100"
                      cy="110"
                      rx="35"
                      ry="45"
                      className="stroke-[#C4487A]"
                    />
                    <circle cx="100" cy="90" r="4" className="fill-[#3A5A40]" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[#FBF4EE]/10 my-8"></div>

            {/* VARIETY 2: TAJUK */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 flex justify-center order-1 lg:order-1">
                <div
                  className="w-64 h-64 md:w-80 md:h-80 glass-panel rounded-full p-6 flex items-center justify-center animate-float border border-[#C4487A]/30"
                  style={{ animationDelay: '2s' }}
                >
                  <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full fill-none stroke-[#C4487A] stroke-[1.5]"
                  >
                    <path d="M100 15 C150 55, 185 105, 100 185 C15 105, 50 55, 100 15 Z" />
                    <path d="M100 35 C130 65, 160 105, 100 165 C40 105, 70 65, 100 35 Z" />
                    <ellipse
                      cx="100"
                      cy="115"
                      rx="40"
                      ry="40"
                      className="stroke-[#E6A15C]"
                    />
                    <circle cx="100" cy="95" r="4" className="fill-[#C4487A]" />
                  </svg>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-6 order-2 lg:order-2">
                <div className="inline-block px-3 py-1 rounded-full bg-[#C4487A]/20 text-[#C4487A] text-xs font-mono uppercase tracking-wider">
                  Penguasa Musim Kemarau
                </div>
                <h3 className="font-serif text-5xl md:text-6xl font-light text-[#FBF4EE]">
                  TAJUK
                </h3>
                <p className="text-[#FBF4EE]/90 text-lg md:text-xl font-light leading-relaxed">
                  Kebanggaan yang tak terbantahkan di musim kemarau—terkenal
                  karena aromanya yang khas, kepadatan umbi yang solid, dan
                  nilai jual ekspor yang tak tertandingi. Menghasilkan 12
                  hingga 15 ton per hektar, Tajuk mempertahankan kualitas
                  unggulnya berbulan-bulan pascapanen.
                </p>
                <p className="text-[#FBF4EE]/70 text-sm leading-relaxed">
                  Tingkat kepedasan yang pekat dan tekstur renyahnya menjadikan
                  varietas ini standar emas untuk dapur kuliner mewah dan
                  koridor ekspor ASEAN.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY 4: PERJUANGAN */}
        <section
          id="gallery-4"
          className="min-h-screen w-full relative flex flex-col justify-center px-6 md:px-20 py-28 bg-[#0E080A] text-[#FBF4EE]"
        >
          <div className="max-w-6xl mx-auto w-full space-y-16">
            <div className="space-y-4">
              <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                Galeri 05 &bull; Beban Tak Terlihat
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-light text-[#FBF4EE]">
                Di Balik Setiap Panen Tersimpan Perang Senyap.
              </h2>
              <p className="text-[#FBF4EE]/70 max-w-2xl text-base md:text-lg font-light">
                Di balik statistik produksi yang cemerlang terdapat kehidupan
                manusia nyata yang bergelut dengan alam yang tak menentu dan
                pasar yang tidak adil.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl glass-panel space-y-4 hover:border-red-500/40 transition-all">
                <div className="w-10 h-10 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center">
                  <CloudRain className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#FBF4EE]">Anomali Iklim</h3>
                <p className="text-xs text-[#FBF4EE]/70 leading-relaxed">
                  Hujan di luar musim selama bulan-bulan kering menyebabkan
                  pembusukan umbi yang cepat dan menghancurkan investasi
                  berbulan-bulan dalam semalam.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel space-y-4 hover:border-red-500/40 transition-all">
                <div className="w-10 h-10 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center">
                  <Bug className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#FBF4EE]">Ulat Grayak</h3>
                <p className="text-xs text-[#FBF4EE]/70 leading-relaxed">
                  Hama ulat tentara (<em>Spodoptera exigua</em>) yang rakus
                  menghancurkan daun tubular, menghentikan fotosintesis umbi
                  sepenuhnya.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel space-y-4 hover:border-red-500/40 transition-all">
                <div className="w-10 h-10 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#FBF4EE]">
                  Volatilitas Harga
                </h3>
                <p className="text-xs text-[#FBF4EE]/70 leading-relaxed">
                  Harga pasar berfluktuasi tajam—petani sering kali memanen hasil
                  yang melimpah namun terpaksa menjual di bawah biaya produksi.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel space-y-4 hover:border-red-500/40 transition-all">
                <div className="w-10 h-10 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#FBF4EE]">
                  Lonjakan Biaya Tani
                </h3>
                <p className="text-xs text-[#FBF4EE]/70 leading-relaxed">
                  Kenaikan biaya pupuk dan obat pelindung tanaman memaksa petani
                  terjebak dalam lingkaran utang yang menggunung.
                </p>
              </div>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden bg-gradient-to-r from-[#4A1F2B]/40 to-[#0E080A]">
              <div className="max-w-3xl space-y-6">
                <span className="text-xs font-mono text-[#C4487A] uppercase tracking-widest">
                  Paradoks Ekonomi
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#FBF4EE]">
                  &quot;Saat hama menyerang, kami merogoh kocek lebih dalam untuk
                  menyelamatkan ladang. Tapi ketika panen tiba, pasar menghargai
                  jerih payah kami dengan harga murah.&quot;
                </h3>
                <p className="text-xs text-[#FBF4EE]/60 leading-relaxed font-light">
                  — Pak Supardi, Petani Bawang Merah di Sukomoro, Nganjuk (34
                  tahun menggarap tanah)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY FASE PENANAMAN */}
        <section
          id="gallery-fase-penanaman"
          className="min-h-screen w-full relative bg-[#0E080A] text-[#FBF4EE] flex flex-col justify-center overflow-hidden py-28"
        >
          <div className="max-w-[800px] mx-auto w-full px-6 mb-16 text-center">
            <span className="text-[#C4487A] text-xs font-mono uppercase tracking-[0.25em] block mb-3">
              Gallery 06 &bull; Fase Penanaman
            </span>
            <h2 className="font-serif text-3xl md:text-6xl font-light text-[#FBF4EE] tracking-tight leading-tight mb-3">
              &quot;Lima musim, lima peluang hasil.&quot;
            </h2>
            <p className="text-[#FBF4EE]/70 text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto">
              &quot;Petani tidak hanya menanam. Mereka membaca waktu.&quot;
            </p>
          </div>

          <div
            id="faseTimelineContainer"
            className="relative max-w-[700px] mx-auto w-full px-6 pb-16"
          >
            {/* SVG Vertical Line */}
            <div className="absolute inset-0 pointer-events-none hidden md:block z-0 flex justify-center">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 700 950"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="snakePath"
                  d="M 350 20 C 350 150, 310 320, 350 475 C 390 630, 350 800, 350 930"
                  stroke="url(#snakeGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="1200"
                  strokeDashoffset="1200"
                />
                <defs>
                  <linearGradient
                    id="snakeGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#C4487A" />
                    <stop offset="35%" stopColor="#E6A15C" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#3A5A40" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="space-y-16 md:space-y-20 relative z-10">
              {/* FASE 01 */}
              <div
                className="fase-node relative opacity-0 translate-y-6 transition-all flex flex-col md:flex-row items-center"
                data-index="1"
              >
                <div className="w-full md:w-1/2 md:pr-10 hidden md:block"></div>
                <div className="absolute left-6 md:left-[50%] -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-[10px] z-20 shadow-lg scale-0 transition-transform duration-500 node-circle">
                  01
                </div>
                <div className="w-full md:w-1/2 pl-12 md:pl-10 md:pr-0">
                  <div className="space-y-2 text-left">
                    <span className="text-[#C4487A] text-[11px] font-mono uppercase tracking-[0.2em] block">
                      LABUHAN 1
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-light text-[#FBF4EE] italic leading-snug">
                      &quot;Awal harapan dimulai dari hujan pertama.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-xs md:text-sm leading-relaxed font-light">
                      Tanah mulai lembap, suhu masih bersahabat. Cocok untuk
                      pertumbuhan awal tanaman.
                    </p>
                    <div className="pt-0.5">
                      <span className="font-serif text-2xl text-[#FBF4EE] font-light tracking-wide">
                        1 : 10
                      </span>
                    </div>
                    <div className="w-12 h-px bg-[#FBF4EE]/15 mt-2"></div>
                  </div>
                </div>
              </div>

              {/* FASE 02 */}
              <div
                className="fase-node relative opacity-0 translate-y-6 transition-all flex flex-col md:flex-row items-center"
                data-index="2"
              >
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-10 md:text-right">
                  <div className="space-y-2">
                    <span className="text-[#C4487A] text-[11px] font-mono uppercase tracking-[0.2em] block">
                      LABUHAN 2
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-light text-[#FBF4EE] italic leading-snug">
                      &quot;Terlalu banyak air, terlalu banyak risiko.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-xs md:text-sm leading-relaxed font-light">
                      Curah hujan tinggi meningkatkan kelembapan tanah,
                      memerlukan perhatian ekstra terhadap potensi busuk umbi.
                    </p>
                    <div className="pt-0.5">
                      <span className="font-serif text-2xl text-[#FBF4EE] font-light tracking-wide">
                        1 : 3
                      </span>
                    </div>
                    <div className="w-12 h-px bg-[#FBF4EE]/15 mt-2 ml-auto md:ml-auto md:mr-0"></div>
                  </div>
                </div>
                <div className="absolute left-6 md:left-[50%] -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-[10px] z-20 shadow-lg scale-0 transition-transform duration-500 node-circle">
                  02
                </div>
                <div className="w-full md:w-1/2 md:pl-10 hidden md:block"></div>
              </div>

              {/* FASE 03 */}
              <div
                className="fase-node relative opacity-0 translate-y-6 transition-all flex flex-col md:flex-row items-center"
                data-index="3"
              >
                <div className="w-full md:w-1/2 md:pr-10 hidden md:block"></div>
                <div className="absolute left-6 md:left-[50%] -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-[10px] z-20 shadow-lg scale-0 transition-transform duration-500 node-circle">
                  03
                </div>
                <div className="w-full md:w-1/2 pl-12 md:pl-10 md:pr-0">
                  <div className="space-y-2 text-left">
                    <span className="text-[#C4487A] text-[11px] font-mono uppercase tracking-[0.2em] block">
                      LABUHAN 3
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-light text-[#FBF4EE] italic leading-snug">
                      &quot;Keseimbangan mulai kembali.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-xs md:text-sm leading-relaxed font-light">
                      Peralihan menuju cuaca yang lebih hangat memberikan
                      kondisi ideal bagi pertumbuhan optimal umbi.
                    </p>
                    <div className="pt-0.5">
                      <span className="font-serif text-2xl text-[#FBF4EE] font-light tracking-wide">
                        1 : 8
                      </span>
                    </div>
                    <div className="w-12 h-px bg-[#FBF4EE]/15 mt-2"></div>
                  </div>
                </div>
              </div>

              {/* FASE 04 */}
              <div
                className="fase-node relative opacity-0 translate-y-6 transition-all flex flex-col md:flex-row items-center"
                data-index="4"
              >
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-10 md:text-right">
                  <div className="space-y-2">
                    <span className="text-[#C4487A] text-[11px] font-mono uppercase tracking-[0.2em] block">
                      MUSIM RAYA
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-light text-[#FBF4EE] italic leading-snug">
                      &quot;Inilah puncak dari segalanya.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-xs md:text-sm leading-relaxed font-light">
                      Musim kemarau memberikan intensitas matahari penuh,
                      menghasilkan kualitas umbi terbaik dan daya simpan panjang.
                    </p>
                    <div className="pt-0.5">
                      <span className="font-serif text-2xl text-[#FBF4EE] font-light tracking-wide">
                        1 : 20
                      </span>
                    </div>
                    <div className="w-12 h-px bg-[#FBF4EE]/15 mt-2 ml-auto md:ml-auto md:mr-0"></div>
                  </div>
                </div>
                <div className="absolute left-6 md:left-[50%] -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-[10px] z-20 shadow-lg scale-0 transition-transform duration-500 node-circle">
                  04
                </div>
                <div className="w-full md:w-1/2 md:pl-10 hidden md:block"></div>
              </div>

              {/* FASE 05 */}
              <div
                className="fase-node relative opacity-0 translate-y-6 transition-all flex flex-col md:flex-row items-center"
                data-index="5"
              >
                <div className="w-full md:w-1/2 md:pr-10 hidden md:block"></div>
                <div className="absolute left-6 md:left-[50%] -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-[10px] z-20 shadow-lg scale-0 transition-transform duration-500 node-circle">
                  05
                </div>
                <div className="w-full md:w-1/2 pl-12 md:pl-10 md:pr-0">
                  <div className="space-y-2 text-left">
                    <span className="text-[#C4487A] text-[11px] font-mono uppercase tracking-[0.2em] block">
                      APITAN
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-light text-[#FBF4EE] italic leading-snug">
                      &quot;Akhir yang tetap memberi harapan.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-xs md:text-sm leading-relaxed font-light">
                      Periode transisi akhir tahun dengan cuaca hangat bercampur
                      hujan ringan yang tetap menyuburkan tanah.
                    </p>
                    <div className="pt-0.5">
                      <span className="font-serif text-2xl text-[#FBF4EE] font-light tracking-wide">
                        1 : 15
                      </span>
                    </div>
                    <div className="w-12 h-px bg-[#FBF4EE]/15 mt-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY HASIL PANEN */}
        <section
          id="gallery-hasil-panen"
          className="min-h-screen w-full relative bg-[#0E080A] text-[#FBF4EE] flex flex-col justify-center items-center py-32 px-6"
        >
          <div className="max-w-3xl mx-auto w-full text-center space-y-24">
            {/* HEADER */}
            <div className="space-y-6 hp-block opacity-0 translate-y-6 transition-all duration-500">
              <span className="text-[#C4487A] text-xs font-mono uppercase tracking-[0.25em] block">
                Gallery 07 &bull; Hasil Panen
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-[#FBF4EE] tracking-tight leading-tight">
                &quot;Bukan hanya panen bawang. <br />
                <span className="italic text-[#C4487A]">
                  Tapi panen masa depan.&quot;
                </span>
              </h2>
              <p className="text-[#FBF4EE]/70 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
                Di balik setiap musim, ada peluang yang sering tidak dilihat oleh
                generasi muda.
              </p>
              <div className="w-16 h-px bg-[#C4487A]/30 mx-auto mt-8"></div>
            </div>

            {/* BLOCK 1 */}
            <div className="space-y-8 hp-block opacity-0 translate-y-6 transition-all duration-500">
              <div className="space-y-3">
                <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest block">
                  Nilai Ekonomi
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-light text-[#FBF4EE]">
                  Satu musim bisa mengubah segalanya.
                </h3>
                <p className="text-[#FBF4EE]/70 text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto">
                  Dengan waktu tanam yang tepat, hasil bisa mencapai hingga 20
                  kali lipat dari bibit yang ditanam.
                </p>
              </div>

              <div className="py-6">
                <span className="font-serif text-6xl md:text-8xl font-light text-[#C4487A] tracking-tight block">
                  1 : 20
                </span>
              </div>

              <div className="w-24 h-px bg-[#FBF4EE]/10 mx-auto"></div>
            </div>

            {/* BLOCK 2 */}
            <div className="space-y-8 hp-block opacity-0 translate-y-6 transition-all duration-500">
              <div className="space-y-3">
                <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest block">
                  Kehidupan Petani
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-light text-[#FBF4EE]">
                  Lebih dari sekadar pekerjaan.
                </h3>
                <p className="text-[#FBF4EE]/70 text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto">
                  Pertanian adalah tentang kemandirian, kontrol atas waktu, dan
                  hubungan dengan alam.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm md:text-base font-light text-[#FBF4EE]/80 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A]"></span>
                  <span>Tidak terikat kantor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A]"></span>
                  <span>Penghasilan berbasis hasil</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4487A]"></span>
                  <span>Dekat dengan keluarga</span>
                </div>
              </div>

              <div className="w-24 h-px bg-[#FBF4EE]/10 mx-auto"></div>
            </div>

            {/* BLOCK 3 */}
            <div className="space-y-8 hp-block opacity-0 translate-y-6 transition-all duration-500">
              <div className="space-y-3">
                <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest block">
                  Panggilan Masa Depan
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-light text-[#FBF4EE]">
                  Pertanian membutuhkan generasi berikutnya.
                </h3>
                <p className="text-[#FBF4EE]/70 text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto">
                  Banyak petani berhenti, tetapi tanah tetap ada. Pertanyaannya,
                  siapa yang akan melanjutkan?
                </p>
              </div>

              <div className="pt-6">
                <p className="font-serif text-2xl md:text-4xl font-light italic text-[#C4487A] tracking-wide">
                  &quot;Ini bukan pekerjaan lama. Ini peluang baru.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY 5: MEMORI LISAN */}
        <section
          id="gallery-5"
          className="min-h-screen w-full relative flex flex-col justify-center px-6 md:px-20 py-32 bg-[#0E080A] text-[#FBF4EE] border-y border-[#FBF4EE]/5 overflow-hidden"
        >
          <div className="max-w-5xl mx-auto w-full space-y-20">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                Galeri 08 &bull; Memori Lisan
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight">
                Pengetahuan yang Hanya Hidup di Kepala Manusia
              </h2>
              <p className="text-[#FBF4EE]/70 font-light text-base md:text-lg">
                Dekade-dekade kebijaksanaan pertanian yang tak ternilai tersimpan
                dalam tradisi lisan tanpa kartu atau kotak arsip.
              </p>
            </div>

            <div id="timelineContainer" className="relative max-w-4xl mx-auto pt-8 pb-12">
              <div
                id="timelineLine"
                className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] bg-[#C4487A]/40 origin-top scale-y-0 transition-none"
              ></div>

              <div className="space-y-20 md:space-y-28 relative z-10">
                <div
                  className="timeline-node relative opacity-0 translate-y-12 transition-all"
                  data-index="1"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-xs z-20">
                    01
                  </div>
                  <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-2xl mx-auto text-center space-y-4 relative z-10 border border-[#C4487A]/20">
                    <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                      Generasi Sesepuh
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-[#FBF4EE]">
                      Seni halus membaca bumi dan langit.
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-sm md:text-base leading-relaxed font-light">
                      Selama beberapa generasi, petani Nganjuk mewariskan
                      rahasia secara lisan. Mereka membaca pergeseran cuaca
                      dengan menyentuh tanah basah saat fajar, mengenali
                      serangan hama sebelum gejala muncul di ujung daun, dan
                      menguasai teknik pengeringan alami yang presisi demi
                      memperpanjang umur benih menembus musim hujan.
                    </p>
                  </div>
                </div>

                <div
                  className="timeline-node relative opacity-0 translate-y-12 transition-all"
                  data-index="2"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-xs z-20">
                    02
                  </div>
                  <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-2xl mx-auto text-center space-y-4 relative z-10 border border-[#C4487A]/20">
                    <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                      Risiko Kehilangan
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-[#FBF4EE]">
                      Saat para sesepuh berpulang, sejarah tak tertulis ikut
                      memudar.
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-sm md:text-base leading-relaxed font-light">
                      Tanpa dokumentasi digital, setiap sesepuh yang berpulang
                      membawa serta naluri rotasi tanaman selama berabad-abad,
                      resep penanggulangan hama langka, dan strategi adaptasi
                      iklim yang terlewatkan oleh buku teks modern.
                    </p>
                  </div>
                </div>

                <div
                  className="timeline-node relative opacity-0 translate-y-12 transition-all"
                  data-index="3"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-xs z-20">
                    03
                  </div>
                  <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-2xl mx-auto text-center space-y-4 relative z-10 border border-[#C4487A]/20">
                    <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                      Penjaga Kebijaksanaan
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-[#FBF4EE]">
                      Kisah yang membentuk musim dan panen.
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-sm md:text-base leading-relaxed font-light">
                      Mulai dari memilih varietas Bauji dan Tajuk unggulan
                      berdasarkan pengamatan turun-temurun, memahami fase
                      rembulan yang tepat untuk menanam, hingga meracik
                      pestisida organik dari rempah lokal—pengetahuan ini hidup
                      dalam percakapan, bukan dokumen.
                    </p>
                  </div>
                </div>

                <div
                  className="timeline-node relative opacity-0 translate-y-12 transition-all"
                  data-index="4"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#0E080A] border border-[#C4487A] text-[#FBF4EE] font-mono text-xs z-20">
                    04
                  </div>
                  <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-2xl mx-auto text-center space-y-4 relative z-10 border border-[#C4487A]/20">
                    <span className="text-[#C4487A] text-xs font-mono uppercase tracking-widest">
                      Bahaya Kepunahan
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-[#FBF4EE]">
                      Sebelum ingatan itu lenyap selamanya.
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-sm md:text-base leading-relaxed font-light">
                      Setiap musim berlalu tanpa dokumentasi, kita berisiko
                      kehilangan solusi tak tergantikan yang tidak dapat ditiru
                      oleh teknologi apa pun. Masa depan pertanian Nganjuk
                      bergantung pada upaya melestarikan, menghormati, dan
                      meneruskan warisan hidup ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY 6: LAHIRNYA SIMANTRI */}
        <section
          id="gallery-6"
          className="min-h-screen w-full relative flex flex-col justify-center px-6 md:px-20 py-32 bg-[#4A1F2B] text-[#FBF4EE] overflow-hidden"
        >
          <div className="max-w-[760px] mx-auto w-full space-y-16">
            <div className="text-center space-y-6">
              <span className="text-[#3A5A40] text-xs font-mono uppercase tracking-[0.25em] block">
                Galeri 09 &bull; Penjaga SIMANTRI
              </span>
              <h2 className="font-serif text-5xl md:text-7xl font-light text-[#FBF4EE] tracking-tight">
                Lahirnya SIMANTRI
              </h2>
              <p className="text-[#FBF4EE]/80 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
                SIMANTRI bukan sekadar teknologi. Ia lahir untuk menjaga
                pengetahuan yang telah diwariskan selama puluhan tahun.
              </p>
            </div>

            <div id="simantriStoryContainer" className="relative pt-12 pb-16">
              <div
                id="simantriTimelineLine"
                className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] bg-[#C4487A]/40 origin-top scale-y-0 transition-none"
              ></div>

              <div className="space-y-32 relative z-10">
                <div
                  className="simantri-node relative opacity-0 translate-y-12 transition-all"
                  data-index="1"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#4A1F2B] border border-[#C4487A] text-[#FBF4EE] font-mono text-xs z-20 transition-all duration-300 hover:scale-110 hover:text-[#FBF4EE] cursor-pointer">
                    01
                  </div>
                  <div className="max-w-[700px] mx-auto text-center space-y-4 px-4">
                    <span className="text-[#C4487A] text-xs font-mono uppercase tracking-[0.2em] block">
                      Pengalaman Petani
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-[#FBF4EE] italic">
                      &quot;Semua berawal dari pengalaman.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-base md:text-lg leading-relaxed font-light">
                      Musim, tanah, varietas, waktu tanam, dan cara menghadapi
                      hama dipelajari melalui pengalaman yang diwariskan dari
                      generasi ke generasi.
                    </p>
                    <div className="w-16 h-[1px] bg-[#FBF4EE]/20 mx-auto mt-8"></div>
                  </div>
                </div>

                <div
                  className="simantri-node relative opacity-0 translate-y-12 transition-all"
                  data-index="2"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#4A1F2B] border border-[#C4487A] text-[#FBF4EE] font-mono text-xs z-20 transition-all duration-300 hover:scale-110 hover:text-[#FBF4EE] cursor-pointer">
                    02
                  </div>
                  <div className="max-w-[700px] mx-auto text-center space-y-4 px-4">
                    <span className="text-[#C4487A] text-xs font-mono uppercase tracking-[0.2em] block">
                      Pengetahuan
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-[#FBF4EE] italic">
                      &quot;Pengalaman berubah menjadi pengetahuan.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-base md:text-lg leading-relaxed font-light">
                      Setiap cerita petani, setiap musim tanam, dan setiap
                      keputusan di lapangan membentuk pengetahuan lokal yang
                      sangat berharga.
                    </p>
                    <div className="w-16 h-[1px] bg-[#FBF4EE]/20 mx-auto mt-8"></div>
                  </div>
                </div>

                <div
                  className="simantri-node relative opacity-0 translate-y-12 transition-all"
                  data-index="3"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#4A1F2B] border border-[#C4487A] text-[#FBF4EE] font-mono text-xs z-20 transition-all duration-300 hover:scale-110 hover:text-[#FBF4EE] cursor-pointer">
                    03
                  </div>
                  <div className="max-w-[700px] mx-auto text-center space-y-6 px-4">
                    <span className="text-[#C4487A] text-xs font-mono uppercase tracking-[0.2em] block">
                      SIMANTRI
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-[#FBF4EE] italic">
                      &quot;Pengetahuan yang kini dapat terus hidup.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-base md:text-lg leading-relaxed font-light">
                      SIMANTRI mengumpulkan, mendokumentasikan, dan menyusun
                      pengetahuan tersebut menjadi sebuah basis pengetahuan yang
                      dapat dimanfaatkan oleh generasi berikutnya.
                    </p>

                    <div className="pt-8 pb-4 flex flex-col items-center justify-center space-y-3 font-serif text-[#FBF4EE]/90 text-lg">
                      <span className="tracking-widest">Pengalaman</span>
                      <span className="text-[#C4487A] text-sm">&darr;</span>
                      <span className="tracking-widest">Pengetahuan</span>
                      <span className="text-[#C4487A] text-sm">&darr;</span>

                      <div className="my-4 flex justify-center">
                        <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-full bg-[#FBF4EE]/10 border-2 border-[#C4487A] p-3 shadow-2xl flex items-center justify-center animate-float overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#4A1F2B]/40 via-transparent to-[#C4487A]/20"></div>
                          {/* Emulated Glowing Logo Element */}
                          <div className="w-full h-full rounded-full bg-[#4A1F2B] flex flex-col items-center justify-center p-4 border border-[#C4487A]/30 relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                            <Sprout className="w-16 h-16 text-[#C4487A] mb-2 animate-pulse" />
                            <span className="font-serif text-xl tracking-[0.25em] font-bold text-[#FBF4EE]">
                              SIMANTRI
                            </span>
                            <span className="text-[9px] uppercase tracking-widest text-[#E6A15C]">
                              Nganjuk &bull; Est. 2026
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[#C4487A] text-sm">&darr;</span>
                      <span className="tracking-widest">Generasi</span>
                    </div>

                    <div className="w-16 h-[1px] bg-[#FBF4EE]/20 mx-auto mt-8"></div>
                  </div>
                </div>

                <div
                  className="simantri-node relative opacity-0 translate-y-12 transition-all"
                  data-index="4"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#4A1F2B] border border-[#C4487A] text-[#FBF4EE] font-mono text-xs z-20 transition-all duration-300 hover:scale-110 hover:text-[#FBF4EE] cursor-pointer">
                    04
                  </div>
                  <div className="max-w-[700px] mx-auto text-center space-y-6 px-4">
                    <span className="text-[#C4487A] text-xs font-mono uppercase tracking-[0.2em] block">
                      Masa Depan
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-[#FBF4EE] italic">
                      &quot;Warisan yang tidak lagi hilang.&quot;
                    </h3>
                    <p className="text-[#FBF4EE]/70 text-base md:text-lg leading-relaxed font-light">
                      Ketika pengetahuan tetap hidup, maka pertanian tidak hanya
                      bertahan hari ini, tetapi juga memiliki masa depan.
                    </p>
                    <div className="pt-6">
                      <blockquote className="font-serif text-xl md:text-2xl text-[#C4487A] font-light italic max-w-xl mx-auto leading-relaxed">
                        &quot;Teknologi terbaik bukanlah yang menggantikan manusia,
                        tetapi yang menjaga warisannya.&quot;
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY 7: MASA DEPAN */}
        <section
          id="gallery-7"
          className="min-h-screen w-full relative flex flex-col justify-center items-center px-6 md:px-20 py-28 bg-[#0E080A] text-[#FBF4EE] text-center"
        >
          <div className="absolute inset-0 ambient-spotlight opacity-50"></div>

          <div className="max-w-4xl mx-auto space-y-12 z-10">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#C4487A]/30 text-[#C4487A] text-xs font-mono uppercase tracking-widest">
              Galeri 10 &bull; Fajar Era Baru
            </div>

            <h2 className="font-serif text-4xl md:text-7xl font-light leading-tight">
              &quot;Kota Brambang tidak dibangun dalam satu musim. <br />
              <span className="italic text-[#C4487A]">
                Ia dibangun melintasi generasi.&quot;
              </span>
            </h2>

            <p className="text-[#FBF4EE]/80 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Kini, giliran kita melanjutkan kisah ini. Dengan kebijaksanaan di
              dalam hati dan teknologi di genggaman tangan.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C4487A] hover:bg-[#C4487A]/90 text-[#FBF4EE] font-medium text-sm tracking-wide transition-all shadow-xl hover:shadow-[#C4487A]/30 flex items-center justify-center space-x-3 group cursor-pointer"
              >
                <span>Masuk Portal SIMANTRI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={scrollToTop}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel hover:bg-[#FBF4EE]/10 text-[#FBF4EE] font-medium text-sm tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Pameran</span>
              </button>
            </div>

            <footer className="pt-20 border-t border-[#FBF4EE]/10 text-xs text-[#FBF4EE]/50 space-y-2">
              <p>Dunia Brambang &bull; Pameran Budaya & Pertanian Interaktif</p>
              <p>Didukung oleh SIMANTRI &bull; Nganjuk, Jawa Timur</p>
            </footer>
          </div>
        </section>
      </main>

    </div>
  )
}
