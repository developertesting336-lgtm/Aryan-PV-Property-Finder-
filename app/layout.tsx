import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastContainer from '../components/Toast';
import NavigationProgress from '../components/NavigationProgress';
import PageTransition from '../components/PageTransition';
import { ThemeProvider } from '../components/ThemeProvider';
import AuthProvider from '../components/AuthProvider';
import { getSession } from '@/lib/session';

const display = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600', '700'] });
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'PV Property Finder | Puerto Vallarta Real Estate & 3D Showcase',
  description:
    'Discover condos, luxury villas, and oceanfront penthouses in Puerto Vallarta. Interactive 3D models, budget matching quiz, and bilingual MLS broker assistance.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf7f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e17' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the real session on the SERVER so the client gets the right initial state
  // with zero flicker. This runs on every page navigation server-side.
  const session = await getSession();
  const initialUser = session
    ? { id: session.id, name: session.name, email: session.email, role: session.role }
    : null;

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} scroll-smooth overflow-x-hidden`} suppressHydrationWarning>
      <body className="min-h-screen bg-canvas text-ink antialiased overflow-x-hidden transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* AuthProvider seeds the client store with the server session immediately */}
          <AuthProvider initialUser={initialUser} />
          <NavigationProgress />
          <Navbar />
          <main className="transition-opacity duration-300">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
