import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jjrecklhiknejrdjjfev.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcmVja2xoaWtuZXJkZGpmZXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzI0NzIsImV4cCI6MjA2MTM0ODQ3Mn0.TU_YAHAN_POORI_KEY_PASTE_KAR'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
