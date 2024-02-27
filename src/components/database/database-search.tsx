'use client';
import { Input } from '@/components/ui/input';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useDatabaseSearch } from '@/contexts/DatabaseSearchContext';
import { SearchIcon } from 'lucide-react';
import { useEffect } from 'react';

export default function DatabaseSearch({ disabled }: { disabled?: boolean }) {
  const [databaseList] = useDatabase();
  const [databaseSearchList, setDatabaseSearchList] = useDatabaseSearch();

  useEffect(() => {
    if (!databaseSearchList.length) {
      setDatabaseSearchList(databaseList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseList]);

  function handleSearch(value: string) {
    const search = value.toLowerCase() ?? '';
    const filteredResult = databaseList.filter(item =>
      item.localport.toLowerCase().includes(search)
      || item.alias.toLowerCase().includes(search)
      || item.identifier.toLowerCase().includes(search)
      || item.status.toLowerCase().includes(search)
      || item.role.toLowerCase().includes(search)
      || item.engine.toLowerCase().includes(search)
      || item.size.toLowerCase().includes(search)
    );
    const searchDatabases = filteredResult as DatabaseList[];
    value !== '' ? setDatabaseSearchList(searchDatabases) : setDatabaseSearchList(databaseList)
  }

  return (
    <form className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="rounded-md shadow-sm">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            aria-hidden="true"
          >
            <SearchIcon
              className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
          </div>
          <Input
            id="search"
            type="search"
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
            placeholder=""
            spellCheck={false}
            disabled={disabled}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
