import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { getCurrentUser } from '@/actions/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-CLARIA-AI - AI-Powered Non-Profit Platform',
  description: 'Empowering non-profit organizations with AI-generated strategies, outreach content, and community support.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialUser = null;
  try {
    initialUser = await getCurrentUser();
  } catch (error) {
    // User is not authenticated, which is fine
    console.log('No authenticated user found');
  }

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider initialUser={initialUser}>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}