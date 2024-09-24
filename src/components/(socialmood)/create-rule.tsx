import React from "react";

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import * as DialogPrimitive from "@radix-ui/react-dialog"

import SocialButton from "./social-button";


export default function CreateRule() {
    return (
        <DialogContent className="flex items-start md:w-[90%]">
            <DialogHeader className="w-full">
                <DialogTitle className="flex justify-between w-full mt-6">
                    <div className="flex"><img src="/magic-wand.svg" className="w-[49px] h-[49px]" />
                        <h1 className="ml-2 text-[40px]">Crear Regla</h1>
                    </div>
                    <DialogPrimitive.Close>
                        <SocialButton
                            variant="default"
                            defaultText="Guardar"
                            customStyle="text-[20px]"
                        />
                    </DialogPrimitive.Close>
                </DialogTitle>
            </DialogHeader>
            <DialogDescription>
            <div className="flex flex-col w-full">
                
            </div>
            </DialogDescription>
        </DialogContent>
    );
}
