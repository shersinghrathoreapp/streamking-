import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://jirecklkhiknejrdjfev.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcmVja2xraGlrbmVqcmRqZmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzI2OTEsImV4cCI6MjA2NDU0ODY5MX0.F0gKeYb8fwkF3No2HuiWJ8I3i7Y_qQ2H7B_9J8qK8Rk'
)
