export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'petani' | 'penyuluh' | 'admin'
export type EntryStatus = 'draft' | 'published'
export type PriceSource = 'manual' | 'scraping'
export type DetectionStatus = 'unreviewed' | 'confirmed' | 'corrected'
export type FeedbackValue = 'sesuai' | 'tidak_sesuai'
export type ChatFeedbackValue = 'helpful' | 'not_helpful'
export type SuggestionType = 'laporan_keliru' | 'usulan_pembaruan'
export type SuggestionStatus =
  | 'diterima_menunggu_tinjauan'
  | 'digunakan_dalam_pembaruan'
  | 'tidak_digunakan'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  village: string | null
  is_verified_contributor: boolean
  nip?: string | null
  institution?: string | null
  verification_doc_url?: string | null
  verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
  verified_at?: string | null
  verified_by?: string | null
  created_at: string
  updated_at?: string
}

export interface KnowledgeEntry {
  id: string
  doc_id: string
  title: string
  category: string
  subcategory: string | null
  topic: string | null
  summary: string
  content: string
  keywords: string[]
  semantic_keywords: string[]
  synonyms: string[]
  entity_type: string | null
  location: string | null
  recommended_month: string[]
  recommended_season: string | null
  related_varieties: string[]
  related_diseases: string[]
  related_pests: string[]
  related_weather: string[]
  evidence_level: string | null
  review_status: string | null
  status: EntryStatus
  author_id: string
  based_on_suggestion_id: string | null
  created_at: string
  updated_at: string
}

export interface MarketPrice {
  id: string
  tanggal: string
  harga: number
  source: PriceSource
  input_by: string | null
  created_at: string
}

export interface WeatherData {
  id: string
  tanggal: string
  temperature: number | null
  rainfall: number | null
  wind_speed: number | null
  fetched_at: string
}

export interface PricePrediction {
  id: string
  prediction_date: string
  predicted_price: number
  actual_price: number | null
  model_version: string
  input_features: Json
  mape_at_training: number
  created_at: string
}

export interface CvDetection {
  id: string
  user_id: string
  image_url: string
  model_version: string
  created_at: string
}

export interface CvDetectionResult {
  id: string
  detection_id: string
  predicted_class: string
  confidence: number
  bbox_x: number | null
  bbox_y: number | null
  bbox_width: number | null
  bbox_height: number | null
  status: DetectionStatus
  farmer_feedback: FeedbackValue | null
  farmer_correction_note: string | null
  feedback_by: string | null
  feedback_at: string | null
  reviewer_id: string | null
  reviewer_note: string | null
  created_at: string
}

export interface ChatLog {
  id: string
  user_id: string | null
  message: string
  response: string
  feedback: ChatFeedbackValue | null
  feedback_note: string | null
  created_at: string
}

export interface ContentSuggestion {
  id: string
  type: SuggestionType
  related_entry_id: string | null
  submitted_by: string
  submitted_role: UserRole
  content_note: string
  status: SuggestionStatus
  reviewed_by: string | null
  review_note: string | null
  reviewed_at: string | null
  created_at: string
}

export interface CvSignalReview {
  predicted_class: string
  village: string | null
  jumlah_feedback_tidak_sesuai: number
  jumlah_petani_berbeda: number
  catatan_petani: string[] | null
  feedback_terakhir: string
}
