'use client';
import { useCallback, useState } from 'react';
import { Loader2, RotateCw } from 'lucide-react';
import IpcRenderer from '@/lib/ipcRenderer';
import { ipcParser } from '@/lib/ipcParser';
import { Button } from '@/components/ui/button';
import { ProfileCombo } from '@/components/profile/profile-combo';
import { IsLoadingTable } from '@/components/status/isLoadingTable';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useProfileSession } from '@/contexts/ProfileSessionContext';
import { useDatabaseSearch } from '@/contexts/DatabaseSearchContext';
import dynamic from 'next/dynamic'
const DatabaseSearch = dynamic(() => import('@/components/database/database-search'), {
  ssr: false,
});
const DatabaseTable = dynamic(() => import('@/components/database/database-table'), {
  loading: () => <IsLoadingTable />,
  ssr: false,
});

export default function DatabasePage() {
  const [profileSession] = useProfileSession();
  const [databaseSearchList] = useDatabaseSearch();
  const [databaseList, setDatabaseList] = useDatabase();
  const [isRefresh, setIsRefresh] = useState(false);

  const refreshDatabaseList = useCallback(() => {
    setIsRefresh(true)
    IpcRenderer.getDatabaseList((initDatabases) => {
      window.electron.database.send('init-databases', JSON.stringify({
        profileName: profileSession,
        tokenSuffix: `_token`,
      }));
      window.electron.database.once('init-databases', (initDatabasesString: string) => {
        initDatabases[profileSession] = ipcParser(initDatabasesString) as Database[];
        setDatabaseList(initDatabases[profileSession]);
        setIsRefresh(false)
      });
    });
  }, [profileSession, setDatabaseList]);

  return (
    <div className="flex flex-col w-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <ProfileCombo />
        <DatabaseSearch />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <DatabaseTable databases={databaseSearchList} />
        {isRefresh
        ? <Button className="mt-4 ml-auto w-9/10" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Refresh
          </Button>
        : <Button className="mt-4 ml-auto w-9/10" onClick={refreshDatabaseList}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        }
      </main>
    </div>
  );
}
