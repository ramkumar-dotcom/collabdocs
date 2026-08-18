"use client";

import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";

const FONTS = [
  { label: "Calibri", value: "Calibri, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Inter", value: "Inter, sans-serif" },
];

const SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px"];

const COLORS = [
  "#0f172a",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#db2777",
];

const HIGHLIGHTS = [
  "#fef08a",
  "#bbf7d0",
  "#bae6fd",
  "#ddd6fe",
  "#fecaca",
  "#e5e7eb",
];

function ToolButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200/80 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-700",
        active && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />;
}

function AlignIcon({
  align,
}: {
  align: "left" | "center" | "right" | "justify";
}) {
  const widths =
    align === "left"
      ? ["w-3.5", "w-2.5", "w-3", "w-2"]
      : align === "right"
        ? ["w-3.5 ml-auto", "w-2.5 ml-auto", "w-3 ml-auto", "w-2 ml-auto"]
        : align === "center"
          ? ["w-3.5 mx-auto", "w-2.5 mx-auto", "w-3 mx-auto", "w-2 mx-auto"]
          : ["w-3.5", "w-3.5", "w-3.5", "w-3.5"];

  return (
    <span className="flex w-3.5 flex-col gap-0.5">
      {widths.map((w, i) => (
        <span key={i} className={`block h-0.5 rounded-full bg-current ${w}`} />
      ))}
    </span>
  );
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  const fontFamily =
    (editor.getAttributes("textStyle").fontFamily as string | undefined) ?? "";
  const fontSize =
    (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "16px";

  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

  return (
    <div className="relative z-0 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-900">
      <ToolButton
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↶
      </ToolButton>
      <ToolButton
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↷
      </ToolButton>

      <Divider />

      <select
        aria-label="Paragraph style"
        className="h-8 max-w-[8.5rem] cursor-pointer rounded-md border border-slate-200 bg-white px-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
        }
        onChange={(e) => {
          const value = e.target.value;
          const chain = editor.chain().focus();
          if (value === "p") chain.setParagraph().run();
          if (value === "h1") chain.toggleHeading({ level: 1 }).run();
          if (value === "h2") chain.toggleHeading({ level: 2 }).run();
          if (value === "h3") chain.toggleHeading({ level: 3 }).run();
        }}
      >
        <option value="p">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <select
        aria-label="Font"
        className="h-8 max-w-[8.5rem] cursor-pointer rounded-md border border-slate-200 bg-white px-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        value={fontFamily}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) editor.chain().focus().unsetFontFamily().run();
          else editor.chain().focus().setFontFamily(value).run();
        }}
      >
        <option value="">Font</option>
        {FONTS.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Font size"
        className="h-8 w-[4.5rem] cursor-pointer rounded-md border border-slate-200 bg-white px-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        value={fontSize}
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
      >
        {SIZES.map((size) => (
          <option key={size} value={size}>
            {size.replace("px", "")}
          </option>
        ))}
      </select>

      <Divider />

      <ToolButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-bold">B</span>
      </ToolButton>
      <ToolButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolButton>
      <ToolButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolButton>
      <ToolButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolButton>

      <label
        title="Text color"
        className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-1.5 hover:bg-slate-200/80 dark:hover:bg-slate-700"
      >
        <span className="text-xs font-bold">A</span>
        <input
          type="color"
          className="h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
          value={editor.getAttributes("textStyle").color || "#0f172a"}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          list="text-colors"
        />
        <datalist id="text-colors">
          {COLORS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <label
        title="Highlight"
        className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-1.5 hover:bg-slate-200/80 dark:hover:bg-slate-700"
      >
        <span className="rounded-sm bg-yellow-200 px-0.5 text-[10px] font-bold text-slate-800">
          ab
        </span>
        <input
          type="color"
          className="h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
          value={editor.getAttributes("highlight").color || "#fef08a"}
          onChange={(e) =>
            editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
          }
          list="highlight-colors"
        />
        <datalist id="highlight-colors">
          {HIGHLIGHTS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <Divider />

      <ToolButton
        title="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignIcon align="left" />
      </ToolButton>
      <ToolButton
        title="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignIcon align="center" />
      </ToolButton>
      <ToolButton
        title="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignIcon align="right" />
      </ToolButton>
      <ToolButton
        title="Justify"
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignIcon align="justify" />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </ToolButton>
      <ToolButton
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolButton>
      <ToolButton
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        “ ”
      </ToolButton>
      <ToolButton title="Link" active={editor.isActive("link")} onClick={setLink}>
        🔗
      </ToolButton>
      <ToolButton
        title="Horizontal line"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        ―
      </ToolButton>
    </div>
  );
}
