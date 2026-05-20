import { BoltIcon } from "./Icons";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-bolt text-ink">
        <BoltIcon className="h-5 w-5" />
        <span className="absolute inset-0 rounded-lg bg-bolt blur-md opacity-40" />
      </span>
      {!compact && (
        <span className="font-display text-[15px] font-bold uppercase leading-none tracking-tight">
          <span className="block text-white">Dave Electrical</span>
          <span className="block text-[10px] font-medium tracking-[0.32em] text-bolt">
            SERVICES LTD
          </span>
        </span>
      )}
    </span>
  );
}
