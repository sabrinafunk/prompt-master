"use client";

import { useState } from "react";
import { createPromptAction } from "@/app/actions/admin";
import { Loader2, Image as ImageIcon, Send } from "lucide-react";
import Image from "next/image";

// Função utilitária que RODA NA MÁQUINA/CELULAR do usuário (Não consome Nuvem nem Dados!)
const compressImageToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new window.Image(); // Classe nativa do navegador
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // Limita Imagens Extensas à qualidade ideal Full HD Web (1200px máx)
        const MAX_SIZE = 1200;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Magia da compressão para WebP 80% (Derrete o tamanho do arquivo)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Falha brutal ao comprimir imagem interna."));
          },
          "image/webp",
          0.8
        );
      };
      
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export function PromptForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <form 
      action={async (originalFormData) => {
        setLoading(true);
        setError(null);
        try {
          // Vamos reconstruir o Payload injetando a Imagem Destruída e Leve
          const payload = new FormData();
          payload.append("content", originalFormData.get("content") as string);
          
          const rawFile = originalFormData.get("image") as File;
          
          if (rawFile && rawFile.size > 0 && rawFile.name !== "undefined") {
             // 0 Custo pro Backend: O Celular/PC do admin amassa a própria imagem (Client-side)
             const compressedBlob = await compressImageToWebP(rawFile);
             
             // Injeta a foto WebP com metadados falsificados para enganar e ser aceita no Server
             payload.append("image", compressedBlob, rawFile.name.replace(/\.[^/.]+$/, "") + ".webp");
          }

          await createPromptAction(payload);
          setSuccess(true);
          setTimeout(() => {
            window.location.href = "/"; // Volta pro dashboard para ver a nova arte
          }, 1500);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }} 
      className="flex flex-col gap-6 w-full max-w-xl bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5"
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Novo Prompt</h2>
        <p className="text-gray-500 mt-2 font-medium">Cadastre a arte e a engenharia de texto na plataforma.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-200 text-center shadow-sm animate-pulse">
          ✅ Arte e Prompt publicados! Redirecionando para a Galeria...
        </div>
      )}

      {/* Conteúdo do Prompt */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-900 ml-2">Engenharia do Prompt (Texto para Copiar)</label>
        <textarea 
          name="content" 
          required 
          rows={5}
          placeholder="Hyperrealistic 8k photo of a cinematic man..."
          className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-2xl focus:ring-black focus:border-black transition-all outline-none text-gray-900 resize-none font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Upload de Imagem Masterizado & Optimizado */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-900 ml-2">Arte Gerada (Imagem que será Comprimida pra 80KB)</label>
        <div className="relative w-full h-56 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden transition-colors flex items-center justify-center cursor-pointer group">
           <input 
             type="file" 
             name="image" 
             accept="image/*"
             required
             onChange={handleImageChange}
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
           />
           
           {preview ? (
             <Image src={preview} alt="Preview Admin" fill className="object-cover" />
           ) : (
             <div className="flex flex-col items-center text-gray-400 group-hover:text-black transition-colors">
                <ImageIcon className="h-10 w-10 mb-3" />
                <span className="font-bold text-sm">Clique ou Arraste a Foto Bruta</span>
                <span className="text-xs opacity-60">Vamos comprimi-la em 90% pra você</span>
             </div>
           )}

           {preview && (
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10 pointer-events-none">
                <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm shadow-xl">Trocar Imagem</span>
             </div>
           )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-black text-white font-bold py-5 rounded-3xl hover:bg-gray-900 transition-all shadow-md hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {loading ? "Comprimindo e Enviando..." : "Publicar no Sistema"}
      </button>

    </form>
  );
}
