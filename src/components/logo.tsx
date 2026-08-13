import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  /** Use on dark backgrounds (footer, dark CTAs). */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { mark: "h-8 w-8", word: "text-base", gap: "gap-2" },
  md: { mark: "h-9 w-9", word: "text-lg", gap: "gap-2.5" },
  lg: { mark: "h-11 w-11", word: "text-xl", gap: "gap-3" },
};

/** CollabDocs brand mark: overlapping pages + dual carets (live collab). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="cd-bg" x1="8" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="cd-shine" x1="12" y1="6" x2="28" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Soft rounded tile */}
      <rect width="40" height="40" rx="11" fill="url(#cd-bg)" />
      <rect width="40" height="40" rx="11" fill="url(#cd-shine)" />

      {/* Back page (slightly offset) */}
      <path
        d="M14 10.5h9.2c.9 0 1.6.7 1.6 1.6v14.8c0 .9-.7 1.6-1.6 1.6H14c-.9 0-1.6-.7-1.6-1.6V12.1c0-.9.7-1.6 1.6-1.6Z"
        fill="#fff"
        fillOpacity="0.22"
      />

      {/* Front document */}
      <path
        d="M12.2 9h10.4c1 0 1.8.8 1.8 1.8v16.4c0 1-.8 1.8-1.8 1.8H12.2c-1 0-1.8-.8-1.8-1.8V10.8c0-1 .8-1.8 1.8-1.8Z"
        fill="#fff"
      />
      {/* Folded corner */}
      <path d="M21.4 9H24.4L21.4 12V9Z" fill="#C7D2FE" />
      <path d="M21.4 9v3h3L21.4 9Z" fill="#EEF2FF" />

      {/* Text lines */}
      <rect x="13.6" y="14.2" width="8.2" height="1.35" rx="0.65" fill="#93C5FD" />
      <rect x="13.6" y="17.4" width="6.4" height="1.35" rx="0.65" fill="#BFDBFE" />
      <rect x="13.6" y="20.6" width="7.5" height="1.35" rx="0.65" fill="#BFDBFE" />

      {/* Collaborator caret A (blue) */}
      <path d="M26.2 15.2 29.8 22.4l-2.05-.55-.95 2.35-.95-1.55 1.7-2.1-1.35-.35 0 0Z" fill="#38BDF8" />
      {/* Collaborator caret B (violet) */}
      <path d="M28.6 24.8 32.2 31.8l-2.1-.5-1 2.45-.95-1.6 1.75-2.2-1.4-.35Z" fill="#A78BFA" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  showWordmark = true,
  variant = "light",
  size = "md",
}: LogoProps) {
  const s = sizes[size];

  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <LogoMark className={cn(s.mark, "drop-shadow-sm", markClassName)} />
      {showWordmark && (
        <span
          className={cn(
            "font-semibold tracking-tight",
            s.word,
            variant === "dark" ? "text-white" : "text-slate-900"
          )}
        >
          Collab
          <span
            className={cn(
              "bg-clip-text text-transparent",
              variant === "dark"
                ? "bg-gradient-to-r from-sky-300 to-indigo-300"
                : "bg-gradient-to-r from-blue-600 to-indigo-600"
            )}
          >
            Docs
          </span>
        </span>
      )}
    </span>
  );
}
