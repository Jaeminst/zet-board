'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect, useCallback } from 'react';
import { getSessionStorageProfileSessions, setSessionStorageProfileSessions } from '@/lib/storage';
import { ipcParser } from '@/lib/ipcParser';
import { useProfile } from '@/contexts/ProfileContext';

const ProfileSessionContext = createContext<[string, Dispatch<SetStateAction<string>>] | undefined>(undefined);

export function ProfileSessionProvider({ children }: { children: ReactNode }) {
  const [profileList] = useProfile();
  const [profileSession, setProfileSession] = useState<string>('');

  useEffect(() => {
    const localStorageProfileSession = localStorage.getItem('profileSession')
    setProfileSession(localStorageProfileSession || 'Select Profile')
  }, []);

  const updateLocalStorageSession = useCallback((profileName: string) => {
    let profileSessions = getSessionStorageProfileSessions();
    const nowString = new Date().toISOString();
    const existingSession = profileSessions.find(ps => ps.profileName === profileSession);
    if (existingSession) {
      // Update existing session timestamp
      profileSessions = profileSessions.map(session => 
        session.profileName === profileSession ? { ...session, createdAt: nowString } : session
      );
    } else {
      // Add new session
      profileSessions.push({ profileName, createdAt: nowString });
    }
    setSessionStorageProfileSessions(profileSessions);
  }, [profileSession]);

  const renewSession = useCallback(async () => {
    const selectedProfile = profileList.find(profile => profile.profileName === profileSession);
    if (!selectedProfile) return;
    
    // 세션 갱신 로직을 여기에 구현
    window.electron.profile.send('assume-role', JSON.stringify({
      profileName: profileSession,
      tokenSuffix: `_token`,
      accountId: selectedProfile.accountId,
      role: selectedProfile.selectRole,
    }));
    window.electron.profile.once('assume-role', (response: string) => {
      const updatedProfileSession = ipcParser(response);
      if (updatedProfileSession) {
        updateLocalStorageSession(updatedProfileSession)
      }
    });
  }, [profileList, profileSession, updateLocalStorageSession]); // 필요한 의존성 명시

  useEffect(() => {
    if (profileSession && profileSession !== 'Select Profile') {
      const profileSessions = getSessionStorageProfileSessions();
      const selectedProfile = profileList.find(profile => profile.profileName === profileSession);
      if (!selectedProfile) return;
      const existingSession = profileSessions.find(ps => ps.profileName === profileSession);

      // Send 'assume-role' only if there's no session or it's outdated
      if (!existingSession || new Date().getTime() - new Date(existingSession.createdAt).getTime() >= 55 * 60 * 1000) {
        renewSession();
      }
    }
    const handleSessionExpired = (response: string) => {
      const expiredProfileSession = ipcParser(response);
      if (expiredProfileSession === profileSession) {
        const profileSessions = getSessionStorageProfileSessions();
        const selectedProfile = profileList.find(profile => profile.profileName === expiredProfileSession);
        if (!selectedProfile) return;
        const existingSession = profileSessions.find(ps => ps.profileName === expiredProfileSession);
        // Send 'assume-role' only if there's no session or it's outdated
        if (!existingSession || new Date().getTime() - new Date(existingSession.createdAt).getTime() >= 55 * 60 * 1000) {
          renewSession();
        }
      }
    };
    window.electron.profile.on('session-expired', handleSessionExpired);
    return () => {
      // Clean up the effect when component unmounts or updates
      window.electron.profile.removeAllListeners('session-expired');
    };
  }, [profileList, profileSession, renewSession]);

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