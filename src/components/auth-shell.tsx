import Link from "next/link";
import { Logo } from "@/components/logo";

type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="flex min-h-full flex-1 bg-slate-50">
      {/* Brand panel */}
      <aside className="relative hidden w-[44%] overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 lg:flex lg:flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(255 255 255 / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-sky-400/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-10 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl"
        />

        <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-12">
          <Link href="/" className="self-start">
            <Logo size="md" variant="dark" />
          </Link>

          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-100/80">
              Write together
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-snug tracking-tight text-white xl:text-4xl">
              One shared canvas. Live carets. No more version chaos.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-blue-100/90">
              CollabDocs is a Google Docs–style workspace for teams. Draft,
              invite, and edit in real time.
            </p>

            <div className="mt-10 space-y-3">
              {[
                { who: "Ava", text: "Shipping the intro…", color: "bg-sky-300" },
                { who: "Jordan", text: "Checklist looks good", color: "bg-violet-300" },
              ].map((row) => (
                <div
                  key={row.who}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${row.color} text-xs font-bold text-indigo-900`}
                  >
                    {row.who.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{row.who}</p>
                    <p className="text-xs text-blue-100/80">{row.text}</p>
                  </div>
                  <span className="ml-auto h-2 w-2 rounded-full bg-emerald-300" />
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-blue-100/60">
            © {new Date().getFullYear()} CollabDocs
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:justify-end">
          <Link href="/" className="lg:hidden">
            <Logo size="sm" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            ← Back to home
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 pb-16 sm:px-8">
          <div className="w-full max-w-[420px]">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {subtitle}
            </p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
