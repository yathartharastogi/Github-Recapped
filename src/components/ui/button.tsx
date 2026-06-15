import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          // Variant mappings
          {
            "bg-primary text-primary-foreground hover:bg-neutral-800 dark:hover:bg-neutral-200 border border-transparent":
              variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-transparent":
              variant === "secondary",
            "border border-border bg-background hover:bg-muted hover:border-neutral-400 dark:hover:border-neutral-600":
              variant === "outline",
            "hover:bg-muted hover:text-accent-foreground border border-transparent":
              variant === "ghost",
          },
          // Size mappings
          {
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
