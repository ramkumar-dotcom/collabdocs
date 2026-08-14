import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { getSession } from "@/lib/session";
import { NewNotepadCard } from "@/components/new-notepad-card";
import connectDB from "@/lib/db";
import { listUserDocuments } from "@/lib/documents";
import { formatRelativeTime } from "@/lib/format";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  await connectDB();
  const documents = await listUserDocuments(user.id);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <AppHeader user={user} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-slate-600">
          Start a new notepad or pick up where you left off.
        </p>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Start a new notepad
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NewNotepadCard />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Recent
          </h2>

          {documents.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
              No notepads yet. Create one above to get started.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/docs/${doc.id}`}
                  className="group flex min-h-[220px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex h-28 items-start overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 p-3">
                    <p className="line-clamp-5 text-[11px] leading-4 text-slate-400">
                      {doc.preview || "Empty notepad"}
                    </p>
                  </div>
                  <h3 className="mt-4 truncate text-base font-semibold text-slate-900 group-hover:text-blue-700">
                    {doc.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Opened {formatRelativeTime(doc.updatedAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
