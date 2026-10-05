/* eslint-disable @typescript-eslint/no-require-imports -- Dependency-free Node test harness. */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const vm = require('node:vm')

test('Carousel arch is symmetric, shallow, responsive, and bounded outside the viewport', () => {
  const exports = {}
  const source = ts.transpileModule(fs.readFileSync('src/components/landing/curved-carousel.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  vm.runInNewContext(source, { exports })
  const arc = exports.carouselArcOffset
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440]) {
    const middle = arc(width / 2, width)
    assert.ok(middle >= -44 && middle <= -18)
    assert.ok(arc(width / 4, width) > middle)
    assert.equal(arc(width / 4, width), arc(width * 3 / 4, width))
    assert.ok(Math.abs(arc(0, width)) < 0.001)
    assert.ok(Math.abs(arc(width * 2, width)) < 0.001)
  }
  assert.equal(arc(0, 0), 0)
})

test('Carousel zoom covers secondary mouse pointers and is not disabled by reduced motion', () => {
  const css = fs.readFileSync('src/app/globals.css', 'utf8')
  const carousel = css.slice(css.indexOf('.carousel-card {'), css.indexOf('/* Enhanced Interactive Hover Effects'))
  assert.match(carousel, /@media \(any-hover: hover\) and \(any-pointer: fine\)/)
  assert.match(carousel, /\.carousel-card:hover\s*\{[^}]*scale\(1\.12\)/)
  assert.match(carousel, /\.carousel-card:hover \.carousel-card-img\s*\{[^}]*scale\(1\.16\)/)
  assert.match(carousel, /\.carousel-card\[data-pointer-hover\]\s*\{[^}]*scale\(1\.12\)/)
  assert.match(carousel, /translate: 0 var\(--carousel-arc-y, 0px\)/)
  const reduced = carousel.slice(carousel.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(reduced, /\.carousel-track\s*\{[^}]*animation: none/)
  assert.match(reduced, /transition: none !important/)
  assert.match(reduced, /overflow-x: auto/)
  assert.ok(!reduced.includes('transform: none'))
  assert.match(css, /\.carousel-container\[data-pointer-hover\] \.carousel-track\s*\{\s*animation-play-state: paused/)
})
