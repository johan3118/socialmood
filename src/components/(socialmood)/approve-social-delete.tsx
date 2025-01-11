import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ApproveSocialDeleteProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ApproveSocialDelete({
  onConfirm,
  onCancel,
}: ApproveSocialDeleteProps) {
  const t = useTranslations("socialmood.profile.social");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("deleteAccount")}</DialogTitle>
        <DialogDescription>{t("confirmRemoval")}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          {t("common.delete")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
