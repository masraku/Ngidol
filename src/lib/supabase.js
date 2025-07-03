// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Klien untuk penggunaan di browser/client-side
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Klien untuk penggunaan di server-side (admin/role-based access)
export const supabaseServerClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
