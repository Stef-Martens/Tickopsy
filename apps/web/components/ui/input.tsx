import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  variant?: "default" | "error" | "success";
  errorMessage?: string;
};

function Input({
  className,
  type,
  variant = "default",
  errorMessage,
  ...props
}: InputProps) {
  const variantClasses = {
    default:
      "border-input focus-visible:border-ring focus-visible:ring-ring/50",
    error:
      "border-destructive text-destructive focus-visible:ring-destructive/50",
    success: "border-green-500 text-green-700 focus-visible:ring-green-200",
  };

  return (
    <>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          variantClasses[variant],
          className
        )}
        {...props}
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </>
  );
}

export { Input };
