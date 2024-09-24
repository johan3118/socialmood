import React from "react";

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import SocialButton from "./social-button";

import * as DialogPrimitive from "@radix-ui/react-dialog"

interface DeleteRuleProps {
    ruleID: number;
}

export default function DeleteRule({ ruleID }: DeleteRuleProps) {
    return (
        <DialogContent>
            <DialogHeader className="flex items-center justify-center">
                <img src="/thinking-face.svg" alt="Alert" className="w-66 h-66" />
                <DialogTitle><h1 className="text-[33px]">CONFIRMACIÓN</h1></DialogTitle>
            </DialogHeader>

            <DialogDescription className="w-[70%]">
                <hr className="my-3" />
                <p className="text-[18px] text-center">¿Estás seguro de que quieres eliminar estar regla? Esta contiene reglas hijas asociadas</p>

                <div className="mt-12 flex items-center justify-center space-x-2 ">
                    <DialogPrimitive.Close>
                        <SocialButton
                            variant="google"
                            defaultText="Cancelar"
                            customStyle="text-black bg-[#EBEBEBA8]/[66%] text-[20px]"
                        />
                    </DialogPrimitive.Close>

                    <DialogPrimitive.Close>
                        <SocialButton
                            variant="default"
                            defaultText="Eliminar"
                            customStyle="text-[20px]"
                        />
                    </DialogPrimitive.Close>

                </div>

            </DialogDescription>
        </DialogContent>
    );
}
