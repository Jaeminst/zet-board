'use client';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import { DatabaseSettingProvider } from '@/contexts/DatabaseSettingContext';
import { DatabaseSearchProvider } from '@/contexts/DatabaseSearchContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DatabaseProvider>
      <DatabaseSettingProvider>
        <DatabaseSearchProvider>{children}</DatabaseSearchProvider>
      </DatabaseSettingProvider>
    </DatabaseProvider>
  );
}
