import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      aria-hidden
    />
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "ghost" | "menu";
};

export function Button({
  loading,
  disabled,
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70",
    ghost:
      "inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60",
    menu: "block w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-60",
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn("cursor-pointer", variants[variant], className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ShimmerBlock({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg", className)} />;
}
