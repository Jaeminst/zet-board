'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';
import { useProfileSession } from './ProfileSessionContext';
import IpcRenderer from '@/lib/ipcRenderer';
import { ipcParser } from '@/lib/ipcParser';

const DatabaseContext = createContext<[Database[], Dispatch<SetStateAction<Database[]>>] | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [databaseList, setDatabaseList] = useState<Database[]>([]);
  const [profileSession] = useProfileSession();

  useEffect(() => {
    if (profileSession !== '' && profileSession !== 'Select Profile') {
      IpcRenderer.getDatabaseList((initDatabases) => {
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
          setDatabaseList(initDatabases[profileSession]);
        }
      });
    }
  }, [profileSession]);

  useEffect(() => {
    if (databaseList && profileSession !== '' && profileSession !== 'Select Profile') {
      IpcRenderer.getDatabaseList((databases) => {
        databases[profileSession] = databaseList
        IpcRenderer.setDatabaseList(databases);
      });
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
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}