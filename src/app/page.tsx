'use client';
import { AddProfile } from '@/components/profile/add-profile';
import { ProfileCombo } from '@/components/profile/profile-combo';
import { IsLoadingTable } from '@/components/status/isLoadingTable';
import { useProfileSearch } from '@/contexts/ProfileSearchContext';
import dynamic from 'next/dynamic'
const ProfileSearch = dynamic(() => import('@/components/profile/profile-search'), {
  ssr: false,
});
const ProfileTable = dynamic(() => import('@/components/profile/profile-table'), {
  loading: () => <IsLoadingTable />,
  ssr: false,
});

export default function IndexPage() {
  const [profileSearchList] = useProfileSearch();

  return (
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
  );
}
