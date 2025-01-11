"use client";
import React from "react";
import { useTranslations } from "next-intl";
import GraficoInteracciones from "@/components/(socialmood)/interactions-graph";
import SeguidoresChart from "@/components/(socialmood)/followers-chart";
import InteraccionesDashboard from "@/components/(socialmood)/interactions-dashboard";
import { useRouter } from "next/navigation";
import EmotionsChart from "@/components/(socialmood)/emotions-chart";
import CategoryChart from "@/components/(socialmood)/category-chart";
import SocialButton from "@/components/(socialmood)/social-button";
import FilterModal from "@/components/(socialmood)/filter-modal-dashboard";

function Dashboard() {
  const t = useTranslations("socialmood.dashboard");
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

  const handleRedirect = () => {
    router.push("/app/listado-interacciones");
  };

  return (
    <div className="">
      <div className="flex justify-end space-x-4">
        <SocialButton
          customStyle="w-32"
          variant="default"
          defaultText={t("filters.title")}
          type="button"
          onClick={openFilterModal}
        />
      </div>
      <div className="space-y-6 h-screen overflow-y-auto p-4">
        <div className="flex space-x-6">
          <GraficoInteracciones filter={filter} />
          <SeguidoresChart social_medias={filter.social_medias} />
          <EmotionsChart filter={filter} />
        </div>

        <div className="w-full h-full flex space-x-10">
          <div className="w-full h-full space-y-3">
            <div className="w-full flex items-center">
              <h2 className="text-[20px] text-nowrap text-white text-right font-bold">
                {t("interactionsSummary")}
              </h2>
              <span
                onClick={handleRedirect}
                className="w-full text-right text-[14px] text-[#A6A2B4] hover:underline font-semibold cursor-pointer"
              >
                {t("viewList")}
              </span>
            </div>
            <InteraccionesDashboard filter={filter} />
          </div>

          <div className="mt-10 w-full space-y-3">
            <CategoryChart filter={filter} />
          </div>
        </div>
      </div>
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

export default Dashboard;
