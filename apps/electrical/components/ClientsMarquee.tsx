import { realClients } from "@/lib/content";
import ClientTile from "./ClientTile";

export default function ClientsMarquee() {
  const rowA = realClients.slice(0, 12);
  const rowB = realClients.slice(12);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-5">
          {[...rowA, ...rowA].map((c, i) => (
            <div key={`a-${i}`} className="w-40 sm:w-44">
              <ClientTile brand={c} />
            </div>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee-rev gap-5">
          {[...rowB, ...rowB].map((c, i) => (
            <div key={`b-${i}`} className="w-40 sm:w-44">
              <ClientTile brand={c} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
