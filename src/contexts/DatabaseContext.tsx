'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';

const result: Database[] = [{
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
}];

const DatabaseContext = createContext<[Database[], Dispatch<SetStateAction<Database[]>>] | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [databaseList, setDatabaseList] = useState<Database[]>([]);

  useEffect(() => {
    const localStorageDatabaseList = localStorage.getItem("databaseList")
    setDatabaseList(JSON.parse(localStorageDatabaseList || "") || [...result])
  }, []);

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