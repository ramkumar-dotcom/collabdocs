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
  seedIfEmpty,
} from "@/lib/collab";
import { EditorToolbar } from "@/components/editor-toolbar";
import { FileMenu } from "@/components/file-menu";
import { CommentMark } from "@/components/comment-mark";
import { CommentsPanel, HistoryPanel } from "@/components/collab-panels";
import { Spinner } from "@/components/ui";

type LiveUser = { clientId: number; name: string; color: string };

type Props = {
  id: string;
  initialTitle: string;
  initialContent: string;
  userId: string;
  userName: string;
  canEdit: boolean;
};

export function NotepadEditor({
  id,
  initialTitle,
  initialContent,
  userId,
  userName,
  canEdit,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<"saved" | "saving" | "error" | "live">(
    "live"
  );
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<LiveUser[]>([]);
  const [side, setSide] = useState<"none" | "comments" | "history">("none");
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
        CommentMark,
      ],
      editable: canEdit,
      editorProps: {
        attributes: {
          class:
            "notepad-prose min-h-[58vh] px-8 py-6 focus:outline-none sm:px-12 sm:py-8",
        },
      },
    },
    [session, userName, userColor, canEdit]
  );

  useEffect(() => {
    const { provider, ydoc } = session;
    let cancelled = false;
    let seedTimer: number | null = null;

    const onStatus = (event: { status: string }) => {
      setConnected(event.status === "connected");
    };

    const trySeed = () => {
      if (cancelled || !editor) return;
      const html = toEditorHtml(initialContent);
      const currentText = editor.getText().replace(/\s+/g, " ").trim();
      const incomingText = html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (currentText && incomingText && currentText.includes(incomingText)) {
        session.seeded = true;
        return;
      }
      const peerIds = [...provider.awareness.getStates().keys()];
      if (
        peerIds.length > 1 &&
        ydoc.clientID !== Math.min(...peerIds)
      ) {
        return;
      }
      if (!seedIfEmpty(session, html)) return;
      if (html) editor.commands.setContent(html);
    };

    const scheduleSeed = () => {
      if (seedTimer) window.clearTimeout(seedTimer);
      // Wait for remote Yjs state before inserting saved HTML
      seedTimer = window.setTimeout(trySeed, 400);
    };

    const onSync = (synced: boolean) => {
      if (synced) scheduleSeed();
    };

    const onAwareness = () => {
      const users: LiveUser[] = [];
      provider.awareness.getStates().forEach((state, clientId) => {
        if (clientId === ydoc.clientID) return;
        const user = state.user as { name?: string; color?: string } | undefined;
        if (user?.name) {
          users.push({
            clientId,
            name: user.name,
            color: user.color || "#2563eb",
          });
        }
      });
      setPeers(users);
    };

    provider.on("status", onStatus);
    provider.on("sync", onSync);
    provider.awareness.on("update", onAwareness);
    if (provider.synced) scheduleSeed();
    onAwareness();

    return () => {
      cancelled = true;
      if (seedTimer) window.clearTimeout(seedTimer);
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

    const save = (includeContent: boolean) => {
      const html = editor.getHTML();
      const empty =
        html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim() === "";
      setStatus("saving");
      void fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleRef.current.trim() || "Untitled notepad",
          ...(includeContent && !empty ? { content: html } : {}),
        }),
      })
        .then((res) => setStatus(res.ok ? "live" : "error"))
        .catch(() => setStatus("error"));
    };

    const onUpdate = () => {
      if (!canEdit) return;
      setStatus("saving");
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => save(true), 1200);
    };

    editor.on("update", onUpdate);
    return () => {
      editor.off("update", onUpdate);
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [editor, id, canEdit]);

  const skipFirstTitleSave = useRef(true);
  useEffect(() => {
    if (skipFirstTitleSave.current) {
      skipFirstTitleSave.current = false;
      return;
    }
    if (!canEdit) return;
    const timer = window.setTimeout(async () => {
      setStatus("saving");
      try {
        const res = await fetch(`/api/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim() || "Untitled notepad",
          }),
        });
        setStatus(res.ok ? "live" : "error");
      } catch {
        setStatus("error");
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [title, id, canEdit]);

  function followPeer(name: string) {
    const labels = document.querySelectorAll(".collaboration-carets__label");
    for (const label of labels) {
      if (label.textContent === name) {
        label.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
  }

  const presenceText =
    peers.length === 0
      ? "Only you"
      : peers.length === 1
        ? `${peers[0].name} is here`
        : `${peers.map((p) => p.name).join(", ")} are here`;

  return (
    <div className="flex gap-4">
      <div className="relative z-0 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 dark:border-slate-800">
          <input
            value={title}
            onChange={(e) => canEdit && setTitle(e.target.value)}
            readOnly={!canEdit}
            placeholder="Untitled notepad"
            className="min-w-0 flex-1 border-none bg-transparent text-lg font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-600"
          />
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              {peers.slice(0, 4).map((peer) => (
                <button
                  key={peer.clientId}
                  type="button"
                  title={`Follow ${peer.name}`}
                  onClick={() => followPeer(peer.name)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900"
                  style={{ backgroundColor: peer.color }}
                >
                  {peer.name.slice(0, 1).toUpperCase()}
                </button>
              ))}
              <span className="max-w-[10rem] truncate text-xs text-slate-500">
                {presenceText}
              </span>
            </div>
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
                  {!canEdit ? "Viewing" : connected ? "Live" : "Connecting…"}
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
                    if (!canEdit) return;
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
              trailing={
                <>
                  <span className="mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
                  <button
                    type="button"
                    onClick={() =>
                      setSide((s) => (s === "comments" ? "none" : "comments"))
                    }
                    className="inline-flex h-8 items-center rounded-md px-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Comments
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSide((s) => (s === "history" ? "none" : "history"))
                    }
                    className="inline-flex h-8 items-center rounded-md px-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    History
                  </button>
                </>
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

      {side !== "none" && (
        <aside className="w-full max-w-xs shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {side === "comments" && (
            <CommentsPanel
              documentId={id}
              editor={editor}
              canComment={canEdit}
            />
          )}
          {side === "history" && (
            <HistoryPanel
              documentId={id}
              canRestore={canEdit}
              onRestore={(content, nextTitle) => {
                setTitle(nextTitle);
                editor?.commands.setContent(content || "");
              }}
            />
          )}
        </aside>
      )}
    </div>
  );
}
