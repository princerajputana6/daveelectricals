import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions (end-user agreement) governing your use of the Dave Electrical Services website and the electrical services we provide.",
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

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms of Service"
        title="Terms of Service"
        intro="These terms form the agreement between you and Dave Electrical Services when you use our website or book our electrical services."
      />

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-xs uppercase tracking-widest text-bolt">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="mt-10">
          <Section title="1. About these terms">
            <p>
              These terms and conditions (&ldquo;Terms&rdquo;) govern your use
              of the website operated by {company.legalName} (&ldquo;we&rdquo;,
              &ldquo;us&rdquo;, &ldquo;our&rdquo;) and the electrical services we
              supply. By using our website, requesting a quote, or booking a
              service, you agree to these Terms. If you do not agree, please do
              not use the website or our services.
            </p>
            <p>
              We are a business based in England. Our registered address is{" "}
              {company.address}.
            </p>
          </Section>

          <Section title="2. Our services">
            <p>
              We provide electrical installation, inspection, testing,
              maintenance and related services, including EICR and EIC
              certification, emergency lighting, fire alarm testing, PAT
              testing, EV charger and solar installations, and call-out work.
              All work is carried out by qualified, NAPIT-registered
              electricians to the applicable UK standards and Building
              Regulations.
            </p>
          </Section>

          <Section title="3. Quotes, bookings and prices">
            <p>
              Quotes are based on the information you provide and the scope of
              work agreed. If site conditions differ from what was described, or
              additional work is required, we will discuss and agree any change
              in price with you before proceeding where reasonably possible.
            </p>
            <p>
              Prices are shown in pounds sterling (£) and, where applicable,
              are inclusive of VAT at the prevailing rate. A booking is
              confirmed once you have completed the required payment (a deposit
              or the full amount, as indicated at checkout).
            </p>
          </Section>

          <Section title="4. Payment">
            <p>
              Payments are processed securely through our payment provider,
              Stripe. Depending on the service, we may require a deposit to
              secure your booking, with the balance due on or after completion.
              We do not store your card details. An invoice is issued and
              emailed to you for each payment.
            </p>
          </Section>

          <Section title="5. Your right to cancel (consumers)">
            <p>
              If you are a consumer and you booked away from our premises (for
              example online or by phone), you generally have the right to
              cancel within 14 days under the Consumer Contracts Regulations
              2013.
            </p>
            <p>
              If you ask us to start work during the 14-day cancellation period
              and then cancel, you must pay for the work carried out up to the
              point of cancellation. Where a service is fully performed within
              the 14-day period at your express request, the right to cancel is
              lost. To cancel, contact us at{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-bolt hover:underline"
              >
                {company.email}
              </a>
              .
            </p>
          </Section>

          <Section title="6. Your obligations">
            <p>
              To allow us to carry out the work safely and on time, you agree to
              provide safe and timely access to the property, accurate
              information about the site, and to inform us of any known hazards.
              You confirm that you are the owner of the property or otherwise
              authorised to instruct the work.
            </p>
          </Section>

          <Section title="7. Our guarantee and your statutory rights">
            <p>
              Our workmanship is covered by a 12-month guarantee from the date
              of completion. Materials we supply are covered by the relevant
              manufacturer&rsquo;s warranty. Nothing in these Terms affects your
              statutory rights under the Consumer Rights Act 2015, which require
              our services to be carried out with reasonable care and skill.
            </p>
          </Section>

          <Section title="8. Certificates and reports">
            <p>
              Where we issue certificates or reports (such as an EICR or EIC),
              these reflect the condition of the installation at the time of
              inspection. We retain copies so they remain available to you. You
              are responsible for acting on any remedial recommendations we
              identify.
            </p>
          </Section>

          <Section title="9. Website use">
            <p>
              You agree to use our website lawfully and not to misuse it, attempt
              to gain unauthorised access, or interfere with its operation. All
              content on the website (text, logos, images and design) belongs to
              us or our licensors and may not be copied without permission.
            </p>
            <p>
              If you create an account, you are responsible for keeping your
              login details confidential and for activity carried out under your
              account.
            </p>
          </Section>

          <Section title="10. Liability">
            <p>
              We carry appropriate insurance for the work we undertake. To the
              extent permitted by law, we are not liable for losses that are not
              reasonably foreseeable, or for pre-existing faults not covered by
              the scope of work agreed. Nothing in these Terms limits our
              liability for death or personal injury caused by our negligence,
              for fraud, or for any liability that cannot be excluded under UK
              law.
            </p>
          </Section>

          <Section title="11. Changes to these terms">
            <p>
              We may update these Terms from time to time. The version published
              on this page at the time you use our website or book a service is
              the one that applies. The &ldquo;last updated&rdquo; date above
              shows when they were last revised.
            </p>
          </Section>

          <Section title="12. Governing law">
            <p>
              These Terms are governed by the laws of England and Wales, and any
              disputes will be subject to the exclusive jurisdiction of the
              courts of England and Wales.
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
