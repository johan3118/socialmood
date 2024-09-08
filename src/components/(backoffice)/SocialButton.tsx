"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import IgIcon from "./igIcon";
import GgIcon from "./ggIcon";
import AngryIcon from "./angryIcon";
import { VariantType, SizeType, IconType, ButtonType } from "@/types";

// Función utilitaria para agregar !important a cada regla de estilo en customStyle
const addImportantToStyles = (styles: string) => {
  return styles
    .split(" ")
    .map((style) => `${style} !important`)
    .join(" ");
};

export default function SocialButton({
  variant = "default",
  pendingText,
  defaultText,
  onClick,
  isPending,
  size = "default",
  type,
  icon,
  customStyle,
}: {
  variant: VariantType;
  customStyle?: string;
  pendingText?: string;
  defaultText: string;
  isPending?: boolean;
  size?: SizeType;
  icon?: IconType;
  type?: ButtonType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const { pending } = useFormStatus();

  const importantCustomStyle = customStyle
    ? addImportantToStyles(customStyle)
    : "";

  return (
    <Button
      className={importantCustomStyle}
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
      ) : icon === "angry" ? (
        <AngryIcon />
      ) : (
        ""
      )}
      {pending || isPending ? pendingText : defaultText}
    </Button>
  );
}
