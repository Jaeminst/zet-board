'use client';
import { useState, createContext, type Dispatch,type SetStateAction,type ReactNode, useContext, useEffect, useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import IpcRenderer from '@/lib/ipcRenderer';
import { getDate } from '@/lib/date';
import { toast } from 'sonner';

const ProfileSessionContext = createContext<[string, Dispatch<SetStateAction<string>>] | undefined>(undefined);

export function ProfileSessionProvider({ children }: { children: ReactNode }) {
  const { profileList } = useProfile();
  const [profileSession, setProfileSession] = useState<string>('Select Profile');
  const [profileSessions, setProfileSessions] = useState<ProfileSession[]>([]);

  // 세션 만료 메시지 수신
  useEffect(() => {
    IpcRenderer.sessionExpired((profileName) => {
      toast.info('Session expired', {
        description: `Profile: ${profileName}`,
        duration: 5000
      });
    });
  }, []);

  // 초기 세션 설정
  useEffect(() => {
    if (profileList && profileList.length > 0) {
      IpcRenderer.getProfileSession((initProfileSession) => {
        setProfileSession(initProfileSession || 'Select Profile');
      });
    }
  }, [profileList]);

  const updateSession = useCallback((profileName: string) => {
    const nowString = getDate();
    const newProfileSessions = profileSessions.some(ps => ps.profileName === profileName) 
      ? profileSessions.map(session => session.profileName === profileName ? { ...session, createdAt: nowString } : session)
      : [...profileSessions, { profileName, createdAt: nowString }];

    setProfileSessions(newProfileSessions);
    IpcRenderer.setProfileSessions(newProfileSessions);
  }, [profileSessions]);

  // 세션 갱신 로직
  const renewSession = useCallback((profileName: string) => {
    const selectedProfile = profileList.find(profile => profile.profileName === profileName);
    if (selectedProfile) {
      IpcRenderer.assumeRole(profileName, selectedProfile, (updatedProfileSession) => {
        if (updatedProfileSession) {
          updateSession(updatedProfileSession);
        } else {
          setProfileSession('Select Profile');
        }
      });
    }
  }, [profileList, updateSession]);

  // 세션 갱신 조건 확인
  useEffect(() => {
    const existingSession = profileSessions.find(ps => ps.profileName === profileSession);
    if (profileSession !== 'Select Profile' && (!existingSession || new Date().getTime() - new Date(existingSession.createdAt).getTime() >= 60 * 60 * 1000)) {
      renewSession(profileSession);
    }
  }, [profileSession, profileSessions, renewSession]);

  // 현재 세션 저장
  useEffect(() => {
    if (profileList && profileList.length > 0) {
      IpcRenderer.setProfileSession(profileSession);
    }
  }, [profileList, profileSession]);

  return (
    <ProfileSessionContext.Provider value={[profileSession, setProfileSession]}>
      {children}
    </ProfileSessionContext.Provider>
  );
}

export function useProfileSession() {
  const context = useContext(ProfileSessionContext);
  if (!context) {
    throw new Error('useProfileSession must be used within a ProfileSessionProvider');
  }
  return context;
}