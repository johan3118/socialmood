"use client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSelector() {
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Store the selected language in localStorage
    localStorage.setItem("preferred-locale", newLocale);
    // Redirect to the new locale version
    router.push(`/${newLocale}`);
  };

  return (
    <Select onValueChange={handleLanguageChange} defaultValue="es">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
}
