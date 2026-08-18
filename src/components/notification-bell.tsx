"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/format";
import { Spinner } from "@/components/ui";
import { AnchoredPopover } from "@/components/anchored-popover";

type NotificationItem = {
  id: string;
  documentId: string;
  documentTitle: string;
  status: string;
  read: boolean;
  createdAt: string;
  actorName: string;
  role?: string;
};

export function NotificationBell() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = (await res.json()) as {
      notifications: NotificationItem[];
    };
    setItems(data.notifications);
    setPendingCount(
      data.notifications.filter((n) => n.status === "pending").length
    );
  }

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 20_000);
    return () => clearInterval(t);
  }, []);

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
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      await load();
      await fetch("/api/notifications", { method: "PATCH" });
      setLoading(false);
    }
  }

  async function act(id: string, action: "accept" | "decline") {
    setActingId(id);
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json()) as { documentId?: string };
      await load();
      router.refresh();
      if (action === "accept" && data.documentId) {
        setOpen(false);
        router.push(`/docs/${data.documentId}`);
      }
    } finally {
      setActingId(null);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => void toggle()}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4.5 w-4.5 h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"
          />
        </svg>
        {pendingCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      <AnchoredPopover
        open={open}
        anchorRef={rootRef}
        panelRef={panelRef}
        width={352}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
      >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Notifications
            </p>
            <p className="text-xs text-slate-500">
              Invites to collaborate on notepads
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 && (
              <p className="flex items-center gap-2 px-4 py-8 text-sm text-slate-500">
                <Spinner /> Loading…
              </p>
            )}

            {!loading && items.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                No notifications yet.
              </p>
            )}

            {items.map((n) => (
              <div
                key={n.id}
                className="border-b border-slate-100 px-4 py-3 last:border-0 dark:border-slate-800"
              >
                <p className="text-sm text-slate-800 dark:text-slate-100">
                  <span className="font-semibold">{n.actorName}</span> invited
                  you to {n.role === "viewer" ? "view" : "edit"}{" "}
                  <span className="font-semibold">{n.documentTitle}</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatRelativeTime(n.createdAt)}
                  {n.status === "accepted" && " · Accepted"}
                  {n.status === "declined" && " · Declined"}
                </p>

                {n.status === "pending" ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={actingId === n.id}
                      onClick={() => void act(n.id, "accept")}
                      className="inline-flex h-8 items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-xs font-semibold text-white disabled:opacity-70"
                    >
                      {actingId === n.id ? "Working…" : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={actingId === n.id}
                      onClick={() => void act(n.id, "decline")}
                      className="inline-flex h-8 items-center rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      Decline
                    </button>
                  </div>
                ) : n.status === "accepted" ? (
                  <Link
                    href={`/docs/${n.documentId}`}
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Open notepad →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
      </AnchoredPopover>
    </div>
  );
}
