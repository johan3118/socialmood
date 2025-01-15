import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SocialButton from "./social-button";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

interface ApproveResponseProps {
  onOpenChange: (newOpenValue: boolean) => void;
  onConfirm: () => void;
}

export default function ApproveResponse({
  onOpenChange,
  onConfirm,
}: ApproveResponseProps) {
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("approveResponse");

  const handleApprove = async () => {
    setIsPending(true);
    try {
      await onConfirm();
      toast({ variant: "default", description: t("sendSuccess") });
      onOpenChange(false);
    } catch (error) {
      toast({ variant: "destructive", description: t("sendError") });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader className="flex items-center justify-center">
        <img
          src="/thinking-face.svg"
          alt={t("confirmation")}
          className="w-16 h-16"
        />
        <DialogTitle>
          <h1 className="text-[33px]">{t("confirmation")}</h1>
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="w-[70%]">
        <hr className="my-3" />
        <p className="text-[18px] text-center">{t("sendConfirmation")}</p>
        <div className="mt-12 flex items-center justify-center space-x-2">
          <SocialButton
            variant="google"
            defaultText={t("cancel")}
            customStyle="text-black bg-[#EBEBEBA8]/[66%] text-[20px]"
            onClick={() => onOpenChange(false)}
          />
          <SocialButton
            variant="default"
            defaultText={t("send")}
            pendingText={t("sending")}
            customStyle="text-[20px]"
            isPending={isPending}
            onClick={handleApprove}
          />
        </div>
      </DialogDescription>
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-6 top-6 opacity-70 hover:opacity-100 focus:outline-none"
      >
        <img src="/delete.svg" alt={t("cancel")} className="w-6 h-6" />
      </button>
    </DialogContent>
  );
}
