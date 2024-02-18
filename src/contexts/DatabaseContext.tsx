'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';
import { useEnvironment } from './EnvironmentContext';

const result: DatabaseList[] = [{
  idx: 0,
  tunneling: false,
  localport: "13071",
  alias: "식봄",
  identifier: "marketboro-aurora2-dev",
  endpoint: "marketboro-aurora2-dev.abcdef123456.ap-northeast-2.rds.amazonaws.com",
  status: "used",
  role: "Writer instance",
  engine: "Aurora MySQL",
  size: "db.t4g.medium",
},{
  idx: 1,
  tunneling: false,
  localport: "13072",
  alias: "마켓봄",
  identifier: "marketboro-aurora2-dev",
  endpoint: "marketboro-aurora2-dev.abcdef123456.ap-northeast-2.rds.amazonaws.com",
  status: "used",
  role: "Writer instance",
  engine: "Aurora MySQL",
  size: "db.t4g.medium",
}];

const DatabaseContext = createContext<[DatabaseList[], Dispatch<SetStateAction<DatabaseList[]>>] | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [databaseList, setDatabaseList] = useState<DatabaseList[]>([]);
  const [selectedEnvironment] = useEnvironment();

  useEffect(() => {
    const localStorageDatabaseSetting = localStorage.getItem(`databaseSetting_${selectedEnvironment}`);
    const localStorageDatabaseList = localStorage.getItem(`databaseList_${selectedEnvironment}`);
    const jsonLocalStorageDatabaseSetting = JSON.parse(localStorageDatabaseSetting || '[]')
    const jsonLocalStorageDatabaseList = JSON.parse(localStorageDatabaseList || '[]')
    setDatabaseList(jsonLocalStorageDatabaseList.length > 0 ? jsonLocalStorageDatabaseList : [...result])
  }, [selectedEnvironment]);

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