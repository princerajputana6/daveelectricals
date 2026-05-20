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
    "Contact Dave Electrical Services — call 02035244041 or 07944437459, email info@daveelectrical.co.uk, or visit us at 7 Nursery Gardens, Hounslow, London TW4 5EY.",
};

const details = [
  {
    icon: PhoneIcon,
    label: "Call us on",
    lines: [company.phonePrimary, company.phoneMobile],
    href: `tel:${company.phoneMobile}`,
  },
  {
    icon: MailIcon,
    label: "Email us at",
    lines: [company.email],
    href: `mailto:${company.email}`,
  },
  {
    icon: PinIcon,
    label: "Visit us at",
    lines: [company.address],
  },
  {
    icon: ClockIcon,
    label: "Opening hours",
    lines: ["Mon–Sat: 8am – 6pm", "24/7 Emergency call-outs"],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        intro="Need a landlord certificate in a hurry, or want a free no-obligation quote? Call us, email us, or send a message — our 24 hour emergency line is always manned."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Details */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((d, i) => {
                const Icon = d.icon;
                const inner = (
                  <div className="group h-full rounded-2xl border border-white/10 bg-graphite p-6 transition-colors hover:border-bolt/40">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20 transition-colors group-hover:bg-bolt group-hover:text-ink">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ash">
                      {d.label}
                    </p>
                    {d.lines.map((line) => (
                      <p
                        key={line}
                        className="mt-1 text-sm font-semibold text-white"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                );
                return (
                  <Reveal key={d.label} delay={i * 0.08}>
                    {d.href ? (
                      <a href={d.href} className="block h-full">
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
                  <span className="block text-sm font-bold text-white">
                    Chat on WhatsApp
                  </span>
                  <span className="block text-xs text-ash">
                    Quick replies during working hours
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title="Dave Electrical Services location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.4015%2C51.4612%2C-0.3815%2C51.4712&layer=mapnik&marker=51.4662%2C-0.3915"
                  className="h-64 w-full grayscale"
                  loading="lazy"
                />
              </div>
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
