'use client';
import { DatabaseProvider } from '@/contexts/DatabaseContext';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <DatabaseProvider>
      {children}
    </DatabaseProvider>
  );
}
