'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './report.module.css';

function ReportContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const dataString = searchParams.get('data');
    const [reportDate, setReportDate] = useState('');

    useEffect(() => {
        setReportDate(new Date().toLocaleDateString());
    }, []);

    let auditData = null;
    try {
        if (dataString) {
            auditData = JSON.parse(decodeURIComponent(dataString));
        }
    } catch (e) {
        console.error('Failed to parse audit data from URL');
    }

    const overallScore = auditData?.overallScore ?? 0;
    const metrics = auditData?.metrics ?? [];

    if (status !== 'success') {
        return (
            <div className={styles.container}>
                <h2>Audit Did Not Complete</h2>
                <p>There was an issue connecting to your HubSpot portal.</p>
                <Link href="/" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                    Try Again
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logoContainer}>
                    <Image src="/muloo-logo.png" alt="Muloo Logo" width={180} height={50} style={{ objectFit: 'contain' }} priority />
                </div>
                <h1>Your HubSpot Health Report</h1>
                <p>Analyzed on {reportDate}</p>
            </header>

            <section className={styles.scoreSection}>
                <div className={styles.scoreCircle}>
                    <span className={styles.scoreValue}>{overallScore}</span>
                    <span className={styles.scoreLabel}>/ 100</span>
                </div>
                <div className={styles.scoreText}>
                    <h2>Action Required</h2>
                    <p>Your portal is operational but leaking efficiency. Fixing these core issues could save your team 10+ hours a week and prevent lost deals.</p>
                </div>
            </section>

            <section className={styles.resultsGrid}>
                {metrics.map((metric: { title: string; status: 'success' | 'warning' | 'error'; description: string; recommendation?: string }, i: number) => (
                    <div key={i} className={`${styles.resultCard} ${styles[metric.status]}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.statusIcon}>
                                {metric.status === 'success' ? '✅' : metric.status === 'warning' ? '⚠️' : '🚨'}
                            </span>
                            <h3>{metric.title}</h3>
                        </div>
                        <p>{metric.description}</p>

                        {/* Render actionable advice if the test did not pass */}
                        {metric.status !== 'success' && metric.recommendation && (
                            <div className={styles.recommendationBox}>
                                <strong>💡 Instant Fix:</strong> {metric.recommendation}
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {/* Educational / Methodology Section */}
            <section className={styles.methodologySection}>
                <div className={styles.methodologyHeader}>
                    <h2>What exactly are we auditing?</h2>
                    <p>This automated check is just the surface. A true HubSpot transformation requires a deep understanding of your commercial goals. Here is our full 4-Step Blueprint methodology:</p>
                </div>

                <div className={styles.stepsGrid}>
                    <div className={styles.stepCard}>
                        <div className={styles.stepNumber}>01</div>
                        <h3>Commercial & Sales Alignment Workshop</h3>
                        <p>We collaborate with leadership to map your 2026 goals, regional sales structures, revenue streams, and handover points. The blueprint must be built around your real-world operations.</p>
                    </div>

                    <div className={styles.stepCard}>
                        <div className={styles.stepNumber}>02</div>
                        <h3>CRM Audit & Data Assessment</h3>
                        <p>A deep dive inside your portal (where automating tools can"t go) to evaluate user adoption, behavioural data, tracking, scoring layers, and the gaps between your current system and future needs.</p>
                    </div>

                    <div className={styles.stepCard}>
                        <div className={styles.stepNumber}>03</div>
                        <h3>System Design & Blueprinting</h3>
                        <p>We produce a structured playbook outlining optimised data architecture, standardised sales methodologies, automation opportunities, and reporting frameworks for leadership to scale across regions.</p>
                    </div>

                    <div className={styles.stepCard}>
                        <div className={styles.stepNumber}>04</div>
                        <h3>Review & Presentation</h3>
                        <p>A dedicated session with your leadership to walk through our findings, priority recommendations, resourcing options, and a clear timeline for optimizing your CRM.</p>
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaCard}>
                    <h2>Ready to unlock your portal's true potential?</h2>
                    <p>
                        This automated test identified immediate technical debt, but resolving your core efficiency issues requires a strategic plan.
                        Book a Discovery Call to discuss our comprehensive <strong>HubSpot Blueprint Audit</strong> and get a step-by-step remediation plan customized for your business.
                    </p>
                    <button className="btn-primary" onClick={() => window.location.href = 'https://www.wearemuloo.com/meetings/jarrud2/hubspot-audit-tool'}>
                        Book a Discovery Call
                    </button>
                </div>
            </section>
        </div>
    );
}

export default function ReportPage() {
    return (
        <main className={styles.pageWrapper}>
            <Suspense fallback={<div className={styles.loading}>Generating your audit...</div>}>
                <ReportContent />
            </Suspense>
        </main>
    );
}
