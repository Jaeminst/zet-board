'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';

const ProfileSessionContext = createContext<[string, Dispatch<SetStateAction<string>>] | undefined>(undefined);

export function ProfileSessionProvider({ children }: { children: ReactNode }) {
  const [profileSession, setProfileSession] = useState<string>('');

  useEffect(() => {
    const localStorageProfileSession = localStorage.getItem('profileSession')
    setProfileSession(localStorageProfileSession || 'Select Profile')
  }, []);

  return (
    <ProfileSessionContext.Provider value={[profileSession, setProfileSession]}>
      {children}
    </ProfileSessionContext.Provider>
  );
}

export function useProfileSession() {
  const context = useContext(ProfileSessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}