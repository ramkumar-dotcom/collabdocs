"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui";
import { AnchoredPopover } from "@/components/anchored-popover";

type SearchUser = { id: string; name: string; email: string };
type Person = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer";
};

export function ShareInvite({ documentId }: { documentId: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [searching, setSearching] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadPeople() {
    const res = await fetch(`/api/documents/${documentId}/collaborators`);
    if (!res.ok) return;
    const data = (await res.json()) as { people?: Person[] };
    setPeople(data.people ?? []);
  }

  useEffect(() => {
    function onPointer(e: MouseEvent) {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  useEffect(() => {
    if (open) void loadPeople();
  }, [open, documentId]);

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
        body: JSON.stringify({ email, role }),
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
        `Invited ${data.invited?.name ?? email} as ${role}. They’ll see it on the bell.`
      );
      setQuery("");
      setResults([]);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function removePerson(userId: string) {
    const res = await fetch(`/api/documents/${documentId}/collaborators`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) await loadPeople();
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
        Share
      </button>

      <AnchoredPopover
        open={open}
        anchorRef={rootRef}
        panelRef={panelRef}
        width={360}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Share notepad
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Invite someone who already has a CollabDocs account.
        </p>

        <div className="mt-3 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or email"
            className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "editor" | "viewer")}
            className="h-10 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="mt-2 max-h-36 overflow-y-auto">
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
                <span className="block text-xs text-slate-500">{user.email}</span>
              </span>
              <span className="text-xs font-semibold text-blue-600">Invite</span>
            </button>
          ))}
        </div>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        {message && (
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
            {message}
          </p>
        )}

        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            People with access
          </p>
          <ul className="max-h-40 space-y-2 overflow-y-auto">
            {people.map((person) => (
              <li key={person.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {person.name}
                  </p>
                  <p className="truncate text-xs capitalize text-slate-500">
                    {person.role}
                  </p>
                </div>
                {person.role !== "owner" && (
                  <button
                    type="button"
                    onClick={() => void removePerson(person.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </AnchoredPopover>
    </div>
  );
}
