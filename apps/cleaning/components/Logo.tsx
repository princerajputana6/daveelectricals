/* eslint-disable @next/next/no-img-element */
import { withBase } from "@/lib/basePath";

/**
 * Dave Cleaning Services logo.
 *
 * Uses /public/logo.svg (a blue & white recreation matching the brand mark).
 * To use the exact supplied artwork instead, drop it in /public as `logo.png`
 * and change the `src` below to "/logo.png".
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center ${className}`}>
      <img
        src={withBase("/logo.svg")}
        alt="Dave Cleaning Services"
        width={460}
        height={230}
        className="h-12 w-auto sm:h-14"
      />
    </span>
  );
}
