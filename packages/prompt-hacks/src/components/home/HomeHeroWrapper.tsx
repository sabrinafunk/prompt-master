"use client";

import { PromptCarouselHero } from "@/components/ui/prompt-carousel-hero";

export function HomeHeroWrapper() {
  const demoImages = [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1684369176170-463e84248b70?auto=format&fit=crop&q=80&w=600",
      alt: "AI Art",
      rotation: -15,
    },
    {
      id: "2",
      src: "https://plus.unsplash.com/premium_photo-1677269465314-d5d2247a0b0c?auto=format&fit=crop&q=80&w=600",
      alt: "Abstract AI",
      rotation: -8,
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1524673360092-e07b7ae58845?auto=format&fit=crop&q=80&w=600",
      alt: "City Prompts",
      rotation: 5,
    },
    {
      id: "4",
      src: "https://plus.unsplash.com/premium_photo-1680610653084-6e4886519caf?auto=format&fit=crop&q=80&w=600",
      alt: "Nature AI",
      rotation: 12,
    },
    {
      id: "5",
      src: "https://plus.unsplash.com/premium_photo-1680608979589-e9349ed066d5?auto=format&fit=crop&q=80&w=600",
      alt: "Digital Prompt",
      rotation: -12,
    },
    {
      id: "6",
      src: "https://images.unsplash.com/photo-1562575214-da9fcf59b907?auto=format&fit=crop&q=80&w=600",
      alt: "Tropical leaves",
      rotation: 8,
    }
  ];

  const demoFeatures = [
    {
      title: "Resultados Precisos",
      description: "Prompts validados profissionalmente para extrair as melhores respostas.",
    },
    {
      title: "Descubra Rápido",
      description: "Navegue por dezenas de categorias separadas por área e profissão.",
    },
    {
      title: "Economize Tempo",
      description: "Pare de adivinhar instruções. Copie, cole, e foque no seu trabalho.",
    },
  ];

  const scrollToSearch = () => {
    document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PromptCarouselHero
      title="A Biblioteca Definitiva de Prompts"
      subtitle="Otimizando Fluxos de Trabalho"
      description="Copie, adapte e cole prompts testados por especialistas para maximizar seus resultados com IA em menos de 5 segundos."
      ctaText="Acessar o Catálogo Livre"
      onCtaClick={scrollToSearch}
      images={demoImages}
      features={demoFeatures}
    />
  );
}
