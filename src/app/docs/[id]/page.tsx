import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/logout-button";
import { NotepadEditor } from "@/components/notepad-editor";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import { userDocFilter } from "@/lib/documents";
import { getSession } from "@/lib/session";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocPage({ params }: PageProps) {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  await connectDB();

  const doc = await DocumentModel.findOne({
    _id: id,
    ...userDocFilter(user.id),
  });

  if (!doc) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <header className="border-b border-blue-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Logo size="sm" />
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-500 hover:text-blue-700"
            >
              ← All notepads
            </Link>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-6">
        <NotepadEditor
          id={doc._id.toString()}
          initialTitle={doc.title}
          initialContent={doc.content ?? ""}
        />
      </main>
    </div>
  );
}
