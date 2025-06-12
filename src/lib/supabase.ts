
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rexymuwmprtdswhqgahv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleHltdXdtcHJ0ZHN3aHFnYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTk2MDgsImV4cCI6MjA2NTI5NTYwOH0.jAZNZD6P16wOjFiHAAv5NroAUIRO6XAiekEFvqZyYuk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
