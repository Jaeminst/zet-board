'use client';
import { useState, createContext, type Dispatch, type SetStateAction, type ReactNode, useContext, useEffect } from 'react';

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
  if (!context) {
    throw new Error('useDatabaseSearch must be used within a DatabaseSearchProvider');
  }
  return context;
}