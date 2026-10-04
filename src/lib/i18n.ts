import javanese from './locales/jv.json'

export type Language = 'id' | 'jv'
export type TranslationParams = Record<string, string | number>
export const LANGUAGE_STORAGE_KEY = 'simantri.language'

export function normalizeLanguage(value: unknown): Language {
  return value === 'jv' ? 'jv' : 'id'
}

/** Exact UI messages only: never translate arbitrary user or retrieved content. */
export function translate(source: string, language: Language, params: TranslationParams = {}): string {
  const dictionary: Record<string, string> = javanese
  const message = language === 'jv' && Object.hasOwn(dictionary, source) ? dictionary[source] : source
  return message.replace(/\{(\w+)\}/g, (token, name: string) => Object.hasOwn(params, name) ? String(params[name]) : token)
}

/** Only allow a fixed locale instruction, never arbitrary request text. */
export function chatLanguageInstruction(value: unknown): string {
  if (normalizeLanguage(value) !== 'jv') return ''
  return '\n\nPREFERENSI BAHASA JAWABAN: Untuk jawaban ini, gunakan bahasa Jawa krama alus yang sopan, alami, dan mudah dipahami petani Nganjuk, menggantikan preferensi bahasa Indonesia di bagian gaya komunikasi. Pertahankan seluruh aturan keamanan dan batasan agronomi. Jangan menerjemahkan nama penyakit, nama ilmiah, bahan aktif, dosis, angka, satuan, judul sumber, atau kutipan asli. Bila istilah teknis perlu diperjelas, tambahkan penjelasan krama alus tanpa mengubah maknanya. Bila pengguna secara eksplisit meminta bahasa Indonesia, ikuti permintaan tersebut. Jangan mengaku telah menerjemahkan dokumen sumber.'
}
