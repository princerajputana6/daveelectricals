import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const titleColor = tone === "light" ? "text-ink" : "text-white";
  const descColor = tone === "light" ? "text-zinc-600" : "text-ash";
  const eyebrowColor =
    tone === "light" ? "text-bolt-deep" : "text-bolt";
  const eyebrowBar =
    tone === "light" ? "bg-bolt-deep" : "bg-bolt";

  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <div
          className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] ${eyebrowColor} ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className={`h-px w-8 ${eyebrowBar}`} />
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          className={`mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl ${titleColor}`}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.2}>
          <p className={`mt-4 text-base leading-relaxed ${descColor}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
