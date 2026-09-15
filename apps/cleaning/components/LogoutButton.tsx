"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { withBase } from "@/lib/basePath";

export default function LogoutButton({
  className = "rounded-full border border-slate-200 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-bolt/40 hover:text-bolt",
}: {
  className?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      onClick={async () => {
        setPending(true);
        await fetch(withBase("/api/auth/logout"), { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      disabled={pending}
      className={className}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
