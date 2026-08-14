import { ShimmerBlock } from "@/components/ui";

export default function SettingsLoading() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <header className="h-16 border-b border-blue-100/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950" />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-10 sm:px-6">
        <ShimmerBlock className="h-9 w-56" />
        <ShimmerBlock className="mt-3 h-4 w-72" />
        <div className="mt-8 space-y-6">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <ShimmerBlock className="h-6 w-24" />
            <ShimmerBlock className="h-11 w-full" />
            <ShimmerBlock className="h-11 w-full" />
            <ShimmerBlock className="h-10 w-28 rounded-full" />
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <ShimmerBlock className="h-6 w-28" />
            <ShimmerBlock className="h-11 w-full" />
            <ShimmerBlock className="h-11 w-full" />
            <ShimmerBlock className="h-11 w-full" />
            <ShimmerBlock className="h-10 w-36 rounded-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
