import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jjrecklhiknejrdjjfev.supabase.co'
const supabaseAnonKey = 'YAHAN_TU_SUPABASE_SE_COPY_KI_HUI_ANON_KEY_DAAL'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
