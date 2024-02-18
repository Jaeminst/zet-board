'use client';
import { ProfileCombo } from '@/components/profile/profile-combo';
import Search from '@/components/Search';
import DatabaseTable from '@/components/database/database-table';
import { useDatabase } from '@/contexts/DatabaseContext';

export default function DatabasePage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const [databaseList] = useDatabase();

  const search = searchParams.q ?? '';
  const filteredResult = databaseList.filter(item =>
    item.localport.includes(search) ||
    item.alias.includes(search) ||
    item.identifier.includes(search) ||
    item.status.includes(search) ||
    item.role.includes(search) ||
    item.engine.includes(search) ||
    item.size.includes(search)
  );
  const searchDatabases = filteredResult as DatabaseList[];
  return (
    <div className="flex flex-col w-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <ProfileCombo />
        <Search />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <DatabaseTable databases={searchDatabases} />
      </main>
    </div>
  );
}
