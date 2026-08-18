import mongoose from "mongoose";

export function isObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && id.length === 24;
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isEmptyHtml(html: string): boolean {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim() === "";
}
