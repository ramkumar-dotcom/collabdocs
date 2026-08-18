"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import {
  downloadHtml,
  downloadText,
  downloadWord,
  printAsPdf,
} from "@/lib/export";
import { Spinner } from "@/components/ui";

type Props = {
  title: string;
  editor: Editor;
  onSave: () => Promise<void>;
};

export function FileMenu({ title, editor, onSave }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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

  async function save() {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
      setOpen(false);
    }
  }

  function run(action: () => void) {
    action();
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 items-center rounded-md px-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200/80 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        File
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-1 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <MenuItem onClick={() => void save()} disabled={saving}>
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="h-3 w-3" /> Saving…
              </span>
            ) : (
              "Save"
            )}
          </MenuItem>
          <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
          <MenuItem
            onClick={() =>
              run(() => downloadText(title, editor.getText() || ""))
            }
          >
            Download as TXT
          </MenuItem>
          <MenuItem
            onClick={() =>
              run(() => downloadHtml(title, editor.getHTML()))
            }
          >
            Download as HTML
          </MenuItem>
          <MenuItem
            onClick={() =>
              run(() => downloadWord(title, editor.getHTML()))
            }
          >
            Download as Word
          </MenuItem>
          <MenuItem
            onClick={() => run(() => printAsPdf(title, editor.getHTML()))}
          >
            Save as PDF…
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300"
    >
      {children}
    </button>
  );
}
