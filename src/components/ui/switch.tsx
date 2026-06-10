import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-(--color-border) bg-(--color-bg-overlay) transition-[background,border-color] duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 data-[state=checked]:border-(--color-accent) data-[state=checked]:bg-(--color-accent)",
      className,
    )}
    ref={ref}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className="pointer-events-none block h-5 w-5 translate-x-1 rounded-full bg-(--color-text-primary) shadow-[0_10px_24px_var(--color-shadow)] transition-transform duration-150 data-[state=checked]:translate-x-6 data-[state=checked]:bg-(--color-text-inverse)"
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
