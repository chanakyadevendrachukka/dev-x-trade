import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function Privacy() {
  return (
    <PageLayout title="Privacy Policy">
      <div className="max-w-4xl mx-auto prose prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
        </p>
        
        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
        </p>
        
        <h2>3. Information Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
        </p>
        
        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>
        
        <h2>5. Firebase Integration</h2>
        <p>
          We use Google Firebase for authentication and data storage. Your data is processed according to Google's Privacy Policy and our security standards.
        </p>
        
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@devxtrade.com.
        </p>
      </div>
    </PageLayout>
  );
}
