"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export default function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "es" : "en";
    // Remove the current locale from the pathname
    const newPathname = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${newPathname}`);
  };

  return (
    <Button
      onClick={switchLocale}
      variant="default"
      className="text-white hover:text-gray-300"
    >
      {locale === "en" ? "ES" : "EN"}
    </Button>
  );
}
