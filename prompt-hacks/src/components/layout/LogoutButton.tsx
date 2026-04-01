"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
