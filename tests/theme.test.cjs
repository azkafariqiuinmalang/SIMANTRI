/* eslint-disable @typescript-eslint/no-require-imports -- Native Node test harness; no extra packages. */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

const compiled = ts.transpileModule(fs.readFileSync('src/lib/theme.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const context = { exports: {} }
vm.runInNewContext(compiled, context)
const theme = context.exports

test('Theme preference is allowlisted and follows the device only in system mode', () => {
  for (const input of [null, undefined, 'invalid', '<script>']) assert.equal(theme.normalizeTheme(input), 'system')
  for (const dark of [true, false]) {
    assert.equal(theme.resolveTheme('light', dark), 'light')
    assert.equal(theme.resolveTheme('dark', dark), 'dark')
    assert.equal(theme.resolveTheme('system', dark), dark ? 'dark' : 'light')
  }
})

test('First-paint script handles stored, system, invalid, and unavailable storage', () => {
  for (const [stored, deviceDark, expected] of [['dark', false, 'dark'], ['light', true, 'light'], ['system', true, 'dark'], [null, false, 'light'], ['invalid', true, 'dark']]) {
    const document = { documentElement: { dataset: {} } }
    vm.runInNewContext(theme.THEME_BOOTSTRAP, { document, localStorage: { getItem: () => stored }, matchMedia: () => ({ matches: deviceDark }) })
    assert.equal(document.documentElement.dataset.theme, expected)
  }
  const document = { documentElement: { dataset: {} } }
  vm.runInNewContext(theme.THEME_BOOTSTRAP, { document, localStorage: { getItem() { throw new Error('blocked') } }, matchMedia: () => ({ matches: true }) })
  assert.equal(document.documentElement.dataset.theme, 'dark')
})

test('Dark semantic text pairs meet AA contrast on all neutral surfaces', () => {
  const css = fs.readFileSync('src/app/theme.css', 'utf8')
  const values = Object.fromEntries([...css.matchAll(/--theme-([\w-]+): (#[\da-f]{6});/g)].map(m => [m[1], m[2]]))
  const luminance = hex => {
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
  }
  for (const foreground of ['ink', 'body', 'muted', 'green', 'rose', 'red', 'amber']) for (const background of ['canvas', 'surface', 'raised']) {
    const a = luminance(values[foreground]), b = luminance(values[background])
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    assert.ok(ratio >= 4.5, `${foreground}/${background}: ${ratio.toFixed(2)}`)
  }
})
