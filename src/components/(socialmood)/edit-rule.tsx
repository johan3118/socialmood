import React from "react";

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import * as DialogPrimitive from "@radix-ui/react-dialog"

import SocialButton from "./social-button";

interface EditRuleProps {
    ruleID: number;
    onOpenChange: (newOpenValue: boolean) => void;

}

export default function EditRule({ ruleID, onOpenChange }: EditRuleProps) {
    return (
        <DialogContent className="flex items-start md:w-[90%]">
            <DialogHeader className="w-full">
                <DialogTitle className="flex justify-between w-full mt-6">
                    <div className="flex"><img src="/magic-wand.svg" className="w-[49px] h-[49px]" />
                        <h1 className="ml-2 text-[40px]">Editar Regla</h1>
                    </div>
                    <SocialButton
                        variant="default"
                        defaultText="Guardar"
                        customStyle="text-[20px]"
                        onClick={() => { onOpenChange(false) }}

                    />
                </DialogTitle>
            </DialogHeader>
            <DialogDescription>
                <div className="flex flex-col w-full">

                </div>
            </DialogDescription>
            <button onClick={() => { onOpenChange(false) }} className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white">
                <img src="/delete.svg" alt="Close" className="w-6 h-6" />
            </button>
        </DialogContent>
    );
}
