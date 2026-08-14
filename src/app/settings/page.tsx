import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AccountSettingsForm } from "@/components/account-settings-form";
import { getSession } from "@/lib/session";

export default async function SettingsPage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <AppHeader
        user={user}
        left={
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300"
          >
            ← Back to notepads
          </Link>
        }
      />

      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Account settings
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Update how your name appears and change your password.
        </p>

        <AccountSettingsForm name={user.name} email={user.email} />
      </main>
    </div>
  );
}
