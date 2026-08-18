"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui";
import { ThemePicker } from "@/components/theme-toggle";
import { AnchoredPopover } from "@/components/anchored-popover";

type AvatarMenuProps = {
  name: string;
  email: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AvatarMenu({ name, email }: AvatarMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2 rounded-full p-0.5 transition hover:bg-blue-50 dark:hover:bg-slate-800"
      >
        <span className="hidden text-right sm:block">
          <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
            {name}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            {email}
          </span>
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
          {initials(name)}
        </span>
      </button>

      <AnchoredPopover
        open={open}
        anchorRef={rootRef}
        panelRef={panelRef}
        width={256}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
      >
        <div role="menu">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {email}
            </p>
          </div>
          <ThemePicker />
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block cursor-pointer px-4 py-2.5 text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300"
          >
            Account settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            disabled={signingOut}
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-60 dark:text-slate-200 dark:hover:bg-red-950/50 dark:hover:text-red-300"
          >
            {signingOut && <Spinner className="h-3.5 w-3.5" />}
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </AnchoredPopover>
    </div>
  );
}
