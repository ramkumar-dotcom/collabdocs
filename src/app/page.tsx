import Link from "next/link";
import { Logo } from "@/components/logo";
import { LivePreviewTyping } from "@/components/live-preview-typing";

const features = [
  {
    title: "Live multiplayer editing",
    description:
      "Everyone types on the same canvas. Changes appear instantly with conflict-free sync — no refresh, no overwrites.",
    accent: "from-blue-500 to-cyan-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.09 9.09 0 0 0 3.74-.72 9 9 0 1 0-15.48 0A9.09 9.09 0 0 0 10 18.72M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    ),
  },
  {
    title: "Beautiful rich text",
    description:
      "Headings, lists, emphasis, and clean formatting in a focused editor that feels like a modern Google Docs.",
    accent: "from-indigo-500 to-violet-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    ),
  },
  {
    title: "Private by default",
    description:
      "Accounts secured with hashed passwords and session tokens. Share only when you’re ready — and with whom you choose.",
    accent: "from-emerald-500 to-teal-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    ),
  },
  {
    title: "Invite in one click",
    description:
      "Add editors or viewers to any document. Your whole team stays aligned without emailing file attachments.",
    accent: "from-orange-500 to-amber-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
      />
    ),
  },
  {
    title: "Always saved",
    description:
      "Edits persist to the cloud as you work. Close the tab, open another device — your latest draft is waiting.",
    accent: "from-sky-500 to-blue-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
      />
    ),
  },
  {
    title: "Browser-native",
    description:
      "No downloads, no plugins. Open CollabDocs on any modern browser and start writing in seconds.",
    accent: "from-fuchsia-500 to-pink-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
      />
    ),
  },
];

const steps = [
  {
    step: "1",
    title: "Create your workspace",
    body: "Sign up with email. Your account and first blank document are ready instantly.",
  },
  {
    step: "2",
    title: "Write in the open canvas",
    body: "Use a familiar doc layout — title at the top, rich text below, zero clutter.",
  },
  {
    step: "3",
    title: "Bring people in live",
    body: "Share the doc. Watch colored carets appear and ship the draft together.",
  },
];

