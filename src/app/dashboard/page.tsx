import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const initial = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <header className="border-b border-blue-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link href="/dashboard">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white">
              {initial}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-6">
        <p className="text-sm font-semibold text-blue-600">Your workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 max-w-xl text-slate-600">
          You&apos;re signed in. Document list and the live editor come next —
          your account is saved in MongoDB.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-6">
            <p className="text-sm font-semibold text-slate-800">
              Create a document
            </p>
            <p className="mt-2 text-sm text-slate-500">
              The editor and live collaboration will live here.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400"
            >
              Coming soon
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-slate-800">Account</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-slate-400">Name</dt>
                <dd className="font-medium text-slate-800">{user.name}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Email</dt>
                <dd className="font-medium text-slate-800">{user.email}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
