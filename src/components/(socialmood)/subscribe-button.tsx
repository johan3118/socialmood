"use client"; // Client-side component

import { useRouter } from "next/navigation";
import SocialButton from "@/components/(socialmood)/social-button";

interface SubscribeButtonProps {
  planId: number;
  variant: string;
  index: number;
  isCurrentPlan: boolean;
  planName: string;
  userHasAnyPlan: boolean;
}

export default function SubscribeButton({
  planId,
  variant,
  index,
  isCurrentPlan,
  planName,
  userHasAnyPlan,
}: SubscribeButtonProps) {
  const router = useRouter();

  const handleSubscribeClick = () => {
    router.push(`/app/get-sub/pay-sub?id=${planId}`);
  };

  return (
    <SocialButton
      defaultText={
        isCurrentPlan
          ? "Plan Actual"
          : userHasAnyPlan
          ? `Actualizar a ${planName}`
          : `Obtener ${planName}`
      }
      pendingText="Plan Actual"
      variant={index === 1 ? "blue" : "default"}
      size="defaultBold"
      type="button"
      onClick={handleSubscribeClick}
      isPending={isCurrentPlan}
    />
  );
}
