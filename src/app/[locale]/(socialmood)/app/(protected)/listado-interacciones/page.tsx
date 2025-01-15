"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import InteraccionesDashboard from "@/components/(socialmood)/interactions-dashboard";
import SocialButton from "@/components/(socialmood)/social-button";
import FilterModal from "@/components/(socialmood)/filter-modal-dashboard";

export default function ListadoInteracciones() {
  const t = useTranslations("socialmood.interactions");
  const router = useRouter();

  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const [filter, setSelectedFilters] = React.useState({
    social_medias: [],
  });

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const onSaveFilters = (filter: any) => {
    setSelectedFilters(filter);
    console.log(filter);
  };

  return (
    <div className="space-y-6 h-screen overflow-y-auto p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => router.push("/app/dashboard")}
          />
          <h2 className="text-[20px] text-white font-bold">{t("listTitle")}</h2>
        </div>
        <SocialButton
          customStyle="w-32"
          variant="default"
          defaultText={t("filters.title")}
          type="button"
          onClick={openFilterModal}
        />
      </div>

      <InteraccionesDashboard filter={filter} />

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={closeFilterModal}
          onSave={onSaveFilters}
        />
      )}
    </div>
  );
}
