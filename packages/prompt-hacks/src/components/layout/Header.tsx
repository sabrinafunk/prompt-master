import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { getSessionUser } from "@/app/actions/auth";
import { LogoutButton } from "./LogoutButton";

export default async function Header() {
  const user = await getSessionUser();

  return (
    <header className="w-full fixed top-4 sm:top-6 left-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="flex items-center justify-center gap-6 sm:gap-12 w-fit mx-auto bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-lg shadow-black/5 rounded-full px-6 sm:px-8 py-3 sm:py-3.5 pointer-events-auto transition-all duration-300">
        
        <Link href="/" className="font-mono font-black text-xl sm:text-2xl tracking-tighter relative group flex-shrink-0" style={{ textDecoration: 'none' }}>
          <span className="relative inline-block text-black glitch-text uppercase" data-text="Prompt_Hacks">
            Prompt_Hacks
          </span>
        </Link>

        <div>
          {user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center text-sm text-gray-700 gap-1.5 bg-gray-50/80 px-4 py-2 rounded-full border border-gray-200">
                <UserIcon className="h-4 w-4 text-gray-400" />
                <span className="font-semibold">{user?.name?.split(' ')[0]}</span>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-bold bg-black text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-2xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              Entrar
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
