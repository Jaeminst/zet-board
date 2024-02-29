'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';
import { getLocalStorageProfileSessions, setLocalStorageProfileSessions } from '@/lib/localStorage';
import { ipcParser } from '@/lib/ipcPaser';
import { useProfile } from '@/contexts/ProfileContext';

const ProfileSessionContext = createContext<[string, Dispatch<SetStateAction<string>>] | undefined>(undefined);

export function ProfileSessionProvider({ children }: { children: ReactNode }) {
  const [profileList, setProfileList] = useProfile();
  const [profileSession, setProfileSession] = useState<string>('');

  useEffect(() => {
    const localStorageProfileSession = localStorage.getItem('profileSession')
    setProfileSession(localStorageProfileSession || 'Select Profile')
  }, []);

  useEffect(() => {
    if (profileSession && profileSession !== 'Select Profile') {
      const now = new Date();
      const nowString = now.toISOString()
      let profileSessions: ProfileSession[] = getLocalStorageProfileSessions();
      const selectedProfileSession = profileSessions.find(ps => ps.profileName === profileSession);
      if (selectedProfileSession !== undefined) {
        const timePassed = now.getTime() - new Date(selectedProfileSession.createdAt).getTime();
        if (timePassed >= 55 * 60 * 1000) { // 55분이 지났는지 확인
          const selectedProfile = profileList.find(profile => profile.profileName === profileSession);
          if (selectedProfile !== undefined) {
            window.electron.profile.send('assume-role', JSON.stringify({
              profileName: profileSession,
              tokenSuffix: `_token`,
              accountId: selectedProfile.accountId,
              role: selectedProfile.selectRole,
              // tokenCode: "",
            }));
          }
          window.electron.profile.on('assume-role', (sessionProfileNameString: string) => {
            ipcParser(sessionProfileNameString);
          });
          const updatedProfileSessions = profileSessions.map(session => {
            if (session.profileName === profileSession) {
              return { ...session, createdAt: nowString };
            }
            return session;
          });
          setLocalStorageProfileSessions(updatedProfileSessions);
        }
      } else {
        const selectedProfile = profileList.find(profile => profile.profileName === profileSession);
        if (selectedProfile !== undefined) {
          window.electron.profile.send('assume-role', JSON.stringify({
            profileName: profileSession,
            tokenSuffix: `_token`,
            accountId: selectedProfile.accountId,
            role: selectedProfile.selectRole,
            // tokenCode: "",
          }));
        }
        window.electron.profile.on('assume-role', (sessionProfileNameString: string) => {
          ipcParser(sessionProfileNameString);
        });
        const existingSessionIndex = profileSessions.findIndex(session => session.profileName === profileSession);
        if (existingSessionIndex !== -1) {
          const updatedProfileSessions = profileSessions.map(session => {
            if (session.profileName === profileSession) {
              return { ...session, createdAt: nowString };
            }
            return session;
          });
          setLocalStorageProfileSessions(updatedProfileSessions);
        } else {
          const newProfileSession = {
            profileName: profileSession,
            createdAt: nowString,
          };
          setLocalStorageProfileSessions([...profileSessions, newProfileSession]);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileSession]);

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