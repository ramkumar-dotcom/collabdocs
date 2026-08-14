import { ShimmerBlock } from "@/components/ui";

export function NotepadCardSkeleton() {
  return (
    <div className="flex min-h-[220px] flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <ShimmerBlock className="h-28 w-full rounded-xl" />
      <ShimmerBlock className="mt-4 h-5 w-3/5" />
      <ShimmerBlock className="mt-2 h-3 w-1/3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-6">
      <ShimmerBlock className="h-9 w-56" />
      <ShimmerBlock className="mt-3 h-4 w-80" />
      <ShimmerBlock className="mt-10 h-3 w-40" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-blue-100 bg-white p-6">
          <ShimmerBlock className="h-14 w-14 rounded-2xl" />
        </div>
      </div>
      <ShimmerBlock className="mt-12 h-3 w-20" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NotepadCardSkeleton />
        <NotepadCardSkeleton />
        <NotepadCardSkeleton />
      </div>
    </div>
  );
}
