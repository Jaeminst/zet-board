'use client';
import { ipcParser } from '@/lib/ipcPaser';
import { getLocalStorageProfileList, setLocalStorageProfileList } from '@/lib/localStorage';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';

const ProfileContext = createContext<[Profile[], Dispatch<SetStateAction<Profile[]>>] | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileList, setProfileList] = useState<Profile[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 프로필 데이터를 로드
    const initProfiles = getLocalStorageProfileList();
    if (!initProfiles || initProfiles.length === 0) {
      // 프로필 데이터가 없거나 비어있으면 초기 프로필 설정 실행
      window.electron.profile.send('init-profiles');
      window.electron.profile.once('init-profiles', (initProfilesString: string) => {
        const initProfiles = ipcParser(initProfilesString) as Profile[];
        setProfileList(initProfiles);
      });
    } else {
      // 저장된 프로필 데이터로 상태 업데이트
      setProfileList(initProfiles);
    }
  }, []);

  useEffect(() => {
    setLocalStorageProfileList(profileList);
    console.log(profileList)
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