"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit, Plus, X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import Image from "next/image";
import { getNextPaymentDate } from "@/app/actions/(backoffice)/subscriptions.actions";
import { useTranslations } from "next-intl";

function UserCurrentPlanCard() {
  const t = useTranslations("socialmood.profile.plan");
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null);

  const fetchNextPaymentDate = async () => {
    try {
      const nextPaymentTimestamp = await getNextPaymentDate();
      if (nextPaymentTimestamp) {
        const formattedDate = new Date(nextPaymentTimestamp).toLocaleDateString(
          "es-ES",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
        setNextPaymentDate(formattedDate);
      } else {
        setNextPaymentDate(t("dateNotAvailable"));
      }
    } catch (error) {
      console.error("Error fetching next payment date:", error);
      setNextPaymentDate(t("errorFetchingDate"));
    }
  };

  useEffect(() => {
    fetchNextPaymentDate();
  }, []);

  return (
    <BlurredContainer customStyle="h-[30vh] !mx-0">
      <div className="flex items-center w-full">
        <div className="payment-info w-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">{t("currentPlan")}</h2>
            <button aria-label={t("editPlan")}>
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs mb-2">
            {t("nextPayment")}{" "}
            {nextPaymentDate
              ? `$25 ${t("on")} ${nextPaymentDate}`
              : t("loading")}
          </p>
          <p className="text-sm font-bold mb-4">{t("basicPlan")}</p>
          <p className="text-xs mb-1">{t("paymentMethod")}</p>

          <div className="flex items-center">
            <Image
              src="/paypal-logo.svg"
              width={15}
              height={25}
              alt={t("creditCard")}
            />
            <span className="text-sm ml-2">PayPal</span>
            <button aria-label={t("editPaymentMethod")}>
              <Edit className="w-4 h-5 ml-3" />
            </button>
          </div>
        </div>

        <Image
          src="/credit-card.svg"
          width={200}
          height={100}
          alt={t("creditCard")}
        />
      </div>
    </BlurredContainer>
  );
}

export default UserCurrentPlanCard;
