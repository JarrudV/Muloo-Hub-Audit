'use client';

import { useState } from 'react';
import Logo from '../components/Logo';
import styles from './page.module.css';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const handleInstantAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && email) {
      console.log('Initiating Instant Audit for:', { firstName, email });
      // Redirect to kickoff the HubSpot OAuth Flow
      window.location.href = '/api/auth/hubspot';
    }
  };

  const handleManualAudit = () => {
    // Later: redirect to manual audit questionnaire
    console.log('Navigating to Manual Audit');
    alert('Manual Audit placeholder');
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.logoContainer}>
            <Logo serviceName="Hub" />
          </div>
          <h1>
            Is your HubSpot Portal <span className="text-gradient">truly healthy?</span>
          </h1>
          <p>
            Uncover duplicate records, unused seats, and broken automations in seconds.
            Get an instant 10-point technical audit and reclaim your CRM efficiency.
          </p>
        </section>

        {/* Gated Form Card */}
        <section className={styles.formCard}>
          <h2>Start Your Free Audit</h2>
          <p>Enter your details to get your personalized WebGrader score.</p>

          <form onSubmit={handleInstantAudit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className="btn-primary">
                Instant Automated Audit ✨
              </button>
              <button type="button" className={styles.manualAuditBtn} onClick={handleManualAudit}>
                Or take the 10-Minute Manual Audit &rarr;
              </button>
            </div>
          </form>

          {/* Trust Elements */}
          <div className={styles.trustBadges}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Read-only access. Zero data stored.</span>
          </div>

        </section>

      </div>
    </main>
  );
}
