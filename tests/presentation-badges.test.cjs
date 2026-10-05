/* eslint-disable @typescript-eslint/no-require-imports -- Dependency-free Node test harness. */
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const source = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')

test('decorative model, version and connectivity badges are absent', () => {
  const cases = {
    'src/app/page.tsx': ['AI Asisten Tani Nganjuk', 'v2.4 Online', 'Live Telemetri', 'RAG Terverifikasi', 'Data Pasar Aktif', 'card.badge', 'card.tag'],
    'src/app/dashboard/page.tsx': ['Pasar Sukomoro Aktif • Terhubung Real-Time', 'Model v2.4 (Gemini + RAG)', 'MAPE 4.1%', 'Monitoring Aktif'],
    'src/app/dashboard/chat/page.tsx': ['v2.4 Gemini + RAG Pertanian', 'topic.count', 'topic.badgeColor'],
    'src/app/dashboard/profil/page.tsx': ['Sinkronisasi Si-Petani Aktif', 'v2.4 Nganjuk'],
    'src/app/admin/layout.tsx': ['Sistem Optimal'],
    'src/app/admin/page.tsx': ['Optimal (v2.4)'],
    'src/app/admin/market/input/page.tsx': ['Terverifikasi Sistem'],
    'src/app/login/page.tsx': ['Agro-Intelligence Platform', 'Portal Masuk'],
    'src/app/register/page.tsx': ['Komunitas Agrikultur Nganjuk'],
    'src/app/admin/verifikasi-penyuluh/page.tsx': ['Governance & Credential Authority'],
    'src/app/privacy/page.tsx': ['Transparansi & Perlindungan Data'],
    'src/app/terms/page.tsx': ['Ketentuan Penggunaan Platform'],
    'src/app/data-deletion/page.tsx': ['User Data Deletion Instructions'],
  }
  for (const [file, labels] of Object.entries(cases)) {
    for (const label of labels) assert.ok(!source(file).includes(label), `${file}: ${label}`)
  }
})

test('functional controls, contextual answer provenance and detection results remain', () => {
  assert.match(source('src/app/dashboard/chat/page.tsx'), /message\.dari_kb &&/)
  assert.match(source('src/app/dashboard/chat/page.tsx'), /Tervalidasi RAG BPTP/)
  assert.match(source('src/app/dashboard/deteksi/page.tsx'), /analysisResult/)
  assert.match(source('src/app/page.tsx'), /carousel-card-img/)
  assert.match(source('src/app/page.tsx'), /PlatformVideoDemo/)
  assert.match(source('src/app/dashboard/layout.tsx'), /<LanguageSwitcher/)
  assert.match(source('src/app/dashboard/layout.tsx'), /<ThemeSwitcher/)
})
