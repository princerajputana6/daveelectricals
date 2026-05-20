import { BoltIcon } from "./Icons";

function initials(name: string) {
  return name
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ClientLogo({
  name,
  sector,
}: {
  name: string;
  sector?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-white/10 bg-ink font-display text-sm font-bold text-bolt">
        {initials(name)}
      </span>
      <span className="flex flex-col">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
          <BoltIcon className="h-3 w-3 text-bolt" />
          {name}
        </span>
        {sector && (
          <span className="text-[11px] uppercase tracking-wider text-ash">
            {sector}
          </span>
        )}
      </span>
    </div>
  );
}
