import { forwardRef } from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={clsx(
          "rounded-xl bg-background transition-all duration-300",
          {
            // Variants
            "border border-border": variant === "outlined",
            "shadow-sm border border-border/50": variant === "default",
            "shadow-lg border border-border/50": variant === "elevated",

            // Padding
            "p-0": padding === "none",
            "p-4": padding === "sm",
            "p-6": padding === "md",
            "p-8": padding === "lg",

            // Hover effects
            "hover:shadow-xl hover:-translate-y-1 cursor-pointer": hover,
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

// Subcomponents
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, children, ...props }, ref) => {
    return (
      <div
        className={clsx("flex flex-col space-y-2 pb-4", className)}
        ref={ref}
        {...props}
      >
        {title && (
          <h3 className="text-xl font-semibold leading-tight tracking-tight text-text-primary">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-text-secondary leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={clsx("text-text-primary leading-relaxed", className)}
      ref={ref}
      {...props}
    />
  );
});

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={clsx("flex items-center pt-6 gap-4", className)}
      ref={ref}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";
