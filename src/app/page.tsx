import Link from "next/link";

const features = [
  {
    title: "Real-time collaboration",
    description:
      "Write together live. See teammates type as it happens with low-latency sync powered by Yjs and Socket.IO.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.09 9.09 0 0 0 3.74-.72 9 9 0 1 0-15.48 0A9.09 9.09 0 0 0 10 18.72M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    ),
  },
  {
    title: "Rich document editor",
    description:
      "Headings, lists, bold, links, and more — a clean Google Docs–style canvas that stays out of your way.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    ),
  },
  {
    title: "Secure accounts",
    description:
      "Sign in with email and password. Your documents stay private until you choose to share them.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    ),
  },
  {
    title: "Share with your team",
    description:
      "Invite collaborators as editors or viewers. Work on the same doc without emailing versions around.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
      />
    ),
  },
  {
    title: "Auto-saved in the cloud",
    description:
      "Every change is stored safely in MongoDB. Come back anytime — pick up right where you left off.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
      />
    ),
  },
  {
    title: "Works in the browser",
    description:
      "No install required. Open CollabDocs on any modern browser and start writing in seconds.",
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
    step: "01",
    title: "Create an account",
    body: "Sign up free with your email. Your workspace is ready in moments.",
  },
  {
    step: "02",
    title: "Start a document",
    body: "Open a blank page or continue an existing draft from your dashboard.",
  },
  {
    step: "03",
    title: "Invite and co-edit",
    body: "Share a link, watch live cursors appear, and ship the doc together.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 text-zinc-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm shadow-blue-600/25">
              C
            </span>
            <span className="text-lg font-semibold tracking-tight">
              CollabDocs
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
            <a href="#features" className="transition hover:text-zinc-900">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-zinc-900">
              How it works
            </a>
            <a href="#preview" className="transition hover:text-zinc-900">
              Preview
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 sm:px-4"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 sm:px-4"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]"
          />
          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pb-24 sm:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Live collaborative documents
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl md:leading-[1.08]">
                Write together.{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  In real time.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
                CollabDocs is a Google Docs–style editor for teams. Create
                documents, invite people, and edit live — no version chaos, no
                waiting for someone to finish.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 sm:w-auto"
                >
                  Start writing free
                </Link>
                <a
                  href="#preview"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 sm:w-auto"
                >
                  See product preview
                </a>
              </div>
              <p className="mt-5 text-sm text-zinc-500">
                Free to get started · Works in any browser · No install
              </p>
            </div>

            {/* Editor mock preview */}
            <div id="preview" className="mx-auto mt-16 max-w-4xl scroll-mt-24">
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 ring-1 ring-black/5">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="mx-auto flex max-w-md flex-1 items-center justify-center">
                    <div className="w-full truncate rounded-md border border-zinc-200 bg-white px-3 py-1 text-center text-xs text-zinc-500">
                      collabdocs.app / docs / product-roadmap
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 border-b border-zinc-100 px-4 py-2 text-xs text-zinc-500">
                  {["File", "Edit", "View", "Insert", "Format"].map((item) => (
                    <span
                      key={item}
                      className="rounded px-2 py-1 font-medium hover:bg-zinc-50"
                    >
                      {item}
                    </span>
                  ))}
                  <div className="ml-auto flex -space-x-2">
                    {[
                      { initials: "AK", color: "bg-violet-500" },
                      { initials: "JM", color: "bg-emerald-500" },
                      { initials: "SR", color: "bg-orange-500" },
                    ].map((user) => (
                      <span
                        key={user.initials}
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${user.color} text-[10px] font-bold text-white ring-2 ring-white`}
                        title={user.initials}
                      >
                        {user.initials}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Document body */}
                <div className="grid gap-0 lg:grid-cols-[1fr_200px]">
                  <div className="min-h-[320px] space-y-4 px-8 py-10 sm:px-14 sm:py-12">
                    <div className="flex items-start gap-2">
                      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
                        Q3 Product Roadmap
                      </h2>
                      <span className="mt-2 inline-block h-5 w-0.5 animate-pulse bg-blue-500" />
                    </div>
                    <p className="text-[15px] leading-7 text-zinc-600">
                      Goals for this quarter: ship live collaboration, document
                      sharing, and a polished editor experience for remote
                      teams.
                    </p>
                    <div className="space-y-2 pt-2">
                      <p className="text-sm font-semibold text-zinc-800">
                        Priorities
                      </p>
                      <ul className="space-y-2 text-[15px] text-zinc-600">
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                          Real-time multiplayer editing with presence cursors
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          Secure auth and per-document permissions
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                          Cloud save with reliable MongoDB persistence
                        </li>
                      </ul>
                    </div>
                    {/* Fake collab carets */}
                    <div className="relative pt-4">
                      <p className="text-[15px] leading-7 text-zinc-600">
                        Next up: polish the dashboard and invite flow so teams
                        can{" "}
                        <span className="relative inline-block">
                          onboard in under a minute
                          <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-violet-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            Ava
                          </span>
                          <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-violet-400/80" />
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  <aside className="hidden border-l border-zinc-100 bg-zinc-50/50 p-4 lg:block">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Active now
                    </p>
                    <ul className="mt-3 space-y-3">
                      {[
                        { name: "Ava Kim", role: "Editing", color: "bg-violet-500" },
                        { name: "Jordan M.", role: "Editing", color: "bg-emerald-500" },
                        { name: "Sam R.", role: "Viewing", color: "bg-orange-500" },
                      ].map((person) => (
                        <li key={person.name} className="flex items-center gap-2.5">
                          <span
                            className={`h-2 w-2 rounded-full ${person.color}`}
                          />
                          <div>
                            <p className="text-sm font-medium text-zinc-800">
                              {person.name}
                            </p>
                            <p className="text-xs text-zinc-500">{person.role}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 border-t border-zinc-200 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need to co-write
              </h2>
              <p className="mt-4 text-lg text-zinc-600">
                Built for product teams, students, and anyone who still juggles
                five copies of the same file.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/10 transition group-hover:bg-blue-600 group-hover:text-white">
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
                  <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-t border-zinc-200 bg-zinc-50 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Up and writing in three steps
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((item, index) => (
                <div key={item.step} className="relative">
                  {index < steps.length - 1 && (
                    <div
                      aria-hidden
                      className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-blue-300 to-transparent md:block"
                    />
                  )}
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <span className="text-sm font-bold text-blue-600">
                      {item.step}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold text-zinc-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof strip */}
        <section className="border-t border-zinc-200 bg-white py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
            <p className="text-center text-sm font-medium text-zinc-500 sm:text-left">
              Powered by a modern stack teams trust
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold tracking-wide text-zinc-400">
              {["Next.js", "MongoDB", "Socket.IO", "Yjs", "TipTap"].map(
                (tech) => (
                  <span key={tech}>{tech}</span>
                )
              )}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-zinc-200 bg-zinc-900 py-20 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to write together?
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Create your free account and open your first document in under a
              minute.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-500 px-8 text-sm font-semibold text-white transition hover:bg-blue-400 sm:w-auto"
              >
                Get started free
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-zinc-600 px-8 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 sm:w-auto"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-10 text-zinc-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white">
              C
            </span>
            <span className="text-sm font-semibold text-zinc-200">
              CollabDocs
            </span>
          </div>
          <p className="text-center text-xs sm:text-sm">
            © {new Date().getFullYear()} CollabDocs. Built for real-time
            collaboration.
          </p>
          <div className="flex gap-4 text-xs sm:text-sm">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <Link href="/login" className="transition hover:text-white">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
