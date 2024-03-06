'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';

const DatabaseSearchContext = createContext<[Database[], Dispatch<SetStateAction<Database[]>>] | undefined>(undefined);

export function DatabaseSearchProvider({ children }: { children: ReactNode }) {
  const [databaseSearchList, setDatabaseSearchList] = useState<Database[]>([]);

  return (
    <DatabaseSearchContext.Provider value={[databaseSearchList, setDatabaseSearchList]}>
      {children}
    </DatabaseSearchContext.Provider>
  );
}

export function useDatabaseSearch() {
  const context = useContext(DatabaseSearchContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}