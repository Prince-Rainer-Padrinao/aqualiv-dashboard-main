import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pwmbhijtdbvinsuvhomz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bWJoaWp0ZGJ2aW5zdXZob216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjYzMzEsImV4cCI6MjA5MDY0MjMzMX0.ViIc0qh6uDhKJ3J-R_vagBeHsUTlbefyqBule06v4_I'

export const supabase = createClient(supabaseUrl, supabaseKey)