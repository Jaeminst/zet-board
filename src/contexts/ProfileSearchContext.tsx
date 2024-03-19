'use client';
import { useState, createContext,type Dispatch,type SetStateAction,type ReactNode, useContext } from 'react';

const ProfileSearchContext = createContext<[Profile[], Dispatch<SetStateAction<Profile[]>>] | undefined>(undefined);

export function ProfileSearchProvider({ children }: { children: ReactNode }) {
  const [profileSearchList, setProfileSearchList] = useState<Profile[]>([]);

  return (
    <ProfileSearchContext.Provider value={[profileSearchList, setProfileSearchList]}>
      {children}
    </ProfileSearchContext.Provider>
  );
}

export function useProfileSearch() {
  const context = useContext(ProfileSearchContext);
  if (!context) {
    throw new Error('useProfileSearch must be used within a ProfileSearchProvider');
  }
  return context;
}