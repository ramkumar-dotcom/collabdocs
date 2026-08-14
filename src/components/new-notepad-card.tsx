"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewNotepadCard() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createNotepad() {
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/documents", { method: "POST" });
      const data = (await res.json()) as {
        document?: { id: string };
        error?: string;
      };

      if (!res.ok || !data.document) {
        setError(data.error ?? "Could not create notepad");
        return;
      }

      router.push(`/docs/${data.document.id}`);
      router.refresh();
    } catch {
      setError("Could not create notepad");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={createNotepad}
        disabled={pending}
        className="group flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md disabled:opacity-70"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-light text-white shadow-md shadow-blue-600/25 transition group-hover:scale-105">
          +
        </span>
        <span className="mt-4 text-base font-semibold text-slate-900">
          {pending ? "Creating…" : "New notepad"}
        </span>
        <span className="mt-1 text-sm text-slate-500">
          Start a blank page
        </span>
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
