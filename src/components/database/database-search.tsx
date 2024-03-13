'use client';
import { Input } from '@/components/ui/input';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useDatabaseSetting } from '@/contexts/DatabaseSettingContext';
import { useDatabaseSearch } from '@/contexts/DatabaseSearchContext';
import { SearchIcon } from 'lucide-react';
import { useEffect } from 'react';

export default function DatabaseSearch({ disabled }: { disabled?: boolean }) {
  const [databaseList] = useDatabase();
  const [databaseSettingList] = useDatabaseSetting();
  const [databaseSearchList, setDatabaseSearchList] = useDatabaseSearch();

  useEffect(() => {
    if (databaseList) {
      setDatabaseSearchList(databaseList);
    }
  }, [databaseList, setDatabaseSearchList]);

  function handleSearch(value: string) {
    const search = value.toLowerCase();
    const filteredResult: Database[] = databaseList.flatMap(db => {
      // 기존 속성 검사
      const matchInDb = db.Identifier.toLowerCase().includes(search) ||
        db.Status.toLowerCase().includes(search) ||
        db.Engine.toLowerCase().includes(search) ||
        db.Size.toString().toLowerCase().includes(search);

      const settingsMatch = db.Endpoint.Address && databaseSettingList[db.Endpoint.Address] &&
        (databaseSettingList[db.Endpoint.Address].alias?.toLowerCase().includes(search) ||
        databaseSettingList[db.Endpoint.Address].localPort?.toLowerCase().includes(search));

      if (matchInDb || settingsMatch) {
        return [db];
      }
      // DbCluster 타입일 때만 Instances 필터링 수행
      if ('Instances' in db && 'ReaderEndpoint' in db) { // db가 DbCluster 타입임을 확인
        const matchedInstances = db.Instances.filter(instance => {
          const instanceMatch = instance.Identifier.toLowerCase().includes(search) ||
            instance.Engine.toLowerCase().includes(search) ||
            instance.Size.toString().toLowerCase().includes(search);
  
          const instanceSettingsMatch = instance.Endpoint.Address && databaseSettingList[instance.Endpoint.Address] &&
            (databaseSettingList[instance.Endpoint.Address].alias?.toLowerCase().includes(search) ||
            databaseSettingList[instance.Endpoint.Address].localPort?.toLowerCase().includes(search));
  
          return instanceMatch || instanceSettingsMatch;
        });
        if (matchedInstances.length > 0) {
          // 모든 필수 속성을 포함하여 새 DbCluster 객체 생성
          const modifiedDb: DbCluster = {
            ...db,
            Instances: matchedInstances
          };
          return [modifiedDb];
        }
      }
      return [];
    });
    setDatabaseSearchList(filteredResult);
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
