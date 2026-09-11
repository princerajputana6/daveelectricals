import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { company } from "@/lib/content";
import {
  MailIcon,
  PhoneIcon,
  PinIcon,
  ClockIcon,
  WhatsAppIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get a free, no-obligation cleaning quote from Dave Cleaning Services. Call 0203 524 4041 or send us your property details and requirements.",
};

const details = [
  {
    icon: PhoneIcon,
    label: "Call us on",
    lines: [company.phonePrimary],
    href: `tel:${company.phonePrimary}`,
  },
  {
    icon: MailIcon,
    label: "Email us at",
    lines: [company.email],
    href: `mailto:${company.email}`,
  },
  {
    icon: PinIcon,
    label: "Our office",
    lines: [company.address],
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      company.address,
    )}`,
    external: true,
  },
  {
    icon: ClockIcon,
    label: "Opening hours",
    lines: ["Mon–Sat: 8am – 6pm", "Sun: by arrangement"],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get a Free Quote"
        intro="Ready for a cleaner property? Tell us your property, postcode and what you need cleaned, and we'll send you a clear, no-obligation quote. Prefer to talk? Call or WhatsApp us."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Details */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((d, i) => {
                const Icon = d.icon;
                const inner = (
                  <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-bolt/40">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20 transition-colors group-hover:bg-bolt group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {d.label}
                    </p>
                    {d.lines.map((line) => (
                      <p
                        key={line}
                        className="mt-1 text-sm font-semibold text-slate-900"
                      >
                        {line}
                      </p>
                    ))}
                    {d.external && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-bolt">
                        View on Google Maps →
                      </p>
                    )}
                  </div>
                );
                return (
                  <Reveal key={d.label} delay={i * 0.08}>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="block h-full"
                        {...(d.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.3}>
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-5 transition-colors hover:bg-[#25D366]/15"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366] text-white">
                  <WhatsAppIcon className="h-7 w-7" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">
                    Chat on WhatsApp
                  </span>
                  <span className="block text-xs text-slate-500">
                    Quick replies during working hours
                  </span>
                </span>
              </a>
            </Reveal>

          </div>

          {/* Form */}
          <Reveal direction="left" delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
