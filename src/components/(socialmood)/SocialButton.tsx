"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import FbIcon from "./fbIcon";
import IgIcon from "./igIcon";
import GgIcon from "./ggIcon";
import AngryIcon from "./angryIcon";
import { VariantType, SizeType, IconType, ButtonType } from "@/types";

export default function SocialButton({
  variant = "default",
  pendingText,
  defaultText,
  onClick,
  isPending,
  size = "default",
  type,
  icon,
}: {
  variant: VariantType;
  pendingText?: string;
  defaultText: string;
  isPending?: boolean;
  size?: SizeType;
  icon: IconType;
  type?: ButtonType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant={variant}
      size={size}
      type={type}
      onClick={onClick}
      disabled={pending || isPending}
    >
      {icon === "ig" ? (
        <IgIcon />
      ) : icon === "gg" ? (
        <GgIcon />
      ) : icon === "fb" ? (
        <FbIcon />
      ) : (
        <AngryIcon />
      )}
      {pending || isPending ? pendingText : defaultText}
    </Button>
  );
}
