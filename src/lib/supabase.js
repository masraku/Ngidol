import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseRoleKey);
