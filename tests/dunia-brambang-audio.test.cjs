/* eslint-disable @typescript-eslint/no-require-imports -- Dependency-free Node test harness. */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

function mount({ resume = () => Promise.resolve(), unsupported = false } = {}) {
  const elements = Object.fromEntries(['audioToggleBtn', 'audioText', 'audioIcon'].map(id => [id, {
    attrs: {}, textContent: '', listeners: {},
    setAttribute(key, value) { this.attrs[key] = value },
    addEventListener(key, listener) { this.listeners[key] = listener },
  }]))
  const sources = []
  const contexts = []
  class AudioContext {
    constructor() { this.currentTime = 0; this.state = 'running'; contexts.push(this) }
    resume() { return resume() }
    close() { this.state = 'closed'; return Promise.resolve() }
    createBuffer(channels, length, sampleRate) {
      const data = Array.from({ length: channels }, () => new Float32Array(length))
      return { length, sampleRate, duration: length / sampleRate, getChannelData: i => data[i] }
    }
    createGain() {
      return { gain: { cancelScheduledValues() {}, setValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, disconnect() {} }
    }
    createBufferSource() {
      const source = { starts: 0, stops: 0, connect() {}, disconnect() {}, start() { this.starts++ }, stop() { this.stops++ } }
      sources.push(source)
      return source
    }
  }
  const document = { hidden: false, listeners: {}, getElementById: id => elements[id], addEventListener(key, listener) { this.listeners[key] = listener } }
  const window = { AudioContext: unsupported ? undefined : AudioContext, listeners: {}, addEventListener(key, listener) { this.listeners[key] = listener } }
  vm.runInNewContext(fs.readFileSync('public/dunia-brambang-audio.js', 'utf8'), { document, window })
  return { button: elements.audioToggleBtn, elements, document, window, sources, contexts, click: () => elements.audioToggleBtn.listeners.click() }
}

test('Music is opt-in, a non-silent looping stereo composition, and stops on toggle', async () => {
  const app = mount()
  assert.equal(app.contexts.length, 0)
  await app.click()
  assert.equal(app.button.attrs['aria-pressed'], 'true')
  assert.equal(app.sources.length, 1)
  const source = app.sources[0]
  assert.equal(source.loop, true)
  assert.ok(source.buffer.duration > 26 && source.buffer.duration < 27)
  for (const channel of [0, 1]) {
    const samples = source.buffer.getChannelData(channel)
    let peak = 0
    let energy = 0
    for (const value of samples) { assert.ok(Number.isFinite(value)); peak = Math.max(peak, Math.abs(value)); energy += value * value }
    assert.ok(peak <= 0.801 && energy / samples.length > 0.00001)
  }
  await app.click()
  assert.equal(source.stops, 1)
  assert.equal(app.button.attrs['aria-pressed'], 'false')
  await app.click()
  assert.equal(app.sources.length, 2)
  assert.equal(source.stops, 1)
  assert.equal(app.sources[1].starts, 1)
})

test('A second click cancels a pending audio resume without late playback', async () => {
  let finish
  const app = mount({ resume: () => new Promise(resolve => { finish = resolve }) })
  const pending = app.click()
  await app.click()
  finish()
  await pending
  assert.equal(app.sources.length, 0)
  assert.equal(app.button.attrs['aria-pressed'], 'false')
})

test('Backgrounding and navigation stop music; pagehide releases the context', async () => {
  const app = mount()
  await app.click()
  app.document.hidden = true
  app.document.listeners.visibilitychange()
  assert.equal(app.sources[0].stops, 1)
  assert.equal(app.button.attrs['aria-pressed'], 'false')
  app.document.hidden = false
  app.document.listeners.visibilitychange()
  assert.equal(app.sources.length, 1)
  await app.click()
  app.window.listeners.pagehide()
  assert.equal(app.sources[1].stops, 1)
  assert.equal(app.contexts[0].state, 'closed')
})

test('Unsupported or blocked audio reports a retryable error, not a false playing state', async () => {
  for (const options of [{ unsupported: true }, { resume: () => Promise.reject(new Error('blocked')) }]) {
    const app = mount(options)
    await app.click()
    assert.equal(app.sources.length, 0)
    assert.equal(app.button.attrs['aria-pressed'], 'false')
    assert.match(app.elements.audioText.textContent, /Coba lagi/)
  }
})

test('The actual iframe document loads local music and exposes an accessible mobile control', () => {
  const html = fs.readFileSync('public/dunia-brambang.html', 'utf8')
  assert.match(html, /src="\/dunia-brambang-audio.js" defer/)
  assert.match(html, /id="audioToggleBtn"[^>]*aria-pressed="false"[^>]*aria-label="Aktifkan musik akustik"/)
  assert.ok(!html.includes('playAmbientNotes') && !html.includes('Tone.js'))
})
