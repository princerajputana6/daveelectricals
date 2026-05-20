import Link from "next/link";
import { ArrowIcon, BoltIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-ink px-5">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,212,0,0.12),transparent_60%)]" />
      <div className="relative text-center">
        <BoltIcon className="mx-auto h-14 w-14 text-bolt" />
        <p className="mt-6 font-display text-8xl font-bold text-gradient-bolt">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-ash">
          The page you are looking for has been moved or no longer exists.
        </p>
        <Link
          href="/"
          className="group mt-7 inline-flex items-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-ink transition-transform hover:scale-[1.04]"
        >
          Back to home
          <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
