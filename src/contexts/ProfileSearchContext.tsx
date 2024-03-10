'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext } from 'react';

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
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}