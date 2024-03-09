'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';
import { getLocalStorageDatabaseSettings, setLocalStorageDatabaseSettings } from '@/lib/storage';
import { useProfileSession } from './ProfileSessionContext';

const DatabaseSettingContext = createContext<[DatabaseSetting, Dispatch<SetStateAction<DatabaseSetting>>] | undefined>(undefined);

export function DatabaseSettingProvider({ children }: { children: ReactNode }) {
  const [databaseSettingList, setDatabaseSettingList] = useState<DatabaseSetting>({});
  const [profileSession] = useProfileSession();

  useEffect(() => {
    const databaseSettings = getLocalStorageDatabaseSettings();
    setDatabaseSettingList(databaseSettings[profileSession]);
  }, [profileSession]);

  useEffect(() => {
    const databaseSettings = getLocalStorageDatabaseSettings();
    if (databaseSettingList && profileSession) {
      databaseSettings[profileSession] = databaseSettingList
      setLocalStorageDatabaseSettings(databaseSettings);
    }
  }, [databaseSettingList, profileSession]);

  return (
    <DatabaseSettingContext.Provider value={[databaseSettingList, setDatabaseSettingList]}>
      {children}
    </DatabaseSettingContext.Provider>
  );
}

export function useDatabaseSetting() {
  const context = useContext(DatabaseSettingContext);
  if (context === undefined) {
    throw new Error('useDatabaseSetting must be used within a DatabaseSettingProvider');
  }
  return context;
}