import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-utility font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-saffron text-white shadow-[0_8px_24px_-8px_rgba(232,130,60,0.6)] hover:shadow-[0_10px_30px_-6px_rgba(232,130,60,0.75)] hover:brightness-105",
        secondary:
          "bg-forest text-canvas hover:bg-forest/90 dark:bg-mint dark:text-forest",
        outline:
          "border border-forest/15 text-forest hover:border-forest/30 hover:bg-forest/5 dark:border-mint/20 dark:text-mint dark:hover:bg-mint/10",
        ghost: "text-forest hover:bg-forest/5 dark:text-mint dark:hover:bg-mint/10",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
