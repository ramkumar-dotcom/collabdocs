import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Sign in — CollabDocs",
  description: "Sign in to your CollabDocs workspace.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to open your documents and keep writing with your team."
    >
      <SignInForm />
    </AuthShell>
  );
}
