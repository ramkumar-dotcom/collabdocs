import { ShimmerBlock } from "@/components/ui";

export default function LoginLoading() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-[420px] space-y-4">
        <ShimmerBlock className="h-8 w-48" />
        <ShimmerBlock className="h-4 w-72" />
        <ShimmerBlock className="mt-6 h-11 w-full rounded-xl" />
        <ShimmerBlock className="h-11 w-full rounded-xl" />
        <ShimmerBlock className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
