import Search from './search';
import UsersTable from './table';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Profile {
  idx: number;
  environment: string;
  accountId: string;
  role: string;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  const result = [{
    idx: 0,
    environment: 'dev',
    accountId: '123456789012',
    role: 'Administrator',
  }];
  const filteredResult = result.filter(item =>
    item.environment.includes(search) || item.accountId.includes(search) || item.role.includes(search)
  );
  const profiles = filteredResult as Profile[];

  return (
    <Suspense>
      <div className="flex flex-col w-full">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-expanded="true" variant="ghost">
                  Dev
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Dev</DropdownMenuItem>
                <DropdownMenuItem>QA</DropdownMenuItem>
                <DropdownMenuItem>Stage</DropdownMenuItem>
                <DropdownMenuItem>Prod</DropdownMenuItem>
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
          <Button className="mt-4 ml-auto w-9/10">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Profile
          </Button>
        </main>
      </div>
    </Suspense>
  );
}
