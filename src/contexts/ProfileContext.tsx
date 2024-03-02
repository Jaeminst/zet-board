'use client';
import { ipcParser } from '@/lib/ipcParser';
import { getLocalStorageProfileList, setLocalStorageProfileList } from '@/lib/localStorage';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';

const ProfileContext = createContext<[Profile[], Dispatch<SetStateAction<Profile[]>>] | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileList, setProfileList] = useState<Profile[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 프로필 데이터를 로드
    const initProfiles = getLocalStorageProfileList();
    if (!initProfiles || initProfiles.length === 0) {
      let messageCount = 0;
      const maxMessages = 2; // 최대 수신할 메시지 수
      // 프로필 데이터가 없거나 비어있으면 초기 프로필 설정 실행
      window.electron.profile.send('init-profiles');
      window.electron.profile.on('init-profiles', (initProfilesString: string) => {
        const initProfiles = ipcParser(initProfilesString) as Profile[];
        setProfileList(initProfiles);
        messageCount += 1;
        // 메시지 수신 횟수가 maxMessages에 도달하면 리스너 제거
        if (messageCount >= maxMessages) {
          window.electron.profile.removeAllListeners('init-profiles');
        }
      });
    } else {
      // 저장된 프로필 데이터로 상태 업데이트
      setProfileList(initProfiles);
    }
  }, []);

  useEffect(() => {
    setLocalStorageProfileList(profileList);
  }, [profileList]);

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