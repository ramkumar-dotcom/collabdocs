export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              C
            </span>
            <span className="text-lg font-semibold tracking-tight">
              CollabDocs
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Setup ready
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Project scaffold
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Google Docs–style app with live collaboration
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Next.js, Tailwind CSS, Node.js, MongoDB, Socket.IO, and Yjs are
          installed. Auth, documents API, and the editor come next.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Next.js + Tailwind",
              body: "App Router frontend and API routes for documents and auth.",
            },
            {
              title: "MongoDB + Mongoose",
              body: "User and Document models with a cached connection helper.",
            },
            {
              title: "Live collab server",
              body: "Socket.IO + Yjs on port 4000 for multiplayer editing.",
            },
            {
              title: "TipTap editor",
              body: "Rich-text editor packages ready for collaboration extensions.",
            },
            {
              title: "Auth utilities",
              body: "bcryptjs + jose helpers for passwords and JWT sessions.",
            },
            {
              title: "Health check",
              body: "GET /api/health verifies the API and MongoDB connection.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="font-semibold">Run locally</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              Ensure MongoDB is running (local or Atlas URI in{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                .env.local
              </code>
              ).
            </li>
            <li>
              From{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                collabdocs/
              </code>
              , run{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                npm run dev
              </code>
              .
            </li>
            <li>
              Web:{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                http://localhost:3000
              </code>{" "}
              · Socket:{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                http://localhost:4000
              </code>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
