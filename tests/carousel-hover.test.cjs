/* eslint-disable @typescript-eslint/no-require-imports -- Dependency-free Node test harness. */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')

test('Carousel zoom covers secondary mouse pointers and is not disabled by reduced motion', () => {
  const css = fs.readFileSync('src/app/globals.css', 'utf8')
  const carousel = css.slice(css.indexOf('.carousel-card {'), css.indexOf('/* Enhanced Interactive Hover Effects'))
  assert.match(carousel, /@media \(any-hover: hover\) and \(any-pointer: fine\)/)
  assert.match(carousel, /\.carousel-card:hover\s*\{[^}]*scale\(1\.08\)/)
  assert.match(carousel, /\.carousel-card:hover \.carousel-card-img\s*\{[^}]*scale\(1\.12\)/)
  const reduced = carousel.slice(carousel.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(reduced, /\.carousel-track\s*\{[^}]*animation: none/)
  assert.match(reduced, /transition: none !important/)
  assert.match(reduced, /overflow-x: auto/)
  assert.ok(!reduced.includes('transform: none'))
  assert.match(css, /\.carousel-container:hover \.carousel-track\s*\{\s*animation-play-state: paused/)
})
