"use server"

import { createClient } from "@supabase/supabase-js";

// Bypass RLS para leitura pública do Feed
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mockKey"
);

import { checkIsAdmin } from "./auth";

export async function getMorePrompts(offset: number) {
  const isAdmin = await checkIsAdmin();
  
  let query = supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + 11);

  if (!isAdmin) {
    query = query.neq("ocultar", false);
  }
    
  const { data } = await query;
  return data || [];
}
