import React from "react";

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import SocialButton from "./social-button";

import { useState } from "react";


import { toast } from "@/components/ui/use-toast";

import { deleteRule, ruleHasChildren } from "@/app/actions/(socialmood)/rules.actions";

interface DeleteRuleChildProps {
    ruleID: number;
    onOpenChange: (newOpenValue: boolean) => void;
}

export default function DeleteRuleChild({ ruleID, onOpenChange }: DeleteRuleChildProps) {

    const [isPending, setIsPending] = useState(false);


    const handleDeleteRule = async () => {

        const res = await deleteRule(ruleID);
        if (res.error) {
            toast({
                variant: "destructive",
                description: res.error,
            });
            setIsPending(false);
        } else if (res.success) {
            toast({
                variant: "default",
                description: "Rule deleted successfully",
            });
            onOpenChange(false);
        }
        setIsPending(false);


    }

    return (
        <DialogContent>
            <DialogHeader className="flex items-center justify-center">
                <img src="/thinking-face.svg" alt="Alert" className="w-66 h-66" />
                <DialogTitle><h1 className="text-[33px]">CONFIRMACIÓN</h1></DialogTitle>
            </DialogHeader>

            <DialogDescription className="w-[70%]">
                <hr className="my-3" />
                <p className="text-[18px] text-center">¿Estás seguro de que quieres eliminar estar regla?</p>

                <div className="mt-12 flex items-center justify-center space-x-2 ">
                    <SocialButton
                        variant="google"
                        defaultText="Cancelar"
                        customStyle="text-black bg-[#EBEBEBA8]/[66%] text-[20px]"
                        onClick={() => { onOpenChange(false) }}
                    />

                    <SocialButton
                        variant="default"
                        defaultText="Eliminar"
                        pendingText="Eliminando..."
                        customStyle="text-[20px]"
                        isPending={isPending}
                        onClick={handleDeleteRule}
                    />


                </div>

            </DialogDescription>
            <button onClick={() => { onOpenChange(false) }} className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white">
                <img src="/delete.svg" alt="Close" className="w-6 h-6" />
            </button>
        </DialogContent>
    );
}
