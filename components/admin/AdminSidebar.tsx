"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowIcon,
  BagIcon,
  BoltIcon,
  ClockIcon,
  CloseIcon,
  DashboardIcon,
  MailIcon,
  MenuIcon,
} from "../Icons";
import LogoutButton from "../LogoutButton";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { label: "Orders", href: "/admin/orders", icon: BagIcon },
  { label: "Availability", href: "/admin/availability", icon: ClockIcon },
  { label: "Enquiries", href: "/admin/enquiries", icon: MailIcon },
];

export default function AdminSidebar({
  user,
}: {
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-display text-sm font-bold text-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-bolt text-ink">
            <BoltIcon className="h-4 w-4" />
          </span>
          Admin Console
        </Link>
        <button
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white ring-1 ring-white/10"
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-gradient-to-b from-coal to-ink lg:flex">
        <SidebarBody pathname={pathname} initials={initials} user={user} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-gradient-to-b from-coal to-ink lg:hidden"
            >
              <SidebarBody pathname={pathname} initials={initials} user={user} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarBody({
  pathname,
  initials,
  user,
}: {
  pathname: string;
  initials: string;
  user: { name: string; email: string };
}) {
  return (
    <div className="flex h-full flex-col p-5">
      <Link
        href="/admin"
        className="flex items-center gap-3 rounded-xl p-2"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-bolt text-ink shadow-lg shadow-bolt/20">
          <BoltIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-base font-bold text-white">
            Admin Console
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-bolt">
            Dave Electrical
          </p>
        </div>
      </Link>

      <nav className="mt-8 flex-1 space-y-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-bolt/15 text-bolt ring-1 ring-bolt/30"
                  : "text-ash hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-bolt" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-5">
        <Link
          href="/"
          className="group mb-3 flex items-center gap-2 text-xs font-semibold text-ash hover:text-bolt"
        >
          <ArrowIcon className="h-4 w-4 rotate-180" />
          Back to public site
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-bolt font-display text-sm font-bold text-ink">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-bolt">{user.email}</p>
            </div>
          </div>
          <LogoutButton className="mt-3 block w-full rounded-lg bg-white/5 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-bolt/15 hover:text-bolt" />
        </div>
      </div>
    </div>
  );
}
