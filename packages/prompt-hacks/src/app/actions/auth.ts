"use server"

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Bouncer Architecture: This client is exclusively used in the Next.js Server.
// By using SUPABASE_SERVICE_ROLE_KEY, it bypasses RLS, allowing us to completely 
// lock down the 'app_users' table from the public internet.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mockKey"
);

// Módulo de Segurança Anti-Forging (Assinatura de Sessão)
function signSessionId(id: string) {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret";
  const hash = crypto.createHmac('sha256', secret).update(id).digest('hex');
  return `${id}.${hash}`;
}

function verifySessionId(signedId: string) {
  if (!signedId || !signedId.includes(".")) return null;
  const [id, hash] = signedId.split(".");
  const expectedHash = crypto.createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret").update(id).digest('hex');
  if (hash === expectedHash) return id;
  return null;
}

export async function loginWithPhone(phone: string) {
  const { data, error } = await supabase
    .from("app_users")
    .select("id")
    .eq("phone", phone)
    .single();
    
  if (error || !data) {
    return { error: "Número não encontrado. Por favor, registre-se primeiro." };
  }
  
  cookies().set("session_id", signSessionId(data.id), { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    path: "/",
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  
  return { success: true };
}

export async function registerUser(name: string, email: string, phone: string, acceptedTerms: boolean) {
  if (!acceptedTerms) return { error: "Você precisa aceitar os termos de uso." };
  
  const { data, error } = await supabase
    .from("app_users")
    .insert({ name, email, phone, accepted_terms: true, admin: false })
    .select("id")
    .single();
    
  if (error) {
    if (error.code === '23505') return { error: "Este telefone ou e-mail já está cadastrado." };
    return { error: error.message };
  }
  
  cookies().set("session_id", signSessionId(data.id), { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    path: "/",
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  
  return { success: true };
}

export async function logout() {
  cookies().delete("session_id");
}

export async function getSessionUser() {
  const signedSessionId = cookies().get("session_id")?.value;
  if (!signedSessionId) return null;
  
  const sessionId = verifySessionId(signedSessionId);
  if (!sessionId) return null;

  const { data } = await supabase
    .from("app_users")
    .select("name, phone, email")
    .eq("id", sessionId)
    .single();
    
  return data;
}

export async function checkIsAdmin() {
  const signedSessionId = cookies().get("session_id")?.value;
  if (!signedSessionId) return false;
  
  const sessionId = verifySessionId(signedSessionId);
  if (!sessionId) return false;

  const { data } = await supabase
    .from("app_users")
    .select("admin")
    .eq("id", sessionId)
    .single();
    
  return data?.admin === true;
}
