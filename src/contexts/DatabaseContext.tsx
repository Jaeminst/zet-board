'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';
import { useProfileSession } from './ProfileSessionContext';
import { getLocalStorageDatabaseList, setLocalStorageDatabaseList } from '@/lib/storage';
import { ipcParser } from '@/lib/ipcParser';

const DatabaseContext = createContext<[Database[], Dispatch<SetStateAction<Database[]>>] | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [databaseList, setDatabaseList] = useState<Database[]>([]);
  const [profileSession] = useProfileSession();

  useEffect(() => {
    if (profileSession !== 'Select Profile') {
      // 로컬 스토리지에서 데이터를 로드
      const initDatabases = getLocalStorageDatabaseList();
      if (!initDatabases[profileSession]) {
        window.electron.database.send('init-databases', JSON.stringify({
          profileName: profileSession,
          tokenSuffix: `_token`,
        }));
        window.electron.database.once('init-databases', (initDatabasesString: string) => {
          initDatabases[profileSession] = ipcParser(initDatabasesString) as Database[];
          setDatabaseList(initDatabases[profileSession]);
        });
      } else {
        // 저장된 데이터로 상태 업데이트
        setDatabaseList(initDatabases[profileSession]);
      }
    }
  }, [profileSession]);

  useEffect(() => {
    if (databaseList && profileSession !== 'Select Profile') {
      const databases = getLocalStorageDatabaseList();
      databases[profileSession] = databaseList
      setLocalStorageDatabaseList(databases);
    }
  }, [databaseList, profileSession]);

  return (
    <DatabaseContext.Provider value={[databaseList, setDatabaseList]}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}