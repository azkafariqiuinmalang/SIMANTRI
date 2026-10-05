/** Progressive enhancement: SSR/no-JS content stays visible, and each group enters only once. */
export function setupLandingEntrances(root: HTMLElement) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (media.matches || typeof IntersectionObserver === 'undefined') return () => {}

  const targets = Array.from(root.querySelectorAll<HTMLElement>(':scope > section:not(#beranda)')).flatMap(section => {
    const explicit = Array.from(section.querySelectorAll<HTMLElement>('[data-entrance]'))
    if (explicit.length) return explicit
    const container = section.firstElementChild
    if (!container) return []
    // Split editorial columns and card grids, never animate an entire long mobile section.
    return Array.from(container.children).flatMap(group => group.classList.contains('grid')
      ? Array.from(group.children)
      : [group]).filter((group): group is HTMLElement => group instanceof HTMLElement && group.tagName !== 'IMG')
  })
  const animations = new Map<HTMLElement, Animation>()
  const show = (element: HTMLElement, delay = 0, animate = true) => {
    if (!element.hasAttribute('data-entrance-pending')) return
    const distance = getComputedStyle(element).getPropertyValue('--landing-entrance-distance').trim() || '24px'
    element.removeAttribute('data-entrance-pending')
    observer.unobserve(element)
    if (!animate || media.matches || typeof element.animate !== 'function') return
    try {
      // Independent translate does not override card-hover transforms or ongoing UI animations.
      const animation = element.animate([
        { opacity: 0, translate: `0 ${distance}` },
        { opacity: 1, translate: '0 0' },
      ], { duration: 640, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' })
      animations.set(element, animation)
      animation.finished.then(() => animations.delete(element), () => animations.delete(element))
    } catch { /* Final readable state is already restored if animation is unavailable. */ }
  }
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => show(entry.target as HTMLElement, Math.min(index, 4) * 60))
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' })

  targets.forEach(target => {
    // Do not hide an already visible/restored-anchor viewport after hydration.
    const rect = target.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return
    target.setAttribute('data-entrance-pending', '')
    observer.observe(target)
  })
  const showAll = () => {
    animations.forEach(animation => animation.cancel())
    animations.clear()
    targets.forEach(target => show(target, 0, false))
    observer.disconnect()
  }
  const onPreferenceChange = () => { if (media.matches) showAll() }
  const onFocus = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement)) return
    const target = targets.find(element => element.contains(event.target as Node))
    if (target) { animations.get(target)?.cancel(); show(target, 0, false) }
  }
  root.addEventListener('focusin', onFocus)
  media.addEventListener('change', onPreferenceChange)
  window.addEventListener('beforeprint', showAll)
  return () => {
    showAll()
    root.removeEventListener('focusin', onFocus)
    media.removeEventListener('change', onPreferenceChange)
    window.removeEventListener('beforeprint', showAll)
  }
}
