"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PromptCard } from "./PromptCard";
import { Loader2 } from "lucide-react";
import { getMorePrompts } from "@/app/actions/prompts";

export function InfinitePromptGrid({ initialPrompts, isAdmin = false }: { initialPrompts: any[], isAdmin?: boolean }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPrompts.length === 12);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    // Calc: Se página 1 = offset 12. Página 2 = offset 24.
    const nextPrompts = await getMorePrompts(page * 12);
    
    if (nextPrompts.length === 0) {
      setHasMore(false); // Esgotou o banco
    } else {
      setPrompts((prev) => [...prev, ...nextPrompts]);
      setPage((p) => p + 1);
      if (nextPrompts.length < 12) {
         setHasMore(false); // Bateu no final exato na query
      }
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
           loadMore();
        }
      },
      { rootMargin: "200px", threshold: 0.1 } // Carrega um pouco antes de chegar no limite
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
        {prompts.map((prompt, index) => (
          <PromptCard key={`${prompt.id}-${index}`} prompt={prompt} priority={index < 6} isAdmin={isAdmin} />
        ))}
      </div>
      
      {/* Container de Observação Nativa (Ponto de Gatilho do Scroll) */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-12 w-full mt-4">
           {loading && (
             <div className="bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-sm border border-gray-100">
               <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
             </div>
           )}
        </div>
      )}
      
      {/* Assinatura de Final de Feed */}
      {!hasMore && prompts.length > 0 && (
        <div className="py-16 text-center text-sm font-bold text-gray-300 w-full">
          ~ Fim do Acervo ~
        </div>
      )}
    </div>
  );
}
