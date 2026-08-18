"use client";

import {
  useLayoutEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  panelRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  className?: string;
  width?: number;
};

/** Renders a dropdown on document.body so the notepad/toolbar cannot cover it. */
export function AnchoredPopover({
  open,
  anchorRef,
  panelRef,
  children,
  className,
  width,
}: Props) {
  const [pos, setPos] = useState({ top: 0, right: 16 });
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;

    function place() {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({
        top: r.bottom + 8,
        right: Math.max(8, window.innerWidth - r.right),
      });
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={panelRef}
      className={className}
      style={{
        position: "fixed",
        top: pos.top,
        right: pos.right,
        zIndex: 200,
        width,
      }}
    >
      {children}
    </div>,
    document.body
  );
}
