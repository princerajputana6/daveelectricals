"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Hides children whenever the route is part of the admin console.
 * Use this to wrap the public site's Navbar / Footer / floating widgets so
 * they don't bleed into the admin layout.
 */
export default function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
