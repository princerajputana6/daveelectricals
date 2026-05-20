import { clientSectors } from "@/lib/content";
import ClientLogo from "./ClientLogo";

export default function ClientsMarquee() {
  const rowA = clientSectors.slice(0, 12);
  const rowB = clientSectors.slice(12);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-4">
          {[...rowA, ...rowA].map((c, i) => (
            <div
              key={`a-${i}`}
              className="rounded-xl border border-white/10 bg-graphite px-5 py-3.5"
            >
              <ClientLogo name={c.name} sector={c.sector} />
            </div>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee-rev gap-4">
          {[...rowB, ...rowB].map((c, i) => (
            <div
              key={`b-${i}`}
              className="rounded-xl border border-white/10 bg-graphite px-5 py-3.5"
            >
              <ClientLogo name={c.name} sector={c.sector} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
