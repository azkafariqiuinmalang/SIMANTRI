/** A shallow arch: the centre is slightly higher, while off-screen cards stay level. */
export function carouselArcOffset(center: number, width: number) {
  if (width <= 0) return 0
  const distance = Math.min(1, Math.abs((center - width / 2) / (width / 2)))
  const depth = Math.min(44, Math.max(18, width * 0.035))
  return -depth * (1 - distance * distance)
}

export function setupCurvedCarousel(root: HTMLElement) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.carousel-card'))
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  let visible = true
  let hovered: HTMLElement | null = null
  let disposed = false
  const update = () => {
    const bounds = root.getBoundingClientRect()
    // Read every position first; curve and hover use independent CSS properties.
    const offsets = cards.map(card => {
      const rect = card.getBoundingClientRect()
      return carouselArcOffset(rect.left + rect.width / 2 - bounds.left, bounds.width)
    })
    cards.forEach((card, index) => card.style.setProperty('--carousel-arc-y', `${offsets[index].toFixed(2)}px`))
  }
  const tick = () => {
    frame = 0
    if (disposed || !visible || document.hidden) return
    update()
    if (!media.matches && !root.hasAttribute('data-pointer-hover')) frame = requestAnimationFrame(tick)
  }
  const refresh = () => { if (!frame && !disposed) frame = requestAnimationFrame(tick) }
  const clearHover = () => {
    hovered?.removeAttribute('data-pointer-hover')
    hovered = null
    root.removeAttribute('data-pointer-hover')
    refresh()
  }
  const onPointer = (event: PointerEvent) => {
    // Use the actual pointer event, so a mouse on a touch-first device still works.
    if (event.pointerType === 'touch') { clearHover(); return }
    root.setAttribute('data-pointer-hover', '')
    const card = event.target instanceof Element ? event.target.closest<HTMLElement>('.carousel-card') : null
    if (hovered !== card) {
      hovered?.removeAttribute('data-pointer-hover')
      hovered = card && root.contains(card) ? card : null
      hovered?.setAttribute('data-pointer-hover', '')
    }
    refresh()
  }
  const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    if (visible) refresh()
    else { cancelAnimationFrame(frame); frame = 0 }
  }) : null
  observer?.observe(root)
  root.addEventListener('pointerover', onPointer)
  root.addEventListener('pointermove', onPointer)
  root.addEventListener('pointerleave', clearHover)
  root.addEventListener('pointercancel', clearHover)
  root.addEventListener('scroll', refresh, { passive: true })
  window.addEventListener('resize', refresh)
  document.addEventListener('visibilitychange', clearHover)
  media.addEventListener('change', refresh)
  refresh()
  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    observer?.disconnect()
    clearHover()
    cards.forEach(card => card.style.removeProperty('--carousel-arc-y'))
    root.removeEventListener('pointerover', onPointer)
    root.removeEventListener('pointermove', onPointer)
    root.removeEventListener('pointerleave', clearHover)
    root.removeEventListener('pointercancel', clearHover)
    root.removeEventListener('scroll', refresh)
    window.removeEventListener('resize', refresh)
    document.removeEventListener('visibilitychange', clearHover)
    media.removeEventListener('change', refresh)
  }
}
