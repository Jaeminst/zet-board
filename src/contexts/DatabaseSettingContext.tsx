'use client';
import { useState, createContext, type Dispatch,type SetStateAction,type ReactNode, useContext, useEffect } from 'react';
import IpcRenderer from '@/lib/ipcRenderer';
import { useProfileSession } from './ProfileSessionContext';

const DatabaseSettingContext = createContext<[DatabaseSetting, Dispatch<SetStateAction<DatabaseSetting>>] | undefined>(undefined);

export function DatabaseSettingProvider({ children }: { children: ReactNode }) {
  const [databaseSettingList, setDatabaseSettingList] = useState<DatabaseSetting>({});
  const [profileSession] = useProfileSession();

  useEffect(() => {
    if (profileSession !== '' && profileSession !== 'Select Profile') {
      IpcRenderer.getDatabaseSettings((databaseSettings) => {
        setDatabaseSettingList(databaseSettings[profileSession]);
      });
    }
  }, [profileSession]);

  useEffect(() => {
    if (databaseSettingList && profileSession !== '' && profileSession !== 'Select Profile') {
      IpcRenderer.getDatabaseSettings((databaseSettings) => {
        databaseSettings[profileSession] = databaseSettingList
        IpcRenderer.setDatabaseSettings(databaseSettings);
      });
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
  if (!context) {
    throw new Error('useDatabaseSetting must be used within a DatabaseSettingProvider');
  }
  return context;
}