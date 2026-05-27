import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Dave Electrical Services customer account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Customer area"
      title="Create your account"
      description="Get faster quotes, track certificates and manage your enquiries in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-bolt hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
