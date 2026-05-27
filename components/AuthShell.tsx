import Link from "next/link";
import type { ReactNode } from "react";
import { BoltIcon } from "./Icons";

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink px-5 py-32">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,212,0,0.18),transparent_60%)]" />
      <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-bolt/15 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-bolt/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-bolt"
        >
          <BoltIcon className="h-4 w-4" />
          {eyebrow}
        </Link>
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-ash">{description}</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-graphite p-7 sm:p-9">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-ash">{footer}</p>
      </div>
    </section>
  );
}
