"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, company } from "@/lib/content";
import { CloseIcon, MenuIcon, PhoneIcon } from "./Icons";
import Logo from "./Logo";
import CartBadge from "./CartBadge";

type User = { name: string; email: string; isAdmin?: boolean } | null;

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const initials = user
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <>
      <motion.header
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Dave Electrical Services home">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "text-bolt" : "text-ash hover:text-white"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/5 ring-1 ring-bolt/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link
                href={user?.isAdmin ? "/admin" : "/account"}
                className="hidden items-center gap-2 rounded-full border border-bolt/30 bg-bolt/5 px-3 py-1.5 text-sm font-semibold text-bolt transition-colors hover:bg-bolt/10 sm:flex"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-bolt font-display text-xs font-bold text-ink">
                  {initials}
                </span>
                <span className="max-w-[110px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <div className="hidden items-center gap-1 sm:flex">
                <Link
                  href="/login"
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-ash transition-colors hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:border-bolt/40 hover:text-bolt"
                >
                  Sign up
                </Link>
              </div>
            )}

            <a
              href={`tel:${company.phoneMobile}`}
              className="group hidden items-center gap-2 rounded-full bg-bolt px-4 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-[1.04] md:flex"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>{company.phoneMobile}</span>
            </a>
            <CartBadge />
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-white ring-1 ring-white/10 lg:hidden"
            >
              {open ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-center gap-1 px-8">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.07 }}
                >
                  <Link
                    href={item.href}
                    className={`block py-2.5 font-display text-3xl font-bold sm:text-4xl ${
                      pathname === item.href ? "text-bolt" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 border-t border-white/10 pt-4"
              >
                {user ? (
                  <Link
                    href={user?.isAdmin ? "/admin" : "/account"}
                    className="flex items-center gap-3 py-2"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-bolt font-display text-sm font-bold text-ink">
                      {initials}
                    </span>
                    <span>
                      <span className="block font-display text-lg font-bold text-bolt">
                        My account
                      </span>
                      <span className="block text-xs text-ash">{user.email}</span>
                    </span>
                  </Link>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/login"
                      className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-full bg-bolt px-5 py-2.5 text-sm font-bold text-ink"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </motion.div>

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                href={`tel:${company.phoneMobile}`}
                className="mt-5 flex w-fit items-center gap-2 rounded-full bg-bolt px-6 py-3.5 font-bold text-ink"
              >
                <PhoneIcon className="h-5 w-5" />
                Call {company.phoneMobile}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
