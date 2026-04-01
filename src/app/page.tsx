import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getSessionUser, checkIsAdmin } from "@/app/actions/auth";
import { InfinitePromptGrid } from "@/components/prompts/InfinitePromptGrid";
import LoginView from "@/components/auth/LoginView";

export const dynamic = "force-dynamic";

export default async function Home() {
  // O Server verifica as credenciais do usuário na hora que ele bate na página
  const user = await getSessionUser();

  // Verifica se o usuário atual logado tem acesso como DONO para liberar painéis ocultos
  const isAdmin = await checkIsAdmin();

  // Se o usuário está logado (SaaS Dashboard Minimalista focado nos Prompts)
  if (user) {
    let query = supabase
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12); // Defesa vital contra travamento de CPU e estouro de RAM na VPS/Hospedagem
      
    // Apenas Admins podem ver a galeria irrestrita (incluindo Prompts "Desligados")
    if (!isAdmin) {
       query = query.neq("ocultar", false);
    }

    const { data: prompts } = await query;

    return (
      <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
        {/* Aurora Borealis Header Section (Full Width Hero) */}
        <div className="relative w-full overflow-hidden flex flex-col items-center pt-36 pb-24">
           {/* Efeito Aurora Borealis Absoluto no Fundo (Lento e Posicionado na Esquerda) */}
           <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
               {/* Núcleo Central Pulsante Colorido */}
               <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/15 blur-[90px] rounded-full animate-pulse"></div>
               
               {/* Nuvem Magnética Ciano (Movimentação suave na esquerda) */}
               <div className="absolute top-0 -left-1/4 w-full h-full flex items-center animate-aurora mix-blend-multiply opacity-100">
                 <div className="w-[900px] h-[600px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[120px] rounded-full"></div>
               </div>

               {/* Nuvem Magnética Violeta (Lenta, mais embaixo na esquerda com Atraso) */}
               <div className="absolute -top-32 -left-10 w-full h-full flex items-center animate-aurora [animation-delay:-5s] mix-blend-multiply opacity-100">
                 <div className="w-[800px] h-[500px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent blur-[130px] rounded-full"></div>
               </div>
               
               {/* Nuvem Fúcsia de Contraste (Onda Terciária Profunda mais na borda) */}
               <div className="absolute top-1/4 -left-32 w-full h-full flex items-center animate-aurora [animation-delay:-10s] mix-blend-multiply opacity-90">
                 <div className="w-[700px] h-[600px] bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent blur-[140px] rounded-full"></div>
               </div>

               {/* Gradient Fade to Bottom seamlessly merging into the grid */}
               <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-50 to-transparent"></div>
           </div>

           {/* Conteúdo do Header (Title, Subtitle, Buttons) - Z-index para sobrepor a Aurora */}
           <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                Crie imagens absurdas
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 font-medium">
                Roube meus prompts{" "}
                <a 
                  href="https://instagram.com/arturbranchina.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-gray-900 hover:text-black bg-gray-200/50 hover:bg-gray-300/50 px-2 py-0.5 rounded-md transition-all inline-block mt-2 sm:mt-0 shadow-sm"
                  style={{ textDecoration: 'none' }}
                >
                  @arturbranchina.com.br
                </a>
              </p>
              
              {/* Ferramenta Exclusiva Artur */}
              {isAdmin && (
                <div className="mt-12">
                   <Link href="/admin" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 hover:-translate-y-1 transition-all shadow-2xl shadow-black/20 flex items-center gap-2 border border-white/10">
                     <Sparkles className="h-5 w-5" />
                     Cadastrar Novo Prompt
                   </Link>
                </div>
              )}
           </div>
        </div>

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {/* Galeria Feed com Scroll Infinito (Client Component Híbrido) */}
          {prompts && prompts.length > 0 ? (
            <InfinitePromptGrid initialPrompts={prompts} isAdmin={isAdmin} />
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <Sparkles className="h-8 w-8 mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum prompt adicionado</h3>
              <p className="text-sm">Os seus cards de arte vão aparecer aqui.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Se o usuário NÃO ESTÁ logado (Exibir Login Direto)
  return <LoginView />;
}
