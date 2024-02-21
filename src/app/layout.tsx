'use client';
import { Navbar } from '@/components/Navbar';
import './globals.css';
import { Toaster } from "@/components/ui/sonner"
import { ProfileProvider } from '@/contexts/ProfileContext';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';
import { ProfileSearchProvider } from '@/contexts/ProfileSearchContext';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="flex min-h-screen w-full">
        <Navbar />
        <ProfileProvider>
          <ProfileSearchProvider>
            <EnvironmentProvider>
              {children}
            </EnvironmentProvider>
          </ProfileSearchProvider>
        </ProfileProvider>
        <Toaster />
      </body>
    </html>
  );
}
