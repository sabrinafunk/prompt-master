"use server";

import { createClient } from "@supabase/supabase-js";
import { getSessionUser, checkIsAdmin } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";

// Admin Bouncer Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function createPromptAction(formData: FormData) {
  // 1. Barreira de Segurança (Role-Based Access Control - RBAC)
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    throw new Error("Acesso Negado: Apenas administradores podem executar esta ação.");
  }

  // 2. Coletar dados do formulário
  const content = formData.get("content") as string;
  const imageFile = formData.get("image") as File;

  if (!content) {
    throw new Error("O texto do Prompt Mágico é obrigatório.");
  }

  let finalImageUrl = null;

  // 3. Lógica de Upload da Imagem pro Supabase Storage
  if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const fileExt = imageFile.name.split('.').pop() || 'png';
      const fileName = `prompt_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('prompts') // Revertido para 'prompts' (Plural) conforme seu BD real
        .upload(fileName, buffer, {
          contentType: "image/webp", // Forcando webp pela nossa compressao nativa
          upsert: true
        });

      if (uploadError) {
        console.error(uploadError);
        throw new Error("Erro no Supabase Storage: " + uploadError.message);
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('prompts')
        .getPublicUrl(fileName);

      finalImageUrl = publicUrlData.publicUrl;
    } catch (e: any) {
        throw new Error("Falha catastrófica no upload: " + e.message);
    }
  }

  // 4. Inserir na tabela de Prompts
  const { error: dbError } = await supabaseAdmin
    .from('prompts')
    .insert({
      content,
      image_url: finalImageUrl,
    });

  if (dbError) {
    throw new Error("Erro de Banco de Dados: " + dbError.message);
  }

  // 5. Apagar o cache do Next pra atualização instantânea
  revalidatePath("/");
  
  return { success: true };
}

export async function togglePromptVisibilityAction(promptId: string, isVisible: boolean) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw new Error("Acesso permissível apenas para administradores");

  const { error } = await supabaseAdmin
    .from("prompts")
    .update({ ocultar: isVisible })
    .eq("id", promptId);

  if (error) {
    console.error(error);
    throw new Error("Falha ao atualizar o banco de dados: " + error.message);
  }
  
  revalidatePath("/");
  return { success: true };
}
