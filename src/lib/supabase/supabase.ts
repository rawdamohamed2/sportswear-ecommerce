import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rkbiliglobkwljgkzyvi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrYmlsaWdsb2Jrd2xqZ2t6eXZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk2NzU5MiwiZXhwIjoyMDgwNTQzNTkyfQ.o7Rm3r19oWbJPjSkSgFdwSRK670ZvQg0pgLy-du0NaI';

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Not set');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});