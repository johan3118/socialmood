"use client";
import { usePathname } from "next/navigation";
import UserProfile from "@/components/(socialmood)/user-profile";
import { getActiveUserName } from "@/app/actions/(socialmood)/auth.actions";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function MainBar() {
  const [userName, setUserName] = useState<string>("");
  const t = useTranslations("socialmood.mainBar");

  const fetchUserName = async () => {
    const result = await getActiveUserName();
    if (typeof result === "string") {
      setUserName(result);
    } else {
      console.error(result.error);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  const pathname = usePathname();

  // Determina el título y la frase basados en la ruta actual
  const getContent = () => {
    switch (pathname) {
      case "/app/listado/respuestas":
        return {
          title: t("responses.title"),
          phrase: t("responses.phrase"),
        };
      case "/app/reglas":
        return {
          title: t("rules.title"),
          phrase: t("rules.phrase"),
        };
      case "/app/listado-interacciones":
        return {
          title: t("interactions.title"),
          phrase: t("interactions.phrase"),
        };
      case "/reports":
        return {
          title: t("reports.title"),
          phrase: t("reports.phrase"),
        };
      default:
        return {
          title: t("dashboard.title", { userName }),
          phrase: t("dashboard.phrase"),
        };
    }
  };

  const { title, phrase } = getContent();

  return (
    <div>
      <header className="mt-16 mb-10 px-6 text-white flex justify-between items-center">
        <div>
          <h1 className="py-3 text-4xl font-semibold">{title}</h1>
          <p className="text-lg text-gray-400">{phrase}</p>
        </div>
        <UserProfile />
      </header>
    </div>
  );
}
