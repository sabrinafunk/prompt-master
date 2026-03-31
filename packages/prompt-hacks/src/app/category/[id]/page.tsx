import { supabase } from "@/lib/supabase/client";
import { PromptCard } from "@/components/prompts/PromptCard";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const revalidate = 60; // 1 minute ISR

export default async function CategoryPage({ params }: { params: { id: string } }) {
  // Fetch Category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single();

  // Fetch Prompts for this category
  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("category_id", params.id)
    .order("created_at", { ascending: false });

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
        <Link href="/" className="text-blue-600 font-medium hover:underline">Voltar ao Início</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-36">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-10 transition-colors bg-gray-50 px-4 py-2 rounded-full border shadow-sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para coleções
      </Link>

      <div className="mb-12 flex flex-col items-start">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-2xl">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">{category.name}</h1>
        </div>
        
        {category.description && (
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {prompts?.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}

        {(!prompts || prompts.length === 0) && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-500 bg-gray-50/50 flex flex-col items-center justify-center">
            <Sparkles className="h-10 w-10 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum prompt encontrado</h3>
            <p className="text-sm max-w-md">Ainda não há prompts disponíveis nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
