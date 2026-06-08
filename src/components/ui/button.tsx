import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-(--radius) border border-transparent px-5 text-sm font-semibold transition-[background,border-color,color,transform,box-shadow] duration-150 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-(--color-accent) text-(--color-text-inverse) shadow-[0_0_24px_var(--color-glow)] hover:bg-(--color-accent-hover)",
        secondary:
          "border-(--color-border) bg-(--color-bg-elevated) text-(--color-text-primary) hover:border-(--color-accent) hover:text-(--color-accent)",
        ghost:
          "text-(--color-text-secondary) hover:bg-(--color-accent-muted) hover:text-(--color-accent)",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-[calc(var(--radius)-2px)] px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
