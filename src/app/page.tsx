'use client';
import { Suspense, useEffect } from 'react';
import Search from '@/components/search';
import ProfileTable from '@/components/profile/profile-table';
import { AddProfile } from '@/components/profile/add-profile';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileCombo } from '@/components/profile/profile-combo';

export default function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const [profileList] = useProfile();

  const search = searchParams.q ?? '';
  const filteredResult = profileList.filter(item =>
    item.environment.includes(search) || item.accountId.includes(search) || item.selectRole.includes(search)
  );
  const searchProfiles = filteredResult as Profile[];

  return (
    <Suspense>
      <div className="flex flex-col w-full">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <ProfileCombo />
          <Search />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <ProfileTable profiles={searchProfiles} />
          <AddProfile />
        </main>
      </div>
    </Suspense>
  );
}
