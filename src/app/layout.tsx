import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Muloo Hub | HubSpot Health Check',
  description: 'Get an instant 10-point technical audit of your HubSpot portal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <div className="blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        <div className="app-container">
          {children}
          <footer className="global-footer">
            <p>
              Built and powered by{' '}
              <a href="https://www.wearemuloo.com" target="_blank" rel="noopener noreferrer" className="brand-link">
                <strong>muloo</strong><span className="brand-dot">.</span>
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
