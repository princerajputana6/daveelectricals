import Link from "next/link";
import { company, nav, services } from "@/lib/content";
import {
  MailIcon,
  PhoneIcon,
  PinIcon,
  LinkedInIcon,
  InstagramIcon,
} from "./Icons";
import Logo from "./Logo";
import HazardStripe from "./HazardStripe";

export default function Footer() {
  return (
    <footer className="relative bg-coal">
      <HazardStripe height={10} />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">
              NAPIT registered electricians delivering safe, compliant and
              high-quality workmanship within &amp; surrounding the M25 for over
              15 years.
            </p>
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
                  <span>{company.phonePrimary}</span>
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

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={company.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dave Electrical Services on LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:border-bolt/50 hover:bg-bolt/10 hover:text-bolt"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dave Electrical Services on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ash transition-colors hover:border-bolt/50 hover:bg-bolt/10 hover:text-bolt"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-xs text-ash">
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-ash">
            <Link href="/privacy" className="transition-colors hover:text-bolt">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-bolt">
              Terms of Service
            </Link>
            <span>
              {company.napit} · {company.certificate}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
