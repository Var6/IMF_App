import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms &amp; Conditions" updated="15 July 2026">
      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your
        registration and use of the Citizen IMF Partner Portal (the
        &ldquo;Portal&rdquo;), operated by <strong>Citizen Savings &amp; Credit
        IMF Pvt. Ltd.</strong> By registering as a partner you agree to these
        Terms.
      </p>

      <LegalSection heading="1. Eligibility & registration">
        <p>
          You must provide accurate, complete and current information, including
          valid KYC and bank details. Your account remains inactive until it is
          verified and approved by an administrator. We may reject or suspend any
          registration at our discretion.
        </p>
      </LegalSection>

      <LegalSection heading="2. Partner responsibilities">
        <ul className="list-disc space-y-1 pl-6">
          <li>Submit policy information that is truthful and authorised by the customer.</li>
          <li>Obtain the customer&apos;s consent before submitting their details.</li>
          <li>Keep your login credentials confidential and not share your account.</li>
          <li>Comply with all applicable insurance laws and IRDAI regulations.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Reward coins">
        <p>
          Rewards on the Portal are issued as <strong>coins</strong>, which are
          non-monetary reward points and <strong>not</strong> currency, cash or
          a legal tender. Coins are credited at the sole discretion of Citizen
          IMF, typically when a submitted policy is created. We may add, adjust
          or deduct coins, and reserve the right to modify the reward structure
          at any time. Coins have no cash value and are non-transferable.
        </p>
      </LegalSection>

      <LegalSection heading="4. Policy processing">
        <p>
          Submitting a policy request does not guarantee it will be created.
          Each request is reviewed by an administrator and may be approved,
          returned for clarification, or rejected. Final issuance of any
          insurance policy is subject to the relevant insurer&apos;s underwriting
          and approval.
        </p>
      </LegalSection>

      <LegalSection heading="5. Prohibited conduct">
        <ul className="list-disc space-y-1 pl-6">
          <li>Submitting false, fraudulent or misleading information.</li>
          <li>Impersonating any person or misrepresenting your authority.</li>
          <li>Attempting to gain unauthorised access to the Portal or others&apos; data.</li>
          <li>Using the Portal for any unlawful purpose.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Suspension & termination">
        <p>
          We may suspend or terminate your account, and forfeit associated
          coins, if you breach these Terms or engage in fraudulent or unlawful
          activity.
        </p>
      </LegalSection>

      <LegalSection heading="7. Disclaimer & liability">
        <p>
          The Portal is provided on an &ldquo;as is&rdquo; basis. To the extent
          permitted by law, Citizen IMF is not liable for any indirect or
          consequential loss arising from your use of the Portal.
        </p>
      </LegalSection>

      <LegalSection heading="8. Governing law">
        <p>
          These Terms are governed by the laws of India. Any disputes are
          subject to the exclusive jurisdiction of the courts at Patna, Bihar.
        </p>
      </LegalSection>

      <LegalSection heading="9. Contact">
        <p>
          Questions about these Terms? Email{" "}
          <a href="mailto:Sales@citizenimf.com" className="text-brand-600 underline">
            Sales@citizenimf.com
          </a>{" "}
          or call +91 90310 07097.
        </p>
      </LegalSection>

      <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        This document is a general template and does not constitute legal
        advice. Please have it reviewed by qualified legal counsel before
        relying on it.
      </p>
    </LegalLayout>
  );
}
