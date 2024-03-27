import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { ipcParser } from '@/lib/ipcParser';
import { type ProfileAction, ProfileActionTypes } from '@/types/actions';
import IpcRenderer from '@/lib/ipcRenderer';

/* eslint-disable */
const ProfileContext = createContext<{
  profileList: Profile[];
  dispatchProfile: React.Dispatch<ProfileAction>;
} | undefined>(undefined);
/* eslint-enable */

// 리듀서 함수
function profileReducer(profileList: Profile[], action: ProfileAction): Profile[] {
  switch (action.type) {
    case ProfileActionTypes.SelectRole:
      return profileList.map(profile =>
        profile.idx === action.payload.idx ? { ...profile, selectRole: action.payload.role } : profile,
      );
    case ProfileActionTypes.SetProfileList:
      return action.payload;
    case ProfileActionTypes.AddProfile:
      return [...profileList, action.payload];
    case ProfileActionTypes.UpdateProfile:
      return profileList.map(profile =>
        profile.profileName === action.payload.oldProfileName
          ? { ...profile, ...action.payload.newProfileData }
          : profile,
      );
    case ProfileActionTypes.DeleteProfile:
      const filteredProfiles = profileList.filter(profile => profile.profileName !== action.payload);
      const sortedProfiles = filteredProfiles.sort((a, b) => a.idx - b.idx);
      return sortedProfiles.map((profile, index) => ({ ...profile, idx: index }));
    case ProfileActionTypes.SwapProfileIdxUp:
    case ProfileActionTypes.SwapProfileIdxDown:
      let newList = [...profileList];
      const index = action.payload;
      const isUp = action.type === ProfileActionTypes.SwapProfileIdxUp;
      const swapWith = isUp ? index - 1 : index + 1;
      if (newList[index] && newList[swapWith]) {
        [newList[index], newList[swapWith]] = [newList[swapWith], newList[index]];
        newList = newList.map((p, idx) => ({ ...p, idx }));
      }
      return newList;
    default:
      return profileList;
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileList, dispatchProfile] = useReducer(profileReducer, []);

  useEffect(() => {
    IpcRenderer.getProfileList(initProfiles => {
      if (!initProfiles || initProfiles.length === 0) {
        let messageCount = 0;
        const maxMessages = 2;
        window.electron.profile.send('init-profiles');
        window.electron.profile.on('init-profiles', (initProfilesString: string) => {
          const initProfiles = ipcParser(initProfilesString) as Profile[];
          dispatchProfile({ type: ProfileActionTypes.SetProfileList, payload: initProfiles });
          messageCount += 1;
          if (messageCount >= maxMessages) {
            IpcRenderer.removeAllListeners('init-profiles');
          }
        });
      } else {
        dispatchProfile({ type: ProfileActionTypes.SetProfileList, payload: initProfiles });
      }
    });
  }, []);

  useEffect(() => {
    IpcRenderer.setProfileList(profileList);
  }, [profileList]);

  return <ProfileContext.Provider value={{ profileList, dispatchProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
