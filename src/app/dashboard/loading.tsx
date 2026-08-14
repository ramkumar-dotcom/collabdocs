import { AppHeader } from "@/components/app-header";
import { DashboardSkeleton } from "@/components/notepad-skeletons";
import { getSession } from "@/lib/session";

export default async function DashboardLoading() {
  const user = await getSession();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      {user ? (
        <AppHeader user={user} />
      ) : (
        <header className="h-16 border-b border-blue-100/80 bg-white/90" />
      )}
      <DashboardSkeleton />
    </div>
  );
}
