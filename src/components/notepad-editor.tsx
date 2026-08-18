"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { FontSize } from "@/lib/font-size";
import { toEditorHtml } from "@/lib/html";
import {
  colorForUser,
  createCollabSession,
  yFragmentIsEmpty,
} from "@/lib/collab";
import { EditorToolbar } from "@/components/editor-toolbar";
import { FileMenu } from "@/components/file-menu";
import { Spinner } from "@/components/ui";

type LiveUser = { name: string; color: string };

type Props = {
  id: string;
  initialTitle: string;
  initialContent: string;
  userId: string;
  userName: string;
};

export function NotepadEditor({
  id,
  initialTitle,
  initialContent,
  userId,
  userName,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<"saved" | "saving" | "error" | "live">(
    "live"
  );
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<LiveUser[]>([]);
  const seeded = useRef(false);
  const [, bump] = useState(0);

  const userColor = useMemo(() => colorForUser(userId), [userId]);
  const session = useMemo(() => createCollabSession(id), [id]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      onSelectionUpdate: () => bump((n) => n + 1),
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          undoRedo: false,
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
        Collaboration.configure({
          document: session.ydoc,
        }),
        CollaborationCaret.configure({
          provider: session.provider,
          user: { name: userName, color: userColor },
        }),
      ],
      editorProps: {
        attributes: {
          class:
            "notepad-prose min-h-[58vh] px-8 py-6 focus:outline-none sm:px-12 sm:py-8",
        },
      },
    },
    [session, userName, userColor]
  );

  useEffect(() => {
    const { provider, ydoc } = session;
    seeded.current = false;

    const onStatus = (event: { status: string }) => {
      setConnected(event.status === "connected");
    };

    const trySeed = () => {
      if (seeded.current || !editor) return;
      if (!yFragmentIsEmpty(ydoc)) {
        seeded.current = true;
        return;
      }
      const html = toEditorHtml(initialContent);
      if (!html) {
        seeded.current = true;
        return;
      }
      editor.commands.setContent(html);
      seeded.current = true;
    };

    const onSync = (synced: boolean) => {
      if (synced) trySeed();
    };

    const onAwareness = () => {
      const users: LiveUser[] = [];
      provider.awareness.getStates().forEach((state, clientId) => {
        if (clientId === ydoc.clientID) return;
        const user = state.user as LiveUser | undefined;
        if (user?.name) users.push({ name: user.name, color: user.color });
      });
      setPeers(users);
    };

    provider.on("status", onStatus);
    provider.on("sync", onSync);
    provider.awareness.on("update", onAwareness);
    if (provider.synced) trySeed();
    onAwareness();

    return () => {
      provider.off("status", onStatus);
      provider.off("sync", onSync);
      provider.awareness.off("update", onAwareness);
    };
  }, [session, editor, initialContent]);

  useEffect(() => {
    return () => {
      session.provider.destroy();
      session.ydoc.destroy();
    };
  }, [session]);

  const titleRef = useRef(title);
  titleRef.current = title;
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!editor) return;

    const save = () => {
      setStatus("saving");
      void fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleRef.current.trim() || "Untitled notepad",
          content: editor.getHTML(),
        }),
      })
        .then((res) => setStatus(res.ok ? "live" : "error"))
        .catch(() => setStatus("error"));
    };

    const onUpdate = () => {
      setStatus("saving");
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(save, 1200);
    };

    editor.on("update", onUpdate);
    return () => {
      editor.off("update", onUpdate);
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [editor, id]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!editor) return;
      setStatus("saving");
      try {
        const res = await fetch(`/api/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim() || "Untitled notepad",
            content: editor.getHTML(),
          }),
        });
        setStatus(res.ok ? "live" : "error");
      } catch {
        setStatus("error");
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [title, editor, id]);

  return (
    <div className="relative z-0 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 sm:px-5 dark:border-slate-800">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled notepad"
          className="min-w-0 flex-1 border-none bg-transparent text-lg font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-600"
        />
        <div className="flex shrink-0 items-center gap-3">
          {peers.length > 0 && (
            <div className="flex -space-x-2">
              {peers.slice(0, 4).map((peer) => (
                <span
                  key={peer.name}
                  title={peer.name}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900"
                  style={{ backgroundColor: peer.color }}
                >
                  {peer.name.slice(0, 1).toUpperCase()}
                </span>
              ))}
            </div>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            {status === "saving" && (
              <>
                <Spinner className="h-3 w-3 text-blue-500" />
                Saving…
              </>
            )}
            {status === "error" && "Couldn’t save snapshot"}
            {status !== "saving" && status !== "error" && (
              <>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    connected ? "bg-emerald-500" : "bg-amber-400"
                  }`}
                />
                {connected ? "Live" : "Connecting…"}
              </>
            )}
          </span>
        </div>
      </div>

      {editor ? (
        <>
          <EditorToolbar
            editor={editor}
            leading={
              <FileMenu
                title={title.trim() || "Untitled notepad"}
                editor={editor}
                onSave={async () => {
                  setStatus("saving");
                  const res = await fetch(`/api/documents/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      title: title.trim() || "Untitled notepad",
                      content: editor.getHTML(),
                    }),
                  });
                  setStatus(res.ok ? "live" : "error");
                  if (!res.ok) throw new Error("save failed");
                }}
              />
            }
          />
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
