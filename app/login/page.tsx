import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Dave Electrical Services account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Customer area"
      title="Welcome back"
      description="Sign in to track your enquiries, certificates and bookings."
      footer={
        <>
          Need an account?{" "}
          <Link href="/signup" className="font-semibold text-bolt hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
