import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SocialButton from "./social-button";
import { toast } from "@/components/ui/use-toast";

interface ApproveResponseProps {
  onOpenChange: (newOpenValue: boolean) => void;
  onConfirm: () => void;
}

export default function ApproveSocialDelete({ onOpenChange, onConfirm }: ApproveResponseProps) {
  const [isPending, setIsPending] = useState(false);

  const handleApprove = async () => {
    setIsPending(true); // Marca la operación como pendiente
    try {
      // Intenta confirmar la eliminación
      await onConfirm();
      // Si no lanza error, muestra mensaje de éxito
      toast({ variant: "default", description: "Cuenta eliminada correctamente" });
      onOpenChange(false); // Cierra el diálogo si fue exitoso
    } catch (error) {
      // Muestra un mensaje destructivo si ocurre un error
      console.error("Error al eliminar la cuenta:", error); // Detalles para depuración
      toast({ variant: "destructive", description: "Error al eliminar la cuenta. Por favor, inténtalo nuevamente." });
    } finally {
      // Restablece el estado de pendiente en ambos casos
      setIsPending(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader className="flex items-center justify-center">
        <img src="/thinking-face.svg" alt="Confirmación" className="w-16 h-16" />
        <DialogTitle><h1 className="text-[33px]">CONFIRMACIÓN</h1></DialogTitle>
      </DialogHeader>
      <DialogDescription className="w-[70%]">
        <hr className="my-3" />
        <p className="text-[18px] text-center">¿Estás seguro de que quieres eliminar esta cuenta?</p>
        <div className="mt-12 flex items-center justify-center space-x-2">
          <SocialButton
            variant="google"
            defaultText="Cancelar"
            customStyle="text-black bg-[#EBEBEBA8]/[66%] text-[20px]"
            onClick={() => onOpenChange(false)}
          />
          <SocialButton
            variant="default"
            defaultText="Eliminar"
            pendingText="Eliminando..."
            customStyle="text-[20px]"
            isPending={isPending}
            onClick={handleApprove}
          />
        </div>
      </DialogDescription>
      <button onClick={() => onOpenChange(false)} className="absolute right-6 top-6 opacity-70 hover:opacity-100 focus:outline-none">
        <img src="/delete.svg" alt="Cerrar" className="w-6 h-6" />
      </button>
    </DialogContent>
  );
}
