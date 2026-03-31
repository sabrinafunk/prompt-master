import { checkIsAdmin } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { PromptForm } from "@/components/admin/PromptForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminPage() {
  const isAdmin = await checkIsAdmin();

  // Apenas administradores confirmados pelo banco podem ver as chaves de publicação
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen pt-32 pb-24 px-4">
      <div className="w-full max-w-xl flex justify-start mb-6">
         <Link href="/" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-5 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-sm">
           <ArrowLeft className="h-4 w-4" /> 
           Voltar para Dashboard
         </Link>
      </div>
      
      <PromptForm />
    </div>
  );
}
