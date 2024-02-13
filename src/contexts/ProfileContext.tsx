'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext } from 'react';

interface Profile {
  idx: number;
  environment: string;
  accountId: string;
  selectRole: string;
  roles: string[];
}

const ProfileContext = createContext<[Profile[], Dispatch<SetStateAction<Profile[]>>] | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileList, setProfileList] = useState<Profile[]>([]);

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