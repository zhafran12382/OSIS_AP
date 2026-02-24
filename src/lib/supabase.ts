import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  supabaseUrl !== "" &&
  supabaseAnonKey !== "" &&
  !supabaseUrl.includes("your-project-id");

export const SUPABASE_NOT_CONFIGURED_MSG =
  "Supabase belum dikonfigurasi. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diisi di file .env.local";

if (!isSupabaseConfigured) {
  console.warn(`⚠ ${SUPABASE_NOT_CONFIGURED_MSG}`);
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);
