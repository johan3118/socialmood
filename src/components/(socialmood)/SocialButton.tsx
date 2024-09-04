"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import FbIcon from "./fbIcon";
import IgIcon from "./igIcon";

export default function SocialButton({
  variant = "default",
  pendingText,
  defaultText,
  isPending,
  size = "default",
  icon,
}: {
  variant:
    | "default"
    | "blue"
    | "green"
    | "yellow"
    | "orange"
    | "link"
    | null
    | undefined;
  pendingText?: string;
  defaultText: string;
  isPending?: boolean;
  size?:
    | "default"
    | "defaultBold"
    | "sm"
    | "smBold"
    | "lg"
    | "lgBold"
    | "icon"
    | null
    | undefined;
  icon: "ig" | "fb";
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant={variant}
      size={size}
      type="submit"
      disabled={pending || isPending}
    >
      {icon === "ig" ? (
        <IgIcon className="mr-1" />
      ) : (
        <FbIcon className="mr-1" />
      )}
      {pending || isPending ? pendingText : defaultText}
    </Button>
  );
}
