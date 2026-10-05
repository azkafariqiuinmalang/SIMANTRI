/* eslint-disable @typescript-eslint/no-require-imports -- Dependency-free Node test harness. */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const vm = require('node:vm')

function mount({ reduced = false, supported = true } = {}) {
  const animations = []
  class Element {
    constructor(top) { this.top = top; this.attrs = new Set(); this.tagName = 'DIV' }
    getBoundingClientRect() { return { top: this.top, bottom: this.top + 300 } }
    setAttribute(key) { this.attrs.add(key) }
    removeAttribute(key) { this.attrs.delete(key) }
    hasAttribute(key) { return this.attrs.has(key) }
    contains(node) { return node === this }
    animate(frames, options) {
      const animation = { frames, options, cancelled: false, finished: new Promise(() => {}), cancel() { this.cancelled = true } }
      animations.push(animation)
      return animation
    }
  }
  const targets = [new Element(100), new Element(1100), new Element(1400)]
  const section = { querySelectorAll: () => targets }
  const root = { querySelectorAll: () => [section], listeners: {}, addEventListener(k, fn) { this.listeners[k] = fn }, removeEventListener(k) { delete this.listeners[k] } }
  const media = { matches: reduced, addEventListener(k, fn) { this.listener = fn }, removeEventListener() { this.listener = null } }
  const window = { innerHeight: 900, matchMedia: () => media, listeners: {}, addEventListener(k, fn) { this.listeners[k] = fn }, removeEventListener(k) { delete this.listeners[k] } }
  const observers = []
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; this.observed = new Set(); observers.push(this) }
    observe(el) { this.observed.add(el) }
    unobserve(el) { this.observed.delete(el) }
    disconnect() { this.observed.clear() }
  }
  const source = ts.transpileModule(fs.readFileSync('src/components/landing/entrances.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const exports = {}
  vm.runInNewContext(source, { exports, window, HTMLElement: Element, IntersectionObserver: supported ? Observer : undefined, getComputedStyle: () => ({ getPropertyValue: () => '24px' }) })
  const cleanup = exports.setupLandingEntrances(root)
  return { targets, root, media, window, animations, observer: observers[0], cleanup }
}

test('Entrance enhancement leaves current viewport readable and staggers unseen groups once', () => {
  const app = mount()
  assert.ok(!app.targets[0].hasAttribute('data-entrance-pending'))
  assert.equal(app.observer.observed.size, 2)
  const entries = app.targets.slice(1).map(target => ({ target, isIntersecting: true }))
  app.observer.callback(entries)
  assert.equal(app.animations.length, 2)
  assert.equal(app.animations[0].options.delay, 0)
  assert.equal(app.animations[1].options.delay, 60)
  assert.equal(app.animations[0].frames[0].translate, '0 24px')
  assert.equal(app.observer.observed.size, 0)
  app.observer.callback(entries)
  assert.equal(app.animations.length, 2)
  app.cleanup()
  assert.ok(app.animations.every(a => a.cancelled))
})

test('Reduced motion or missing observer never hides content', () => {
  for (const options of [{ reduced: true }, { supported: false }]) {
    const app = mount(options)
    assert.ok(app.targets.every(t => !t.hasAttribute('data-entrance-pending')))
    assert.equal(app.animations.length, 0)
    app.cleanup()
  }
})

test('Live motion preference, printing, and cleanup restore all content', () => {
  for (const trigger of ['motion', 'print', 'cleanup']) {
    const app = mount()
    app.observer.callback([{ target: app.targets[1], isIntersecting: true }])
    if (trigger === 'motion') { app.media.matches = true; app.media.listener() }
    if (trigger === 'print') app.window.listeners.beforeprint()
    if (trigger === 'cleanup') app.cleanup()
    assert.ok(app.targets.every(t => !t.hasAttribute('data-entrance-pending')))
    assert.ok(app.animations.every(a => a.cancelled))
    assert.equal(app.observer.observed.size, 0)
  }
})

test('Keyboard focus restores an unseen group immediately without animation', () => {
  const app = mount()
  app.root.listeners.focusin({ target: app.targets[2] })
  assert.ok(!app.targets[2].hasAttribute('data-entrance-pending'))
  assert.equal(app.animations.length, 0)
  app.cleanup()
})
