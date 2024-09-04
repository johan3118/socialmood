import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 border border-[rgba(255,255,255,0.20)] shadow-[0px_4px_26px_0px_#00000017] hover:scale-[102%]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(106.25deg,_#FFFFFF_-272.33%,_#D24EA6_92.58%)] text-slate-50 shadow transition-transform hover:shadow-lg",
        blue: "bg-[linear-gradient(106.25deg,_#FFFFFF_-272.33%,_#2046E1_92.58%)] text-slate-50 shadow transition-transform hover:shadow-lg",
        green:
          "bg-[linear-gradient(106.25deg,_#FFFFFF_-272.33%,_#30BD92_92.58%)] text-slate-50 shadow transition-transform hover:shadow-lg",
        yellow:
          "bg-[linear-gradient(106.25deg,_#FFFFFF_-272.33%,_#FCC327_92.58%)] text-slate-50 shadow transition-transform hover:shadow-lg",
        orange:
          "bg-[linear-gradient(106.25deg,_#FFFFFF_-272.33%,_#F86A3A_92.58%)] text-slate-50 shadow transition-transform hover:shadow-lg",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      },
      size: {
        default: "h-9 px-14 py-4",
        defaultBold: "h-9 px-12 py-4 font-bold",
        sm: "h-8 rounded-md px-3 text-xs",
        smBold: "h-8 rounded-md px-3 text-xs font-bold",
        lg: "h-10 rounded-md px-8",
        lgBold: "h-10 rounded-md px-8 font-bold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
