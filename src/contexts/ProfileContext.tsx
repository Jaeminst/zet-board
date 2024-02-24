'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';

const result = [{
  idx: 0,
  profileName: 'dev',
  accessKey: 'test',
  secretKey: 'test',
  accountId: '123456789012',
  selectRole: 'Administrator',
  roles: ['Administrator', 'Developers'],
}];

const ProfileContext = createContext<[Profile[], Dispatch<SetStateAction<Profile[]>>] | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileList, setProfileList] = useState<Profile[]>([...result]);
  useEffect(() => {
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.once('ipc-example', (arg: string) => {
      console.log(arg);
    });
    window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
  }, []);

  return (
    <ProfileContext.Provider value={[profileList, setProfileList]}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}