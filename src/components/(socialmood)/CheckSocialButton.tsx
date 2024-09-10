"use client";
import React from "react";
import { Button } from "@/components/ui/checkButton";
import { useFormStatus } from "react-dom";
import IconContainer from "./check";
import { VariantType, SizeType, IconType, ButtonType } from "@/types";

// Función utilitaria para agregar !important a cada regla de estilo en customStyle
const addImportantToStyles = (styles: string) => {
  return styles
    .split(" ")
    .map((style) => `${style} !important`)
    .join(" ");
};

export default function CheckSocialButton({
  variant = "default",
  defaultText,
  secondaryText,
  onClick,
  isPending,
  size = "default",
  type,
  customStyle,
}: {
  variant: "default" | "disable";
  customStyle?: string;
  secondaryText?: string;
  defaultText: string;
  isPending?: boolean;
  size?: "default" | "lgBold";
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
      <div className="flex flex-row items-center w-full justify-between">
        <section className="flex flex-col space-y-2">
          <h1
            className={`text-sm 2xl:text-base font-black text-start ${
              variant === "default" ? "text-white" : "text-black"
            } `}
          >
            {defaultText}
          </h1>
          <h1
            className={`text-xs 2xl:text-sm font-medium text-start ${
              variant === "default" ? "text-white" : "text-black"
            }`}
          >
            {secondaryText}
          </h1>
        </section>
        <section>
          <IconContainer
            bgColor={`  ${
              variant === "default" ? "bg-[#DC5122]" : "border border-black"
            }`}
            iconColor={`${variant === "default" ? "white" : ""}`}
            size={24}
          />
        </section>
      </div>
    </Button>
  );
}
