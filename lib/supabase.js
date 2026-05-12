import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jjrecklhiknejrdjjfev.supabase.co'
const supabaseAnonKey = 'sb_publishable_fDouKSuUu6Wq84...'  // ← Yahan paste kar

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
