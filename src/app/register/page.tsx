import Link from "next/link";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-16">
      <Link href="/" className="mb-8 transition hover:opacity-90">
        <Logo size="md" />
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Registration is coming next. This page will collect your name, email,
          and password.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
