import Link from "next/link";
import { company, nav, services, badges } from "@/lib/content";
import { MailIcon, PhoneIcon, PinIcon } from "./Icons";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-coal">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">
              NAPIT registered electricians delivering safe, compliant and
              high-quality workmanship across West London for over a decade.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {badges.slice(0, 2).map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-bolt/30 bg-bolt/5 px-3 py-1 text-[11px] font-semibold text-bolt"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Navigate
            </h4>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ash transition-colors hover:text-bolt"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Services
            </h4>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href="/services"
                    className="text-sm text-ash transition-colors hover:text-bolt"
                  >
                    {s.title.replace(" & Maintenance", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Get in touch
            </h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={`tel:${company.phonePrimary}`}
                  className="flex items-start gap-3 text-ash transition-colors hover:text-bolt"
                >
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
                  <span>
                    {company.phonePrimary}
                    <br />
                    {company.phoneMobile}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-start gap-3 text-ash transition-colors hover:text-bolt"
                >
                  <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-ash">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
                {company.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-xs text-ash">
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p className="text-xs text-ash">
            {company.napit} · Certificate {company.certificate}
          </p>
        </div>
      </div>
    </footer>
  );
}
