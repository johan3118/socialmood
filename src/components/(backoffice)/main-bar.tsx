"use client";
import { usePathname } from "next/navigation";
import UserProfile from "@/components/(backoffice)/user-profile";
import { getActiveUserName } from "@/app/actions/(backoffice)/auth.actions";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function MainBar() {
  const t = useTranslations("mainBar");
  const [userName, setUserName] = useState<string>("");

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
      case "/bo/layout/sub-table":
        return {
          title: t("subscriptions"),
        };
      case "/bo/layout/user-table":
        return {
          title: t("users"),
        };

      default:
        return {
          title: t("greeting", { name: userName }),
        };
    }
  };

  const { title } = getContent();

  return (
    <div>
      <header className="mt-16 mb-10 text-[#241F2C] px-6 flex justify-between items-center">
        <div>
          <h1 className="py-3 text-4xl font-semibold">{title}</h1>
        </div>
        <UserProfile />
      </header>
    </div>
  );
}
