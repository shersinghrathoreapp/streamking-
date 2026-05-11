import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rwitrzdzxbpdpdxpmlud.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3aXRyemR6eGJwZHBkeHBtbHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzE4NjAsImV4cCI6MjA3MzYwNzg2MH0.MiE5p3Cc_4NOyU1NXN4dGJmiTWPtLCnhA9nDvGy3zQg'

export const supabase = createClient(supabaseUrl, supabaseKey)
