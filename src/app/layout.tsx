import { Navbar } from '@/components/Navbar';
import './globals.css';
import Toast from './toast';
import { Suspense } from 'react';
import { ProfileProvider } from '@/components/ProfileContext';

export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="flex min-h-screen w-full">
        <Suspense>
          <Navbar />
        </Suspense>
        <ProfileProvider>
          {children}
        </ProfileProvider>
        <Toast />
      </body>
    </html>
  );
}
