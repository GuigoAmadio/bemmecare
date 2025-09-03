"use client";

import { forwardRef, ReactNode } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = false, className, ...props }, ref) => {
    return (
      <div className={clsx("space-y-1", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={clsx(
              "w-full px-4 py-3 border border-border rounded-lg",
              "bg-background text-text-primary placeholder:text-text-muted",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-12",
              error && "border-error focus:border-error focus:ring-error",
              className
            )}
            {...props}
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
