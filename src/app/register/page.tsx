import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Create account — CollabDocs",
  description: "Create a CollabDocs account and start writing together.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to start. Your first document is one minute away."
    >
      <RegisterForm />
    </AuthShell>
  );
}
