import type { DocumentDocument } from "@/models/Document";

export type AccessRole = "owner" | "editor" | "viewer";

export function getAccessRole(
  doc: Pick<DocumentDocument, "ownerId" | "collaborators">,
  userId: string
): AccessRole | null {
  if (doc.ownerId.toString() === userId) return "owner";
  const row = doc.collaborators.find((c) => c.userId.toString() === userId);
  if (!row) return null;
  return row.role === "viewer" ? "viewer" : "editor";
}

export function canEditRole(role: AccessRole | null): boolean {
  return role === "owner" || role === "editor";
}
