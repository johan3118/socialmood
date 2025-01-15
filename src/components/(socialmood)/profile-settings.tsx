"use client";
import React from "react";
import { ArrowLeft, Edit, Plus, X } from "lucide-react";
import { User } from "lucide-react";
import UserSettingsCard from "@/components/(socialmood)/user-settings-card";
import UserCurrentPlanCard from "@/components/(socialmood)/user-current-plan-card";
import SocialMediaCard from "@/components/(socialmood)/social-media-card";
import TeamCard from "@/components/(socialmood)/team-card";
import { IoIosInformationCircle } from "react-icons/io";
import Modal from "@/components/(socialmood)/modal";
import { useState } from "react";
import BlurredContainer from "./blur-background";
import InstructionCard from "./instruction-card";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

interface ProfileSettingsProps {
  onClose: () => void;
}

export default function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const t = useTranslations("socialmood.profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const switchLocale = () => {
    const newLocale = locale === "en" ? "es" : "en";
    const newPathname = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${newPathname}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-[25vh]">
      <div className="bg-[#2C2436] text-white p-10 rounded-3xl w-full overflow-y-auto">
        <header className="flex items-center mb-6 pr-4">
          <button onClick={onClose} className="mr-4" aria-label={t("back")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-3xl font-bold">{t("settings")}</h1>
            <button
              className="underline flex items-center font-medium"
              onClick={openModal}
            >
              {t("help")}
              <IoIosInformationCircle size={18} className="ml-1" />
            </button>
          </div>
        </header>

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <InstructionCard closeModal={closeModal} />
          </Modal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          <UserSettingsCard />
          <div className="space-y-4">
            <UserCurrentPlanCard />
            <SocialMediaCard />
          </div>
        </div>

        <div className="mt-4 p-4 border-t border-gray-700">
          <h3 className="text-white text-lg mb-2">
            {locale === "en" ? "Language Settings" : "Configuración de idioma"}
          </h3>
          <button
            onClick={switchLocale}
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
          >
            <span>{locale === "en" ? "->" : "->"}</span>
            <span>
              {locale === "en" ? "Cambiar a Español" : "Switch to English"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
