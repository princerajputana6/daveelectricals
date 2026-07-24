import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Dave Electrical Services collects, uses, stores and protects your personal data, in accordance with UK GDPR and the Data Protection Act 2018.",
};

const LAST_UPDATED = "24 July 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ash">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="Privacy Policy"
        intro="This policy explains how Dave Electrical Services collects, uses and protects your personal data in line with UK data protection law."
      />

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-xs uppercase tracking-widest text-bolt">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10">
          <Section title="1. Who we are">
            <p>
              {company.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
              &ldquo;our&rdquo;) is a UK electrical services business and the
              data controller responsible for your personal data. We are
              registered at {company.address}.
            </p>
            <p>
              For any privacy questions or to exercise your rights, contact us
              at{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-bolt hover:underline"
              >
                {company.email}
              </a>{" "}
              or {company.phonePrimary}.
            </p>
          </Section>

          <Section title="2. The law we follow">
            <p>
              We process personal data in accordance with the UK General Data
              Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              You have the right to lodge a complaint with the Information
              Commissioner&rsquo;s Office (ICO), the UK supervisory authority,
              at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bolt hover:underline"
              >
                ico.org.uk
              </a>
              .
            </p>
          </Section>

          <Section title="3. The information we collect">
            <p>Depending on how you interact with us, we may collect:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-zinc-200">Identity &amp; contact
                data</strong> — your name, email address, phone number and the
                property/service address relevant to your booking.
              </li>
              <li>
                <strong className="text-zinc-200">Booking &amp; service
                data</strong> — the services you request, appointment details,
                site notes, inspection findings and certificates we issue.
              </li>
              <li>
                <strong className="text-zinc-200">Transaction data</strong> —
                order totals, deposits, balances, invoice numbers and payment
                status. We do <em>not</em> store your card or bank details (see
                section 5).
              </li>
              <li>
                <strong className="text-zinc-200">Technical data</strong> —
                basic information your browser sends when you use our website,
                and any account login you create.
              </li>
            </ul>
          </Section>

          <Section title="4. How and why we use your data">
            <p>
              We only use your data where the law allows. Our lawful bases are:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-zinc-200">Contract</strong> — to provide
                quotes, carry out the electrical work you book, issue
                certificates and invoices, and process your payments.
              </li>
              <li>
                <strong className="text-zinc-200">Legal obligation</strong> — to
                keep accounting and tax records, and to retain electrical safety
                certification as required under UK regulations.
              </li>
              <li>
                <strong className="text-zinc-200">Legitimate interests</strong>{" "}
                — to respond to enquiries, manage our customer relationship,
                keep records of work carried out, and prevent fraud.
              </li>
              <li>
                <strong className="text-zinc-200">Consent</strong> — where you
                have opted in to any optional communications; you can withdraw
                consent at any time.
              </li>
            </ul>
          </Section>

          <Section title="5. Payments">
            <p>
              Card payments are processed securely by our payment provider,{" "}
              <strong className="text-zinc-200">Stripe</strong>. Your full card
              details are entered directly with Stripe and are never seen or
              stored on our servers. Stripe processes this data as an
              independent controller under its own privacy policy.
            </p>
          </Section>

          <Section title="6. Who we share your data with">
            <p>
              We do not sell your personal data. We share it only with trusted
              service providers who help us run our business, and only as
              necessary:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-zinc-200">Stripe</strong> — payment
                processing.
              </li>
              <li>
                <strong className="text-zinc-200">Intuit QuickBooks</strong> —
                accounting and invoicing. When you make a payment, we create an
                invoice and customer record in QuickBooks (your name, email and
                the invoice amount).
              </li>
              <li>
                <strong className="text-zinc-200">Our hosting, database and
                file-storage providers</strong> — to run the website and store
                invoices and certificates securely.
              </li>
              <li>
                <strong className="text-zinc-200">Our email provider</strong> —
                to send you booking confirmations, invoices and certificates.
              </li>
            </ul>
            <p>
              We may also disclose data where required by law, or to protect our
              legal rights.
            </p>
          </Section>

          <Section title="7. International transfers">
            <p>
              Some of our providers (such as Stripe and Intuit) may process data
              outside the UK. Where they do, appropriate safeguards — such as UK
              International Data Transfer Agreements or adequacy decisions — are
              in place to protect your data to UK standards.
            </p>
          </Section>

          <Section title="8. How long we keep your data">
            <p>
              We keep personal data only as long as necessary. Accounting and
              invoice records are retained for a minimum of six years to meet UK
              tax law. Electrical certificates and inspection reports are
              retained so they remain available to you, your tenants, insurers
              or solicitors. Enquiry data is kept for as long as needed to deal
              with your enquiry and a reasonable period afterwards.
            </p>
          </Section>

          <Section title="9. How we protect your data">
            <p>
              We use appropriate technical and organisational measures to keep
              your data secure, including encrypted connections (HTTPS),
              access-controlled admin systems, and reputable, security-vetted
              third-party providers. Access to your data is limited to those who
              need it to deliver our services.
            </p>
          </Section>

          <Section title="10. Your rights">
            <p>Under UK GDPR you have the right to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>access the personal data we hold about you;</li>
              <li>ask us to correct inaccurate or incomplete data;</li>
              <li>
                ask us to erase your data, where there is no overriding legal
                reason to keep it;
              </li>
              <li>restrict or object to certain processing;</li>
              <li>request a copy of your data in a portable format; and</li>
              <li>withdraw consent where processing is based on consent.</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-bolt hover:underline"
              >
                {company.email}
              </a>
              . We will respond within one month.
            </p>
          </Section>

          <Section title="11. Cookies">
            <p>
              Our website uses only essential cookies needed to keep you logged
              in and to keep your session secure. We do not use these for
              advertising. You can control cookies through your browser
              settings.
            </p>
          </Section>

          <Section title="12. Changes to this policy">
            <p>
              We may update this policy from time to time. The
              &ldquo;last updated&rdquo; date at the top shows when it was last
              revised. Please check back periodically.
            </p>
          </Section>

          <Section title="13. Contact us">
            <p>
              {company.legalName}
              <br />
              {company.address}
              <br />
              Email:{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-bolt hover:underline"
              >
                {company.email}
              </a>
              <br />
              Phone: {company.phonePrimary}
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}
