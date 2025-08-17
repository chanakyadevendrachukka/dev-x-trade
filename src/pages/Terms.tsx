import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function Terms() {
  return (
    <PageLayout title="Terms of Service">
      <div className="max-w-4xl mx-auto prose prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing and using DevXTrade, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
        
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use DevXTrade for personal, non-commercial transitory viewing only.
        </p>
        
        <h2>3. Disclaimer</h2>
        <p>
          The materials on DevXTrade are provided on an 'as is' basis. DevXTrade makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
        
        <h2>4. Trading Risks</h2>
        <p>
          Trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results. AI predictions and analysis are for informational purposes only and should not be considered financial advice.
        </p>
        
        <h2>5. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at support@devxtrade.com.
        </p>
      </div>
    </PageLayout>
  );
}
