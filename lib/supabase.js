import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jjrecklhiknejrdjjfev.supabase.co'
const supabaseAnonKey =eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcmVja2xoaWtuZWpyZGpqZmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTY4NDcsImV4cCI6MjA5NDA3Mjg0N30.IU4lxcZ-4ZyoMZlEVO1Kur941VzZ-l8O4MHk_9Vwu3E

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
