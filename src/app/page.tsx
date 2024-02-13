'use client';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Search from './search';
import UsersTable from './table';
import { AddProfile } from './add-profile';

interface Profile {
  idx: number;
  environment: string;
  accountId: string;
  selectRole: string;
  roles: [string];
}

export default function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('Select Profile');
  const result = [{
    idx: 0,
    environment: 'dev',
    accountId: '123456789012',
    selectRole: 'Administrator',
    roles: ['Administrator','Developers'],
  }];
  const search = searchParams.q ?? '';
  const filteredResult = result.filter(item =>
    item.environment.includes(search) || item.accountId.includes(search) || item.selectRole.includes(search)
  );
  const profiles = filteredResult as Profile[];

  const handleSelectEnvironment = (environment: string): void => {
    setSelectedEnvironment(environment);
  };

  return (
    <Suspense>
      <div className="flex flex-col w-full">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-expanded="true" variant="ghost">
                  {selectedEnvironment}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {profiles.map((profile) => (
                  <DropdownMenuItem key={profile.idx} onClick={() => handleSelectEnvironment(profile.environment)}>
                    {profile.environment}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <form className="ml-auto flex-1 sm:flex-initial">
            <Search />
          </form>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="border shadow-sm rounded-lg p-2">
            <UsersTable profiles={profiles} />
          </div>
          <AddProfile />
        </main>
      </div>
    </Suspense>
  );
}
