import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
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
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <AppHeader
        user={user}
        wide={false}
        left={
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300"
          >
            ← All notepads
          </Link>
        }
      />

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
