"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui";

const fieldClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

type Props = {
  name: string;
  email: string;
};

export function AccountSettingsForm({ name, email }: Props) {
  const router = useRouter();
  const [nameValue, setNameValue] = useState(name);
  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [namePending, setNamePending] = useState(false);

  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordPending, setPasswordPending] = useState(false);

  async function saveName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNameMsg(null);
    setNameError(null);
    setNamePending(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setNameError(data.error ?? "Could not update name");
        return;
      }
      setNameMsg("Name updated");
      router.refresh();
    } catch {
      setNameError("Network error. Please try again.");
    } finally {
      setNamePending(false);
    }
  }

  async function savePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordError(null);
    setPasswordPending(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: String(data.get("currentPassword") ?? ""),
          newPassword: String(data.get("newPassword") ?? ""),
          confirmPassword: String(data.get("confirmPassword") ?? ""),
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setPasswordError(json.error ?? "Could not update password");
        return;
      }
      form.reset();
      setPasswordMsg("Password updated");
    } catch {
      setPasswordError("Network error. Please try again.");
    } finally {
      setPasswordPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <form
        onSubmit={saveName}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Profile
        </h2>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            value={email}
            disabled
            className={`${fieldClass} cursor-not-allowed bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400`}
          />
          <p className="mt-1 text-xs text-slate-400">Email can’t be changed.</p>
        </div>
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Display name
          </label>
          <input
            id="name"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            minLength={2}
            required
            className={fieldClass}
          />
        </div>
        {nameError && <p className="text-sm text-red-600">{nameError}</p>}
        {nameMsg && <p className="text-sm text-emerald-600">{nameMsg}</p>}
        <Button type="submit" loading={namePending} className="h-10 rounded-full">
          {namePending ? "Saving…" : "Save name"}
        </Button>
      </form>

      <form
        onSubmit={savePassword}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Password
        </h2>
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className={fieldClass}
          />
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={fieldClass}
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={fieldClass}
          />
        </div>
        {passwordError && (
          <p className="text-sm text-red-600">{passwordError}</p>
        )}
        {passwordMsg && (
          <p className="text-sm text-emerald-600">{passwordMsg}</p>
        )}
        <Button
          type="submit"
          loading={passwordPending}
          className="h-10 rounded-full"
        >
          {passwordPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
