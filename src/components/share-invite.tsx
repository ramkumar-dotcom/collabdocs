"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui";

type SearchUser = { id: string; name: string; email: string };

export function ShareInvite({ documentId }: { documentId: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = (await res.json()) as { users?: SearchUser[] };
        setResults(data.users ?? []);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [query, open]);

  async function invite(email: string) {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        error?: string;
        invited?: { name: string };
      };
      if (!res.ok) {
        setError(data.error ?? "Could not send invite");
        return;
      }
      setMessage(
        `Invite sent to ${data.invited?.name ?? email}. They’ll see it on the bell when they sign in.`
      );
      setQuery("");
      setResults([]);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setError(null);
        }}
        className="inline-flex h-9 items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-sm"
      >
        Invite
      </button>

      {open && (
        <div className="absolute right-0 z-[60] mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Invite to collaborate
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Search someone who already has a CollabDocs account. No email is
            sent — they’ll get a bell notification.
          </p>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or email"
            className="mt-3 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <div className="mt-2 max-h-44 overflow-y-auto">
            {searching && (
              <p className="flex items-center gap-2 py-2 text-xs text-slate-500">
                <Spinner className="h-3 w-3" /> Searching…
              </p>
            )}
            {!searching && query.trim().length >= 2 && results.length === 0 && (
              <p className="py-2 text-xs text-slate-500">
                No matching account. They need to register first.
              </p>
            )}
            {results.map((user) => (
              <button
                key={user.id}
                type="button"
                disabled={pending}
                onClick={() => void invite(user.email)}
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                <span>
                  <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                    {user.name}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {user.email}
                  </span>
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  Invite
                </span>
              </button>
            ))}
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          {message && (
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
