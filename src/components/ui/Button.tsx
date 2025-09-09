import { forwardRef } from "react";
import { clsx } from "clsx";
import { ButtonVariant, Size } from "@/types";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={clsx(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg transform hover:-translate-y-0.5":
              variant === "primary",
            "bg-secondary text-white hover:bg-secondary/90":
              variant === "secondary",
            "border-2 border-primary bg-transparent text-primary hover:bg-primary":
              variant === "outline",
            "hover:bg-background-secondary text-text-primary":
              variant === "ghost",
            "text-primary hover:underline": variant === "link",
            "bg-background border border-border text-text-primary hover:bg-background-secondary":
              variant === "default",

            // Sizes
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-6": size === "md",
            "h-13 px-8 text-lg": size === "lg",

            // Full width
            "w-full": fullWidth,
          },
          className
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
