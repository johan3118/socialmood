"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function FormButton({
  variant = "default",
  pendingText,
  defaultText,
  isPending,
}: {
  variant: "default";
  pendingText: string;
  defaultText: string;
  isPending?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} type="submit" disabled={pending || isPending}>
      {pending || isPending ? pendingText : defaultText}
    </Button>
  );
}
