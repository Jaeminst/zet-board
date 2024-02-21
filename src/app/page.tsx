'use client';
import { Suspense } from 'react';
import ProfileSearch from '@/components/profile/profile-search';
import ProfileTable from '@/components/profile/profile-table';
import { AddProfile } from '@/components/profile/add-profile';
import { ProfileCombo } from '@/components/profile/profile-combo';
import { useProfileSearch } from '@/contexts/ProfileSearchContext';

export default function IndexPage() {
  const [profileSearchList] = useProfileSearch();

  return (
    <Suspense>
      <div className="flex flex-col w-full">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <ProfileCombo />
          <ProfileSearch />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <ProfileTable profiles={profileSearchList} />
          <AddProfile />
        </main>
      </div>
    </Suspense>
  );
}
