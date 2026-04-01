"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, User, Mail, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { loginWithPhone, registerUser } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const demoImages = [
  { id: "1", src: "https://arturbranchina.com.br/wp-content/uploads/2026/03/Sem-titulo-1.png", alt: "Arte Artur 1", rotation: -15 },
  { id: "2", src: "https://arturbranchina.com.br/wp-content/uploads/2026/03/Sem-titulo-2.png", alt: "Arte Artur 2", rotation: -8 },
  { id: "3", src: "https://arturbranchina.com.br/wp-content/uploads/2026/03/Sem-titulo-3.png", alt: "Arte Artur 3", rotation: 5 },
  { id: "4", src: "https://arturbranchina.com.br/wp-content/uploads/2026/03/Sem-titulo-4.png", alt: "Arte Artur 4", rotation: 12 },
  { id: "5", src: "https://arturbranchina.com.br/wp-content/uploads/2026/03/Sem-titulo-5.png", alt: "Arte Artur 5", rotation: -12 },
  { id: "6", src: "https://arturbranchina.com.br/wp-content/uploads/2026/03/Sem-titulo-6.png", alt: "Arte Artur 6", rotation: 8 },
  { id: "7", src: "https://arturbranchina.com.br/wp-content/uploads/2026/03/Sem-titulo-7.png", alt: "Arte Artur 7", rotation: 18 },
  { id: "8", src: "https://arturbranchina.com.br/wp-content/uploads/2026/03/Sem-titulo-8.png", alt: "Arte Artur 8", rotation: -20 },
];

export default function LoginPage() {
  const router = useRouter();
  
  // Auth State
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);

  // Carousel State
  const [rotatingCards, setRotatingCards] = useState<number[]>([]);
  const [radius, setRadius] = useState(350);
  const [isRotating, setIsRotating] = useState(true);

  // 1. Performance: Resize Handling
  useEffect(() => {
    setRadius(window.innerWidth > 768 ? 440 : 230);
    const handleResize = () => setRadius(window.innerWidth > 768 ? 440 : 230);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Setup Initial Cards
  useEffect(() => {
    setRotatingCards(demoImages.map((_, i) => i * (360 / demoImages.length)));
  }, []);

  // 3. Performance: Pause on Tab Switch & Reduced Motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsRotating(false);
    }

    const handleVisibilityChange = () => {
      setIsRotating(!document.hidden && !mediaQuery.matches);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 4. Performance: Interval execution only when tab is visible
  useEffect(() => {
    if (!isRotating) return;

    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((_, i) => (prev[i] + 0.3) % 360));
    }, 50);
    return () => clearInterval(interval);
  }, [isRotating]);

  // DEV IDEA: Custom Phone Mask Handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, ""); // strip all non-digits
    
    let formatted = numbers;
    if (numbers.length > 2 && numbers.length <= 7) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length > 7) {
      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Strip everything but numbers for exact Data Integrity comparison with the DB
    const plainPhone = phone.replace(/\D/g, "");

    const res = await loginWithPhone(plainPhone);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh(); 
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Por favor, insira um WhatsApp válido com DDD.");
      return;
    }

    setLoading(true);
    setError("");

    const plainPhone = phone.replace(/\D/g, "");

    const res = await registerUser(name, email, plainPhone, terms);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="relative w-full min-h-screen pt-32 pb-12 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden flex items-center justify-center">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-gray-200/50 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-gray-200/50 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Rotating Background Carousel */}
      <div className="absolute inset-0 flex items-center justify-center perspective z-0 pointer-events-auto">
        {demoImages.map((image, index) => {
          const angle = (rotatingCards[index] || 0) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={image.id}
              className="absolute w-36 h-48 sm:w-56 sm:h-72 transition-all duration-300"
              style={{
                transform: `
                  translate(${x}px, ${y}px)
                  rotateZ(${image.rotation}deg)
                `,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={cn(
                  "relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white",
                  "transition-transform duration-300 hover:scale-[1.25] hover:shadow-3xl hover:z-50",
                  "cursor-pointer group"
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  priority={index < 4}
                  quality={70}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Solid Login Form Block */}
      <div className="relative z-20 w-full max-w-[400px] sm:max-w-md p-8 sm:p-10 bg-white/95 border border-white/50 rounded-[2.5rem] shadow-2xl shadow-black/10 backdrop-blur-xl m-4">
        
        <div className="flex justify-center mb-6">
           <div className="bg-black p-3.5 rounded-2xl shadow-lg shadow-black/30">
             <Sparkles className="h-6 w-6 text-white" />
           </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900 tracking-tight">
          Roube meus prompts
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {mode === "LOGIN" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="(11) 99999-9999"
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-black focus:border-black transition-all sm:text-sm outline-none font-medium"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || phone.length < 14}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-extrabold text-white bg-black hover:bg-gray-800 hover:shadow-black/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none transition-all"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>Acessar a Biblioteca <ArrowRight className="h-4 w-4 ml-2" /></>
              )}
            </button>
            
            <div className="pt-5 text-center flex flex-col items-center">
              <button 
                type="button" 
                onClick={() => { setMode("REGISTER"); setError(""); setPhone(""); }}
                className="text-gray-500 font-bold text-sm hover:text-black transition-colors hover:underline"
              >
                Novo aqui? Cadastre grátis
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-black focus:border-black transition-all sm:text-sm outline-none font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="voce@empresa.com"
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-black focus:border-black transition-all sm:text-sm outline-none font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="(11) 99999-9999"
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:ring-black focus:border-black transition-all sm:text-sm outline-none font-medium"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1 pb-1">
              <label className="flex items-start gap-3 cursor-pointer group bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-md border-2 border-gray-300 text-black focus:ring-0 checked:bg-black transition-colors cursor-pointer"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    required
                  />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors leading-snug font-medium">
                  Concordo com os Termos e que este é um projeto gratuito mediante cadastro.
                </span>
              </label>
            </div>
            
            {/* UX IDEA 1: Micro-badge trust tag */}
            <div className="flex justify-center mt-3 mb-1">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                 <ShieldCheck className="h-3.5 w-3.5" />
                 100% Gratuito e sem Spam
               </span>
            </div>

            <button
              type="submit"
              disabled={loading || !terms || phone.length < 14}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-extrabold text-white bg-black hover:bg-gray-800 hover:shadow-black/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none transition-all"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Finalizar Cadastro"}
            </button>
            
            <div className="pt-3 text-center mt-2 flex flex-col items-center">
              <button 
                type="button" 
                onClick={() => { setMode("LOGIN"); setError(""); setPhone(""); }}
                className="text-gray-500 font-bold text-sm hover:text-black hover:underline transition-colors"
              >
                Voltar para o Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
