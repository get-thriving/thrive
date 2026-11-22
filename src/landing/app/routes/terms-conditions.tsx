import { LegalPage } from "~/components/legal-page";

export function meta() {
  return [{ title: "Terms & Conditions | Thrive" }];
}

// The text of the terms, as published before this site replaced the old one.
export default function TermsConditions() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="Welcome to Thrive. By using our app, you agree to these Terms of Service (“Terms”). Please read them carefully."
      sections={[
        {
          heading: "1. Acceptance of Terms",
          blocks: [
            "By accessing or using our app, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use our app.",
          ],
        },
        {
          heading: "2. Use of the App",
          blocks: [
            "You agree to:",
            [
              "Use the app only for lawful purposes.",
              "Not engage in activities that disrupt or harm the app’s functionality or other users’ experiences.",
              "Provide accurate and complete information when creating an account.",
            ],
          ],
        },
        {
          heading: "3. Account Responsibilities",
          blocks: [
            "You are responsible for:",
            [
              "Maintaining the confidentiality of your account credentials.",
              "All activities conducted under your account.",
            ],
            "Please notify us immediately if you suspect unauthorized use of your account.",
          ],
        },
        {
          heading: "4. Intellectual Property",
          blocks: [
            "All content within the app, including text, graphics, and software, is the property of Thrive or its licensors and is protected by intellectual property laws. You may not reproduce, modify, or distribute any part of the app without our prior written consent.",
          ],
        },
        {
          heading: "5. Limitation of Liability",
          blocks: [
            "To the extent permitted by law, Thrive is not liable for any indirect, incidental, or consequential damages arising from your use of the app.",
          ],
        },
        {
          heading: "6. Termination",
          blocks: [
            "We reserve the right to suspend or terminate your access to the app if you violate these Terms or engage in unlawful activities. Termination may occur without prior notice.",
          ],
        },
        {
          heading: "7. Changes to Terms",
          blocks: [
            "We may update these Terms from time to time. Any changes will be posted here with an updated effective date. Continued use of the app after changes constitutes acceptance of the new Terms.",
          ],
        },
        {
          heading: "8. Governing Law",
          blocks: [
            "These Terms are governed by and construed in accordance with the laws of the European Union.",
          ],
        },
        {
          heading: "9. Contact Us",
          blocks: [
            "If you have any questions or concerns about these Terms, please contact us at: horia@get-thriving.com",
          ],
        },
      ]}
    />
  );
}
