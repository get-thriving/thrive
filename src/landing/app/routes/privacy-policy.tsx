import { LegalPage } from "~/components/legal-page";

export function meta() {
  return [{ title: "Privacy Policy | Thrive" }];
}

// The text of the policy, as published before this site replaced the old one.
export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="At Thrive, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information."
      sections={[
        {
          heading: "1. Information We Collect",
          blocks: [
            "We collect the following information from you when you use our app:",
            [
              "Name: Required to personalize your experience.",
              "Email Address: Used for account creation, communication, and recovery.",
              "Password: Stored securely to allow account access.",
            ],
            "We also use cookies to enable essential functionality of the app. These cookies do not collect additional personal information.",
          ],
        },
        {
          heading: "2. How We Use Your Information",
          blocks: [
            "We use your information solely for the following purposes:",
            [
              "To provide and improve the app’s functionality.",
              "To personalize your user experience.",
              "To communicate important updates or respond to your inquiries.",
            ],
          ],
        },
        {
          heading: "3. Information Sharing",
          blocks: [
            "We do not share your personal information with third parties unless required by law or to protect the integrity of the app.",
          ],
        },
        {
          heading: "4. Security",
          blocks: [
            "We use industry-standard measures to protect your personal information, including encryption for passwords and secure storage.",
          ],
        },
        {
          heading: "5. Cookies",
          blocks: [
            "Our app uses cookies for essential functions, such as maintaining your session. You can disable cookies through your browser settings; however, doing so may affect app functionality.",
          ],
        },
        {
          heading: "6. Your Rights",
          blocks: [
            "You have the right to:",
            [
              "Access and update your personal information.",
              "Request the deletion of your account.",
            ],
            "To exercise these rights, please contact us at the email below.",
          ],
        },
        {
          heading: "7. Contact Us",
          blocks: [
            "If you have any questions or concerns about this Privacy Policy, please contact us at: horia@get-thriving.com",
          ],
        },
        {
          heading: "Changes to This Privacy Policy",
          blocks: [
            "We may update this Privacy Policy from time to time. Any changes will be posted here with an updated effective date. We encourage you to review this policy periodically.",
          ],
        },
      ]}
    />
  );
}
