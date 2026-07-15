import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="15 July 2026">
      <p>
        This Privacy Policy explains how <strong>Citizen Savings &amp; Credit
        IMF Pvt. Ltd.</strong> (&ldquo;Citizen IMF&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collects, uses, stores and protects the personal
        information you provide when you register and operate as a partner on the
        Citizen IMF Partner Portal (the &ldquo;Portal&rdquo;). By using the
        Portal you agree to the practices described here.
      </p>

      <LegalSection heading="1. Information we collect">
        <p>To register and verify partners, we collect:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Identity details — full name, date of birth, gender, mobile number and email address.</li>
          <li>KYC information — Aadhaar number, PAN number, and a selfie photograph.</li>
          <li>Optional identity/education documents — Aadhaar card, PAN card, and 10th/12th marksheets.</li>
          <li>Bank account details — account holder name, account number, IFSC and bank name — used for reward settlement records.</li>
          <li>Policy submission data — proposer, nominee and plan details you enter on behalf of customers.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. How we use your information">
        <ul className="list-disc space-y-1 pl-6">
          <li>To verify your identity and approve your partner account.</li>
          <li>To process the insurance policy requests you submit.</li>
          <li>To calculate and record reward coins (non-monetary reward points).</li>
          <li>To communicate with you about your account and submissions.</li>
          <li>To comply with applicable legal and regulatory obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Where your data is stored">
        <p>
          Account and policy data is stored in a managed MongoDB database.
          Uploaded images and documents are stored in Cloudflare R2 object
          storage. Access is restricted to authorised administrators and,
          where required, the relevant insurer partners.
        </p>
      </LegalSection>

      <LegalSection heading="4. Sharing of information">
        <p>
          We do not sell your personal data. We may share information with
          insurer partners to process a policy, with service providers who help
          us operate the Portal, and with authorities where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data security">
        <p>
          Passwords are stored using industry-standard hashing. Access to the
          Portal is protected by authenticated sessions. While we take
          reasonable measures to protect your data, no method of transmission or
          storage is completely secure.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal
          data, subject to legal and regulatory retention requirements, by
          contacting us at the details below.
        </p>
      </LegalSection>

      <LegalSection heading="7. Contact">
        <p>
          For any privacy questions, email{" "}
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
