export default function TermsPage() {
  return (
    <main className="flex-1">
      <section className="relative py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Last updated: January 1, 2024
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl prose prose-gray dark:prose-invert">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using our platform, you agree to be bound by these
            Terms of Service and our Privacy Policy.
          </p>

          <h2>2. Platform Usage</h2>
          <h3>2.1 Account Creation</h3>
          <ul>
            <li>You must provide accurate information</li>
            <li>Maintain account security</li>
            <li>Not share accounts</li>
          </ul>

          <h3>2.2 Expert Verification</h3>
          <ul>
            <li>Experts must verify their identity and credentials</li>
            <li>Maintain accurate profile information</li>
            <li>Adhere to platform guidelines</li>
          </ul>

          <h2>3. Booking and Sessions</h2>
          <h3>3.1 Session Rules</h3>
          <ul>
            <li>Show up on time</li>
            <li>Maintain professional conduct</li>
            <li>Follow cancellation policies</li>
          </ul>

          <h3>3.2 Payment Terms</h3>
          <ul>
            <li>All fees are in USD unless specified</li>
            <li>Platform fees are non-refundable</li>
            <li>Refund policy for cancelled sessions</li>
          </ul>

          <h2>4. Content and Intellectual Property</h2>
          <ul>
            <li>Respect intellectual property rights</li>
            <li>Grant limited license to share content</li>
            <li>No unauthorized use of platform content</li>
          </ul>

          <h2>5. Prohibited Activities</h2>
          <ul>
            <li>No harassment or abuse</li>
            <li>No fraudulent activity</li>
            <li>No circumvention of platform fees</li>
            <li>No unauthorized commercial use</li>
          </ul>

          <h2>6. Liability and Disclaimers</h2>
          <ul>
            <li>Platform provided "as is"</li>
            <li>No guarantee of expert results</li>
            <li>Limitation of liability</li>
          </ul>

          <h2>7. Dispute Resolution</h2>
          <p>
            Any disputes will be resolved through arbitration according to our
            dispute resolution policy.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use
            of the platform constitutes acceptance of updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact us at legal@example.com
          </p>
        </div>
      </section>
    </main>
  )
}