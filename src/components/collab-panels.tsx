"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { formatRelativeTime } from "@/lib/format";
import { Spinner } from "@/components/ui";

export type DocComment = {
  id: string;
  authorName: string;
  quote: string;
  body: string;
  resolved: boolean;
  createdAt: string;
  mine: boolean;
};

export type DocVersion = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
};

export function CommentsPanel({
  documentId,
  editor,
  canComment,
}: {
  documentId: string;
  editor: Editor | null;
  canComment: boolean;
}) {
  const [comments, setComments] = useState<DocComment[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  async function load() {
    const res = await fetch(`/api/documents/${documentId}/comments`);
    if (!res.ok) return;
    const data = (await res.json()) as { comments: DocComment[] };
    setComments(data.comments);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [documentId]);

  async function post() {
    const quote = editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );
    if (!draft.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft.trim(), quote: quote ?? "" }),
      });
      const data = (await res.json()) as { comment?: DocComment };
      if (res.ok && data.comment) {
        if (editor && !editor.state.selection.empty) {
          editor
            .chain()
            .focus()
            .setMark("comment", { commentId: data.comment.id })
            .run();
        }
        setDraft("");
        await load();
      }
    } finally {
      setPosting(false);
    }
  }

  async function toggleResolved(comment: DocComment) {
    await fetch(`/api/documents/${documentId}/comments/${comment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved: !comment.resolved }),
    });
    await load();
  }

  async function remove(comment: DocComment) {
    await fetch(`/api/documents/${documentId}/comments/${comment.id}`, {
      method: "DELETE",
    });
    await load();
  }

  const open = comments.filter((c) => !c.resolved);
  const done = comments.filter((c) => c.resolved);

  return (
    <div className="flex h-full flex-col">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        Comments
      </h3>
      {canComment && (
        <div className="mt-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Select text and comment…"
            className="min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="button"
            disabled={posting || !draft.trim()}
            onClick={() => void post()}
            className="mt-2 inline-flex h-8 items-center rounded-full bg-blue-600 px-3 text-xs font-semibold text-white disabled:opacity-50"
          >
            {posting ? "Posting…" : "Comment"}
          </button>
        </div>
      )}

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
        {loading && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Spinner className="h-3 w-3" /> Loading…
          </p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-xs text-slate-500">No comments yet.</p>
        )}
        {open.map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            onResolve={() => void toggleResolved(c)}
            onDelete={c.mine ? () => void remove(c) : undefined}
          />
        ))}
        {done.length > 0 && (
          <p className="pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Resolved
          </p>
        )}
        {done.map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            onResolve={() => void toggleResolved(c)}
            onDelete={c.mine ? () => void remove(c) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function CommentCard({
  comment,
  onResolve,
  onDelete,
}: {
  comment: DocComment;
  onResolve: () => void;
  onDelete?: () => void;
}) {
  return (
    <article
      className={`rounded-xl border p-3 text-sm dark:border-slate-800 ${
        comment.resolved
          ? "border-slate-100 bg-slate-50 dark:bg-slate-900/40"
          : "border-amber-100 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20"
      }`}
    >
      <p className="font-semibold text-slate-800 dark:text-slate-100">
        {comment.authorName}
      </p>
      {comment.quote && (
        <p className="mt-1 border-l-2 border-amber-400 pl-2 text-xs italic text-slate-500">
          “{comment.quote}”
        </p>
      )}
      <p className="mt-1 text-slate-700 dark:text-slate-200">{comment.body}</p>
      <p className="mt-1 text-[11px] text-slate-400">
        {formatRelativeTime(comment.createdAt)}
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onResolve}
          className="text-xs font-semibold text-blue-600"
        >
          {comment.resolved ? "Reopen" : "Resolve"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-xs font-semibold text-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

export function HistoryPanel({
  documentId,
  canRestore,
  onRestore,
}: {
  documentId: string;
  canRestore: boolean;
  onRestore: (content: string, title: string) => void;
}) {
  const [versions, setVersions] = useState<DocVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/documents/${documentId}/versions`);
      if (res.ok) {
        const data = (await res.json()) as { versions: DocVersion[] };
        setVersions(data.versions);
      }
      setLoading(false);
    })();
  }, [documentId]);

  async function restore(version: DocVersion) {
    setRestoring(version.id);
    try {
      const res = await fetch(`/api/documents/${documentId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId: version.id }),
      });
      if (res.ok) onRestore(version.content, version.title);
    } finally {
      setRestoring(null);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        Version history
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Snapshots are saved as people edit.
      </p>
      <div className="mt-4 space-y-2">
        {loading && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Spinner className="h-3 w-3" /> Loading…
          </p>
        )}
        {!loading && versions.length === 0 && (
          <p className="text-xs text-slate-500">No snapshots yet.</p>
        )}
        {versions.map((v) => (
          <div
            key={v.id}
            className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
          >
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {v.authorName}
            </p>
            <p className="text-xs text-slate-500">
              {formatRelativeTime(v.createdAt)}
            </p>
            {canRestore && (
              <button
                type="button"
                disabled={restoring === v.id}
                onClick={() => void restore(v)}
                className="mt-2 text-xs font-semibold text-blue-600 disabled:opacity-50"
              >
                {restoring === v.id ? "Restoring…" : "Restore"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
