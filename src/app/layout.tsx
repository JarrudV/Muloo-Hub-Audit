import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import Logo from '../components/Logo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

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
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
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
                <Logo />
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
