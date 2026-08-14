import Link from "next/link";
import { Logo } from "@/components/logo";
import { AvatarMenu } from "@/components/avatar-menu";
import type { SessionUser } from "@/types";

type AppHeaderProps = {
  user: SessionUser;
  wide?: boolean;
  left?: React.ReactNode;
};

export function AppHeader({ user, wide = true, left }: AppHeaderProps) {
  return (
    <header className="border-b border-blue-100/80 bg-white/90 backdrop-blur">
      <div
        className={`mx-auto flex h-16 items-center justify-between px-5 sm:px-6 ${
          wide ? "max-w-6xl" : "max-w-5xl"
        }`}
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Logo size={wide ? "md" : "sm"} />
          </Link>
          {left}
        </div>
        <AvatarMenu name={user.name} email={user.email} />
      </div>
    </header>
  );
}
