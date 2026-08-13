"use client";

import { useEffect, useState } from "react";

const LINES = [
  {
    label: "Ava",
    color: "violet" as const,
    text: "Ship a collaborative writing experience teams love.",
  },
  {
    label: "Jordan",
    color: "emerald" as const,
    text: "Presence, permissions, and a canvas that never fights you.",
  },
  {
    label: "You",
    color: "blue" as const,
    text: "This is what live collab looks like — type, and everyone sees it.",
  },
];

const TITLE = "Q3 Product Roadmap";

const colorMap = {
  violet: {
    caret: "bg-violet-500",
    tag: "bg-violet-500",
    underline: "bg-violet-400/70",
  },
  emerald: {
    caret: "bg-emerald-500",
    tag: "bg-emerald-500",
    underline: "bg-emerald-400/70",
  },
  blue: {
    caret: "bg-blue-500",
    tag: "bg-blue-500",
    underline: "bg-blue-400/70",
  },
};

/**
 * Types text line-by-line in the landing product mock — simulates live collab.
 */
export function LivePreviewTyping() {
  const [titleChars, setTitleChars] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"title" | "body" | "pause">("title");
  const [completed, setCompleted] = useState<string[]>([]);

  // Type title first
  useEffect(() => {
    if (phase !== "title") return;

    if (titleChars < TITLE.length) {
      const t = setTimeout(() => setTitleChars((c) => c + 1), 55);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setPhase("body"), 400);
    return () => clearTimeout(t);
  }, [phase, titleChars]);

  // Type body lines
  useEffect(() => {
    if (phase !== "body") return;

    const current = LINES[lineIndex];
    if (!current) return;

    if (charIndex < current.text.length) {
      const delay = current.text[charIndex] === " " ? 40 : 28 + Math.random() * 35;
      const t = setTimeout(() => setCharIndex((c) => c + 1), delay);
      return () => clearTimeout(t);
    }

    // Line finished — keep briefly, then next line or loop
    const t = setTimeout(() => {
      setCompleted((prev) => [...prev, current.text]);
      if (lineIndex < LINES.length - 1) {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      } else {
        setPhase("pause");
      }
    }, 900);
    return () => clearTimeout(t);
  }, [phase, lineIndex, charIndex]);

  // Pause then restart body typing (title stays)
  useEffect(() => {
    if (phase !== "pause") return;
    const t = setTimeout(() => {
      setCompleted([]);
      setLineIndex(0);
      setCharIndex(0);
      setPhase("body");
    }, 2200);
    return () => clearTimeout(t);
  }, [phase]);

  const active = phase === "body" ? LINES[lineIndex] : null;
  const activeColors = active ? colorMap[active.color] : colorMap.blue;
  const typedBody = active ? active.text.slice(0, charIndex) : "";

  return (
    <div className="mx-auto max-w-xl">
      {/* Title with typing */}
      <div className="flex min-h-[2.75rem] items-center gap-0.5">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {TITLE.slice(0, titleChars)}
          {phase === "title" && (
            <span className="animate-caret ml-0.5 inline-block h-8 w-0.5 align-middle bg-blue-500" />
          )}
        </h2>
      </div>

      {/* Completed paragraphs */}
      <div className="mt-5 min-h-[7.5rem] space-y-3">
        {completed.map((text, i) => {
          const who = LINES[i];
          const colors = colorMap[who.color];
          return (
            <p
              key={`${i}-${text.slice(0, 12)}`}
              className="relative text-[15px] leading-7 text-slate-600"
            >
              <span className="relative font-medium text-slate-800">
                {text}
                <span
                  className={`absolute -top-5 left-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${colors.tag}`}
                >
                  {who.label}
                </span>
              </span>
            </p>
          );
        })}

        {/* Active typing line */}
        {active && phase === "body" && (
          <p className="relative text-[15px] leading-7 text-slate-600">
            <span className="relative font-medium text-slate-800">
              {typedBody}
              <span
                className={`absolute -top-5 left-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${activeColors.tag}`}
              >
                {active.label}
              </span>
              <span
                className={`animate-caret ml-0.5 inline-block h-[1.1em] w-0.5 align-[-0.15em] ${activeColors.caret}`}
              />
            </span>
          </p>
        )}

        {phase === "pause" && (
          <p className="text-[13px] italic text-slate-400">
            Everyone is in sync…
          </p>
        )}
      </div>

      {/* Static sprint list stays as context below typing */}
      <div className="mt-8 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          This sprint
        </p>
        {[
          {
            done: true,
            text: "Realtime multiplayer with colored carets",
            who: "Ava",
            color: "violet",
          },
          {
            done: true,
            text: "Secure auth & document ownership",
            who: "Jordan",
            color: "emerald",
          },
          {
            done: false,
            text: "Invite links & role-based access",
            who: null,
            color: null,
          },
        ].map((row) => (
          <div
            key={row.text}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-3 shadow-sm"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${
                row.done ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              {row.done ? "✓" : ""}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-700">{row.text}</p>
              {row.who && (
                <span
                  className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    row.color === "violet"
                      ? "bg-violet-50 text-violet-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      row.color === "violet" ? "bg-violet-500" : "bg-emerald-500"
                    }`}
                  />
                  {row.who} is editing
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
