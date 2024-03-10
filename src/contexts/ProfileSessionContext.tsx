'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect, useCallback } from 'react';
import { ipcParser } from '@/lib/ipcParser';
import { useProfile } from '@/contexts/ProfileContext';
import IpcRenderer from '@/lib/ipcRenderer';
import { getDate } from '@/lib/date';

const ProfileSessionContext = createContext<[string, Dispatch<SetStateAction<string>>] | undefined>(undefined);

export function ProfileSessionProvider({ children }: { children: ReactNode }) {
  const { profileList } = useProfile();
  const [profileSession, setProfileSession] = useState<string>('Select Profile');

  // useEffect(() => {
  //   IpcRenderer.getProfileSession((initProfileSession) => {
  //     setProfileSession(initProfileSession);
  //   });
  // }, []);

  const updateSession = useCallback((profileName: string) => {
    let profileSessions = IpcRenderer.getProfileSessions();
    const nowString = getDate();
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
    IpcRenderer.setProfileSessions(profileSessions);
  }, [profileSession]);

  const renewSession = useCallback(() => {
    const selectedProfile = profileList.find(profile => profile.profileName === profileSession) as Profile;
    IpcRenderer.assumeRole(profileSession, selectedProfile, (updatedProfileSession) => {
      if (updatedProfileSession) {
        updateSession(updatedProfileSession)
      } else {
        setProfileSession('Select Profile');
      }
    });
  }, [profileList, profileSession, updateSession]);

  useEffect(() => {
    if (profileSession && profileSession !== '' && profileSession !== 'Select Profile') {
      const profileSessions = IpcRenderer.getProfileSessions();
      const existingSession = profileSessions.find(ps => ps.profileName === profileSession);

      // Send 'assume-role' only if there's no session or it's outdated
      if (!existingSession || new Date().getTime() - new Date(existingSession.createdAt).getTime() >= 55 * 60 * 1000) {
        renewSession();
      } else {
        IpcRenderer.defaultProfile(profileSession);
      }
      const handleSessionExpired = (response: string) => {
        const expiredProfileSession = ipcParser(response);
        if (expiredProfileSession === profileSession) {
          const profileSessions = IpcRenderer.getProfileSessions();
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
    }
  }, [profileList, profileSession, renewSession]);

  useEffect(() => {
    IpcRenderer.setProfileSession(profileSession);
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