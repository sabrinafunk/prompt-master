"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { togglePromptVisibilityAction } from "@/app/actions/admin";

interface Prompt {
  id: string;
  content: string;
  image_url?: string;
  ocultar?: boolean;
}

export function PromptCard({ prompt, priority = false, isAdmin = false }: { prompt: Prompt, priority?: boolean, isAdmin?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [isActive, setIsActive] = useState(prompt.ocultar !== false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isToggling) return;
    
    setIsToggling(true);
    const newStatus = !isActive; // "Ligar" = true (Mostrar). "Desligar" = false (Ocultar)
    
    try {
      await togglePromptVisibilityAction(prompt.id, newStatus);
      setIsActive(newStatus);
    } catch(err) {
      console.error(err);
    } finally {
      setIsToggling(false);
    }
  };

  // Array com as 8 fotos salvas no seu /public
  const localArtworkImages = [
    "/artur-1.png",
    "/artur-2.png",
    "/artur-3.png",
    "/artur-4.png",
    "/artur-5.png",
    "/artur-6.png",
    "/artur-7.png",
    "/artur-8.png",
  ];

  // Algoritmo matemático simples para garantir que a arte "1" sempre apareça no mesmo prompt (Persistência Visual)
  const getHashIndex = (str: string, max: number) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % max;
  };

  const persistentLocalImage = localArtworkImages[getHashIndex(prompt.id, localArtworkImages.length)];
  const displayImage = prompt.image_url || persistentLocalImage;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      
      // UX DEV 3: Dispara uma leve vibração de sucesso no celular ao copiar
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`w-full aspect-square bg-white rounded-3xl sm:rounded-[2.2rem] border ${!isActive ? 'border-red-200 shadow-none' : 'border-gray-100'} shadow-sm flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-black/10 transition-all duration-400 group/card ${!isActive ? 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}>
      
      {/* Imagem Interativa (80%) */}
      <div 
        className="w-full h-[80%] relative bg-gray-100 cursor-pointer flex-shrink-0 overflow-hidden"
        onClick={handleCopy}
        title="Clique na imagem para copiar o Prompt"
        onContextMenu={(e) => e.preventDefault()} // Bloqueia clique com Botão Direito no Menu do Navegador
      >
        <Image 
          src={displayImage} 
          alt="Arte conceitual gerada do prompt por IA"
          fill
          priority={priority} // Apenas as primeiras 3 usam Eager Loading (Melhoria LCP)
          className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out select-none pointer-events-none" // Bloqueia arraste para a aba e salvamento mobile longo
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          draggable={false}
        />

        {/* Selo UX de Ação Universal (Design Mobile translúcido adotado em todas as telas) */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white/90 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm border border-white/10 z-10 pointer-events-none transition-all">
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado!" : "Copiar"}
        </div>

        {/* Chave de Ocultar Admin */}
        {isAdmin && (
          <button 
            onClick={handleToggleVisibility}
            className="absolute top-3 right-3 z-50 p-2.5 bg-black/80 backdrop-blur-md border border-white/20 text-white rounded-full hover:scale-110 hover:bg-black transition-all shadow-lg flex items-center justify-center cursor-pointer"
            title={isActive ? "Desligar e Ocultar do Site" : "Ligar e Mostrar no Site"}
          >
            {isToggling ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             isActive ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-red-400" />}
          </button>
        )}

        {/* Feedback Tátil Móbile */}
        {copied && (
          <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center sm:hidden animate-in fade-in zoom-in duration-200 z-30 pointer-events-none">
             <div className="bg-white text-green-700 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl scale-110">
                <Check className="h-5 w-5" /> Copiado!
             </div>
          </div>
        )}
      </div>

      {/* Informação do Prompt (20%) - Sem os Títulos */}
      <div className="h-[20%] w-full px-5 py-4 sm:px-6 flex items-center bg-white z-10 relative overflow-hidden pointer-events-none">
        <p className="text-gray-600 text-sm sm:text-[15px] line-clamp-2 leading-relaxed font-medium w-full">
          {prompt.content}
        </p>
      </div>
    </div>
  );
}
