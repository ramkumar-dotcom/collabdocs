import { ShimmerBlock } from "@/components/ui";

export default function DocLoading() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <header className="h-16 border-b border-blue-100/80 bg-white/90" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-12 sm:py-10">
          <ShimmerBlock className="h-3 w-16" />
          <ShimmerBlock className="mt-6 h-10 w-2/3" />
          <ShimmerBlock className="mt-8 h-4 w-full" />
          <ShimmerBlock className="mt-3 h-4 w-11/12" />
          <ShimmerBlock className="mt-3 h-4 w-10/12" />
          <ShimmerBlock className="mt-3 h-4 w-8/12" />
        </div>
      </main>
    </div>
  );
}
