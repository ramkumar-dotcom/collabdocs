"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { FontSize } from "@/lib/font-size";
import { toEditorHtml } from "@/lib/html";
import { EditorToolbar } from "@/components/editor-toolbar";
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

  const [, bump] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    onSelectionUpdate: () => bump((n) => n + 1),
    onTransaction: () => bump((n) => n + 1),
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
    ],
    content: toEditorHtml(initialContent),
    editorProps: {
      attributes: {
        class: "notepad-prose min-h-[58vh] px-8 py-6 focus:outline-none sm:px-12 sm:py-8",
      },
    },
    onUpdate: ({ editor: instance }) => {
      setContent(instance.getHTML());
    },
  });

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
          body: JSON.stringify({
            title: title.trim() || "Untitled notepad",
            content,
          }),
        });
        setStatus(res.ok ? "saved" : "error");
      } catch {
        setStatus("error");
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [id, title, content]);

  return (
    <div className="relative z-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 sm:px-5 dark:border-slate-800">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled notepad"
          className="min-w-0 flex-1 border-none bg-transparent text-lg font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-600"
        />
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
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

      {editor ? (
        <>
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="flex min-h-[58vh] items-center justify-center text-sm text-slate-400">
          <Spinner className="mr-2" /> Loading editor…
        </div>
      )}
    </div>
  );
}
