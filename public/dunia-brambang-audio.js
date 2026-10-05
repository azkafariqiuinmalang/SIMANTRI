/* Original, locally synthesized fingerpicked-string accompaniment. No remote audio or samples. */
(() => {
  const button = document.getElementById('audioToggleBtn')
  if (!button) return
  const text = document.getElementById('audioText')
  let context = null
  let buffer = null
  let source = null
  let output = null
  let requested = false
  let revision = 0

  // Cmaj7 – Am7 – Fmaj7 – G6, two bars each, at a calm 72 BPM.
  // Karplus–Strong models a plucked string rather than a sustained electronic pad.
  function createAcousticLoop(audioContext) {
    const rate = 22050
    const step = 60 / 72 / 2
    const chords = [[48, 55, 59, 64], [45, 52, 55, 60], [41, 48, 52, 57], [43, 50, 52, 59]]
    const pattern = [0, 2, 1, 3, 0, 2, 1, 2, 0, 1, 2, 3, 1, 2, 3, 2]
    const length = Math.round(step * 64 * rate)
    const result = audioContext.createBuffer(2, length, rate)
    const left = result.getChannelData(0)
    const right = result.getChannelData(1)
    let seed = 137
    for (let note = 0; note < 64; note++) {
      const string = pattern[note % 16]
      const midi = chords[Math.floor(note / 16)][string]
      const frequency = 440 * 2 ** ((midi - 69) / 12)
      const delay = Math.max(2, Math.round(rate / frequency - 0.5))
      const ring = new Float32Array(delay)
      for (let i = 0; i < delay; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
        ring[i] = seed / 4294967296 * 2 - 1
      }
      const start = Math.round(note * step * rate)
      const duration = Math.round(rate * 2.4)
      const strength = string === 0 ? 0.85 : 0.6
      for (let i = 0; i < duration; i++) {
        const pos = i % delay
        const sample = ring[pos]
        ring[pos] = 0.996 * (sample + ring[(pos + 1) % delay]) / 2
        const attack = Math.min(1, i / (rate * 0.006))
        const tail = Math.min(1, (duration - i) / (rate * 0.1))
        const value = sample * strength * attack * tail
        // Wrap note tails into the beginning so the loop boundary stays musical.
        const target = (start + i) % length
        left[target] += value * (string % 2 ? 0.8 : 1)
        right[target] += value * (string % 2 ? 1 : 0.8)
      }
    }
    let peak = 0
    for (let i = 0; i < length; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]))
    for (let i = 0; i < length; i++) {
      left[i] *= 0.8 / Math.max(peak, 0.001)
      right[i] *= 0.8 / Math.max(peak, 0.001)
    }
    return result
  }

  function updateControl(playing, failed = false) {
    const label = playing ? 'Nonaktifkan musik akustik' : failed ? 'Coba aktifkan musik akustik kembali' : 'Aktifkan musik akustik'
    button.setAttribute('aria-pressed', String(playing))
    button.setAttribute('aria-label', label)
    button.setAttribute('title', label)
    text.textContent = failed ? 'Musik tidak tersedia. Coba lagi.' : `Musik Akustik: ${playing ? 'Nyala' : 'Mati'}`
    const icon = document.getElementById('audioIcon')
    if (icon) {
      icon.setAttribute('data-lucide', playing ? 'volume-2' : 'volume-x')
      icon.setAttribute('aria-hidden', 'true')
      if (window.lucide) window.lucide.createIcons()
    }
  }

  function stopMusic() {
    requested = false
    revision++
    if (output) {
      output.gain.cancelScheduledValues(context.currentTime)
      output.gain.setValueAtTime(0, context.currentTime)
    }
    if (source) {
      source.stop()
      source.disconnect()
      source = null
    }
    if (output) { output.disconnect(); output = null }
    updateControl(false)
  }

  button.addEventListener('click', async () => {
    if (requested) { stopMusic(); return }
    requested = true
    const attempt = ++revision
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) throw new Error('Web Audio unavailable')
      if (!context || context.state === 'closed') context = new AudioContextClass()
      // Resume directly from the click, including on mobile; never autoplay.
      await context.resume()
      if (!requested || attempt !== revision) return
      if (!buffer) buffer = createAcousticLoop(context)
      output = context.createGain()
      output.gain.setValueAtTime(0, context.currentTime)
      output.gain.linearRampToValueAtTime(0.24, context.currentTime + 0.3)
      output.connect(context.destination)
      source = context.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(output)
      source.start()
      updateControl(true)
    } catch {
      if (attempt !== revision) return
      stopMusic()
      updateControl(false, true)
    }
  })

  // Do not keep music playing in another tab or after leaving the exhibition.
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMusic() })
  window.addEventListener('pagehide', () => {
    stopMusic()
    if (context) { context.close().catch(() => {}); context = null }
    buffer = null
  })
})()
