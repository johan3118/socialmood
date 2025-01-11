"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { User } from "lucide-react";
import { getActiveUserName } from "@/app/actions/(socialmood)/auth.actions";
import { useEffect, useState } from "react";
import LanguageSelector from "@/components/(socialmood)/language-selector";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("socialmood.layout");
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await getActiveUserName();
      setUserName(name || "");
    };
    fetchUserName();
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1624]">
      <header className="bg-[#2C2436] py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt={t("logoAlt")} className="h-8" />
            <nav className="space-x-4">
              <button
                onClick={() => router.push("/app/dashboard")}
                className={`text-sm ${
                  pathname === "/app/dashboard" ? "text-white" : "text-gray-400"
                }`}
              >
                {t("nav.dashboard")}
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <button
              onClick={() => router.push("/app/profile")}
              className="flex items-center space-x-2 text-gray-400 hover:text-white"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">{userName}</span>
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
