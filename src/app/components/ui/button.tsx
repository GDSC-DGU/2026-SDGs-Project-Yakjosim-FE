import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none disabled:scale-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-primary/90 hover:shadow-[var(--shadow-md)]",
        destructive:
          "bg-destructive text-white shadow-[var(--shadow-sm)] hover:bg-destructive/90 hover:shadow-[var(--shadow-md)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "bg-card text-foreground shadow-[var(--shadow-xs)] hover:bg-accent hover:text-accent-foreground hover:shadow-[var(--shadow-sm)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-xs)] hover:bg-secondary/80 hover:shadow-[var(--shadow-sm)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-2xl gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-2xl px-7 has-[>svg]:px-5",
        icon: "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
