import type { ClientBrand } from "@/lib/content";

const fontClass: Record<NonNullable<ClientBrand["font"]>, string> = {
  serif: "font-serif",
  sans: "font-sans",
  display: "font-display",
  mono: "font-mono",
  italic: "font-serif italic",
};

const spacingClass: Record<NonNullable<ClientBrand["spacing"]>, string> = {
  tight: "tracking-tight",
  wide: "tracking-wide",
  ultra: "tracking-[0.28em]",
};

const caseClass: Record<NonNullable<ClientBrand["caseStyle"]>, string> = {
  upper: "uppercase",
  lower: "lowercase",
  normal: "normal-case",
};

export default function ClientTile({ brand }: { brand: ClientBrand }) {
  const isDarkBg = isDarkColor(brand.bg);
  return (
    <div
      className="group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl px-4 text-center shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: brand.bg, color: brand.fg }}
    >
      {brand.accent && (
        <span
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: brand.accent }}
        />
      )}

      {brand.monogram && (
        <span
          className="mb-3 grid h-12 w-12 place-items-center rounded-full text-sm font-bold shadow-sm sm:h-14 sm:w-14 sm:text-base"
          style={{
            background: brand.monoBg || "#ffffff",
            color: brand.monoFg || "#000000",
          }}
        >
          {brand.monogram}
        </span>
      )}

      <p
        className={`text-base font-bold leading-tight sm:text-lg ${
          fontClass[brand.font || "sans"]
        } ${caseClass[brand.caseStyle || "normal"]} ${
          spacingClass[brand.spacing || "tight"]
        }`}
      >
        {brand.name}
      </p>

      {brand.sub && (
        <p
          className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] sm:text-[11px]"
          style={{ opacity: isDarkBg ? 0.65 : 0.55 }}
        >
          {brand.sub}
        </p>
      )}

      <span
        className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: brand.accent || brand.fg }}
      />
    </div>
  );
}

function isDarkColor(hex: string): boolean {
  const v = hex.replace("#", "");
  if (v.length !== 6) return false;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  // perceived luminance
  const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return l < 0.55;
}