const stats = [
  { value: "Realtime", label: "Yjs + Socket.IO sync" },
  { value: "Cloud", label: "MongoDB persistence" },
  { value: "Secure", label: "JWT session auth" },
  { value: "Fast", label: "Next.js edge-ready UI" },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 text-slate-900">
      {/* Nav — brand blue/indigo palette */}
      <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-gradient-to-r from-white via-blue-50/40 to-indigo-50/50 backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-5 md:grid-cols-[1fr_auto_1fr] sm:px-6">
          {/* Brand */}
          <Link
            href="/"
            className="justify-self-start transition hover:opacity-90"
          >
            <Logo size="md" />
          </Link>

          {/* Center links (desktop) */}
          <nav className="hidden items-center rounded-full border border-blue-100/90 bg-white/70 p-1 shadow-sm shadow-blue-500/5 md:flex">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How it works" },
              { href: "#preview", label: "Preview" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 justify-self-end">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-600/35"
            >
              Get started
              <span aria-hidden className="text-blue-100">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(37,99,235,0.16),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hero-grid"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-500/5 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-blue-400" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                Now live · Collaborative documents in the browser
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.05]">
                Your team&apos;s docs,{" "}
                <span className="relative whitespace-nowrap">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    written together
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 blur-[1px]" />
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 sm:text-xl">
                CollabDocs is a Google Docs–style workspace where ideas stay in
                one place. Draft, share, and co-edit with live carets — no more
                &ldquo;final_v7_really_final.docx&rdquo;.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-indigo-500 sm:w-auto"
                >
                  Start writing free
                  <span className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <a
                  href="#preview"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-slate-200 bg-white/90 px-8 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-white sm:w-auto"
                >
                  View live preview
                </a>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Free to try · No install · Works on any modern browser
              </p>
            </div>

            {/* Floating product preview */}
            <div
              id="preview"
              className="relative mx-auto mt-14 max-w-5xl scroll-mt-28 sm:mt-18"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-2xl" />

              <div className="animate-float relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                {/* Browser chrome */}
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/90 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="mx-auto flex w-full max-w-lg items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 shadow-sm">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                    <span className="truncate text-xs text-slate-500">
                      app.collabdocs.io / d / product-roadmap
                    </span>
                  </div>
                </div>

                {/* App chrome */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Logo size="sm" showWordmark={false} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        Q3 Product Roadmap
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Saved just now · 3 people here
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[
                        { i: "AK", c: "bg-violet-500" },
                        { i: "JM", c: "bg-emerald-500" },
                        { i: "SR", c: "bg-orange-500" },
                      ].map((u) => (
                        <span
                          key={u.i}
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${u.c} text-[10px] font-bold text-white ring-2 ring-white`}
                        >
                          {u.i}
                        </span>
                      ))}
                    </div>
                    <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 sm:inline">
                      Share
                    </span>
                  </div>
                </div>

                {/* Formatting bar */}
                <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-white px-3 py-2 text-xs text-slate-500 sm:px-5">
                  {["Normal text", "B", "I", "U", "• List", "1. List", "Link"].map(
                    (t, idx) => (
                      <span
                        key={t}
                        className={`rounded-md px-2 py-1 font-medium ${
                          idx === 1
                            ? "bg-slate-100 text-slate-800"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>

                <div className="grid lg:grid-cols-[1fr_220px]">
                  {/* Page — live typing simulation */}
                  <div className="relative min-h-[340px] bg-[linear-gradient(180deg,#fff_0%,#fafbfc_100%)] px-8 py-10 sm:px-16 sm:py-12">
                    <LivePreviewTyping />
                  </div>

                  {/* Presence rail */}
                  <aside className="hidden border-l border-slate-100 bg-slate-50/80 p-5 lg:block">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      In this doc
                    </p>
                    <ul className="mt-4 space-y-3">
                      {[
                        {
                          name: "Ava Kim",
                          role: "Editing intro",
                          color: "bg-violet-500",
                          online: true,
                        },
                        {
                          name: "Jordan M.",
                          role: "Editing checklist",
                          color: "bg-emerald-500",
                          online: true,
                        },
                        {
                          name: "Sam R.",
                          role: "Viewing",
                          color: "bg-orange-500",
                          online: true,
                        },
                      ].map((p) => (
                        <li
                          key={p.name}
                          className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100"
                        >
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${p.color} text-xs font-bold text-white`}
                          >
                            {p.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {p.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {p.role}
                            </p>
                          </div>
                          {p.online && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
                          )}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-white/60 p-3 text-center">
                      <p className="text-xs font-medium text-slate-500">
                        + Invite teammate
                      </p>
                    </div>
                  </aside>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4 text-center shadow-sm backdrop-blur"
                >
                  <p className="text-sm font-bold text-slate-900 sm:text-base">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-24 border-t border-slate-200/80 bg-white py-20 sm:py-28"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Features
              </p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for how teams actually write
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Less tool-switching. More shipping the words that matter.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/40 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} text-white shadow-md`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.75}
                      stroke="currentColor"
                      aria-hidden
                    >
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-t border-slate-200/80 bg-slate-50 py-20 sm:py-28"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                From zero to co-writing in minutes
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/25">
                    {item.step}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote / vision band */}
        <section className="border-t border-slate-200/80 bg-white py-16">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
            <Logo size="lg" className="justify-center" />
            <blockquote className="mt-8 text-balance text-2xl font-medium tracking-tight text-slate-800 sm:text-3xl">
              &ldquo;One shared canvas. Everyone online. The draft ships
              faster.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-slate-500">
              That&apos;s the CollabDocs promise — simple tools for serious
              collaboration.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-20 text-white sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_120%,rgba(37,99,235,0.35),transparent_60%)]"
          />
          <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Open a blank page. Invite the team.
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Your next doc doesn&apos;t need another folder of conflicting
              copies. It needs CollabDocs.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:w-auto"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-slate-600 px-8 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-6">
          <Logo size="sm" variant="dark" />
          <p className="text-center text-xs text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} CollabDocs. Write together in real
            time.
          </p>
          <div className="flex gap-5 text-sm text-slate-400">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <Link href="/login" className="transition hover:text-white">
              Sign in
            </Link>
            <Link href="/register" className="transition hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
