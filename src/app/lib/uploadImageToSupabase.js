// lib/uploadImageToSupabase.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export async function uploadImageToSupabase(file, folder = 'idols') {
  const fileName = `${folder}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('idol') // Ganti sesuai nama bucket kamu
    .upload(fileName, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage.from('public').getPublicUrl(fileName);
  return urlData.publicUrl;
}
