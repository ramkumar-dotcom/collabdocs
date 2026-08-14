"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui";

type Props = {
  id: string;
  initialTitle: string;
  initialContent: string;
};

export function NotepadEditor({ id, initialTitle, initialContent }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    setStatus("saving");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim() || "Untitled notepad", content }),
        });
        setStatus(res.ok ? "saved" : "error");
      } catch {
        setStatus("error");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [id, title, content]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-12 sm:py-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          {status === "saving" && (
            <>
              <Spinner className="h-3 w-3 text-blue-500" />
              Saving…
            </>
          )}
          {status === "saved" && "Saved"}
          {status === "error" && "Couldn’t save — try again"}
        </span>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled notepad"
        className="w-full border-none bg-transparent text-3xl font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-600"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing…"
        className="mt-6 min-h-[55vh] w-full resize-none border-none bg-transparent text-[17px] leading-8 text-slate-700 outline-none placeholder:text-slate-300 dark:text-slate-200 dark:placeholder:text-slate-600"
      />
    </div>
  );
}
