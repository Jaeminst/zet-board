'use client';
import { Suspense, useEffect } from 'react';
import Search from '@/components/search';
import ProfileTable from './table';
import { AddProfile } from './add-profile';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileMenu } from '@/components/profileMenu';

interface ProfileList {
  idx: number;
  environment: string;
  accessKey: string;
  secretKey: string;
  accountId: string;
  selectRole: string;
  roles: string[];
}

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
  const searchProfiles = filteredResult as ProfileList[];

  return (
    <Suspense>
      <div className="flex flex-col w-full">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <ProfileMenu />
          <form className="ml-auto flex-1 sm:flex-initial">
            <Search />
          </form>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="border shadow-sm rounded-lg p-2">
            <ProfileTable profiles={searchProfiles} />
          </div>
          <AddProfile />
        </main>
      </div>
    </Suspense>
  );
}
